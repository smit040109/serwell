import Link from 'next/link'
import Eyebrow from '@/components/ui-scale/Eyebrow'

const columns = [
  {
    label: 'Products',
    links: ['Scale Data Engine', 'Scale GenAI Platform', 'Scale Donovan', 'Scale Labs', 'Enterprise', 'Public Sector'],
  },
  {
    label: 'Company',
    links: ['About', 'Careers', 'Newsroom', 'Contact', 'Trust Center', 'Blog'],
  },
  {
    label: 'Resources',
    links: ['Case Studies', 'Documentation', 'Guides', 'Research', 'Events', 'Whitepapers'],
  },
  {
    label: 'Legal',
    links: ['Terms of Use', 'Privacy Policy', 'Cookie Preferences', 'Security', 'Compliance'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-obsidian text-pure-white pt-24 pb-10">
      <div className="max-w-page mx-auto px-6 md:px-8">
        {/* Top: Wordmark + columns */}
        <div className="grid grid-cols-12 gap-8 pb-16 border-b border-white/10">
          <div className="col-span-12 lg:col-span-4">
            <div className="font-aeonik text-[22px] tracking-[0.2em]">SCALE</div>
            <p className="mt-5 text-body text-pure-white/60 max-w-[280px]">
              Reliable AI systems for the world&apos;s most important decisions.
            </p>
          </div>

          {columns.map(col => (
            <div key={col.label} className="col-span-6 md:col-span-3 lg:col-span-2">
              <Eyebrow tone="light">{col.label}</Eyebrow>
              <ul className="mt-5 space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-[14px] text-pure-white/70 hover:text-pure-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Massive tagline */}
        <div className="py-16">
          <h3 className="font-aeonik font-normal text-pure-white" style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Reliable AI for the world&apos;s<br />most important decisions.
          </h3>
        </div>

        {/* Bottom: copyright */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-white/10">
          <span className="eyebrow text-pure-white/50">
            © 2025 SCALE AI, INC. — ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-6">
            <Link href="#" className="eyebrow text-pure-white/50 hover:text-pure-white transition-colors">Terms of Use</Link>
            <Link href="#" className="eyebrow text-pure-white/50 hover:text-pure-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="eyebrow text-pure-white/50 hover:text-pure-white transition-colors">Manage Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
