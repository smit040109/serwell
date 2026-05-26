'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ============================================================
   CINEMATIC SCROLL SHOWCASE
   - 6 product sections (400vh each)
   - Sticky canvas with MP4 video per product
   - Dominant color extracted from video frame → bg color transition
   - Title/desc enter from bottom on viewport entry (Apple-style)
============================================================ */

const PRODUCTS = [
  {
    id: 1,
    tag: 'Hospitality · Booking Engine',
    name: 'Nirvana',
    tagline: 'Eco-Resort · Saputara',
    description: 'A cinematic direct-booking platform that traded OTA commissions for clean revenue. 4.2× direct bookings in 90 days.',
    videoSrc: '/videos/p1.mp4',
    type: 'mp4',
    accentFallback: '#FF8A3D',
  },
  {
    id: 2,
    tag: 'Manufacturing · Custom ERP',
    name: 'Sutra',
    tagline: 'Textile Co. · Surat',
    description: 'WhatsApp-native order intake, real-time loom tracking, one-tap dispatch. Reconciliation cut from 4 days to 9 minutes.',
    videoSrc: '/videos/p2.mp4',
    type: 'mp4',
    accentFallback: '#D4A574',
  },
  {
    id: 3,
    tag: 'D2C · Performance Commerce',
    name: 'Anaya',
    tagline: 'Heritage Jewels · Pan-India',
    description: 'A slick D2C storefront plugged into Meta funnels. ₹1.2 Cr in festive GMV from a cold audience in 60 days.',
    videoSrc: '/videos/p3.mp4',
    type: 'mp4',
    accentFallback: '#E85D2C',
  },
  {
    id: 4,
    tag: 'Multi-Outlet Retail · POS Sync',
    name: 'Bandhan',
    tagline: 'Retail Network · 11 Outlets',
    description: 'Eleven outlets, one unified inventory, dashboards in every manager\u2019s pocket. Footfall +38%, stockouts \u221271%.',
    videoSrc: '/videos/p4.mp4',
    type: 'mp4',
    accentFallback: '#7A5B3E',
  },
  {
    id: 5,
    tag: 'F&B · Café Operations',
    name: 'ChaiSnap',
    tagline: 'Café Chain · Western India',
    description: 'A POS-integrated loyalty app, kitchen display screens, and IG-first marketing. 2.1\u00d7 repeat orders, 38% lower spoilage.',
    videoSrc: '/videos/p5.mp4',
    type: 'mp4',
    accentFallback: '#3D5C5C',
  },
  {
    id: 6,
    tag: 'Creator Tooling · SaaS',
    name: 'Saurav Studios',
    tagline: 'Creator Suite · India + GCC',
    description: 'A subscription content platform with AI-assisted editing, instant publishing, and analytics. Onboarded 1,400 creators in Q1.',
    videoSrc: '/videos/p6.mp4',
    type: 'mp4',
    accentFallback: '#1E3A5F',
  },
]

// Extract dominant color from a video element (sampled via canvas)
function extractDominantColor(video) {
  try {
    const w = 32, h = 18
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, w, h)
    const data = ctx.getImageData(0, 0, w, h).data
    // Histogram with quantized buckets for true "dominant" color
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
    // Take the most frequent bucket, blend with overall average
    let best = null, bestCount = 0
    for (const [k, v] of buckets) {
      if (v > bestCount) { bestCount = v; best = k }
    }
    const [br, bg, bb] = best.split(',').map(Number)
    const avgR = Math.round(totalR / count)
    const avgG = Math.round(totalG / count)
    const avgB = Math.round(totalB / count)
    // 60% dominant bucket + 40% average for natural feel
    return {
      r: Math.round(br * 0.6 + avgR * 0.4),
      g: Math.round(bg * 0.6 + avgG * 0.4),
      b: Math.round(bb * 0.6 + avgB * 0.4),
    }
  } catch { return null }
}

