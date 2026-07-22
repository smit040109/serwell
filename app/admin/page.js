'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminShell from '@/components/admin/AdminShell'
import Link from 'next/link'
import { ArrowUpRight, Loader2, Briefcase, Users, MessageSquareQuote, Wrench, Image as ImageIcon } from 'lucide-react'

export default function AdminDashboard() {
  const { apiFetch, admin, loading: authLoading } = useAdmin() || {}
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !apiFetch) return
    let cancel = false
    async function load() {
      const cols = ['portfolio_projects', 'services', 'team_members', 'testimonials', 'media', 'pages', 'sections']
      const c = {}
      await Promise.all(cols.map(async (col) => {
        try {
          const r = await apiFetch(`/api/cms/${col}`)
          c[col] = Array.isArray(r.data) ? r.data.length : 1
        } catch { c[col] = 0 }
      }))
      if (!cancel) { setCounts(c); setLoading(false) }
    }
    load()
    return () => { cancel = true }
  }, [apiFetch, authLoading])

  const cards = [
    { key: 'portfolio_projects', label: 'Portfolio', icon: Briefcase, href: '/admin/portfolio' },
    { key: 'team_members', label: 'Team members', icon: Users, href: '/admin/team' },
    { key: 'services', label: 'Services', icon: Wrench, href: '/admin/services' },
    { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, href: '/admin/testimonials' },
    { key: 'media', label: 'Media assets', icon: ImageIcon, href: '/admin/media' },
  ]

  if (authLoading) return null

  return (
    <AdminShell title="Overview" description={`Welcome back, ${admin?.name || 'Admin'}.`}>
      {loading ? (
        <div className="flex items-center gap-2 text-white/50 text-sm"><Loader2 className="animate-spin" size={14}/> Loading counts…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map(c => (
            <Link key={c.key} href={c.href} className="group p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <c.icon size={16} className="text-white/60" />
                <ArrowUpRight size={14} className="text-white/30 group-hover:text-white transition" />
              </div>
              <div className="text-3xl font-semibold tracking-tight">{counts[c.key] ?? 0}</div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-white/50 mt-1">{c.label}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-3">Quick actions</div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/admin/portfolio" className="text-sm text-white/80 hover:text-white px-3 py-2 rounded-md bg-white/[0.03] hover:bg-white/[0.06] transition">→ Add project</Link>
            <Link href="/admin/team" className="text-sm text-white/80 hover:text-white px-3 py-2 rounded-md bg-white/[0.03] hover:bg-white/[0.06] transition">→ Add team member</Link>
            <Link href="/admin/testimonials" className="text-sm text-white/80 hover:text-white px-3 py-2 rounded-md bg-white/[0.03] hover:bg-white/[0.06] transition">→ Add testimonial</Link>
            <Link href="/admin/media" className="text-sm text-white/80 hover:text-white px-3 py-2 rounded-md bg-white/[0.03] hover:bg-white/[0.06] transition">→ Upload media</Link>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-3">Environment</div>
          <div className="text-sm text-white/80 space-y-1">
            <div><span className="text-white/40">DB:</span> vayucodes_cms</div>
            <div><span className="text-white/40">Auth:</span> JWT (7-day)</div>
            <div><span className="text-white/40">Media:</span> /public/uploads (5s video limit)</div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
