'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/* ============================================================
   STACKED SHOWCASE — Sticky-card stack per latest artifact
   - Each card pins at top, next card stacks ON TOP smoothly
   - Image left (55%) + dark colored card right
   - Cormorant Garamond serif + Syne sans (artifact spec)
   - Side dots nav + scroll cue
============================================================ */

const PROJECTS = [
  {
    id: 1,
    badge: 'Live · 2025',
    category: 'Hospitality · Booking Engine',
    title: 'Nirvana',
    subtitle: 'Eco-Resort · Saputara',
    desc: 'A cinematic direct-booking platform that traded OTA commissions for clean revenue. 4.2× direct bookings in 90 days.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80',
    bg: '#1a2018',
  },
  {
    id: 2,
    badge: 'Live · 2025',
    category: 'Manufacturing · Custom ERP',
    title: 'Sutra',
    subtitle: 'Textile Co. · Surat',
    desc: 'WhatsApp-native order intake, real-time loom tracking, one-tap dispatch. Reconciliation cut from 4 days to 9 minutes.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80',
    bg: '#1c1a10',
  },
  {
    id: 3,
    badge: 'Live · 2025',
    category: 'D2C · Performance Commerce',
    title: 'Anaya',
    subtitle: 'Heritage Jewels · Pan-India',
    desc: 'A slick D2C storefront plugged into Meta funnels. ₹1.2 Cr in festive GMV from a cold audience in 60 days.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80',
    bg: '#101820',
  },
  {
    id: 4,
    badge: 'Live · 2024',
    category: 'Multi-Outlet Retail · POS Sync',
    title: 'Bandhan',
    subtitle: 'Retail Network · 11 Outlets',
    desc: 'Eleven outlets, one unified inventory, dashboards in every manager\u2019s pocket. Footfall +38%, stockouts \u221271%.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    bg: '#1e1010',
  },
  {
    id: 5,
    badge: 'Live · 2024',
    category: 'F&B · Café Operations',
    title: 'ChaiSnap',
    subtitle: 'Café Chain · Western India',
    desc: 'POS-integrated loyalty app, kitchen display screens, IG-first marketing. 2.1× repeat orders, 38% lower spoilage.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80',
    bg: '#14181a',
  },
  {
    id: 6,
    badge: 'Live · 2025',
    category: 'Creator Tooling · SaaS',
    title: 'Saurav Studios',
    subtitle: 'Creator Suite · India + GCC',
    desc: 'A subscription content platform with AI-assisted editing, instant publishing, analytics. 1,400 creators onboarded in Q1.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&q=80',
    bg: '#181018',
  },
]

const NAV_HEIGHT = 64 // px — top nav offset

export default function StackedShowcase({ projects = PROJECTS }) {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])
  const spacerRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [showCue, setShowCue] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      const vh = window.innerHeight
      // Find the card currently "pinned"
      let currentIdx = 0
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= NAV_HEIGHT + 4 && r.top > NAV_HEIGHT + 4 - vh) {
          currentIdx = i
        }
      })
      setActiveIndex(currentIdx)
      setShowCue(sy < 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToCard = (idx) => {
    if (idx === 0) {
      const section = sectionRef.current
      if (section) {
        window.scrollTo({ top: section.offsetTop, behavior: 'smooth' })
      }
      return
    }
    const spacer = spacerRefs.current[idx]
    if (spacer) {
      const top = spacer.offsetTop - NAV_HEIGHT
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section ref={sectionRef} className="relative">
      {/* SIDE DOTS NAV */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2.5">
        {projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to ${p.title}`}
            className="group p-2 -m-2"
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 8 : 6,
                height: i === activeIndex ? 8 : 6,
                background: i === activeIndex ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          </button>
        ))}
      </div>

      {/* SCROLL CUE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showCue ? 0.45 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 hidden lg:flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          className="w-px h-8 bg-white origin-top"
        />
        <span
          className="text-[9px] tracking-[0.35em] uppercase text-white font-semibold"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Scroll
        </span>
      </motion.div>

      {/* STACK */}
      <div className="relative">
        {projects.map((p, i) => (
          <Fragment key={p.id}>
            {/* Spacer — provides scroll room before this card (skip for first card, no gap after hero) */}
            {i > 0 && (
              <div
                ref={(el) => { spacerRefs.current[i] = el }}
                className="h-screen w-full"
                aria-hidden="true"
              />
            )}
            {/* Card — sticky stack */}
            <div
              ref={(el) => { cardRefs.current[i] = el }}
              className="sticky w-full flex items-center"
              style={{
                top: `${NAV_HEIGHT}px`,
                height: `calc(100vh - ${NAV_HEIGHT}px)`,
                background: p.bg,
                zIndex: i + 1,
              }}
            >
              <div className="w-full max-w-[1500px] mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                {/* Image */}
                <div className="w-full lg:basis-[55%] lg:max-w-[55%]">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, transparent 60%)'
                    }} />
                  </div>
                </div>

                {/* Info */}
                <div className="w-full lg:flex-1 text-white flex flex-col gap-5">
                  {/* Badge */}
                  <div
                    className="inline-flex items-center gap-2 border border-white/25 rounded-full px-3.5 py-1.5 text-[11px] tracking-[0.12em] uppercase text-white/75 font-medium w-fit"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50]" />
                    {p.badge}
                  </div>

                  {/* Category */}
                  <div
                    className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/45 font-medium"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    <span className="block w-8 h-px bg-white/30" />
                    {p.category}
                  </div>

                  {/* Title */}
                  <h2
                    className="text-white leading-[0.95] tracking-[-0.02em]"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontWeight: 300,
                      fontSize: 'clamp(48px,5.2vw,80px)',
                    }}
                  >
                    {p.title}
                  </h2>

                  {/* Subtitle */}
                  <p
                    className="text-white/55 italic"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontWeight: 300,
                      fontSize: 'clamp(16px,1.4vw,22px)',
                    }}
                  >
                    {p.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    className="text-white/60 max-w-md"
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 400,
                      fontSize: 'clamp(13px,1vw,15px)',
                      lineHeight: 1.7,
                    }}
                  >
                    {p.desc}
                  </p>

                  {/* CTA */}
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2.5 mt-2 pt-5 border-t border-white/20 text-white/70 hover:text-white transition-colors w-fit"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    <span className="block w-8 h-px bg-current" />
                    <span className="text-[11px] tracking-[0.15em] uppercase font-semibold">
                      Discover case study
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Counter — bottom right */}
              <div
                className="absolute bottom-7 right-10 lg:right-14 text-[12px] tracking-[0.1em] text-white/30 tabular-nums"
                style={{ fontFamily: 'var(--font-syne)', fontWeight: 500 }}
              >
                <span className="text-white/75">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-white/35"> / {String(projects.length).padStart(2, '0')}</span>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}

export { PROJECTS }
