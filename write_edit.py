import os
content = '''\'use client\'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getAdminToken, adminFetch } from '@/lib/adminAuth'

export default function EditSectionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [section, setSection] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadSection()
  }, [id])

  const loadSection = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetch('/api/sections/admin')
      if (data.success) {
        const found = (data.sections || []).find((s) => s._id === id)
        if (found) {
          setSection(found)
          setFormData(found.content || {})
        } else {
          setError('Section not found')
        }
      } else {
        setError(data.message || 'Failed to load section')
      }
    } catch (err) {
      setError(err.message || 'Failed to load section')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const data = await adminFetch(`/api/sections/admin/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content: formData }),
      })
      if (data.success) {
        setSuccess('Saved successfully!')
      } else {
        setError(data.message || 'Save failed')
      }
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0704] text-white/60 text-sm">
        Loading...
      </div>
    )
  }

  if (error && !section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0704] text-red-400 text-sm">
        {error}
      </div>
    )
  }

  const keys = Object.keys(formData)

  return (
    <div className="min-h-screen bg-[#0d0704] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="text-white/40 text-xs uppercase tracking-widest mb-6 hover:text-white/70 transition-colors"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-white text-2xl mb-1" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>
          Edit Section
        </h1>
        {section && (
          <p className="text-white/40 text-xs mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
            {section.page} · {section.type}
          </p>
        )}

        <form onSubmit={handleSave} className="space-y-5 bg-white/5 border border-white/10 rounded-2xl p-6">
          {keys.length === 0 && (
            <p className="text-white/40 text-sm">No content fields found for this section.</p>
          )}

          {keys.map((key) => {
            const value = formData[key]
            const isLong = typeof value === 'string' && value.length > 80

            return (
              <div key={key}>
                <label className="block text-white/60 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                  {key}
                </label>
                {isLong ? (
                  <textarea
                    value={value ?? ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD9B8] transition-colors resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={value ?? ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD9B8] transition-colors"
                  />
                )}
              </div>
            )
          })}

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-[#1a0a04] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#FFD9B8] transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
'''
content = content.replace("\\'use client\\'", "'use client'", 1)

os.makedirs('/var/www/serwell/app/admin/dashboard/[id]/edit', exist_ok=True)
with open('/var/www/serwell/app/admin/dashboard/[id]/edit/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Edit page created!")
