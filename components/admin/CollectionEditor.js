'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminShell from '@/components/admin/AdminShell'
import { Loader2, Plus, Trash2, Save, X, Search, Copy, Image as ImageIcon, ChevronDown } from 'lucide-react'

/*
  Generic collection editor.
  Renders a list on the left and a form on the right.
  Field types are inferred from the schemaHint prop.
*/

function FieldInput({ type = 'text', value, onChange, placeholder, textarea, options, rows = 4 }) {
  if (type === 'boolean') {
    return (
      <button type="button" onClick={() => onChange(!value)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border text-xs ${value ? 'bg-white text-black border-white' : 'border-white/15 text-white/70'}`}>
        <span className={`w-2 h-2 rounded-full ${value ? 'bg-black' : 'bg-white/40'}`} />
        {value ? 'Enabled' : 'Disabled'}
      </button>
    )
  }
  if (type === 'select' && options) {
    return (
      <div className="relative">
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-white/40 pr-8">
          {options.map((o) => <option key={o.value ?? o} value={o.value ?? o} className="bg-black">{o.label ?? o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
      </div>
    )
  }
  if (textarea) {
    return (
      <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-white/40 font-mono leading-relaxed" />
    )
  }
  if (type === 'color') {
    return (
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="w-10 h-9 rounded border border-white/10 bg-transparent cursor-pointer" />
        <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="flex-1 px-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-white/40 font-mono" />
      </div>
    )
  }
  return (
    <input type={type} value={value ?? ''} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-white/40" />
  )
}

export default function CollectionEditor({
  collection,
  title,
  description,
  fields,
  singleton = false,
  itemDisplay = (i) => i.title || i.name || i.slug || i._id,
  itemSubtitle = (i) => i.category || i.role || i.slug || '',
  newItemDefaults = {},
}) {
  const { apiFetch, loading: authLoading } = useAdmin() || {}
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await apiFetch(`/api/cms/${collection}`)
      if (singleton) {
        setItems([r.data])
        setSelected(r.data)
        setDraft(r.data)
      } else {
        setItems(r.data || [])
      }
    } catch (e) {
      setMsg('Failed to load: ' + e.message)
    }
    setLoading(false)
  }, [apiFetch, collection, singleton])

  useEffect(() => { if (!authLoading && apiFetch) load() }, [authLoading, apiFetch, load])

  function select(item) {
    setSelected(item)
    setDraft(JSON.parse(JSON.stringify(item)))
    setMsg('')
  }

  function updateField(key, value) {
    setDraft(prev => {
      const next = { ...prev }
      // dotted key support (theme.ink)
      if (key.includes('.')) {
        const parts = key.split('.')
        let cur = next
        for (let i = 0; i < parts.length - 1; i++) {
          cur[parts[i]] = { ...(cur[parts[i]] || {}) }
          cur = cur[parts[i]]
        }
        cur[parts[parts.length - 1]] = value
      } else {
        next[key] = value
      }
      return next
    })
  }

  function getField(key) {
    if (!draft) return ''
    return key.split('.').reduce((o, k) => o?.[k], draft) ?? ''
  }

  async function save() {
    if (!draft) return
    setSaving(true)
    setMsg('')
    try {
      let r
      if (singleton) {
        r = await apiFetch(`/api/cms/${collection}`, { method: 'POST', body: JSON.stringify(draft) })
      } else if (draft._id && items.find(i => i._id === draft._id)) {
        r = await apiFetch(`/api/cms/${collection}/${draft._id}`, { method: 'PUT', body: JSON.stringify(draft) })
      } else {
        r = await apiFetch(`/api/cms/${collection}`, { method: 'POST', body: JSON.stringify(draft) })
      }
      setMsg('Saved ✓')
      await load()
      if (!singleton) select(r.data)
    } catch (e) {
      setMsg('Error: ' + e.message)
    }
    setSaving(false)
  }

  async function remove() {
    if (!draft?._id || singleton) return
    if (!confirm('Delete this item?')) return
    try {
      await apiFetch(`/api/cms/${collection}/${draft._id}`, { method: 'DELETE' })
      setDraft(null)
      setSelected(null)
      await load()
    } catch (e) {
      setMsg('Delete failed: ' + e.message)
    }
  }

  function newItem() {
    const d = { ...newItemDefaults }
    setDraft(d)
    setSelected(null)
    setMsg('')
  }

  const filtered = items.filter(i => !q || itemDisplay(i)?.toLowerCase().includes(q.toLowerCase()))

  return (
    <AdminShell
      title={title}
      description={description}
      action={!singleton && (
        <button onClick={newItem} className="inline-flex items-center gap-2 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2.5 rounded-md hover:bg-white/90 transition">
          <Plus size={13} /> New
        </button>
      )}
    >
      <div className={`grid ${singleton ? 'grid-cols-1' : 'lg:grid-cols-[280px_1fr]'} gap-6`}>
        {!singleton && (
          <div className="space-y-2">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full pl-8 pr-3 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm outline-none focus:border-white/30" />
            </div>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
              {loading && <div className="text-xs text-white/40 py-4"><Loader2 size={12} className="inline animate-spin mr-2"/> Loading…</div>}
              {!loading && filtered.length === 0 && <div className="text-xs text-white/40 py-4">No items yet.</div>}
              {filtered.map((it) => (
                <button key={it._id} onClick={() => select(it)} className={`w-full text-left px-3 py-2.5 rounded-md border transition ${selected?._id === it._id ? 'bg-white/10 border-white/30' : 'border-white/8 hover:bg-white/5 hover:border-white/15'}`}>
                  <div className="text-xs font-medium text-white truncate">{itemDisplay(it)}</div>
                  <div className="text-[10px] text-white/40 truncate mt-0.5">{itemSubtitle(it)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`rounded-xl border border-white/10 bg-white/[0.02] ${!draft && !singleton ? 'flex items-center justify-center min-h-[300px] text-sm text-white/40' : ''}`}>
          {!draft && !singleton && <div>Select an item or click New</div>}
          {draft && (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                {fields.map((f) => (
                  <div key={f.key} className={f.wide ? 'md:col-span-2' : ''}>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">{f.label}</label>
                    <FieldInput
                      type={f.type}
                      value={getField(f.key)}
                      onChange={(v) => updateField(f.key, v)}
                      placeholder={f.placeholder}
                      textarea={f.textarea}
                      rows={f.rows}
                      options={f.options}
                    />
                    {f.help && <div className="text-[10px] text-white/40 mt-1">{f.help}</div>}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/8 flex items-center justify-between">
                <div className="text-xs text-white/50">{msg}</div>
                <div className="flex items-center gap-2">
                  {!singleton && draft?._id && (
                    <button onClick={remove} className="inline-flex items-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold tracking-[0.15em] uppercase px-4 py-2.5 rounded-md transition">
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                  <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded-md hover:bg-white/90 transition disabled:opacity-50">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
