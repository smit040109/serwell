'use client'

import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Sparkles, Shield, Zap, Target, Users2, Infinity as InfinityIcon,
  Check, MapPin,
} from 'lucide-react'
import { PageWrapper, useCmsPageContent } from '@/components/site/Shared'

const C = {
  bg: '#FAFAF7', bg2: '#F2F2EE', ink: '#0A0A0A', ink2: '#171717',
  line: '#E7E5E1', muted: '#6B6B6B', faint: '#A3A3A3',
}

const VALUE_ICONS = [Zap, Shield, Target, Users2, Sparkles, InfinityIcon]

function CountUp({ to = 100, suffix = '+', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to, duration])
  return <span ref={ref} className="tabular-nums">{val.toLocaleString()}{suffix}</span>
}

function FloatingProfileCard({ src, name, role, tag, rotate = -6, delay = 0, floatDelay = 0, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40, rotate: rotate * 1.6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
                transition={{ delay, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 30, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                className={`relative cursor-pointer group ${className}`}
                style={{ transformOrigin: 'center' }}>
      <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 5 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }} className="relative">
        <div className="w-[220px] md:w-[240px] rounded-[28px] overflow-hidden bg-white border border-black/10"
             style={{ boxShadow: '0 30px 60px -30px rgba(0,0,0,0.25), 0 12px 24px -12px rgba(0,0,0,0.12)' }}>
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            <img src={src} alt={name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" draggable={false} />
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[9px] tracking-[0.15em] uppercase text-[#0A0A0A] font-semibold px-2.5 py-1.5 rounded-full border border-black/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
              {tag}
            </div>
          </div>
          <div className="p-4 bg-white">
            <div className="text-[13px] font-semibold text-[#0A0A0A] leading-tight">{name}</div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B] mt-1">{role}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Hero() {
  const d = useCmsPageContent('why-us') || {}
  const founders = Array.isArray(d.founders) ? d.founders : []
  const left = founders[0] || { photo: '/team/smit.webp', name: 'Uday Tailor', title: 'Co-Founder', tag: 'Building' }
  const right = founders[1] || { photo: '/team/uday.webp', name: 'Smit Patel', title: 'Co-Founder', tag: 'Shipping' }
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-24" style={{ background: C.bg }}>
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[90vw] h-[70vw] rounded-full"
             style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.06), transparent 60%)' }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/15 bg-white/60 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0A0A0A] font-medium">{d.heroBadge || 'Why VayuCodes'}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                     className="text-[#0A0A0A] leading-[0.98] tracking-[-0.02em]"
                     style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(44px,6.5vw,88px)' }}>
            {d.heroHeadline1 || 'The minds behind'}
            <br />
            <span className="italic text-[#0A0A0A]/70">{d.heroHeadlineItalic || 'the machine.'}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35 }}
                    className="mt-8 max-w-xl text-[15px] md:text-base text-[#3F3F3F] leading-relaxed">
            {d.heroSubtitle || 'Two co-founders. One relentless standard.'}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.5 }}
                      className="mt-10 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#0A0A0A]/60">
            <span className="w-8 h-px bg-[#0A0A0A]/40" />
            {d.heroStudioLine || 'Studio · Est. 2026'}
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative h-[520px] md:h-[560px] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-[4%] top-[2%]">
              <FloatingProfileCard src={left.photo} name={left.name} role={left.title} tag={left.tag} rotate={-8} delay={0.6} floatDelay={0} />
            </div>
            <div className="absolute right-[2%] bottom-[2%]">
              <FloatingProfileCard src={right.photo} name={right.name} role={right.title} tag={right.tag} rotate={7} delay={0.8} floatDelay={0.6} />
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-black/8" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ImpactStats() {
  const d = useCmsPageContent('why-us') || {}
  const stats = Array.isArray(d.stats) && d.stats.length ? d.stats : [
    { value: 20, suffix: '+', label: 'Projects Delivered', sub: 'Shipped end-to-end, on time.' },
    { value: 15, suffix: '+', label: 'Businesses Served', sub: 'From D2C brands to family enterprises.' },
    { value: 10, suffix: '', label: 'People. One Studio.', sub: 'Designers, engineers & strategists — under one roof.' },
    { value: 100, suffix: '%', label: 'Founder-Led', sub: 'Every project touched by both of us.' },
  ]
  return (
    <section className="relative py-28 md:py-36" style={{ background: C.bg }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-3xl mb-16 md:mb-20">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">{d.statsEyebrow || '— A ten-person studio, deliberately small.'}</div>
          <h2 className="text-[#0A0A0A] leading-[1.0] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}>
            {d.statsHeadline1 || 'A team of ten. Twenty'}
            <br />
            {d.statsHeadline2 || 'products shipped.'} <span className="italic text-[#0A0A0A]/60">{d.statsHeadlineItalic || 'Zero excuses.'}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4 }}
                        className="group relative p-8 md:p-10 rounded-2xl bg-white border border-black/10 hover:border-[#0A0A0A] transition-all duration-500">
              <div className="text-[#0A0A0A] leading-none tracking-[-0.03em]"
                   style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(44px,5.5vw,72px)' }}>
                <CountUp to={Number(s.value) || 0} suffix={s.suffix || ''} />
              </div>
              <div className="mt-6 text-[13px] font-semibold text-[#0A0A0A]">{s.label}</div>
              <div className="mt-1 text-[12px] text-[#6B6B6B] leading-relaxed">{s.sub}</div>
              <div className="absolute top-0 left-0 h-px w-0 bg-[#0A0A0A] group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisionMission() {
  const d = useCmsPageContent('why-us') || {}
  const visionBullets = Array.isArray(d.visionBullets) ? d.visionBullets.filter(Boolean) : []
  const missionBullets = Array.isArray(d.missionBullets) ? d.missionBullets.filter(Boolean) : []
  return (
    <section className="relative py-28 md:py-36" style={{ background: C.bg2 }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9 }}
                    className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">{d.visionEyebrow || '— Vision & Mission'}</div>
          <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}>
            {d.visionHeadline1 || 'Engineering the systems that'} <span className="italic text-[#0A0A0A]/60">{d.visionHeadlineItalic || 'quietly run'}</span> {d.visionHeadline2 || 'the businesses of tomorrow.'}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-5">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">{d.visionSubEyebrow || '01 — Vision'}</div>
            <h3 className="text-[#0A0A0A] leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(28px,3.4vw,42px)' }}>
              {d.visionSubHeadline1 || 'Software that thinks.'} <br /><span className="italic">{d.visionSubHeadlineItalic || 'Systems that scale.'}</span>
            </h3>
            <p className="text-[15px] text-[#3F3F3F] leading-relaxed mb-6 max-w-md">{d.visionBody || 'We build custom products and AI-driven workflows.'}</p>
            <ul className="space-y-3">
              {visionBullets.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-[#0A0A0A]">
                  <Check size={16} className="mt-0.5 text-[#0A0A0A] shrink-0" /><span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-7">
            <MockDashboard />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-7 order-2 lg:order-1">
            <MockMobileUI videoUrl={'/videos/mission-full.mp4'} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-5 order-1 lg:order-2">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">{d.missionSubEyebrow || '02 — Mission'}</div>
            <h3 className="text-[#0A0A0A] leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(28px,3.4vw,42px)' }}>
              {d.missionSubHeadline1 || 'Ship faster than agencies.'} <br /><span className="italic">{d.missionSubHeadlineItalic || 'Care deeper than freelancers.'}</span>
            </h3>
            <p className="text-[15px] text-[#3F3F3F] leading-relaxed mb-6 max-w-md">{d.missionBody || 'Our mission is to give every ambitious business owner a technical partner.'}</p>
            <ul className="space-y-3">
              {missionBullets.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-[#0A0A0A]">
                  <Check size={16} className="mt-0.5 text-[#0A0A0A] shrink-0" /><span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MockDashboard() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-white border border-black/10 p-5 md:p-6"
         style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.25)' }}>
      <div className="flex items-center gap-1.5 mb-5">
        <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
        <div className="ml-4 flex-1 h-6 rounded-md bg-black/[0.04] border border-black/5" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[{ label: 'Uptime', val: '99.9%' }, { label: 'Sprint velocity', val: '↑ 34%' }, { label: 'On-time launch', val: '20 / 20' }].map((s, i) => (
          <div key={i} className="p-3 rounded-xl bg-[#FAFAF7] border border-black/8">
            <div className="text-[9px] tracking-[0.2em] uppercase text-[#6B6B6B]">{s.label}</div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-[#0A0A0A]">{s.val}</div>
          </div>
        ))}
      </div>
      <div className="relative h-40 rounded-xl bg-[#FAFAF7] border border-black/8 overflow-hidden">
        <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="mochart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                       transition={{ duration: 2.2, ease: 'easeOut' }}
                       d="M0,120 C40,110 70,95 110,85 C160,72 190,90 230,70 C275,48 310,55 350,32 L400,20"
                       stroke="#0A0A0A" strokeWidth="2" fill="none" />
          <path d="M0,120 C40,110 70,95 110,85 C160,72 190,90 230,70 C275,48 310,55 350,32 L400,20 L400,160 L0,160 Z" fill="url(#mochart)" />
        </svg>
      </div>
    </div>
  )
}

function MockMobileUI({ videoUrl }) {
  const [istTime, setIstTime] = useState('')
  useEffect(() => {
    const updateTime = () => setIstTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }))
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[42px] bg-[#0A0A0A] p-2.5"
           style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.35)' }}>
        <div className="w-full h-full rounded-[34px] bg-[#0A0A0A] overflow-hidden relative">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#0A0A0A] z-30" />
          <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between text-[10px] text-white/85 font-medium">
            <span className="tabular-nums">{istTime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoreValues() {
  const d = useCmsPageContent('why-us') || {}
  const values = Array.isArray(d.values) && d.values.length ? d.values : []
  return (
    <section className="relative py-28 md:py-36" style={{ background: C.bg }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9 }}
                    className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">{d.valuesEyebrow || '— Core Values'}</div>
          <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}>
            {d.valuesHeadline1 || 'The'} <span className="italic text-[#0A0A0A]/60">{d.valuesHeadlineItalic || 'six standards'}</span> {d.valuesHeadline2 || "we'll never negotiate on."}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[i % VALUE_ICONS.length]
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-60px' }}
                          transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ y: -4 }}
                          className="group relative p-8 rounded-2xl bg-white border border-black/10 hover:border-[#0A0A0A] transition-all duration-500">
                <div className="w-11 h-11 rounded-xl bg-[#0A0A0A]/[0.04] border border-black/10 flex items-center justify-center mb-6 group-hover:bg-[#0A0A0A] group-hover:border-[#0A0A0A] transition-all duration-500">
                  <Icon size={18} className="text-[#0A0A0A] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-[17px] font-semibold text-[#0A0A0A] tracking-tight leading-snug mb-3">{v.title}</h3>
                <p className="text-[13.5px] text-[#525252] leading-relaxed">{v.body}</p>
                <div className="pointer-events-none absolute top-0 left-6 right-6 h-px bg-[#0A0A0A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CoFounders() {
  const d = useCmsPageContent('why-us') || {}
  const founders = Array.isArray(d.founders) && d.founders.length ? d.founders : []
  return (
    <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: C.bg2 }}>
      <div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full"
           style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08), transparent 60%)' }} />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9 }}
                    className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">{d.foundersEyebrow || '— Leadership'}</div>
          <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}>
            {d.foundersHeadline1 || 'Meet the co-founders'} <span className="italic text-[#0A0A0A]/60">{d.foundersHeadlineItalic || 'building it'}</span> {d.foundersHeadline2 || 'in the open.'}
          </h2>
          <p className="mt-6 text-[15px] text-[#525252] leading-relaxed max-w-xl mx-auto">{d.foundersSubtitle || ''}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {founders.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -6 }}
                        className="group relative bg-white rounded-3xl overflow-hidden border border-black/10 transition-all duration-500 hover:border-[#0A0A0A]"
                        style={{ boxShadow: '0 30px 60px -30px rgba(0,0,0,0.18)' }}>
              <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img src={f.photo} alt={f.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-1000" draggable={false} />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase font-semibold text-[#0A0A0A] px-3 py-1.5 rounded-full border border-black/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
                  {f.title}
                </div>
              </div>
              <div className="p-7 md:p-8">
                <h3 className="text-[#0A0A0A] tracking-[-0.02em] leading-tight"
                    style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(26px,2.4vw,34px)' }}>
                  {f.name}
                </h3>
                <div className="mt-1 text-[11px] tracking-[0.25em] uppercase text-[#6B6B6B]">{f.caption}</div>
                <p className="mt-5 text-[14px] leading-relaxed text-[#525252]">{f.bio}</p>
                <div className="mt-6 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0A0A0A]">
                  <MapPin size={12} /> India · Worldwide
                </div>
              </div>
              <div className="pointer-events-none absolute top-0 left-6 right-6 h-px bg-[#0A0A0A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsletterCTA() {
  const d = useCmsPageContent('why-us') || {}
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const submit = (e) => {
    e.preventDefault(); if (!email) return
    setSubmitted(true); setTimeout(() => setSubmitted(false), 3500); setEmail('')
  }
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: C.bg }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-[36px] md:rounded-[48px] overflow-hidden border border-black/10 bg-white p-10 md:p-16 lg:p-20 text-center"
                    style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.18)' }}>
          <div className="relative">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">{d.newsletterEyebrow || '— The Next Move'}</div>
            <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em] max-w-3xl mx-auto"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,5vw,64px)' }}>
              {d.newsletterHeadline1 || 'Ready to build the'} <span className="italic text-[#0A0A0A]/60">{d.newsletterHeadlineItalic || 'next chapter'}</span> {d.newsletterHeadline2 || 'of your business?'}
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-[15px] text-[#525252] leading-relaxed">{d.newsletterSubtitle || ''}</p>

            <form onSubmit={submit} className="mt-10 max-w-lg mx-auto flex flex-col sm:relative sm:flex-row sm:items-center gap-3 sm:gap-0">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                     placeholder={d.newsletterPlaceholder || 'you@yourbusiness.com'}
                     className="w-full pl-6 pr-6 sm:pr-40 py-5 rounded-full border border-black/12 bg-[#FAFAF7] text-[14px] text-[#0A0A0A] placeholder:text-[#A3A3A3] outline-none focus:border-[#0A0A0A] focus:ring-4 focus:ring-black/5 transition-all" />
              <button type="submit" className="w-full sm:w-auto sm:absolute sm:right-1.5 sm:top-1/2 sm:-translate-y-1/2 inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-white text-xs font-semibold tracking-[0.2em] uppercase px-6 py-4 sm:py-3.5 rounded-full hover:bg-black active:scale-[0.97] transition-all">
                {submitted ? 'Sent ✓' : 'Subscribe'}
                {!submitted && <ArrowRight size={14} />}
              </button>
            </form>

            <div className="mt-8 text-[11px] tracking-[0.2em] uppercase text-[#A3A3A3]">
              Or — <Link href="/contact" className="text-[#0A0A0A] underline underline-offset-4 hover:no-underline">book a 20-min discovery call</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function WhyUsPage() {
  return (
    <PageWrapper darkHero={false}>
      <Hero />
      <ImpactStats />
      <VisionMission />
      <CoreValues />
      <CoFounders />
      <NewsletterCTA />
    </PageWrapper>
  )
}
