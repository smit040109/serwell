'use client'

import { useState } from 'react'
import CarouselArrow from '@/components/ui-scale/CarouselArrow'
import Eyebrow from '@/components/ui-scale/Eyebrow'

const cards = [
  { tag: 'Automotive', title: 'Autonomous perception, from data to deployment.', partner: 'Toyota' },
  { tag: 'Public Sector', title: 'Trusted AI for defense and intelligence workflows.', partner: 'U.S. Army' },
  { tag: 'Healthcare', title: 'Better clinical decisions with reliable AI signals.', partner: 'Mayo Clinic' },
  { tag: 'Financial Services', title: 'Enterprise AI shipping real workflow automation.', partner: 'Morgan Stanley' },
  { tag: 'Retail', title: 'Personalization at the frontier of foundation models.', partner: 'Shore Capital' },
  { tag: 'Aerospace', title: 'Mission-critical models for a new operational tempo.', partner: 'BAE Systems' },
]

export default function ProvenIndustryCarousel() {
  const [index, setIndex] = useState(0)
  const visible = 3
  const max = Math.max(0, cards.length - visible)

  return (
    <section className="bg-pure-white py-20 md:py-28 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <Eyebrow tone="muted">Case Studies</Eyebrow>
            <h2 className="mt-3 font-aeonik font-normal text-obsidian" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Proven across every industry.
            </h2>
          </div>
          <div className="flex gap-2">
            <CarouselArrow direction="left"  onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0} />
            <CarouselArrow direction="right" onClick={() => setIndex(Math.min(max, index + 1))} disabled={index === max} />
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${index} * (100% / ${visible}) - ${index * 24 / visible}px))` }}
          >
            {cards.map(c => (
              <article
                key={c.title}
                className="flex-shrink-0 rounded-card p-8 flex flex-col justify-between min-h-[280px]"
                style={{ width: `calc((100% - ${(visible - 1) * 24}px) / ${visible})`, background: '#f2f2f2' }}
              >
                <Eyebrow tone="muted">{c.tag}</Eyebrow>
                <h3 className="mt-6 font-aeonik font-normal text-obsidian" style={{ fontSize: '22px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                  {c.title}
                </h3>
                <div className="mt-8 text-caption text-graphite">{c.partner}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
