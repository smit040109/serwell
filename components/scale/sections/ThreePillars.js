'use client'

import Link from 'next/link'
import { PenTool, Code2, TrendingUp, ArrowRight } from 'lucide-react'
import RevealOnScroll from '@/components/animation/RevealOnScroll'

const pillars = [
  {
    Icon: PenTool,
    number: '01',
    title: 'Design with purpose.',
    body: 'Motion, typography, whitespace, hierarchy — chosen because they help the product work harder, not because they look good in a case-study screenshot.',
  },
  {
    Icon: Code2,
    number: '02',
    title: 'Engineering that scales.',
    body: 'Type-safe, tested, documented, deployable. We architect for the version 2, 5 and 10 of your product — not just the launch.',
  },
  {
    Icon: TrendingUp,
    number: '03',
    title: 'Growth built in.',
    body: 'Analytics, funnel design and performance marketing baked into the product from day one, so growth is a feature — not a rescue plan.',
  },
]

export default function ThreePillars() {
  return (
    <section className="bg-pure-white pb-24 md:pb-32 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <RevealOnScroll y={30} stagger={0.12} className="grid md:grid-cols-3 gap-6">
          {pillars.map(({ Icon, number, title, body }) => (
            <article key={title} className="rounded-card p-8 md:p-10 bg-soft-mist flex flex-col">
              <div className="flex items-center gap-3">
                <span className="eyebrow text-graphite">{number}</span>
                <span className="w-6 h-px bg-vc-ink/20" />
                <div className="w-11 h-11 rounded-card-nest bg-pure-white flex items-center justify-center ml-auto">
                  <Icon size={20} strokeWidth={1.4} className="text-vc-ink" />
                </div>
              </div>
              <h3
                className="mt-8 text-vc-ink"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: '26px', lineHeight: 1.2, letterSpacing: '-0.01em' }}
              >
                {title}
              </h3>
              <p className="mt-4 text-body text-graphite">{body}</p>
              <Link href="/why-us" className="group inline-flex items-center gap-1.5 mt-8 text-[14px] font-aeonik text-vc-ink">
                See our approach
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  )
}
