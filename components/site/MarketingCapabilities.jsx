'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowUpRight, Sparkles, Target, Film, Users2, MapPin, MessageCircle } from 'lucide-react'

/* ============================================================
   MARKETING CAPABILITIES — Sticky split-screen w/ tabs
   Dramatically different from /our-work stacked cards.
   - Left: Vertical numbered capability list (clickable tabs)
   - Right: Large media preview + metric panel (sticky)
   - Dark gold-tinted theme
============================================================ */

const GOLD = '#D4AF37'

const CAPABILITIES = [
  {
    id: 1,
    no: '01',
    icon: Film,
    label: 'Reels & Shorts',
    title: 'Stop-the-thumb creative.',
    blurb: 'Vertical-first content engine. Hook-driven scripting, 60-second cuts, native-to-platform aesthetics.',
    videoSrc: '/videos/p1.mp4',
    metrics: [
      { k: '40+', v: 'Variants per week' },
      { k: '1.5s', v: 'Hook target' },
      { k: '2.3×', v: 'CPM efficiency' },
    ],
  },
  {
    id: 2,
    no: '02',
    icon: Target,
    label: 'Paid Ads · Meta + Google',
    title: 'Performance that compounds.',
    blurb: 'Creative-led performance campaigns. We test 40 variants a week, kill losers fast, scale winners harder.',
    videoSrc: '/videos/p2.mp4',
    metrics: [
      { k: '₹1.2 Cr', v: 'Festive GMV · 60 days' },
      { k: '3.8 ROAS', v: 'Avg blended' },
      { k: '−42%', v: 'CPL reduction' },
    ],
  },
  {
    id: 3,
    no: '03',
    icon: Sparkles,
    label: 'Brand Films · Cinema',
    title: 'Make cinema, not commercials.',
    blurb: 'Anamorphic-grade brand films shot in 4K Apple Log. We don\u2019t make ads — we make cinema for your business.',
    videoSrc: '/videos/p3.mp4',
    metrics: [
      { k: '4K Log', v: 'Apple-grade footage' },
      { k: '24p', v: 'Cinema framerate' },
      { k: '12+', v: 'Brand films · 2025' },
    ],
  },
  {
    id: 4,
    no: '04',
    icon: Users2,
    label: 'Creators · UGC Network',
    title: 'Authentic voices, scaled.',
    blurb: 'A curated network of micro-influencers and UGC creators across Gujarat. We orchestrate the entire pipeline.',
    videoSrc: '/videos/p4.mp4',
    metrics: [
      { k: '180+', v: 'Vetted creators' },
      { k: '8 cities', v: 'Active distribution' },
      { k: '4.6×', v: 'Engagement vs paid' },
    ],
  },
  {
    id: 5,
    no: '05',
    icon: MapPin,
    label: 'Local SEO + GBP',
    title: 'Win the map. Win the city.',
    blurb: 'Google Business Profile optimization, hyperlocal SEO, review systems. Be the first result in your city.',
    videoSrc: '/videos/p5.mp4',
    metrics: [
      { k: '#1', v: 'Map pack rankings' },
      { k: '+220%', v: 'Direction requests' },
      { k: '38 days', v: 'Avg time to rank' },
    ],
  },
  {
    id: 6,
    no: '06',
    icon: MessageCircle,
    label: 'WhatsApp · CRM',
    title: 'Where Indians actually buy.',
    blurb: 'Automated WhatsApp funnels, broadcast lists, click-to-chat ads. We close the loop where the buyer is.',
    videoSrc: '/videos/p6.mp4',
    metrics: [
      { k: '67%', v: 'Click-to-chat CVR' },
      { k: '<2 min', v: 'Response SLA' },
      { k: '24×7', v: 'Automated flows' },
    ],
  },
]

