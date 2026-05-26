'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ============================================================
   SCROLL SHOWCASE — Cards-reveal w/ continuous video playback
   - Each section pins for ~180vh
   - Video autoplays + loops continuously (no scroll-scrub)
   - Dominant color sampled → smooth background transition
   - Editorial typography (refined, not shouty)
   - Instrument Serif display + Inter body
============================================================ */

const PRODUCTS = [
  { id: 1, tag: 'Hospitality · Booking Engine', name: 'Nirvana',
    tagline: 'Eco-Resort · Saputara, Gujarat',
    description: 'A cinematic direct-booking platform that traded OTA commissions for clean revenue. 4.2× direct bookings in 90 days.',
    videoSrc: '/videos/p1.mp4', accentFallback: '#FF8A3D' },
  { id: 2, tag: 'Manufacturing · Custom ERP', name: 'Sutra',
    tagline: 'Textile Co. · Surat',
    description: 'WhatsApp-native order intake, real-time loom tracking, one-tap dispatch. Reconciliation cut from 4 days to 9 minutes.',
    videoSrc: '/videos/p2.mp4', accentFallback: '#D4A574' },
  { id: 3, tag: 'D2C · Performance Commerce', name: 'Anaya',
    tagline: 'Heritage Jewels · Pan-India',
    description: 'A slick D2C storefront plugged into Meta funnels. ₹1.2 Cr in festive GMV from a cold audience in 60 days.',
    videoSrc: '/videos/p3.mp4', accentFallback: '#E85D2C' },
  { id: 4, tag: 'Multi-Outlet Retail · POS Sync', name: 'Bandhan',
    tagline: 'Retail Network · 11 Outlets',
    description: 'Eleven outlets, one unified inventory, dashboards in every manager\u2019s pocket. Footfall +38%, stockouts \u221271%.',
    videoSrc: '/videos/p4.mp4', accentFallback: '#7A5B3E' },
  { id: 5, tag: 'F&B · Café Operations', name: 'ChaiSnap',
    tagline: 'Café Chain · Western India',
    description: 'POS-integrated loyalty app, kitchen display screens, IG-first marketing. 2.1× repeat orders, 38% lower spoilage.',
    videoSrc: '/videos/p5.mp4', accentFallback: '#3D5C5C' },
  { id: 6, tag: 'Creator Tooling · SaaS', name: 'Saurav Studios',
    tagline: 'Creator Suite · India + GCC',
    description: 'A subscription content platform with AI-assisted editing, instant publishing, analytics. 1,400 creators onboarded in Q1.',
    videoSrc: '/videos/p6.mp4', accentFallback: '#1E3A5F' },
]

// Dominant color extraction via canvas histogram
function extractDominantColor(video) {
  try {
    const w = 32, h = 18
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, w, h)
    const data = ctx.getImageData(0, 0, w, h).data
    const buckets = new Map()
    let totalR = 0, totalG = 0, totalB = 0, count = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2]
      const lum = (r + g + b) / 3
      if (lum < 30 || lum > 235) continue
      const key = `${Math.round(r/32)*32},${Math.round(g/32)*32},${Math.round(b/32)*32}`
      buckets.set(key, (buckets.get(key) || 0) + 1)
      totalR += r; totalG += g; totalB += b; count++
    }
    if (count === 0) return null
    let best = null, bestCount = 0
    for (const [k, v] of buckets) { if (v > bestCount) { bestCount = v; best = k } }
    const [br, bg, bb] = best.split(',').map(Number)
    return {
      r: Math.round(br * 0.6 + (totalR/count) * 0.4),
      g: Math.round(bg * 0.6 + (totalG/count) * 0.4),
      b: Math.round(bb * 0.6 + (totalB/count) * 0.4),
    }
  } catch { return null }
}

