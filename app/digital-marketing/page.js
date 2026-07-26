'use client'

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Play, TrendingUp, Sparkles, Megaphone, Camera, MessagesSquare,
  BarChart3, Target as TargetIcon, Zap, Check,
} from 'lucide-react'
import { PageWrapper } from '@/components/site/Shared'

/* ============================================================
   SLIDESHOW DATA — with photos per service
============================================================ */
const SLIDES = [
  {
    code: '01', title: 'Performance', italic: 'Marketing',
    tag: 'Meta · Google · LinkedIn',
    body: 'Creative-led performance campaigns. We test 40 variants a week, kill losers fast, scale winners harder — every rupee measured, every click accountable.',
    icon: TrendingUp,
    img: 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400',
    stats: [{ v: '4.2x', l: 'Avg ROAS' }, { v: '↓ 38%', l: 'CAC drop' }, { v: '40+', l: 'Creatives / week' }],
  },
  {
    code: '02', title: 'Brand', italic: 'Marketing',
    tag: 'Positioning · Voice · Story',
    body: 'Naming, identity, and messaging that make your business memorable. We turn positioning workshops into deliverables you can actually deploy across every channel.',
    icon: Sparkles,
    img: 'https://images.unsplash.com/photo-1698328722160-7ecf41b789c5?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400',
    stats: [{ v: '12', l: 'Brand systems' }, { v: '6+', l: 'Industries' }, { v: '100%', l: 'Fixed-scope' }],
  },
  {
    code: '03', title: 'Content', italic: '& Creative',
    tag: 'Reels · Films · UGC',
    body: 'Vertical-first content engine. High-velocity reels with hook-first scripting, cinema-grade brand films, and a curated UGC network across India.',
    icon: Camera,
    img: 'https://images.unsplash.com/photo-1513031300226-c8fb12de9ade?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400',
    stats: [{ v: '500+', l: 'Reels shipped' }, { v: '10M+', l: 'Views' }, { v: '1.5s', l: 'Avg hook' }],
  },
  {
    code: '04', title: 'Field &', italic: 'Local Marketing',
    tag: 'GBP · Local SEO · Events',
    body: 'Show up where your customers actually search. Google Business optimization, hyperlocal SEO, review systems, and on-ground activations built for your geography.',
    icon: Megaphone,
    img: 'https://images.unsplash.com/photo-1611166498484-5585e08d5656?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400',
    stats: [{ v: '4.9★', l: 'Avg review' }, { v: '↑2.6x', l: 'Local traffic' }, { v: '25+', l: 'GBPs managed' }],
  },
  {
    code: '05', title: 'Sales', italic: 'Enablement',
    tag: 'WhatsApp · CRM · Funnels',
    body: 'Conversation-led commerce with automated WhatsApp funnels, broadcast systems, and click-to-chat ads. Where India actually buys — we close the loop.',
    icon: MessagesSquare,
    img: 'https://images.unsplash.com/photo-1553081871-306366d02dfc?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400',
    stats: [{ v: '↑68%', l: 'Reply rate' }, { v: '↓5 min', l: 'Response' }, { v: '10+', l: 'Playbooks' }],
  },
]

