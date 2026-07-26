'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/components/site/Shared'
import Logo3D from '@/components/scale/Logo3D'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Filter out Home from nav display (logo is home link) — matches existing VayuCodes pattern
  const links = NAV_LINKS.filter(l => l.href !== '/')

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-vc-ink border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-page mx-auto px-6 md:px-8 flex items-center justify-between h-16">
        {/* Left: VayuCodes wordmark */}
        <Link href="/" aria-label="VayuCodes home" className="inline-flex items-center">
          <Logo3D className="h-9 md:h-10 w-24 md:w-28" />
        </Link>

        {/* Center: primary nav */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-9">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="eyebrow text-pure-white/70 hover:text-pure-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: CTA */}
        <Link
          href="/contact"
          data-track="start_project_nav"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-pure-white text-vc-ink text-[13px] tracking-[0.18em] uppercase font-medium hover:bg-vc-cream transition-colors"
        >
          Start Project
        </Link>
      </div>
    </nav>
  )
}
