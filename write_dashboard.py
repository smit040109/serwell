import os
content = '''\'use client\'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminToken, getAdminData, clearAdminSession, adminFetch } from '@/lib/adminAuth'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAdmin(getAdminData())
    loadSections()
  }, [])

  const loadSections = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetch('/api/sections/admin')
      if (data.success) {
        setSections(data.sections || [])
      } else {
        setError(data.message || 'Failed to load sections')
      }
    } catch (err) {
      setError(err.message || 'Failed to load sections')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this section?')) return
    try {
      const data = await adminFetch(`/api/sections/admin/${id}`, { method: 'DELETE' })
      if (data.success) {
        setSections((prev) => prev.filter((s) => s._id !== id))
      } else {
        alert(data.message || 'Delete failed')
      }
    } catch (err) {
      alert(err.message || 'Delete failed')
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    router.push('/admin/login')
  }

  const grouped = sections.reduce((acc, s) => {
    const page = s.page || 'unknown'
    if (!acc[page]) acc[page] = []
    acc[page].push(s)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0704] text-white/60 text-sm">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0704] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-white text-2xl" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>
              Serwell Admin
            </h1>
            {admin && (
              <p className="text-white/40 text-xs mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                {admin.email}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-white/60 text-xs uppercase tracking-widest border border-white/15 rounded-full px-4 py-2 hover:bg-white/5 transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-6">{error}</p>
        )}

        {Object.keys(grouped).length === 0 && !error && (
          <p className="text-white/40 text-sm">No sections found.</p>
        )}

        {Object.entries(grouped).map(([page, items]) => (
          <div key={page} className="mb-10">
            <h2 className="text-white/50 text-xs uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
              {page}
            </h2>
            <div className="space-y-3">
              {items
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4"
                  >
                    <div>
                      <p className="text-white text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                        {s.type}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        order: {s.order ?? 0} · {s.isVisible ? 'visible' : 'hidden'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/admin/dashboard/${s._id}/edit`)}
                        className="text-xs text-[#FFD9B8] border border-[#FFD9B8]/30 rounded-full px-4 py-1.5 hover:bg-[#FFD9B8]/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-xs text-red-400 border border-red-400/30 rounded-full px-4 py-1.5 hover:bg-red-400/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
'''
content = content.replace("\\'use client\\'", "'use client'", 1)

os.makedirs('/var/www/serwell/app/admin/dashboard', exist_ok=True)
with open('/var/www/serwell/app/admin/dashboard/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Dashboard page created!")
