'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ============================================================
   SCROLL SHOWCASE — Editorial product showcase
   Adopted structure: 2-column sticky (media | text), badge pill,
   left nav rail, hero intro, outro, section counter, CTA button,
   dividers. Continuous video playback. Restrained Instrument Serif.
============================================================ */

const PRODUCTS = [
  {
    id: 1,
    badge: 'Live · 2025',
    tag: 'Hospitality · Booking Engine',
    name: 'Nirvana',
    tagline: 'Eco-Resort · Saputara',
    description:
      'A cinematic direct-booking platform that traded OTA commissions for clean revenue. 4.2× direct bookings in 90 days.',
    videoSrc: '/videos/p1.mp4',
    accentFallback: '#FF8A3D',
  },
  {
    id: 2,
    badge: 'Custom ERP',
    tag: 'Manufacturing',
    name: 'Sutra',
    tagline: 'Textile Co. · Surat',
    description:
      'WhatsApp-native order intake, real-time loom tracking, one-tap dispatch. Reconciliation cut from 4 days to 9 minutes.',
    videoSrc: '/videos/p2.mp4',
    accentFallback: '#D4A574',
  },
  {
    id: 3,
    badge: 'Performance Commerce',
    tag: 'D2C · Pan-India',
    name: 'Anaya',
    tagline: 'Heritage Jewels',
    description:
      'A slick D2C storefront plugged into Meta funnels. ₹1.2 Cr in festive GMV from a cold audience in 60 days.',
    videoSrc: '/videos/p3.mp4',
    accentFallback: '#E85D2C',
  },
  {
    id: 4,
    badge: '11 Outlets',
    tag: 'Multi-Outlet Retail · POS Sync',
    name: 'Bandhan',
    tagline: 'Retail Network',
    description:
      'Eleven outlets, one unified inventory, dashboards in every manager\u2019s pocket. Footfall +38%, stockouts \u221271%.',
    videoSrc: '/videos/p4.mp4',
    accentFallback: '#7A5B3E',
  },
  {
    id: 5,
    badge: 'Loyalty + POS',
    tag: 'F&B · Café Operations',
    name: 'ChaiSnap',
    tagline: 'Café Chain · Western India',
    description:
      'POS-integrated loyalty app, kitchen display screens, IG-first marketing. 2.1× repeat orders, 38% lower spoilage.',
    videoSrc: '/videos/p5.mp4',
    accentFallback: '#3D5C5C',
  },
  {
    id: 6,
    badge: 'SaaS',
    tag: 'Creator Tooling · India + GCC',
    name: 'Saurav Studios',
    tagline: 'Creator Suite',
    description:
      'A subscription content platform with AI-assisted editing, instant publishing, analytics. 1,400 creators onboarded in Q1.',
    videoSrc: '/videos/p6.mp4',
    accentFallback: '#1E3A5F',
  },
]

// Dominant color extraction via canvas histogram (returns {r,g,b})
function extractDominantColor(source) {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 80; canvas.height = 80
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(source, 0, 0, 80, 80)
    const data = ctx.getImageData(0, 0, 80, 80).data
    const buckets = new Map()
    for (let i = 0; i < data.length; i += 16) {
      const r = Math.round(data[i] / 32) * 32
      const g = Math.round(data[i + 1] / 32) * 32
      const b = Math.round(data[i + 2] / 32) * 32
      if (r + g + b < 80 || r + g + b > 700) continue
      const key = `${r},${g},${b}`
      buckets.set(key, (buckets.get(key) || 0) + 1)
    }
    if (!buckets.size) return null
    let best = null, bestCount = 0
    for (const [k, v] of buckets) { if (v > bestCount) { bestCount = v; best = k } }
    const [r, g, b] = best.split(',').map(Number)
    return { r, g, b }
  } catch { return null }
}

function hexToRgb(hex) {
  const m = hex.replace('#', '')
  return {
    r: parseInt(m.substring(0, 2), 16),
    g: parseInt(m.substring(2, 4), 16),
    b: parseInt(m.substring(4, 6), 16),
  }
}

