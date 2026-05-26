'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Code2, Cpu, Megaphone, BarChart3, Sparkles, Globe2 } from 'lucide-react'
import {
  PageWrapper, PageHero, CTABlock
} from '@/components/site/Shared'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  { id: 1, icon: Globe2, tag: 'Websites', title: 'Your 24/7 Digital Showroom',
    description: 'Custom websites built from scratch — blazing fast on every phone, every village, every network. They look premium, load instantly, and turn casual visitors into paying clients while you sleep.',
    bullets: ['Next.js · React frontends', 'Headless CMS setup', 'Direct booking engines', 'E-commerce storefronts'] },
  { id: 2, icon: Cpu, tag: 'Custom Software', title: 'Automate Your Operations',
    description: 'Custom systems that track inventory, orders, leads, and staff — replacing manual errors and messy registers. Built for the way your business actually works.',
    bullets: ['ERP & dashboards', 'POS & inventory sync', 'WhatsApp integrations', 'AI workflow automation'] },
  { id: 3, icon: Megaphone, tag: 'Performance Marketing', title: 'Consistent Customer Inflow',
    description: 'Targeted local ads and Gujarati-first social strategy that bring real sales inquiries — not vanity likes. We measure success in calls answered and bills raised.',
    bullets: ['Meta & Google Ads', 'Local SEO + GBP', 'Influencer campaigns', 'Conversion-rate optimization'] },
  { id: 4, icon: Code2, tag: 'Brand Films', title: 'Cinema-Grade Storytelling',
    description: 'Anamorphic-grade brand films and product narratives shot in 4K Apple Log. We make cinema for businesses — not commercials.',
    bullets: ['Brand films', 'Product cinematography', 'Reels & shorts', 'Documentary-style edits'] },
  { id: 5, icon: BarChart3, tag: 'Analytics & Growth', title: 'Receipts Over Vanity Metrics',
    description: 'Custom dashboards, attribution models, and weekly growth reviews. Every rupee spent is tracked to a rupee earned.',
    bullets: ['GA4 + server-side tracking', 'Custom CRM dashboards', 'Cohort & funnel reports', 'Monthly growth audits'] },
  { id: 6, icon: Sparkles, tag: 'Partnership', title: 'One Predictable Partner',
    description: 'Monthly retainers, not vendor chaos. One team. One Slack. One person who picks up when something breaks at 11 PM.',
    bullets: ['Dedicated growth lead', 'Weekly check-ins', '12-hour response SLA', 'Predictable monthly billing'] },
]

/* ============================================================
   TWO-COLUMN STICKY SCROLL-SYNC LAYOUT
============================================================ */
function ScrollSyncServices() {
  const wrapRef = useRef(null)
  const leftRef = useRef(null)
  const itemRefs = useRef([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const triggers = itemRefs.current.map((el, i) => {
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => animateTo(i),
        onEnterBack: () => animateTo(i),
      })
    })
    function animateTo(i) {
      setActive(prev => {
        if (prev === i) return prev
        // Animate out current panel
        const panel = leftRef.current
        if (panel) {
          gsap.timeline()
            .to(panel, { y: -50, opacity: 0, duration: 0.3, ease: 'power2.in' })
            .add(() => setActive(i))
            .fromTo(panel,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.05 })
        } else {
          setActive(i)
        }
        return prev
      })
    }
    return () => triggers.forEach(t => t && t.kill())
  }, [])

  const current = SERVICES[active]
  const Icon = current.icon

  return (
    <section ref={wrapRef} className="relative bg-[#F4F1EA]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row">
        {/* LEFT — Sticky panel (40%) */}
        <div className="lg:w-[40%] lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center py-20 lg:py-0">
          <div ref={leftRef} className="max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#0E0E10]/10 flex items-center justify-center mb-8 shadow-[0_20px_40px_-20px_rgba(14,14,16,0.2)]">
              <Icon size={28} className="text-[#E85D2C]" />
            </div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#E85D2C] mb-4">
              · {current.tag}
            </div>
            <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1] text-[#0E0E10] tracking-[-0.02em] font-light mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              {current.title}
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-8">
              {current.description}
            </p>
            <ul className="space-y-2 mb-10">
              {current.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2C]" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors"
            >
              Learn more
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* RIGHT — Scrolling list (60%) */}
        <div className="lg:w-[60%] lg:pl-16 py-20">
          <div className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4">· Six core services</div>
          <h3 className="text-[clamp(28px,3.5vw,52px)] leading-[1] text-[#0E0E10] tracking-[-0.02em] font-light mb-16" style={{ fontFamily: 'var(--font-playfair)' }}>
            Everything we make,
            <br />
            <span className="italic text-[#E85D2C]">under one roof.</span>
          </h3>

          <div className="space-y-5">
            {SERVICES.map((s, i) => {
              const isActive = i === active
              const SvcIcon = s.icon
              return (
                <motion.div
                  key={s.id}
                  ref={el => (itemRefs.current[i] = el)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7 }}
                  className={`relative rounded-2xl border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#E85D2C]/40 shadow-[0_30px_60px_-30px_rgba(232,93,44,0.25)]'
                      : 'bg-white/40 border-[#0E0E10]/8 hover:bg-white/70'
                  }`}
                  style={{ minHeight: '180px' }}
                >
                  {/* Active border-left highlight */}
                  <div
                    className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full transition-all duration-500"
                    style={{ background: isActive ? '#E85D2C' : 'transparent' }}
                  />
                  <div className="p-7 lg:p-9 flex items-start gap-5">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#E85D2C]/10' : 'bg-[#0E0E10]/[0.04]'
                    }`}>
                      <SvcIcon size={20} className={isActive ? 'text-[#E85D2C]' : 'text-[#0E0E10]/60'} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#E85D2C]">
                          {String(s.id).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#0E0E10]/50">
                          {s.tag}
                        </span>
                      </div>
                      <h4 className="text-2xl font-light text-[#0E0E10] tracking-tight mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {s.title}
                      </h4>
                      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  return (
    <PageWrapper darkHero={true}>
      <PageHero
        tag="· Services"
        title="What we make for businesses that mean business."
        italicWord="that mean business."
        subtitle="Three engines under one roof. Websites, custom software, and performance marketing — stitched into one growth system. No vendor juggling. No jargon. Just results that show up in your bank statement."
      />
      <ScrollSyncServices />
      <CTABlock kicker="Let&apos;s build yours" title="Talk to a human, not a chatbot." italicWord="a human," />
    </PageWrapper>
  )
}
