import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production'
const TOKEN_EXPIRY = '7d'

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

/** Extract token from Authorization header or cookie */
export function getTokenFromRequest(request) {
  const auth = request.headers.get('authorization') || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/(?:^|;\s*)vc_admin_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function requireAdmin(request) {
  const token = getTokenFromRequest(request)
  if (!token) return { ok: false, status: 401, error: 'No token' }
  const decoded = verifyToken(token)
  if (!decoded || !decoded.id) return { ok: false, status: 401, error: 'Invalid token' }
  return { ok: true, admin: decoded }
}
