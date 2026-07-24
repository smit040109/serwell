'use client'

import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import { Loader2, Upload, X, Image as ImageIcon, Video, Check } from 'lucide-react'

/*
  MediaPicker — reusable modal that browses the media library,
  supports inline upload, and returns the selected asset URL.
  Props: accept ('image' | 'video' | 'all'), onSelect(url), onClose()
*/
export default function MediaPicker({ accept = 'all', onSelect, onClose }) {
  const { apiFetch, token } = useAdmin() || {}
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const inputRef = useRef(null)

  async function load() {
    setLoading(true)
    try {
      const r = await apiFetch('/api/admin/media')
      setItems(r.data || [])
    } catch (e) { setMsg('Load failed: ' + e.message) }
    setLoading(false)
  }

  useEffect(() => { if (apiFetch) load() }, [apiFetch]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onFiles(files) {
    if (!files || !files.length) return
    setUploading(true); setMsg('')
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('alt', file.name)
        const res = await fetch('/api/admin/media', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
      } catch (e) { setMsg('Error: ' + e.message) }
    }
    setUploading(false)
    await load()
  }

  const filtered = items.filter(m => accept === 'all' || m.type === accept)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10" role="dialog">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl border border-white/15 bg-[#0d0d0d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <div className="text-sm font-semibold text-white">Media Library</div>
            <div className="text-[11px] text-white/40 mt-0.5">
              {accept === 'image' ? 'Select an image' : accept === 'video' ? 'Select a video' : 'Select an asset'} — or upload a new one
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input ref={inputRef} type="file" hidden multiple accept={accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*'} onChange={(e) => onFiles(e.target.files)} />
            <button onClick={() => inputRef.current?.click()} disabled={uploading}
                    className="inline-flex items-center gap-2 bg-white text-black text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-2 rounded-md hover:bg-white/90 transition disabled:opacity-50">
              {uploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />} Upload
            </button>
            <button onClick={onClose} className="p-2 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-white/30">
              <X size={14} />
            </button>
          </div>
        </div>

        {msg && <div className="px-5 pt-3 text-xs text-amber-400">{msg}</div>}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="text-white/50 text-sm flex items-center gap-2 py-10 justify-center"><Loader2 className="animate-spin" size={14}/> Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/15 rounded-xl">
              <ImageIcon size={24} className="mx-auto text-white/30 mb-2" />
              <div className="text-sm text-white/60">No {accept !== 'all' ? accept + ' ' : ''}assets yet. Upload one above.</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((m) => (
                <button key={m._id} onClick={() => onSelect?.(m.url)}
                        className="group relative rounded-lg border border-white/10 hover:border-white/50 bg-white/[0.02] overflow-hidden text-left transition">
                  <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
                    {m.type === 'image' ? (
                      <img src={m.url} alt={m.alt || m.filename} className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] tracking-[0.15em] uppercase font-semibold text-white">
                      {m.type === 'video' ? <><Video size={8} /> VID</> : <><ImageIcon size={8} /> IMG</>}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 bg-white text-black text-[9px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1.5 rounded"><Check size={10}/> Select</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] text-white/70 truncate">{m.filename}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/*
  MediaInput — text input + Browse button + live preview.
  Drop-in field for CollectionEditor (type: 'media').
*/
export function MediaInput({ value, onChange, accept = 'image', placeholder }) {
  const [open, setOpen] = useState(false)
  const isVideo = value && (accept === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(value))
  return (
    <div>
      <div className="flex items-center gap-2">
        {value ? (
          <div className="w-12 h-12 shrink-0 rounded-md border border-white/15 bg-black overflow-hidden flex items-center justify-center">
            {isVideo ? (
              <video src={value} muted playsInline preload="metadata" className="w-full h-full object-cover" />
            ) : (
              <img src={value} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        ) : null}
        <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || '/uploads/…'}
               className="flex-1 px-3 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-white/40 font-mono" />
        <button type="button" onClick={() => setOpen(true)}
                className="shrink-0 inline-flex items-center gap-1.5 border border-white/20 text-white/80 hover:text-white hover:border-white/50 text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-2.5 rounded-md transition">
          <ImageIcon size={11} /> Browse
        </button>
        {value ? (
          <button type="button" onClick={() => onChange('')} title="Clear"
                  className="shrink-0 p-2.5 rounded-md border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/30">
            <X size={12} />
          </button>
        ) : null}
      </div>
      {open && <MediaPicker accept={accept} onSelect={(url) => { onChange(url); setOpen(false) }} onClose={() => setOpen(false)} />}
    </div>
  )
}
