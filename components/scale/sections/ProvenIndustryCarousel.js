'use client'

import { useState } from 'react'
import CarouselArrow from '@/components/ui-scale/CarouselArrow'
import Eyebrow from '@/components/ui-scale/Eyebrow'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

// VayuCodes services — replaces the reference "industries" carousel
const services = [
  {
    n: '01',
    tag: 'Custom Software',
    title: 'Tailored platforms and business systems.',
    body: 'Internal tools, dashboards, admin platforms and workflow software built around your operation — not around a template.',
    href: '/contact',
  },
  {
    n: '02',
    tag: 'Web Experiences',
    title: 'Premium, high-performance websites.',
    body: 'Cinematic marketing sites, product landing pages and interactive experiences engineered for polish and speed.',
    href: '/our-work',
  },
  {
    n: '03',
    tag: 'AI & Automation',
    title: 'Intelligence, embedded into your workflow.',
    body: 'LLM integrations, automation pipelines, custom AI features and internal copilots that remove real hours from your week.',
    href: '/contact',
  },
  {
    n: '04',
    tag: 'Business Systems',
    title: 'Digital plumbing that just works.',
    body: 'Payments, CRMs, portals, integrations and back-office systems that keep the business running without you thinking about it.',
    href: '/contact',
  },
  {
    n: '05',
    tag: 'Performance Marketing',
    title: 'Growth-focused digital strategy.',
    body: 'Paid media, SEO, funnel design and analytics — built on top of the product, not bolted on afterward.',
    href: '/digital-marketing',
  },
  {
    n: '06',
    tag: 'Digital Strategy',
    title: 'A partner from idea to scale.',
    body: 'Discovery, product architecture, technology choices and roadmap — so you spend budget on the right build, once.',
    href: '/contact',
  },
]

export default function ProvenIndustryCarousel() {
  const [index, setIndex] = useState(0)
  const visible = 3
  const max = Math.max(0, services.length - visible)

  return (
    <section className="bg-pure-white py-20 md:py-28 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div className="max-w-2xl">
            <Eyebrow tone="muted">Services</Eyebrow>
            <h2
              className="mt-3 text-vc-ink"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.012em' }}
            >
              What we do, <span className="italic text-vc-ink/60">end&#8209;to&#8209;end</span>.
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
            {services.map(s => (
              <article
                key={s.n}
                className="flex-shrink-0 rounded-card p-8 flex flex-col min-h-[340px] bg-soft-mist"
                style={{ width: `calc((100% - ${(visible - 1) * 24}px) / ${visible})` }}
              >
                <div className="flex items-center gap-3">
                  <span className="eyebrow text-graphite">{s.n}</span>
                  <span className="w-6 h-px bg-vc-ink/20" />
                  <Eyebrow tone="muted">{s.tag}</Eyebrow>
                </div>
                <h3
                  className="mt-6 text-vc-ink"
                  style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: '24px', lineHeight: 1.25, letterSpacing: '-0.01em' }}
                >
                  {s.title}
                </h3>
                <p className="mt-4 text-body text-graphite flex-1">{s.body}</p>
                <Link href={s.href} className="group inline-flex items-center gap-1.5 mt-6 text-[14px] font-aeonik text-vc-ink">
                  Learn more
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