function ProductSection({ product, index, onActive }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const titleRef = useRef(null)
  const tagRef = useRef(null)
  const descRef = useRef(null)
  const numberRef = useRef(null)
  const [colorReady, setColorReady] = useState(false)

  // Extract dominant color on video load, push up to parent
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const handle = () => {
      const c = extractDominantColor(v)
      if (c) {
        onActive(index, c, false)
        setColorReady(true)
      }
    }
    v.addEventListener('loadeddata', handle, { once: true })
    if (v.readyState >= 2) handle()
    return () => v.removeEventListener('loadeddata', handle)
  }, [index, onActive])

  // ScrollTrigger for this section
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // 1) Entry animation \u2014 text rises from below with stagger
    const enterTl = gsap.timeline({ paused: true })
    enterTl
      .fromTo(tagRef.current,
        { y: 60, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' })
      .fromTo(numberRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '<0.05')
      .fromTo(titleRef.current,
        { y: 80, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' }, '<0.05')
      .fromTo(descRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '<0.2')

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        enterTl.play()
        const v = videoRef.current
        if (v) v.play().catch(() => {})
        // Notify parent this section is active so it can change bg color
        onActive(index, null, true)
      },
      onEnterBack: () => {
        const v = videoRef.current
        if (v) v.play().catch(() => {})
        onActive(index, null, true)
      },
      onLeave: () => {
        const v = videoRef.current
        if (v) v.pause()
      },
      onLeaveBack: () => {
        const v = videoRef.current
        if (v) v.pause()
      },
    })

    return () => {
      trigger.kill()
    }
  }, [index, onActive])

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      {/* Sticky cinematic frame */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Video container with subtle inset frame */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={product.videoSrc}
            muted
            playsInline
            loop
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Cinematic vignette + letterbox */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/20 pointer-events-none" />
          {/* Film grain */}
          <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
          }} />

          {/* Content overlay */}
          <div className="absolute inset-0 z-10 flex items-end pb-24 lg:pb-32 px-6 lg:px-16">
            <div className="w-full max-w-[1500px] mx-auto grid lg:grid-cols-12 gap-8 items-end">
              {/* Left: big number watermark */}
              <div className="lg:col-span-2 hidden lg:block">
                <div
                  ref={numberRef}
                  className="text-white/30 leading-none"
                  style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(100px,9vw,170px)' }}
                >
                  {String(product.id).padStart(2, '0')}
                </div>
              </div>

              {/* Right: tag, title, description */}
              <div className="lg:col-span-10">
                <div
                  ref={tagRef}
                  className="text-[10px] tracking-[0.35em] uppercase text-white/70 mb-5 flex items-center gap-3"
                >
                  <span className="w-8 h-px bg-white/50" />
                  {product.tag}
                </div>
                <h2
                  ref={titleRef}
                  className="text-white leading-[0.9] tracking-[-0.01em] uppercase"
                  style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(72px,11vw,200px)' }}
                >
                  {product.name}
                </h2>
                <div className="mt-2 text-sm tracking-[0.25em] uppercase text-white/60 mb-8">
                  {product.tagline}
                </div>
                <p
                  ref={descRef}
                  className="max-w-2xl text-white/80 text-base lg:text-lg font-light leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ScrollShowcase() {
  const containerRef = useRef(null)
  const bgColors = useRef({})
  const [, force] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // Called by each section: index, optional sampled color, isActive flag
  const onActive = useCallback((index, color, isActive) => {
    if (color) {
      bgColors.current[index] = color
      force(x => x + 1)
    }
    if (isActive) {
      setActiveIndex(index)
      const c = bgColors.current[index] || hexToRgb(PRODUCTS[index].accentFallback)
      const target = `rgb(${c.r}, ${c.g}, ${c.b})`
      // Smooth GSAP transition of bg color
      const el = containerRef.current
      if (el) gsap.to(el, { backgroundColor: target, duration: 1.0, ease: 'power2.out' })
    }
  }, [])

  useEffect(() => {
    // Ensure ScrollTriggers re-measure after content settles
    const id = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => {
      clearTimeout(id)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative bg-black transition-colors" style={{ willChange: 'background-color' }}>
      {/* Section header (sticky kicker) */}
      <div className="absolute top-0 inset-x-0 z-30 pt-28 px-6 lg:px-16 pointer-events-none">
        <div className="max-w-[1500px] mx-auto flex items-end justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">
              {'· The Showcase · 2024 — 2025'}
            </div>
            <div className="text-white/90 uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(28px,3vw,48px)' }}>
              Selected Work
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] tracking-[0.3em] uppercase text-white/50">
            <span className="tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="opacity-40"> / {String(PRODUCTS.length).padStart(2, '0')}</span>
            </span>
            <span className="opacity-60">{'↓ scroll to explore'}</span>
          </div>
        </div>
      </div>

      {/* Right edge progress dots */}
      <div className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3">
        {PRODUCTS.map((p, i) => (
          <div
            key={p.id}
            className="w-[3px] rounded-full transition-all duration-500"
            style={{
              height: i === activeIndex ? 28 : 10,
              background: i === activeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      {PRODUCTS.map((p, i) => (
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
