'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Eyebrow from '@/components/ui-scale/Eyebrow'
import RevealOnScroll from '@/components/animation/RevealOnScroll'
import { PORTFOLIO_IMAGES } from '@/components/site/Shared'

// PLACEHOLDER — selected work using existing VayuCodes portfolio images.
// Replace the title/tag copy with real case-study details when available.
const work = [
  {
    tag: 'Case Study — placeholder',
    title: 'A high-performance product website for a fast-moving venture.',
    img: PORTFOLIO_IMAGES[0],
    size: 'lg',
  },
  {
    tag: 'Custom Software — placeholder',
    title: 'Internal platform replacing a fragmented spreadsheet workflow.',
    img: PORTFOLIO_IMAGES[1],
    size: 'md',
  },
  {
    tag: 'AI & Automation — placeholder',
    title: 'A support copilot that removes hours from every ticket.',
    img: PORTFOLIO_IMAGES[2],
    size: 'md',
  },
  {
    tag: 'Performance Marketing — placeholder',
    title: 'Growth campaign redesigned around actual attribution.',
    img: PORTFOLIO_IMAGES[3],
    size: 'md',
  },
  {
    tag: 'Business System — placeholder',
    title: 'Booking and operations platform for a service business.',
    img: PORTFOLIO_IMAGES[4],
    size: 'md',
  },
]

export default function NewsGrid() {
  return (
    <section className="bg-soft-mist py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <Eyebrow tone="muted">Selected work</Eyebrow>
            <h2
              className="mt-3 text-vc-ink"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.012em' }}
            >
              Things we&apos;ve <span className="italic text-vc-ink/60">built</span>.
            </h2>
          </div>
          <Link href="/our-work" data-track="portfolio" className="group inline-flex items-center gap-2 text-[14px] font-aeonik text-vc-ink">
            See all work
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <RevealOnScroll y={30} stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {work.map(n => (
            <Link
              key={n.title}
              href="/our-work" data-track="portfolio"
              className={`group relative rounded-card overflow-hidden bg-pure-white flex flex-col ${
                n.size === 'lg' ? 'md:col-span-2 md:row-span-2 md:min-h-[520px]' : 'min-h-[320px]'
              }`}
            >
              <div className="relative flex-1 overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{
                    backgroundImage: `url(${n.img}?w=900&q=70)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>

              <div className="p-6 md:p-8">
                <Eyebrow tone="muted">{n.tag}</Eyebrow>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <h3
                    className="text-vc-ink"
                    style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: n.size === 'lg' ? '28px' : '20px', lineHeight: 1.22, letterSpacing: '-0.01em' }}
                  >
                    {n.title}
                  </h3>
                  <ArrowUpRight size={20} className="flex-shrink-0 text-vc-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  )
}
