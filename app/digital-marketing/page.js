'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Play, TrendingUp, Sparkles, Megaphone, Camera, MessagesSquare,
  BarChart3, Target as TargetIcon, Zap, Check,
} from 'lucide-react'
import { PageWrapper, useCmsPageContent } from '@/components/site/Shared'

const SLIDE_ICONS = [TrendingUp, Sparkles, Camera, Megaphone, MessagesSquare]
const PILLAR_ICONS = [BarChart3, TargetIcon, Zap]

function SlideshowHero() {
  const d = useCmsPageContent('digital-marketing') || {}
  const slides = Array.isArray(d.slides) && d.slides.length ? d.slides : []
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!slides.length) return
    const id = setInterval(() => setI(v => (v + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])
  const s = slides[i]

  if (!s) return <section className="relative min-h-[100vh] bg-[#171717]" />

  return (
    <section className="relative min-h-[100vh] bg-[#171717] text-white overflow-hidden flex items-center px-4 md:px-10 pt-24 pb-16">
      <AnimatePresence mode="wait">
        <motion.div key={'bg-' + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 1.4 }} className="absolute inset-0">
          <img src={s.img} alt="" className="w-full h-full object-cover"
               style={{ filter: 'grayscale(100%) brightness(0.55) contrast(1.05)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-[1400px] mx-auto w-full grid lg:grid-cols-12 gap-10 items-center z-10">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                      className="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-6">
            {d.eyebrow || '— Marketing Division'}
          </motion.div>

          <div className="flex items-center gap-3 mb-8">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                      className={`h-1 rounded-full transition-all ${i === idx ? 'w-12 bg-white' : 'w-4 bg-white/25'}`}
                      aria-label={`Slide ${idx + 1}`} />
            ))}
            <div className="ml-3 text-[10px] tracking-[0.25em] uppercase text-white/50 font-mono">
              {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
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
                {(s.stats || []).map((st, idx) => (
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
            <motion.div key={'photo-' + i} initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.95, rotate: 3 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full aspect-[4/5] max-w-[440px] rounded-3xl overflow-hidden border border-white/15"
                        style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.4)' }}>
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

function MarketingPhilosophy() {
  const d = useCmsPageContent('digital-marketing') || {}
  return (
    <section className="relative bg-[#FAFAF7] py-28 md:py-40 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9 }}
                    className="text-[10px] tracking-[0.4em] uppercase text-[#6B6B6B] mb-8">
          {d.philosophyEyebrow || '— Our Philosophy'}
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: '-100px' }}
                   transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                   className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
                   style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(34px,6vw,88px)' }}>
          {d.philosophyHeadline1 || "We don't sell impressions."}
          <br />
          <span className="italic text-[#0A0A0A]/60">{d.philosophyHeadlineItalic || 'We sell outcomes.'}</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, delay: 0.2 }}
                  className="mt-8 max-w-2xl mx-auto text-[15px] md:text-base text-[#525252] leading-relaxed">
          {d.philosophyBody || ''}
        </motion.p>
      </div>
    </section>
  )
}

function ServicePillars() {
  const d = useCmsPageContent('digital-marketing') || {}
  const pillars = Array.isArray(d.pillars) && d.pillars.length ? d.pillars : []
  return (
    <section className="relative bg-white py-24 md:py-32 px-6 md:px-10 border-t border-black/8">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="text-[10px] tracking-[0.35em] uppercase text-[#6B6B6B] mb-4">{d.pillarsEyebrow || '— How we operate'}</div>
          <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4.5vw,58px)' }}>
            {d.pillarsHeadline1 || 'Three principles.'} <span className="italic text-[#0A0A0A]/60">{d.pillarsHeadlineItalic || 'Every engagement.'}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length]
            const points = Array.isArray(p.points) ? p.points : (typeof p.points === 'string' ? p.points.split(',').map(s => s.trim()).filter(Boolean) : [])
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-60px' }}
                          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ y: -4 }}
                          className="group relative p-8 md:p-10 rounded-2xl border border-black/10 bg-[#FAFAF7] hover:border-[#0A0A0A] transition-all duration-500">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#6B6B6B]">{p.code}</span>
                </div>
                <h3 className="text-[#0A0A0A] leading-[1.1] tracking-[-0.01em] mb-4"
                    style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(26px,2.8vw,36px)' }}>
                  {p.title}
                </h3>
                <p className="text-[14px] text-[#525252] leading-relaxed mb-6">{p.body}</p>
                <ul className="space-y-2">
                  {points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13px] text-[#0A0A0A]">
                      <Check size={14} className="mt-0.5 shrink-0" /> {pt}
                    </li>
                  ))}
                </ul>
                <div className="pointer-events-none absolute top-0 left-8 right-8 h-px bg-[#0A0A0A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CaseHighlight() {
  const d = useCmsPageContent('digital-marketing') || {}
  const stats = Array.isArray(d.caseStats) && d.caseStats.length ? d.caseStats : []
  return (
    <section className="relative bg-[#FAFAF7] py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }}
                    className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <div className="text-[10px] tracking-[0.35em] uppercase text-[#6B6B6B] mb-4">{d.caseEyebrow || '— Case in point'}</div>
            <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4vw,54px)' }}>
              {d.caseHeadline1 || ''} <span className="italic text-[#0A0A0A]/60">{d.caseHeadlineItalic || ''}</span> {d.caseHeadline2 || ''}
            </h2>
            <p className="text-[15px] text-[#525252] leading-relaxed max-w-md mb-6">{d.caseBody || ''}</p>
            <Link href="/our-work" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#0A0A0A] hover:underline underline-offset-4">
              See more work <ArrowRight size={13} />
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-3 md:gap-5">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                          className="p-6 md:p-8 rounded-2xl border border-black/10 bg-white hover:border-[#0A0A0A] transition-colors">
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

function ReelGrid() {
  const d = useCmsPageContent('digital-marketing') || {}
  const reels = Array.isArray(d.reels) && d.reels.length ? d.reels : []
  return (
    <section className="relative bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">{d.reelsEyebrow || '— Reel Grid'}</div>
            <h2 className="text-white leading-[1.02] tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4vw,60px)' }}>
              {d.reelsHeadline1 || 'Stop-the-thumb'} <span className="italic text-white/60">{d.reelsHeadlineItalic || 'creative.'}</span>
            </h2>
          </div>
          <p className="text-white/50 max-w-md text-sm md:text-base">{d.reelsSubtitle || ''}</p>
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
    <motion.div ref={cellRef} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, delay: index * 0.05 }}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
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

function FinalCTA() {
  const d = useCmsPageContent('digital-marketing') || {}
  return (
    <section className="relative bg-[#0A0A0A] py-28 md:py-40 px-6 md:px-10 border-t border-white/8 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 60%)', filter: 'blur(40px)' }} />
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-6">{d.ctaEyebrow || '— Ready when you are'}</div>
        <h2 className="text-white leading-[1.02] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(38px,6vw,84px)' }}>
          {d.ctaHeadline1 || "Let's make"} <span className="italic text-white/60">{d.ctaHeadlineItalic || 'something worth watching.'}</span>
        </h2>
        <Link href="/contact"
              className="group inline-flex items-center gap-3 mt-10 border border-white text-white text-xs tracking-[0.2em] uppercase font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all">
          {d.ctaButton || 'Book a discovery call'}
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
