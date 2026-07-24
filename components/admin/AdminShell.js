'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdmin } from '@/components/admin/AdminProvider'
import {
  LayoutDashboard, Settings, FileText, Image as ImageIcon,
  Briefcase, Wrench, Users, MessageSquareQuote, Mail,
  Navigation as NavIcon, PanelBottom, Search, LogOut, ExternalLink, Layers,
  ListOrdered, HelpCircle, ScrollText, LayoutTemplate,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/site-settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/sections', label: 'Sections', icon: Layers },
  { href: '/admin/page-content', label: 'Page Content', icon: LayoutTemplate },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/how-we-work', label: 'How We Work', icon: ListOrdered },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/legal', label: 'Legal Pages', icon: ScrollText },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/contact-settings', label: 'Contact', icon: Mail },
  { href: '/admin/navigation', label: 'Navigation', icon: NavIcon },
  { href: '/admin/footer', label: 'Footer', icon: PanelBottom },
  { href: '/admin/seo-settings', label: 'SEO', icon: Search },
]

export default function AdminShell({ children, title, description, action }) {
  const { admin, logout } = useAdmin() || {}
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="w-60 shrink-0 border-r border-white/8 bg-black/40 sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 py-6 border-b border-white/8">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">VayuCodes</div>
          <div className="text-sm font-semibold mt-0.5">CMS Console</div>
        </div>
        <nav className="px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition ${
                  active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/8 mt-auto">
          <div className="text-[10px] tracking-[0.15em] uppercase text-white/40">Signed in as</div>
          <div className="text-xs text-white/80 mt-1 truncate">{admin?.email || '—'}</div>
          <div className="mt-3 flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white">
              <ExternalLink size={11} /> Site
            </a>
            <span className="text-white/20">·</span>
            <button onClick={logout} className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white">
              <LogOut size={11} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">
        <header className="border-b border-white/8 px-8 py-6 bg-black/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {description && <p className="text-xs text-white/50 mt-1">{description}</p>}
            </div>
            {action}
          </div>
        </header>
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