/* ============================================================
   1 · HERO — slideshow with photos
============================================================ */
function SlideshowHero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])
  const s = SLIDES[i]

  return (
    <section className="relative min-h-[100vh] bg-[#171717] text-white overflow-hidden flex items-center px-4 md:px-10 pt-24 pb-16">
      {/* Background image gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={'bg-' + s.code}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
        >
          <img src={s.img} alt="" className="w-full h-full object-cover"
               style={{ filter: 'grayscale(100%) brightness(0.55) contrast(1.05)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-[1400px] mx-auto w-full grid lg:grid-cols-12 gap-10 items-center z-10">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-6"
          >
            — Marketing Division
          </motion.div>

          <div className="flex items-center gap-3 mb-8">
            {SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                      className={`h-1 rounded-full transition-all ${i === idx ? 'w-12 bg-white' : 'w-4 bg-white/25'}`}
                      aria-label={`Slide ${idx + 1}`} />
            ))}
            <div className="ml-3 text-[10px] tracking-[0.25em] uppercase text-white/50 font-mono">
              {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-white/50 text-xs tracking-[0.2em]">{s.code}</span>
                <span className="w-8 h-px bg-white/30" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">{s.tag}</span>
              </div>
              <h1 className="text-white leading-[0.98] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(42px,7.5vw,110px)' }}>
                {s.title}<br />
                <span className="italic text-white/60">{s.italic}</span>
              </h1>
              <p className="mt-8 max-w-xl text-[15px] md:text-base text-white/70 leading-relaxed">{s.body}</p>

              <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
                {s.stats.map((st, idx) => (
                  <div key={idx} className="backdrop-blur-md bg-white/[0.05] border border-white/12 rounded-xl p-3">
                    <div className="text-white text-lg font-semibold tracking-tight">{st.v}</div>
                    <div className="text-[9px] tracking-[0.2em] uppercase text-white/50 mt-0.5">{st.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={'photo-' + s.code}
              initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotate: 3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/5] max-w-[440px] rounded-3xl overflow-hidden border border-white/15"
              style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.4)' }}
            >
              <img src={s.img} alt={s.title} className="w-full h-full object-cover"
                   style={{ filter: 'grayscale(100%) contrast(1.05)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 backdrop-blur-md bg-white/10 border border-white/20 text-[10px] tracking-[0.25em] uppercase text-white font-semibold px-3 py-1.5 rounded-full">
                {s.code}
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-white text-lg font-medium tracking-tight">{s.title} {s.italic}</div>
                <div className="text-white/60 text-[10px] tracking-[0.2em] uppercase mt-1">{s.tag}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   2 · PHILOSOPHY BLOCK — white section with big statement
============================================================ */
function MarketingPhilosophy() {
  return (
    <section className="relative bg-[#FAFAF7] py-28 md:py-40 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="text-[10px] tracking-[0.4em] uppercase text-[#6B6B6B] mb-8"
        >
          — Our Philosophy
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(34px,6vw,88px)' }}
        >
          We don&apos;t sell impressions.
          <br />
          <span className="italic text-[#0A0A0A]/60">We sell outcomes.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-8 max-w-2xl mx-auto text-[15px] md:text-base text-[#525252] leading-relaxed"
        >
          Every campaign we run is built to answer one question: did this move the P&L? Not likes, not reach, not vanity dashboards. Just business results your accountant can point at.
        </motion.p>
      </div>
    </section>
  )
}

/* ============================================================
   3 · SERVICE PILLARS — 3 columns with icon+title+body
============================================================ */
function ServicePillars() {
  const pillars = [
    {
      icon: BarChart3, code: '01', title: 'Data-first',
      body: 'Every rupee tracked with proper attribution. Meta, Google, GA4, server-side events — we set up the plumbing so decisions are made on facts, not feelings.',
      points: ['GA4 + Meta CAPI', 'UTM discipline', 'Weekly P&L reviews'],
    },
    {
      icon: TargetIcon, code: '02', title: 'Creative velocity',
      body: 'Content is the new targeting. We produce 40+ variants weekly, test aggressively, and let the winners scale. Slow creative teams lose — always.',
      points: ['Weekly creative sprints', 'Hook library', 'UGC network across India'],
    },
    {
      icon: Zap, code: '03', title: 'Full-funnel thinking',
      body: 'From awareness ad to WhatsApp close. We connect brand, performance, and sales into one integrated system — no more paying to fill a leaky bucket.',
      points: ['Awareness → close mapping', 'CRM + WhatsApp automation', 'Retention loops built-in'],
    },
  ]
  return (
    <section className="relative bg-white py-24 md:py-32 px-6 md:px-10 border-t border-black/8">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="text-[10px] tracking-[0.35em] uppercase text-[#6B6B6B] mb-4">— How we operate</div>
          <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4.5vw,58px)' }}>
            Three principles. <span className="italic text-[#0A0A0A]/60">Every engagement.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative p-8 md:p-10 rounded-2xl border border-black/10 bg-[#FAFAF7] hover:border-[#0A0A0A] transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center">
                  <p.icon size={18} className="text-white" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#6B6B6B]">{p.code}</span>
              </div>
              <h3 className="text-[#0A0A0A] leading-[1.1] tracking-[-0.01em] mb-4"
                  style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(26px,2.8vw,36px)' }}>
                {p.title}
              </h3>
              <p className="text-[14px] text-[#525252] leading-relaxed mb-6">{p.body}</p>
              <ul className="space-y-2">
                {p.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-[#0A0A0A]">
                    <Check size={14} className="mt-0.5 shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none absolute top-0 left-8 right-8 h-px bg-[#0A0A0A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   4 · CASE HIGHLIGHT — one big brag row with numbers
============================================================ */
function CaseHighlight() {
  return (
    <section className="relative bg-[#FAFAF7] py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9 }}
          className="grid lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-5">
            <div className="text-[10px] tracking-[0.35em] uppercase text-[#6B6B6B] mb-4">— Case in point</div>
            <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4vw,54px)' }}>
              Sanskar Handlooms saw their <span className="italic text-[#0A0A0A]/60">footfall multiply</span> in a single festive season.
            </h2>
            <p className="text-[15px] text-[#525252] leading-relaxed max-w-md mb-6">
              We built their storefront, ran creative, closed on WhatsApp — all under one roof. One team, one goal, one accountability line.
            </p>
            <Link href="/our-work" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#0A0A0A] hover:underline underline-offset-4">
              See more work <ArrowRight size={13} />
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-3 md:gap-5">
            {[
              { v: '4×', l: 'Store footfall growth' },
              { v: '3.6×', l: 'Repeat visitors' },
              { v: '2.3 M', l: 'Impressions served' },
              { v: '62%', l: 'WhatsApp close rate' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="p-6 md:p-8 rounded-2xl border border-black/10 bg-white hover:border-[#0A0A0A] transition-colors"
              >
                <div className="text-[#0A0A0A] tracking-[-0.02em]"
                     style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4vw,54px)' }}>
                  {s.v}
                </div>
                <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B]">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   5 · REEL GRID (unchanged — near the end now)
============================================================ */
function ReelGrid() {
  const reels = [
    { src: '/videos/r1.mp4', title: 'Festive Hook', tag: 'Reel' },
    { src: '/videos/r2.mp4', title: 'Product Drop', tag: 'Reel' },
    { src: '/videos/r3.mp4', title: 'Behind The Loom', tag: 'BTS' },
    { src: '/videos/r4.mp4', title: 'Founder Story', tag: 'Doc' },
    { src: '/videos/r5.mp4', title: 'Sanskar Diwali', tag: 'Ad' },
    { src: '/videos/r6.mp4', title: 'Bandhan Launch', tag: 'Promo' },
  ]
  return (
    <section className="relative bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">— Reel Grid</div>
            <h2 className="text-white leading-[1.02] tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4vw,60px)' }}>
              Stop-the-thumb <span className="italic text-white/60">creative.</span>
            </h2>
          </div>
          <p className="text-white/50 max-w-md text-sm md:text-base">Vertical-first. Built to hook in 1.5s and convert in 8.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {reels.map((r, i) => <ReelCell key={i} reel={r} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function ReelCell({ reel, index }) {
  const videoRef = useRef(null)
  const cellRef = useRef(null)
  useEffect(() => {
    const cell = cellRef.current; const v = videoRef.current
    if (!cell || !v) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) v.play().catch(() => {})
        else { v.pause(); v.currentTime = 0 }
      })
    }, { threshold: 0.3 })
    obs.observe(cell)
    return () => obs.disconnect()
  }, [])
  return (
    <motion.div
      ref={cellRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-white/5 border border-white/10"
    >
      <video ref={videoRef} src={reel.src} muted loop playsInline preload="metadata"
             className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute top-3 left-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase text-white font-semibold">{reel.tag}</div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="text-white text-xs md:text-sm font-medium">{reel.title}</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Play size={12} className="text-black ml-0.5" fill="black" />
        </div>
      </div>
    </motion.div>
  )
}

/* ============================================================
   6 · CTA
============================================================ */
function FinalCTA() {
  return (
    <section className="relative bg-[#0A0A0A] py-28 md:py-40 px-6 md:px-10 border-t border-white/8 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 60%)', filter: 'blur(40px)' }} />
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-6">— Ready when you are</div>
        <h2 className="text-white leading-[1.02] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(38px,6vw,84px)' }}>
          Let&apos;s make <span className="italic text-white/60">something worth watching.</span>
        </h2>
        <Link href="/contact"
              className="group inline-flex items-center gap-3 mt-10 border border-white text-white text-xs tracking-[0.2em] uppercase font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all">
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
      <SlideshowHero />
      <MarketingPhilosophy />
      <ServicePillars />
      <CaseHighlight />
      <ReelGrid />
      <FinalCTA />
    </PageWrapper>
  )
}
