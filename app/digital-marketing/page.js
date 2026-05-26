'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, TrendingUp, Sparkles, Megaphone, Camera, Globe2, MessagesSquare } from 'lucide-react'
import {
  PageWrapper, SectionHeading, CTABlock, Tilt3DCard
} from '@/components/site/Shared'
import ScrollShowcase from '@/components/site/ScrollShowcase'

const GOLD = '#D4AF37'
const NEAR_BLACK = '#080808'

const MARKETING_PRODUCTS = [
  { id: 1, tag: 'Short-Form · Reels & TikTok', name: 'Reels',
    tagline: 'Vertical-first content engine',
    description: 'High-velocity reel production with hook-first scripting. Built for the scroll — designed to stop the thumb.',
    videoSrc: '/videos/p1.mp4', type: 'mp4', accentFallback: '#D4AF37' },
  { id: 2, tag: 'Paid Ads · Meta + Google',
    name: 'Funnels', tagline: 'Performance ads that convert',
    description: 'Creative-led performance campaigns. We test 40 variants a week, kill losers fast, scale winners harder.',
    videoSrc: '/videos/p2.mp4', type: 'mp4', accentFallback: '#B8860B' },
  { id: 3, tag: 'Brand Films · Cinema-grade',
    name: 'Cinema', tagline: 'Brand films + product narratives',
    description: 'Anamorphic-grade brand films shot in 4K Apple Log. We don\'t make ads — we make cinema for your business.',
    videoSrc: '/videos/p3.mp4', type: 'mp4', accentFallback: '#A0522D' },
  { id: 4, tag: 'Creators · UGC Network',
    name: 'Creators', tagline: 'Influencer & UGC orchestration',
    description: 'A curated network of micro-influencers and UGC creators across Gujarat. Authentic voices, scaled distribution.',
    videoSrc: '/videos/p4.mp4', type: 'mp4', accentFallback: '#8B6F47' },
  { id: 5, tag: 'Local SEO · Google Business',
    name: 'Local', tagline: 'Show up where customers search',
    description: 'GBP optimization, hyperlocal SEO, review systems. Be the first result when someone in your city looks for what you sell.',
    videoSrc: '/videos/p5.mp4', type: 'mp4', accentFallback: '#4A6B7C' },
  { id: 6, tag: 'WhatsApp · CRM + Funnels',
    name: 'Whatsapp', tagline: 'Conversation-led commerce',
    description: 'Automated WhatsApp funnels, broadcast lists, click-to-chat ads. Where Indians actually buy — we close the loop.',
    videoSrc: '/videos/p6.mp4', type: 'mp4', accentFallback: '#2D5A4E' },
]

