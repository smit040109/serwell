/**
 * Central security utilities for the VayuCodes API.
 * - Rate limiting (in-memory sliding window)
 * - NoSQL injection sanitization
 * - CORS whitelist resolver
 * - Input validators (email, password strength, name, phone)
 * - Client IP extractor (proxy-aware)
 */

/* ---------------------------------------------------------------
   CORS whitelist — strict allowed origins only. Anything else gets
   NO Access-Control-Allow-Origin header (browser will block it).
--------------------------------------------------------------- */
const DEFAULT_ALLOWED_ORIGINS = [
  'https://vayucodes.com',
  'https://www.vayucodes.com',
]

function getAllowedOrigins() {
  const extra = (process.env.EXTRA_CORS_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  return [...DEFAULT_ALLOWED_ORIGINS, ...extra]
}

/**
 * Given the incoming request Origin, return the value to echo back
 * in Access-Control-Allow-Origin, or null if not whitelisted.
 */
export function resolveCorsOrigin(request) {
  const origin = request.headers.get('origin') || ''
  if (!origin) return null // same-origin request, no CORS needed
  const allowed = getAllowedOrigins()
  if (allowed.includes(origin)) return origin
  // Match on emergent preview subdomains (dev only)
  try {
    const u = new URL(origin)
    if (u.hostname.endsWith('.preview.emergentagent.com')) return origin
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return origin
  } catch {
    // malformed origin — treat as not allowed
  }
  return null
}

/**
 * Build a plain-object headers dict of CORS headers, or {} if origin
 * is not allowed. Attach to NextResponse when needed.
 */
export function corsHeaders(request) {
  const allow = resolveCorsOrigin(request)
  if (!allow) return {}
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  }
}

/* ---------------------------------------------------------------
   Client IP extraction — proxy-aware.
--------------------------------------------------------------- */
export function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for') || ''
  if (xff) return xff.split(',')[0].trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

/* ---------------------------------------------------------------
   In-memory sliding-window rate limiter.
   NOTE: works per-process. For multi-instance deploys use Redis;
   this covers single-instance and small-scale MVPs.
--------------------------------------------------------------- */
const _hits = new Map() // key -> array<number> of hit timestamps (ms)

/**
 * @param {string} key - unique bucket identifier (e.g. `ip:1.2.3.4:login`)
 * @param {number} limit - max hits allowed in window
 * @param {number} windowMs - window size in ms
 * @returns {{allowed: boolean, remaining: number, resetMs: number}}
 */
export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now()
  const cutoff = now - windowMs
  let arr = _hits.get(key) || []
  // prune
  arr = arr.filter(t => t > cutoff)
  const allowed = arr.length < limit
  if (allowed) arr.push(now)
  _hits.set(key, arr)
  const resetMs = arr.length ? Math.max(0, arr[0] + windowMs - now) : windowMs
  return { allowed, remaining: Math.max(0, limit - arr.length), resetMs }
}

// Periodic cleanup of stale buckets (guards against unbounded growth).
if (typeof globalThis !== 'undefined' && !globalThis.__rateLimitCleanupInstalled) {
  globalThis.__rateLimitCleanupInstalled = true
  setInterval(() => {
    const cutoff = Date.now() - 60 * 60 * 1000 // 1h
    for (const [k, arr] of _hits.entries()) {
      const kept = arr.filter(t => t > cutoff)
      if (kept.length === 0) _hits.delete(k)
      else _hits.set(k, kept)
    }
  }, 10 * 60 * 1000).unref?.()
}

/**
 * Standard rate-limit response headers for a client.
 */
export function rateLimitHeaders(result, limit) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetMs / 1000)),
  }
}

/* ---------------------------------------------------------------
   NoSQL injection sanitizer.
   Recursively strips keys starting with `$` (Mongo operators) and
   any key containing `.` (path injection). Also normalizes prototype
   pollution vectors (__proto__, constructor, prototype).
--------------------------------------------------------------- */
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

export function sanitizeInput(value, depth = 0) {
  if (depth > 20) return null // guard against pathological deep objects
  if (value === null || value === undefined) return value
  if (Array.isArray(value)) return value.map(v => sanitizeInput(v, depth + 1))
  if (typeof value !== 'object') return value
  const out = {}
  for (const k of Object.keys(value)) {
    if (typeof k !== 'string') continue
    if (k.startsWith('$')) continue          // $where, $regex, $ne etc.
    if (k.includes('.')) continue             // dotted path injection
    if (DANGEROUS_KEYS.has(k)) continue       // prototype pollution
    out[k] = sanitizeInput(value[k], depth + 1)
  }
  return out
}

/* ---------------------------------------------------------------
   Input validators.
--------------------------------------------------------------- */
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
export const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{1,}$/
export const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/

export function validateEmail(email) {
  if (typeof email !== 'string') return { ok: false, error: 'Email is required' }
  const trimmed = email.trim()
  if (!trimmed) return { ok: false, error: 'Email is required' }
  if (trimmed.length > 254) return { ok: false, error: 'Email is too long' }
  if (!EMAIL_RE.test(trimmed)) return { ok: false, error: 'Enter a valid email address' }
  return { ok: true, value: trimmed.toLowerCase() }
}

/**
 * Password strength: min 8 chars, at least 1 letter and 1 number.
 * Also cap at 200 chars to prevent bcrypt DoS.
 */
export function validatePasswordStrength(password) {
  if (typeof password !== 'string') return { ok: false, error: 'Password is required' }
  if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters' }
  if (password.length > 200) return { ok: false, error: 'Password is too long' }
  if (!/[A-Za-z]/.test(password)) return { ok: false, error: 'Password must include a letter' }
  if (!/[0-9]/.test(password)) return { ok: false, error: 'Password must include a number' }
  return { ok: true }
}

export function validateName(name) {
  if (typeof name !== 'string') return { ok: false, error: 'Name is required' }
  const t = name.trim()
  if (!t) return { ok: false, error: 'Name is required' }
  if (t.length > 120) return { ok: false, error: 'Name is too long' }
  if (!NAME_RE.test(t)) return { ok: false, error: 'Enter a valid name' }
  return { ok: true, value: t }
}

export function validatePhone(phone) {
  if (phone === undefined || phone === null || phone === '') return { ok: true, value: '' }
  if (typeof phone !== 'string') return { ok: false, error: 'Enter a valid phone number' }
  const t = phone.trim()
  if (!PHONE_RE.test(t)) return { ok: false, error: 'Enter a valid phone number' }
  return { ok: true, value: t }
}
