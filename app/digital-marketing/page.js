'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Play, TrendingUp, Sparkles, Megaphone, Camera, Globe2, MessagesSquare,
} from 'lucide-react'
import { PageWrapper } from '@/components/site/Shared'

/* ============================================================
   1 · HERO — auto-cycling slideshow of marketing verticals
============================================================ */
const SLIDES = [
  { code: '01', title: 'Performance Marketing', tag: 'Meta · Google · LinkedIn',
    body: 'Creative-led performance campaigns. We test 40 variants a week, kill losers fast, scale winners harder — every rupee measured, every click accountable.',
    icon: TrendingUp },
  { code: '02', title: 'Brand Marketing', tag: 'Positioning · Voice · Story',
    body: 'Naming, identity, and messaging that make your business memorable. We turn positioning workshops into deliverables you can actually deploy across every channel.',
    icon: Sparkles },
  { code: '03', title: 'Content & Creative', tag: 'Reels · Films · UGC',
    body: 'Vertical-first content engine. High-velocity reels with hook-first scripting, cinema-grade brand films, and a curated UGC network across India.',
    icon: Camera },
  { code: '04', title: 'Field & Local Marketing', tag: 'GBP · Local SEO · Events',
    body: 'Show up where your customers actually search. Google Business optimization, hyperlocal SEO, review systems, and on-ground activations built for your geography.',
    icon: Megaphone },
  { code: '05', title: 'Sales Enablement', tag: 'WhatsApp · CRM · Funnels',
    body: 'Conversation-led commerce with automated WhatsApp funnels, broadcast systems, and click-to-chat ads. Where India actually buys — we close the loop.',
    icon: MessagesSquare },
]

function SlideshowHero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [])
  const s = SLIDES[i]
  const Icon = s.icon
  return (
    <section className="relative min-h-[100vh] bg-[#0A0A0A] text-white overflow-hidden flex items-center px-4 md:px-10 pt-24 pb-16">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] rounded-full"
             style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05), transparent 60%)' }} />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
        }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto w-full grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-6"
          >
            — Marketing Division
          </motion.div>

          {/* Slide indicator */}
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
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-white/50 text-xs tracking-[0.2em]">{s.code}</span>
                <span className="w-8 h-px bg-white/30" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">{s.tag}</span>
              </div>
              <h1 className="text-white leading-[0.98] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(44px,8vw,116px)' }}>
                {s.title.split(' ')[0]}<br />
                <span className="italic text-white/60">{s.title.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="mt-8 max-w-xl text-[15px] md:text-base text-white/60 leading-relaxed">{s.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={'icon-' + s.code}
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-square max-w-[420px] rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-sm flex items-center justify-center"
              style={{ boxShadow: '0 40px 80px -30px rgba(255,255,255,0.05)' }}
            >
              <Icon size={140} strokeWidth={0.8} className="text-white" />
              <div className="absolute top-4 left-4 text-[9px] tracking-[0.3em] uppercase text-white/50 font-mono">{s.code}</div>
              <div className="absolute bottom-4 right-4 text-[9px] tracking-[0.3em] uppercase text-white/50">Vertical</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   2 · REEL GRID
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
   3 · STATS
============================================================ */
function StatsRow() {
  const stats = [
    { n: '500+', label: 'Reels Created' },
    { n: '10M+', label: 'Views Generated' },
    { n: '20+', label: 'Brands Onboarded' },
  ]
  return (
    <section className="relative bg-[#0A0A0A] py-20 md:py-24 px-6 md:px-10 border-t border-white/8">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-10">
        {stats.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="text-center md:text-left"
          >
            <div className="text-white leading-none tracking-[-0.02em]"
                 style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(48px,6vw,88px)' }}>{s.n}</div>
            <div className="text-[10px] tracking-[0.35em] uppercase text-white/50 mt-4">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   4 · CTA — monochrome
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
      <ReelGrid />
      <StatsRow />
      <FinalCTA />
    </PageWrapper>
  )
}