/* ============================================================
   LETTERBOX HERO
============================================================ */
function LetterboxHero() {
  const videoRef = useRef(null)
  useEffect(() => { videoRef.current?.play().catch(() => {}) }, [])
  return (
    <section className="relative w-full min-h-screen bg-[#080808] overflow-hidden">
      <video
        ref={videoRef}
        src="/video/intro.mp4"
        autoPlay muted loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      <div className="absolute inset-0 mix-blend-overlay" style={{
        background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.18), transparent 60%)'
      }} />
      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
      }} />

      {/* Letterbox bars */}
      <div className="absolute top-0 inset-x-0 h-[60px] bg-black z-20" />
      <div className="absolute bottom-0 inset-x-0 h-[60px] bg-black z-20" />

      {/* Center text */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-[10px] tracking-[0.5em] uppercase mb-8"
          style={{ color: GOLD, fontFamily: 'var(--font-inter)', fontWeight: 300 }}
        >
          — Digital Marketing Division —
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="uppercase leading-[0.92] tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-bebas)', color: GOLD, fontSize: 'clamp(72px,12vw,200px)' }}
        >
          vayucodes<br />reels
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="mt-6 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed"
          style={{ fontWeight: 300 }}
        >
          We create content that converts. Reels, films, ads & funnels engineered for businesses that want eyeballs to translate to receipts.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="text-[10px] tracking-[0.4em] uppercase" style={{ color: GOLD }}>Scroll</div>
          <motion.div
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 origin-top"
            style={{ background: GOLD }}
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   REEL GRID — vertical 9:16, IntersectionObserver play/pause
============================================================ */
function ReelGrid() {
  const reels = [
    { src: '/videos/p1.mp4', title: 'Festive Hook', tag: 'Reel' },
    { src: '/videos/p2.mp4', title: 'Product Drop', tag: 'Reel' },
    { src: '/videos/p3.mp4', title: 'Behind The Loom', tag: 'BTS' },
    { src: '/videos/p4.mp4', title: 'Founder Story', tag: 'Doc' },
    { src: '/videos/p5.mp4', title: 'Anaya Diwali', tag: 'Ad' },
    { src: '/videos/p6.mp4', title: 'Bandhan Launch', tag: 'Promo' },
  ]

  return (
    <section className="relative bg-[#080808] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>· Reel grid</div>
            <h2 className="text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(40px,6vw,80px)' }}>
              Stop-the-thumb<br />creative
            </h2>
          </div>
          <p className="text-white/60 max-w-md" style={{ fontWeight: 300 }}>
            Vertical-first. Native to the platform. Built to hook in 1.5 seconds and convert in 8.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {reels.map((r, i) => (
            <ReelCell key={i} reel={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReelCell({ reel, index }) {
  const videoRef = useRef(null)
  const cellRef = useRef(null)
  useEffect(() => {
    const cell = cellRef.current
    const v = videoRef.current
    if (!cell || !v) return
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) v.play().catch(() => {})
          else { v.pause(); v.currentTime = 0 }
        })
      },
      { threshold: 0.3 }
    )
    obs.observe(cell)
    return () => obs.disconnect()
  }, [])
  return (
    <motion.div
      ref={cellRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.06 }}
      className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer"
    >
      <video
        ref={videoRef}
        src={reel.src}
        muted loop playsInline preload="metadata"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute top-4 left-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase text-white font-semibold">
        {reel.tag}
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="text-white text-sm font-medium">{reel.title}</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
          <Play size={14} className="text-black ml-0.5" fill="black" />
        </div>
      </div>
    </motion.div>
  )
}

/* ============================================================
   STATS ROW — animated counters
============================================================ */
function useCountUp(target, duration = 2200, inView = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration)
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(target * e))
      if (t >= 1) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [target, duration, inView])
  return val
}

function StatNumber({ target, suffix = '+', inView }) {
  const n = useCountUp(target, 2400, inView)
  return (
    <span className="tabular-nums" style={{ color: GOLD, fontFamily: 'var(--font-bebas)' }}>
      {n.toLocaleString()}{suffix}
    </span>
  )
}

function StatsRow() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const stats = [
    { num: 500, suffix: '+', label: 'Reels Created' },
    { num: 10, suffix: 'M+', label: 'Views Generated' },
    { num: 50, suffix: '+', label: 'Brands Onboarded' },
  ]
  return (
    <section ref={ref} className="relative bg-[#080808] py-24 px-6 lg:px-10 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto grid md:grid-cols-3 gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="text-center md:text-left"
          >
            <div className="text-[clamp(64px,9vw,140px)] leading-none">
              {i === 1 ? <StatNumber target={s.num} suffix={s.suffix} inView={inView} /> :
               <StatNumber target={s.num} suffix={s.suffix} inView={inView} />}
            </div>
            <div className="text-[10px] tracking-[0.35em] uppercase text-white/60 mt-4">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   CTA — gold accent
============================================================ */
function GoldCTA() {
  return (
    <section className="relative bg-[#080808] py-32 px-6 lg:px-10 border-t border-white/5 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent 60%)', filter: 'blur(60px)'
      }} />
      <div className="relative max-w-[1500px] mx-auto text-center">
        <div className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: GOLD }}>· Ready when you are</div>
        <h2 className="text-white uppercase leading-[0.95] tracking-[-0.01em]" style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(60px,9vw,160px)' }}>
          Let&apos;s make<br /><span style={{ color: GOLD }}>cinema.</span>
        </h2>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 mt-12 border-2 text-xs tracking-[0.25em] uppercase font-semibold px-9 py-4 rounded-full transition-all hover:text-black"
          style={{ borderColor: GOLD, color: GOLD }}
          onMouseEnter={e => { e.currentTarget.style.background = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          Book a discovery call
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}

export default function DigitalMarketingPage() {
  return (
    <PageWrapper darkHero={true}>
      <LetterboxHero />
      <ScrollShowcase
        products={MARKETING_PRODUCTS}
        kicker="· Capabilities · Where attention meets revenue"
        sectionTitle="Marketing OS"
      />
      <ReelGrid />
      <StatsRow />
      <GoldCTA />
    </PageWrapper>
  )
}
