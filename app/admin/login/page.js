'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/components/admin/AdminProvider'
import { Lock, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const { login } = useAdmin()
  const router = useRouter()
  const [email, setEmail] = useState('admin@vayucodes.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login(data.token, data.admin)
      router.replace('/admin')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Lock size={16} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">VayuCodes CMS</h1>
          <p className="text-xs text-white/50 mt-1">Admin sign-in</p>
        </div>

        <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-white/40 mb-5"
        />

        <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-white/40 mb-6"
        />

        {error && <div className="text-xs text-red-400 mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3.5 rounded-lg disabled:opacity-50 hover:bg-white/90 transition"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  )
}