function ProductSection({ product, index, onActive }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const tagRef = useRef(null)
  const numberRef = useRef(null)
  const titleRef = useRef(null)
  const taglineRef = useRef(null)
  const descRef = useRef(null)
  const metricRef = useRef(null)

  // Sample dominant color once video has data, then keep sampling lightly
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let id = null
    const handle = () => {
      const c = extractDominantColor(v)
      if (c) onActive(index, c, false)
    }
    const onLoaded = () => {
      handle()
      // re-sample every 2s so dominant tint follows video tone evolution
      id = setInterval(handle, 2000)
    }
    v.addEventListener('loadeddata', onLoaded, { once: true })
    if (v.readyState >= 2) onLoaded()
    return () => {
      v.removeEventListener('loadeddata', onLoaded)
      if (id) clearInterval(id)
    }
  }, [index, onActive])

  // Cinematic text entry on enter, IO-style play/pause for performance
  useEffect(() => {
    const section = sectionRef.current
    const v = videoRef.current
    if (!section || !v) return

    const entry = gsap.timeline({ paused: true })
    entry
      .fromTo(tagRef.current,
        { y: 32, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' })
      .fromTo(numberRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<0.05')
      .fromTo(titleRef.current,
        { y: 50, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' }, '<0.05')
      .fromTo(taglineRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<0.15')
      .fromTo(descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '<0.1')
      .fromTo(metricRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '<0.1')

    const activeTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        entry.play()
        onActive(index, null, true)
        v.play().catch(() => {})
      },
      onEnterBack: () => {
        onActive(index, null, true)
        v.play().catch(() => {})
      },
      onLeave: () => v.pause(),
      onLeaveBack: () => v.pause(),
    })

    return () => activeTrigger.kill()
  }, [index, onActive])

  return (
    <section ref={sectionRef} className="relative" style={{ height: '180vh' }}>
      {/* Sticky cinematic canvas */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={product.videoSrc}
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
          }} />

          {/* Content overlay — refined editorial hierarchy */}
          <div className="absolute inset-0 z-10 flex items-end pb-16 lg:pb-24 px-6 lg:px-16">
            <div className="w-full max-w-[1400px] mx-auto">
              <div className="max-w-2xl">
                {/* Tag with subtle dash */}
                <div ref={tagRef} className="flex items-center gap-3 mb-5">
                  <span className="w-6 h-px bg-white/45" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/65" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
                    {product.tag}
                  </span>
                </div>

                {/* Small index */}
                <div
                  ref={numberRef}
                  className="text-[10px] tracking-[0.35em] uppercase text-white/45 mb-3 tabular-nums"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                >
                  {String(product.id).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
                </div>

                {/* Main title — restrained editorial display */}
                <h2
                  ref={titleRef}
                  className="text-white leading-[0.95] tracking-[-0.01em]"
                  style={{
                    fontFamily: 'var(--font-instrument)',
                    fontWeight: 400,
                    fontSize: 'clamp(40px,4.2vw,72px)'
                  }}
                >
                  {product.name}
                </h2>

                {/* Tagline */}
                <div
                  ref={taglineRef}
                  className="mt-3 text-white/70 italic"
                  style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(14px,1.05vw,18px)' }}
                >
                  {product.tagline}
                </div>

                {/* Description — clean, professional */}
                <p
                  ref={descRef}
                  className="mt-6 max-w-xl text-white/80 leading-[1.65]"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: 'clamp(13px,1vw,15px)' }}
                >
                  {product.description}
                </p>

                {/* View case link */}
                <div ref={metricRef} className="mt-8 flex items-center gap-3 group cursor-pointer">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/85" style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
                    View case study
                  </span>
                  <span className="w-12 h-px bg-white/60 group-hover:bg-white group-hover:w-16 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ScrollShowcase({
  products = PRODUCTS,
  kicker = 'Selected Work · 2024 — 2025',
  sectionTitle = 'The Showcase',
}) {
  const containerRef = useRef(null)
  const bgColors = useRef({})
  const [activeIndex, setActiveIndex] = useState(0)

  const onActive = useCallback((index, color, isActive) => {
    if (color) bgColors.current[index] = color
    if (isActive) {
      setActiveIndex(index)
      const c = bgColors.current[index] || hexToRgb(products[index].accentFallback)
      // Slightly darkened for premium feel
      const dark = {
        r: Math.round(c.r * 0.5),
        g: Math.round(c.g * 0.5),
        b: Math.round(c.b * 0.5),
      }
      const target = `rgb(${dark.r}, ${dark.g}, ${dark.b})`
      const el = containerRef.current
      if (el) gsap.to(el, { backgroundColor: target, duration: 0.9, ease: 'power2.out' })
    }
  }, [products])

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => {
      clearTimeout(id)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative bg-black" style={{ willChange: 'background-color' }}>
      {/* Top section header — refined, professional, small */}
      <div className="absolute top-0 inset-x-0 z-30 pt-20 px-6 lg:px-16 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/55 mb-2" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              {kicker}
            </div>
            <div
              className="text-white/95 italic tracking-[-0.01em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(20px,1.8vw,28px)' }}
            >
              {sectionTitle}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5 text-[10px] tracking-[0.3em] uppercase text-white/55 tabular-nums" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
            <span>
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="opacity-40"> / {String(products.length).padStart(2, '0')}</span>
            </span>
            <span className="opacity-50">{'↓ scroll'}</span>
          </div>
        </div>
      </div>

      {/* Refined progress dots */}
      <div className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="w-[2px] rounded-full transition-all duration-500"
            style={{
              height: i === activeIndex ? 24 : 8,
              background: i === activeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)',
            }}
          />
        ))}
      </div>

      {products.map((p, i) => (
        <ProductSection key={p.id} product={p} index={i} onActive={onActive} />
      ))}
    </div>
  )
}

function hexToRgb(hex) {
  const m = hex.replace('#', '')
  return {
    r: parseInt(m.substring(0, 2), 16),
    g: parseInt(m.substring(2, 4), 16),
    b: parseInt(m.substring(4, 6), 16),
  }
}

export { PRODUCTS }
