'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * First-party tracker.
 * ------------------------------------------------------------------
 * Responsibilities:
 *  1. Assign persistent visitorId (30-day cookie) and per-tab sessionId.
 *  2. POST /api/track on: session-start, pageview, click, section-time,
 *     journey-flush (before unload).
 *  3. Attribute UTM + referrer to the session on start.
 *
 * Fire-and-forget with `navigator.sendBeacon` on unload so we never
 * block navigation.
 */

const COOKIE_VISITOR = 'vc_vid'
const COOKIE_SESSION_KEY = 'vc_sid'
const COOKIE_UTM = 'vc_utm'
const COOKIE_REFERRER = 'vc_ref'
const COOKIE_MAX_AGE_DAYS = 30

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function readCookie(name) {
  if (typeof document === 'undefined') return ''
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}

function writeCookie(name, value, days = COOKIE_MAX_AGE_DAYS) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires}; SameSite=Lax`
}

function sessionRead(key) {
  try { return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : '' } catch { return '' }
}
function sessionWrite(key, val) {
  try { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, val) } catch { /* ignore */ }
}

function parseUtm() {
  try {
    const p = new URLSearchParams(window.location.search)
    const utm = {}
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const v = p.get(k)
      if (v) utm[k] = String(v).slice(0, 200)
    }
    return utm
  } catch { return {} }
}

function sendBeacon(payload) {
  try {
    const url = '/api/track'
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      return navigator.sendBeacon(url, blob)
    }
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch { /* ignore */ }
}

let _visitorId = ''
let _sessionId = ''
let _initialised = false
let _sectionTimers = new Map() // section id -> ms accumulated
let _lastPath = ''
let _pathEnterTs = 0
let _pageTimeMs = 0

function ensureIds() {
  if (_visitorId && _sessionId) return
  _visitorId = readCookie(COOKIE_VISITOR) || uuid()
  writeCookie(COOKIE_VISITOR, _visitorId)
  _sessionId = sessionRead(COOKIE_SESSION_KEY) || uuid()
  sessionWrite(COOKIE_SESSION_KEY, _sessionId)
}

function initSession() {
  if (_initialised) return
  _initialised = true
  ensureIds()

  // Persist attribution once per visitor (first-touch stored in cookie).
  const cookieUtm = readCookie(COOKIE_UTM)
  const cookieRef = readCookie(COOKIE_REFERRER)
  const utm = parseUtm()
  if (!cookieUtm && Object.keys(utm).length) writeCookie(COOKIE_UTM, JSON.stringify(utm))
  if (!cookieRef && document.referrer) writeCookie(COOKIE_REFERRER, document.referrer)

  sendBeacon({
    type: 'session_start',
    visitorId: _visitorId,
    sessionId: _sessionId,
    path: location.pathname,
    referrer: document.referrer || '',
    utm: cookieUtm ? safeParse(cookieUtm) : utm,
    ua: navigator.userAgent,
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: navigator.language || '',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    ts: Date.now(),
  })
}

function safeParse(s) { try { return JSON.parse(s) } catch { return {} } }

function flushPageTime() {
  if (!_lastPath) return
  const ms = Math.max(0, Date.now() - _pathEnterTs) + _pageTimeMs
  if (ms < 200) return // ignore junk
  sendBeacon({
    type: 'page_time',
    visitorId: _visitorId,
    sessionId: _sessionId,
    path: _lastPath,
    ms,
    ts: Date.now(),
  })
  _pageTimeMs = 0
}

function flushSections() {
  if (_sectionTimers.size === 0) return
  const sections = Array.from(_sectionTimers.entries()).map(([id, ms]) => ({ id, ms }))
  sendBeacon({
    type: 'section_time',
    visitorId: _visitorId,
    sessionId: _sessionId,
    path: _lastPath,
    sections,
    ts: Date.now(),
  })
  _sectionTimers = new Map()
}

function trackPageview(path) {
  ensureIds()
  flushPageTime()
  flushSections()
  _lastPath = path
  _pathEnterTs = Date.now()
  sendBeacon({
    type: 'pageview',
    visitorId: _visitorId,
    sessionId: _sessionId,
    path,
    referrer: document.referrer || '',
    ts: Date.now(),
  })
}

function bindClicks() {
  if (typeof document === 'undefined') return
  document.addEventListener('click', (e) => {
    const t = e.target
    if (!t || !t.closest) return
    const el = t.closest('[data-track], a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"], a[href*="whatsapp.com"]')
    if (!el) return

    let name = el.getAttribute('data-track') || ''
    const href = (el.getAttribute('href') || '').toLowerCase()
    if (!name) {
      if (href.startsWith('tel:')) name = 'call'
      else if (href.startsWith('mailto:')) name = 'email'
      else if (href.includes('wa.me') || href.includes('whatsapp.com')) name = 'whatsapp'
    }
    if (!name) return

    sendBeacon({
      type: 'click',
      visitorId: _visitorId,
      sessionId: _sessionId,
      path: location.pathname,
      name,
      label: (el.textContent || '').trim().slice(0, 80),
      href: el.getAttribute('href') || '',
      ts: Date.now(),
    })
  }, { capture: true, passive: true })
}

function bindSections() {
  if (typeof document === 'undefined') return
  const targets = new Map() // element -> id
  document.querySelectorAll('[data-section]').forEach(el => {
    const id = el.getAttribute('data-section')
    if (id) targets.set(el, id)
  })
  if (!targets.size) return
  const enterTs = new Map()
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const id = targets.get(e.target)
      if (!id) continue
      if (e.isIntersecting) {
        enterTs.set(id, Date.now())
      } else if (enterTs.has(id)) {
        const ms = Date.now() - enterTs.get(id)
        enterTs.delete(id)
        if (ms > 200) _sectionTimers.set(id, (_sectionTimers.get(id) || 0) + ms)
      }
    }
  }, { threshold: 0.4 })
  targets.forEach((_id, el) => io.observe(el))
}

function bindVisibility() {
  if (typeof document === 'undefined') return
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // accumulate current segment then pause
      _pageTimeMs += Math.max(0, Date.now() - _pathEnterTs)
      _pathEnterTs = 0
      flushSections()
    } else if (document.visibilityState === 'visible') {
      _pathEnterTs = Date.now()
    }
  })
  window.addEventListener('pagehide', () => {
    flushPageTime()
    flushSections()
  })
}

export default function TrackerClient() {
  const pathname = usePathname()
  const search = useSearchParams()
  const bootRef = useRef(false)

  useEffect(() => {
    if (bootRef.current) return
    bootRef.current = true
    initSession()
    bindClicks()
    bindVisibility()
    // section binding is deferred so DOM has all data-section elements.
    setTimeout(bindSections, 800)
  }, [])

  useEffect(() => {
    // route change → pageview
    const p = pathname + (search?.toString() ? '?' + search.toString() : '')
    trackPageview(p)
    // rebind sections since new page may have different data-section elements
    setTimeout(bindSections, 400)
  }, [pathname, search])

  return null
}
