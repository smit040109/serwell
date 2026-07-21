content = '''\'use client\'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/adminAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(email, password)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0704] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-white text-2xl" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>
            Serwell Admin
          </h1>
          <p className="text-white/50 text-sm mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
            Sign in to manage your website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD9B8] transition-colors"
              placeholder="admin@vayucodes.com"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD9B8] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#1a0a04] font-semibold text-sm py-2.5 rounded-full hover:bg-[#FFD9B8] transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
'''

with open('/var/www/serwell/app/admin/login/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Login page created!")
