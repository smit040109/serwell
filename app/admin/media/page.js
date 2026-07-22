'use client'

import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminShell from '@/components/admin/AdminShell'
import { Upload, Loader2, Trash2, Copy, Image as ImageIcon, Video, File as FileIcon, Check } from 'lucide-react'

export default function MediaLibraryPage() {
  const { apiFetch, token, loading: authLoading } = useAdmin() || {}
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState('')
  const [msg, setMsg] = useState('')
  const inputRef = useRef(null)

  async function load() {
    setLoading(true)
    try {
      const r = await apiFetch('/api/cms/media')
      setItems(r.data || [])
    } catch (e) { setMsg('Load failed: ' + e.message) }
    setLoading(false)
  }

  useEffect(() => { if (!authLoading && apiFetch) load() }, [authLoading, apiFetch])

  async function onFiles(files) {
    if (!files || !files.length) return
    setUploading(true); setMsg('')
    let ok = 0, fail = 0
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('alt', file.name)
        const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        ok++
      } catch (e) { fail++; setMsg('Error: ' + e.message) }
    }
    setUploading(false)
    if (ok) setMsg(`Uploaded ${ok} file(s)${fail ? ` · ${fail} failed` : ''}`)
    await load()
  }

  async function remove(id) {
    if (!confirm('Delete this asset?')) return
    try {
      await apiFetch(`/api/cms/media/${id}`, { method: 'DELETE' })
      await load()
    } catch (e) { setMsg('Delete failed: ' + e.message) }
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url)
    setCopied(url); setTimeout(() => setCopied(''), 1500)
  }

  return (
    <AdminShell
      title="Media Library"
      description="Upload images and videos. Videos preview in a 5-second loop."
      action={(
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" hidden multiple accept="image/*,video/*" onChange={(e) => onFiles(e.target.files)} />
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
                  className="inline-flex items-center gap-2 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2.5 rounded-md hover:bg-white/90 transition disabled:opacity-50">
            {uploading ? <Loader2 className="animate-spin" size={13} /> : <Upload size={13} />} Upload
          </button>
        </div>
      )}
    >
      {msg && <div className="mb-4 text-xs text-white/70">{msg}</div>}

      {loading ? (
        <div className="text-white/50 text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/15 rounded-xl">
          <ImageIcon size={28} className="mx-auto text-white/30 mb-3" />
          <div className="text-sm text-white/70">No assets yet.</div>
          <div className="text-xs text-white/40 mt-1">Click Upload to add images or videos.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((m) => (
            <MediaCard key={m._id} m={m} copied={copied} onCopy={copyUrl} onDelete={remove} />
          ))}
        </div>
      )}
    </AdminShell>
  )
}

function MediaCard({ m, copied, onCopy, onDelete }) {
  const videoRef = useRef(null)

  useEffect(() => {
    // 5-second loop preview for videos
    if (m.type !== 'video' || !videoRef.current) return
    const v = videoRef.current
    v.muted = true
    v.loop = false
    let raf
    function reset() {
      try { v.currentTime = 0; v.play() } catch (e) { /* noop */ }
    }
    function tick() {
      if (v.currentTime >= 5) reset()
      raf = requestAnimationFrame(tick)
    }
    v.play().catch(() => {})
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [m.type, m.url])

  return (
    <div className="group relative rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
        {m.type === 'image' ? (
          <img src={m.url} alt={m.alt || m.filename} className="w-full h-full object-cover" />
        ) : m.type === 'video' ? (
          <video ref={videoRef} src={m.url} muted playsInline className="w-full h-full object-cover" />
        ) : (
          <FileIcon size={28} className="text-white/40" />
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur px-2 py-1 rounded text-[9px] tracking-[0.15em] uppercase font-semibold">
          {m.type === 'video' ? <><Video size={9} /> VIDEO · 5s loop</> : <><ImageIcon size={9} /> IMG</>}
        </div>
      </div>
      <div className="p-3">
        <div className="text-[11px] text-white/80 truncate" title={m.filename}>{m.filename}</div>
        <div className="text-[9px] text-white/40 mt-0.5">{Math.round((m.size || 0) / 1024)} KB</div>
        <div className="mt-2 flex items-center gap-1.5">
          <button onClick={() => onCopy(m.url)} className="flex-1 inline-flex items-center justify-center gap-1 text-[10px] tracking-[0.15em] uppercase font-semibold text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-2 py-1.5 rounded">
            {copied === m.url ? <><Check size={10}/> Copied</> : <><Copy size={10}/> URL</>}
          </button>
          <button onClick={() => onDelete(m._id)} className="p-1.5 rounded border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/30">
            <Trash2 size={11}/>
          </button>
        </div>
      </div>
    </div>
  )
}
