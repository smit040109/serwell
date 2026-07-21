import os
content = '''\'use client\'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getAdminToken, adminFetch } from '@/lib/adminAuth'

function isImageKey(key) {
  return /image|img|photo|logo|avatar|icon|thumbnail/i.test(key)
}

function FieldEditor({ label, value, onChange, onRemove, depth }) {
  const isArray = Array.isArray(value)
  const isObject = value !== null && typeof value === 'object' && !isArray
  const indent = { marginLeft: depth * 14 }

  if (isArray) {
    const allPrimitive = value.every((v) => v === null || typeof v !== 'object')
    return (
      <div className="border border-white/10 rounded-xl p-4 space-y-3" style={indent}>
        <div className="flex items-center justify-between">
          <label className="text-white/60 text-xs uppercase tracking-widest">{label}</label>
          {onRemove && <button type="button" onClick={onRemove} className="text-red-400 text-xs">Remove</button>}
        </div>
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {allPrimitive ? (
              <input
                type="text"
                value={item ?? ''}
                onChange={(e) => {
                  const next = [...value]
                  next[i] = e.target.value
                  onChange(next)
                }}
                className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm"
              />
            ) : (
              <div className="flex-1 border border-white/10 rounded-lg p-3 space-y-2">
                {Object.entries(item || {}).map(([k, v]) => (
                  <FieldEditor
                    key={k}
                    label={k}
                    value={v}
                    depth={depth + 1}
                    onChange={(newVal) => {
                      const next = [...value]
                      next[i] = { ...next[i], [k]: newVal }
                      onChange(next)
                    }}
                  />
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-red-400 text-xs mt-2"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const template = allPrimitive
              ? ''
              : Object.fromEntries(Object.keys(value[0] || {}).map((k) => [k, '']))
            onChange([...value, template])
          }}
          className="text-xs text-[#FFD9B8] border border-[#FFD9B8]/30 rounded-full px-3 py-1"
        >
          + Add item
        </button>
      </div>
    )
  }

  if (isObject) {
    return (
      <div className="border border-white/10 rounded-xl p-4 space-y-3" style={indent}>
        <label className="text-white/60 text-xs uppercase tracking-widest">{label}</label>
        {Object.entries(value).map(([k, v]) => (
          <FieldEditor
            key={k}
            label={k}
            value={v}
            depth={depth + 1}
            onChange={(newVal) => onChange({ ...value, [k]: newVal })}
          />
        ))}
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center justify-between" style={indent}>
        <label className="text-white/60 text-xs uppercase tracking-widest">{label}</label>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <div style={indent}>
        <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
        />
      </div>
    )
  }

  const strValue = value ?? ''
  const isImg = isImageKey(label)
  const isLong = typeof strValue === 'string' && strValue.length > 80

  return (
    <div style={indent}>
      <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">{label}</label>
      {isImg && strValue && (
        <img src={strValue} alt={label} className="w-24 h-24 object-cover rounded-lg mb-2 border border-white/10" />
      )}
      {isLong && !isImg ? (
        <textarea
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm resize-none"
        />
      ) : (
        <input
          type="text"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isImg ? 'https://...' : ''}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
        />
      )}
    </div>
  )
}

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
    return <div className="min-h-screen flex items-center justify-center bg-[#0d0704] text-white/60 text-sm">Loading...</div>
  }

  if (error && !section) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0d0704] text-red-400 text-sm">{error}</div>
  }

  const keys = Object.keys(formData)

  return (
    <div className="min-h-screen bg-[#0d0704] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/admin/dashboard')} className="text-white/40 text-xs uppercase tracking-widest mb-6 hover:text-white/70 transition-colors">
          ← Back to Dashboard
        </button>
        <h1 className="text-white text-2xl mb-1" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>Edit Section</h1>
        {section && <p className="text-white/40 text-xs mb-8" style={{ fontFamily: 'var(--font-inter)' }}>{section.page} · {section.type}</p>}
        <form onSubmit={handleSave} className="space-y-5 bg-white/5 border border-white/10 rounded-2xl p-6">
          {keys.length === 0 && <p className="text-white/40 text-sm">No content fields found for this section.</p>}
          {keys.map((key) => (
            <FieldEditor
              key={key}
              label={key}
              value={formData[key]}
              depth={0}
              onChange={(newVal) => setFormData((prev) => ({ ...prev, [key]: newVal }))}
            />
          ))}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-white text-[#1a0a04] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#FFD9B8] transition-all disabled:opacity-50">
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

with open('/var/www/serwell/app/admin/dashboard/[id]/edit/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Universal edit form created!")