function ProductSection({ product, index, total, onActive }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const badgeRef = useRef(null)
  const tagRef = useRef(null)
  const titleRef = useRef(null)
  const taglineRef = useRef(null)
  const descRef = useRef(null)
  const ctaRef = useRef(null)
  const counterRef = useRef(null)

  // Sample dominant color, re-sample as video plays for evolving tint
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let id = null
    const sample = () => {
      const c = extractDominantColor(v)
      if (c) onActive(index, c, false)
    }
    const playSafe = () => {
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
    const onMeta = () => {
      try {
        if (v.duration && !isNaN(v.duration) && v.currentTime < 0.5) {
          v.currentTime = Math.min(v.duration * 0.3, 2)
        }
      } catch {}
      playSafe()
    }
    const onLoaded = () => {
      playSafe()
      sample()
      id = setInterval(sample, 2200)
    }
    v.addEventListener('loadedmetadata', onMeta, { once: true })
    v.addEventListener('loadeddata', onLoaded, { once: true })
    v.addEventListener('canplay', playSafe)
    // Force load + first play attempt
    try { v.load() } catch {}
    playSafe()
    if (v.readyState >= 2) onLoaded()
    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('loadeddata', onLoaded)
      v.removeEventListener('canplay', playSafe)
      if (id) clearInterval(id)
    }
  }, [index, onActive])

  // Cinematic entry + IO-style play/pause for performance
  useEffect(() => {
    const section = sectionRef.current
    const v = videoRef.current
    if (!section) return

    const entry = gsap.timeline({ paused: true })
    entry
      .fromTo(badgeRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
      .fromTo(tagRef.current,
        { y: 36, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, '<0.08')
      .fromTo(titleRef.current,
        { y: 60, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' }, '<0.06')
      .fromTo(taglineRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '<0.18')
      .fromTo(descRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '<0.08')
      .fromTo(ctaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<0.1')
      .fromTo(counterRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }, '<0.2')

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: () => {
        entry.play()
        onActive(index, null, true)
        v && v.play().catch(() => {})
      },
      onEnterBack: () => {
        onActive(index, null, true)
        v && v.play().catch(() => {})
      },
      onLeave: () => v && v.pause(),
      onLeaveBack: () => {
        v && v.pause()
        // reverse entry to allow re-entry animation
        entry.reverse()
      },
    })

    return () => trigger.kill()
  }, [index, onActive])

  return (
    <section
      ref={sectionRef}
      data-section-index={index}
      className="product-section relative z-10"
      style={{ height: '180vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch px-6 lg:px-16 py-24 lg:py-20">
          {/* MEDIA SIDE */}
          <div className="lg:col-span-7 relative flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[760px] aspect-[16/10] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
              <video
                ref={videoRef}
                src={product.videoSrc}
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-white/10 rounded-3xl pointer-events-none" />
            </div>
            {/* Soft floor shadow */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[50%] h-6 rounded-full bg-black/50 blur-2xl pointer-events-none" />
          </div>

          {/* TEXT SIDE */}
          <div className="lg:col-span-5 relative flex items-center order-1 lg:order-2">
            <div className="w-full max-w-xl lg:pl-10">
              {/* Badge */}
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 backdrop-blur-md bg-white/8 border border-white/15"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span className="text-[10px] tracking-[0.28em] uppercase text-white/80 font-medium">
                  {product.badge}
                </span>
              </div>

              {/* Tag */}
              <div
                ref={tagRef}
                className="flex items-center gap-3 mb-4"
              >
                <span className="w-6 h-px bg-white/40" />
                <span
                  className="text-[10px] tracking-[0.3em] uppercase text-white/55"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                >
                  {product.tag}
                </span>
              </div>

              {/* Title */}
              <h2
                ref={titleRef}
                className="text-white leading-[0.95] tracking-[-0.01em]"
                style={{
                  fontFamily: 'var(--font-instrument)',
                  fontWeight: 400,
                  fontSize: 'clamp(42px,4.6vw,80px)',
                }}
              >
                {product.name}
              </h2>

              {/* Tagline (italic, smaller) */}
              <div
                ref={taglineRef}
                className="mt-3 italic text-white/65"
                style={{
                  fontFamily: 'var(--font-instrument)',
                  fontWeight: 400,
                  fontSize: 'clamp(16px,1.4vw,22px)',
                }}
              >
                {product.tagline}
              </div>

              {/* Description */}
              <p
                ref={descRef}
                className="mt-6 text-white/75 max-w-md"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 300,
                  fontSize: 'clamp(13px,1vw,15px)',
                  lineHeight: 1.7,
                }}
              >
                {product.description}
              </p>

              {/* CTA */}
              <button
                ref={ctaRef}
                type="button"
                className="group mt-10 inline-flex items-center gap-3 text-white/75 hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <span className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
                <span className="text-[10px] tracking-[0.28em] uppercase font-semibold">
                  Discover case study
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Section counter — bottom right */}
        <div
          ref={counterRef}
          className="absolute bottom-8 right-8 lg:bottom-10 lg:right-12 text-[10px] tracking-[0.3em] uppercase text-white/40 tabular-nums"
          style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
        >
          {String(index + 1).padStart(2, '0')}
          <span className="opacity-50"> / {String(total).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}

export default function ScrollShowcase({
  products = PRODUCTS,
  kicker = 'Selected Work · 2024 — 2025',
  sectionTitle = 'The Showcase',
  showIntro = true,
  showOutro = true,
}) {
  const containerRef = useRef(null)
  const bgRef = useRef(null)
  const bgColors = useRef({})
  const [activeIndex, setActiveIndex] = useState(0)

  const onActive = useCallback((index, color, isActive) => {
    if (color) bgColors.current[index] = color
    if (isActive) {
      setActiveIndex(index)
      const c = bgColors.current[index] || hexToRgb(products[index].accentFallback)
      const dark = {
        r: Math.max(0, Math.round(c.r * 0.42)),
        g: Math.max(0, Math.round(c.g * 0.42)),
        b: Math.max(0, Math.round(c.b * 0.42)),
      }
      const target = `rgb(${dark.r}, ${dark.g}, ${dark.b})`
      const el = bgRef.current
      if (el) gsap.to(el, { backgroundColor: target, duration: 0.9, ease: 'power2.out' })
    }
  }, [products])

  useEffect(() => {
    // Cleanup only — refresh is now handled centrally by LenisProvider
    // to avoid racing/overlapping ScrollTrigger.refresh() calls.
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const scrollToSection = (i) => {
    const el = document.querySelector(`[data-section-index="${i}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Ambient background that transitions per section — absolute, contained within showcase */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: '#0a0a0a',
          transition: 'background-color 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'background-color',
        }}
      >
        {/* Film grain overlay — sticky so it stays during scroll */}
        <div className="sticky top-0 h-screen w-full">
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
          }} />
          {/* Radial vignette */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)'
          }} />
        </div>
      </div>

      {/* LEFT NAV RAIL — clickable dots */}
      <nav
        aria-label="Section navigation"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3"
      >
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => scrollToSection(i)}
            aria-label={`Go to ${p.name}`}
            className="group block p-2 -m-2"
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: i === activeIndex ? 10 : 4,
                height: i === activeIndex ? 10 : 4,
                background: i === activeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                transform: i === activeIndex ? 'scale(1)' : 'scale(1)',
                boxShadow: i === activeIndex ? '0 0 0 4px rgba(255,255,255,0.08)' : 'none',
              }}
            />
          </button>
        ))}
      </nav>

      {/* Top kicker header (small, fixed-ish at top of showcase) */}
      <div className="relative z-20 pt-24 px-6 lg:px-16 pointer-events-none">
        <div className="max-w-[1500px] mx-auto flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              {kicker}
            </div>
            <div
              className="text-white/95 italic tracking-[-0.01em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(20px,1.8vw,28px)' }}
            >
              {sectionTitle}
            </div>
          </div>
        </div>
      </div>

      {/* HERO INTRO */}
      {showIntro && (
        <section className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6">
          <div
            className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6"
            style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
          >
            The Collection · 2025
          </div>
          <h1
            className="text-white leading-[0.95] tracking-[-0.01em]"
            style={{
              fontFamily: 'var(--font-instrument)',
              fontWeight: 400,
              fontSize: 'clamp(56px,8.5vw,128px)',
              background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Experience<br /><span className="italic">reinvented.</span>
          </h1>
          <p
            className="mt-8 text-sm text-white/55 max-w-sm"
            style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
          >
            Scroll to explore six businesses we&apos;ve quietly engineered into category leaders.
          </p>
          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" style={{ animation: 'scrollPulse 2s ease-in-out infinite' }} />
            <span
              className="text-[9px] tracking-[0.4em] uppercase text-white/35"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            >
              Scroll
            </span>
          </div>
          <style>{`
            @keyframes scrollPulse {
              0%, 100% { opacity: 0.4; transform: scaleY(1); }
              50% { opacity: 1; transform: scaleY(1.15); }
            }
          `}</style>
        </section>
      )}

      {/* PRODUCT SECTIONS */}
      {products.map((p, i) => (
        <div key={p.id}>
          <ProductSection
            product={p}
            index={i}
            total={products.length}
            onActive={onActive}
          />
          {/* Divider line between sections */}
          {i < products.length - 1 && (
            <div
              aria-hidden="true"
              className="relative z-10 h-px mx-12 lg:mx-24"
              style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)' }}
            />
          )}
        </div>
      ))}

      {/* OUTRO */}
      {showOutro && (
        <section className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6 gap-5">
          <div
            className="text-[10px] tracking-[0.5em] uppercase text-white/35"
            style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
          >
            End of collection
          </div>
          <h2
            className="text-white/20 leading-[1.0] tracking-[-0.01em]"
            style={{
              fontFamily: 'var(--font-instrument)',
              fontWeight: 400,
              fontSize: 'clamp(40px,6vw,84px)',
            }}
          >
            The next one <span className="italic">could be yours.</span>
          </h2>
        </section>
      )}
    </div>
  )
}

export { PRODUCTS }