export default function MarketingCapabilities() {
  const [active, setActive] = useState(0)
  const videoRef = useRef(null)
  const current = CAPABILITIES[active]

  // Play video on capability change
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.load()
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [active])

  return (
    <section className="relative bg-[#080808] py-24 lg:py-32 overflow-hidden">
      {/* Ambient gold radial */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(212,175,55,0.10), transparent 60%)',
        filter: 'blur(60px)',
      }} />

      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-10">
        {/* Top kicker */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <div
              className="text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: GOLD, fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            >
              · Capabilities · Marketing OS
            </div>
            <h2
              className="text-white leading-[1.02] tracking-[-0.01em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(34px,4.5vw,64px)' }}
            >
              Six engines. <span className="italic" style={{ color: GOLD }}>One growth system.</span>
            </h2>
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 tabular-nums" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
            Click any capability →
          </div>
        </div>

        {/* SPLIT — left vertical tabs, right media+metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT — vertical capability list */}
          <div className="lg:col-span-5">
            <div className="space-y-2">
              {CAPABILITIES.map((c, i) => {
                const isActive = i === active
                const Icon = c.icon
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(i)}
                    className={`group w-full text-left rounded-2xl border transition-all duration-500 px-5 lg:px-7 py-5 lg:py-6 ${
                      isActive
                        ? 'border-white/15'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                    style={{
                      background: isActive ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-start gap-4 lg:gap-5">
                      {/* Number */}
                      <div
                        className="text-[11px] tracking-[0.2em] tabular-nums mt-1.5 transition-colors"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontWeight: 500,
                          color: isActive ? GOLD : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {c.no}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <Icon size={14} style={{ color: isActive ? GOLD : 'rgba(255,255,255,0.55)' }} />
                          <span
                            className="text-[10px] tracking-[0.25em] uppercase font-medium transition-colors"
                            style={{
                              fontFamily: 'var(--font-inter)',
                              color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                            }}
                          >
                            {c.label}
                          </span>
                        </div>
                        <div
                          className={`leading-[1.15] tracking-[-0.01em] transition-colors`}
                          style={{
                            fontFamily: 'var(--font-instrument)',
                            fontWeight: 400,
                            fontSize: 'clamp(22px,2.2vw,32px)',
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                          }}
                        >
                          {c.title}
                        </div>

                        {/* Expanded blurb — only on active */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className="text-sm text-white/55 leading-[1.65] overflow-hidden"
                              style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
                            >
                              {c.blurb}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Arrow on active */}
                      <div className="mt-1.5">
                        <ArrowUpRight
                          size={16}
                          className="transition-all"
                          style={{
                            color: isActive ? GOLD : 'rgba(255,255,255,0.25)',
                            transform: isActive ? 'translate(2px,-2px)' : 'translate(0,0)',
                          }}
                        />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT — sticky media + metrics */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              {/* Media canvas */}
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <video
                      ref={videoRef}
                      src={current.videoSrc}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="auto"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-white/10 rounded-3xl pointer-events-none" />

                {/* Active label chip */}
                <div className="absolute top-5 left-5 flex items-center gap-2 backdrop-blur-md bg-black/40 border border-white/15 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
                  <span
                    className="text-[10px] tracking-[0.25em] uppercase text-white/85 font-medium"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Playing · {current.label}
                  </span>
                </div>

                {/* Play badge */}
                <div className="absolute bottom-5 right-5 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                  <Play size={14} className="text-black ml-0.5" fill="black" />
                </div>
              </div>

              {/* Metrics row */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-7 grid grid-cols-3 gap-3 lg:gap-5"
                >
                  {current.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/8 px-4 lg:px-6 py-5 lg:py-6"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div
                        className="leading-none tracking-[-0.02em]"
                        style={{
                          fontFamily: 'var(--font-instrument)',
                          fontWeight: 400,
                          fontSize: 'clamp(24px,2.6vw,40px)',
                          color: GOLD,
                        }}
                      >
                        {m.k}
                      </div>
                      <div
                        className="mt-2 text-[9px] tracking-[0.25em] uppercase text-white/45"
                        style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                      >
                        {m.v}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { CAPABILITIES }
