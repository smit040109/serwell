import Link from 'next/link'
import Eyebrow from '@/components/ui-scale/Eyebrow'
import { ArrowUpRight, Circle } from 'lucide-react'
import { NAV_LINKS } from '@/components/site/Shared'

const columns = [
  {
    label: 'Services',
    links: [
      { name: 'Custom Software', href: '/#services' },
      { name: 'Web Experiences', href: '/#services' },
      { name: 'AI & Automation', href: '/#services' },
      { name: 'Business Systems', href: '/#services' },
      { name: 'Performance Marketing', href: '/digital-marketing' },
    ],
  },
  {
    label: 'Studio',
    links: [
      { name: 'Our Work', href: '/our-work' },
      { name: 'Marketing', href: '/digital-marketing' },
      { name: 'Why Us', href: '/why-us' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Reach',
    links: [
      { name: 'hello@vayucodes.com', href: 'mailto:hello@vayucodes.com' },
      { name: 'Valsad, Gujarat', href: '/contact' },
      { name: 'India · 396001', href: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-vc-ink text-pure-white pt-24 pb-10 overflow-hidden">
      <div className="pointer-events-none absolute w-[60vw] h-[60vw] rounded-full bg-white/[0.02] blur-3xl" style={{ top: '10rem', right: '-15rem' }} />

      <div className="relative max-w-page mx-auto px-6 md:px-8">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-12 gap-8 pb-16 border-b border-white/10">
          <div className="col-span-12 lg:col-span-5">
            <img
              src="/brand/logo-lockup.png"
              alt="VayuCodes"
              className="h-8 w-auto select-none mb-6"
              style={{ filter: 'invert(1) brightness(2)' }}
              draggable={false}
            />
            <p className="text-body text-pure-white/65 max-w-[320px]">
              An independent studio designing, engineering, and scaling the digital systems businesses run on.
            </p>
            <div className="mt-6 flex items-center gap-2 eyebrow text-pure-white/40">
              <Circle size={6} className="fill-white text-white animate-pulse" />
              Available · Q3 2026
            </div>
          </div>

          {columns.map(col => (
            <div key={col.label} className="col-span-6 md:col-span-4 lg:col-span-2">
              <Eyebrow tone="light">{col.label}</Eyebrow>
              <ul className="mt-5 space-y-3">
                {col.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[14px] text-pure-white/70 hover:text-pure-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Massive closing tagline — VayuCodes signature */}
        <div className="py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h3 className="font-aeonik font-normal text-pure-white leading-[1.02]" style={{ fontSize: 'clamp(36px, 6vw, 76px)', letterSpacing: '-0.02em' }}>
            Let&apos;s build something<br />
            <span className="italic text-pure-white/70" style={{ fontFamily: 'var(--font-instrument)' }}>you can rely on.</span>
          </h3>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 self-start md:self-end bg-pure-white text-vc-ink font-medium eyebrow px-7 py-4 rounded-btn hover:bg-vc-cream transition-colors"
          >
            Start a project
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Bottom: copyright */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-white/10">
          <span className="eyebrow text-pure-white/50">
            © 2026 VAYUCODES · AN INDEPENDENT STUDIO
          </span>
          <div className="flex items-center gap-6">
            {NAV_LINKS.slice(1).map(l => (
              <Link key={l.href} href={l.href} className="eyebrow text-pure-white/50 hover:text-pure-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
