'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Products', href: '#' },
  { label: 'Solutions', href: '#' },
  { label: 'Research', href: '#' },
  { label: 'Resources', href: '#' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-obsidian border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-page mx-auto px-6 md:px-8 flex items-center justify-between h-16">
        {/* Left: Logo + primary nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="font-aeonik font-normal text-[18px] tracking-[0.2em] text-pure-white">
            SCALE
          </Link>
          <ul className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-aeonik text-[14px] text-pure-white/85 hover:text-pure-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="hidden md:inline-flex font-aeonik text-[14px] text-pure-white/85 hover:text-pure-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="#"
            className="inline-flex items-center px-4 py-2 rounded-btn border border-white/25 text-[14px] font-aeonik text-pure-white hover:bg-pure-white hover:text-obsidian transition-colors"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}
