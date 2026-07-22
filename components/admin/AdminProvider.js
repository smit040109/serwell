'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AdminCtx = createContext(null)
export const useAdmin = () => useContext(AdminCtx)

export function AdminProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const t = localStorage.getItem('vc_admin_token')
    const a = localStorage.getItem('vc_admin_user')
    if (t && a) {
      setToken(t)
      try { setAdmin(JSON.parse(a)) } catch {}
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return
    if (pathname === '/admin/login') return
    if (!token && pathname.startsWith('/admin')) {
      router.replace('/admin/login')
    }
  }, [token, pathname, loading, router])

  const login = useCallback((tok, adm) => {
    localStorage.setItem('vc_admin_token', tok)
    localStorage.setItem('vc_admin_user', JSON.stringify(adm))
    setToken(tok)
    setAdmin(adm)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('vc_admin_token')
    localStorage.removeItem('vc_admin_user')
    setToken(null)
    setAdmin(null)
    router.replace('/admin/login')
  }, [router])

  const apiFetch = useCallback(async (url, opts = {}) => {
    const headers = { ...(opts.headers || {}) }
    if (token) headers.Authorization = `Bearer ${token}`
    if (opts.body && !(opts.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
    const res = await fetch(url, { ...opts, headers })
    if (res.status === 401) {
      logout()
      throw new Error('Unauthorized')
    }
    const text = await res.text()
    let data = null
    try { data = text ? JSON.parse(text) : null } catch { data = text }
    if (!res.ok) throw new Error((data && data.error) || res.statusText)
    return data
  }, [token, logout])

  return (
    <AdminCtx.Provider value={{ admin, token, loading, login, logout, apiFetch }}>
      {children}
    </AdminCtx.Provider>
  )
}
