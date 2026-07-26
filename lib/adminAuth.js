'use client'

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:8090'
const TOKEN_KEY = 'serwell_admin_token'
const ADMIN_KEY = 'serwell_admin_data'

export function saveAdminSession(token, admin) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export function getAdminToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminData() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(ADMIN_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
}

export async function adminLogin(email, password) {
  const res = await fetch(`${CMS_API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Login failed')
  }
  saveAdminSession(data.token, data.admin)
  return data
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken()
  const res = await fetch(`${CMS_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (res.status === 401) {
    clearAdminSession()
    if (typeof window !== 'undefined') window.location.href = '/admin/login'
    throw new Error('Session expired')
  }
  return res.json()
}
