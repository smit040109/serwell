'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, ShieldCheck, Zap, Users, Code2, Cpu, Megaphone, Sparkles, Globe2, Building2 } from 'lucide-react'
import {
  LandingFlow, Navbar, Footer, SILHOUETTE_IMG, PORTFOLIO_IMAGES,
  Tilt3DCard, SectionHeading, CTABlock, useVideoColor
} from '@/components/site/Shared'

/* ============================================================
   EDITORIAL HERO \u2014 dynamically tinted by sampled video color
============================================================ */
function EditorialHero() {
  const vc = useVideoColor()
  const c = vc || { r: 255, g: 138, b: 61 }
  const c1 = `rgb(${Math.min(255, c.r + 40)},${Math.min(255, c.g + 40)},${Math.min(255, c.b + 30)})`
  const c2 = `rgb(${c.r},${c.g},${c.b})`
  const c3 = `rgb(${Math.max(0, c.r - 80)},${Math.max(0, c.g - 80)},${Math.max(0, c.b - 60)})`
  const c4 = `rgb(${Math.max(0, c.r - 150)},${Math.max(0, c.g - 150)},${Math.max(0, c.b - 130)})`

  // Mouse parallax for floating UI panels
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 70, damping: 20, mass: 0.6 })
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handle = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      mx.set(x)
      my.set(y)
    }
    el.addEventListener('mousemove', handle)
    return () => el.removeEventListener('mousemove', handle)
  }, [mx, my])

  // Generate floating particles
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 8 + Math.random() * 14,
      delay: Math.random() * 6,
    }))
  ).current

  return (
    <section ref={containerRef} id="top" className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Dynamic gradient backdrop */}
      <div className="absolute inset-0">
        <motion.div
          key={c2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 100% 80% at 70% 50%, ${c1} 0%, ${c2} 18%, ${c3} 45%, ${c4} 70%, #060606 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
        }} />
      </div>

      {/* DYNAMIC GRID — subtle */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '88px 88px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 70% 50%, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 70% 50%, black 30%, transparent 80%)',
      }} />

      {/* AI NETWORK LINES — SVG, animated */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="aiLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,217,184,0)" />
            <stop offset="50%" stopColor="rgba(255,217,184,0.55)" />
            <stop offset="100%" stopColor="rgba(255,217,184,0)" />
          </linearGradient>
        </defs>
        {[
          { x1: '55%', y1: '22%', x2: '85%', y2: '35%' },
          { x1: '60%', y1: '45%', x2: '92%', y2: '28%' },
          { x1: '58%', y1: '65%', x2: '88%', y2: '75%' },
          { x1: '72%', y1: '15%', x2: '95%', y2: '60%' },
          { x1: '50%', y1: '55%', x2: '78%', y2: '85%' },
        ].map((l, i) => (
          <motion.line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="url(#aiLine)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0.3] }}
            transition={{ duration: 3 + i, delay: 0.5 + i * 0.4, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          />
        ))}
        {/* Network nodes */}
        {[
          { cx: '55%', cy: '22%' }, { cx: '85%', cy: '35%' }, { cx: '60%', cy: '45%' },
          { cx: '92%', cy: '28%' }, { cx: '88%', cy: '75%' }, { cx: '78%', cy: '85%' },
        ].map((n, i) => (
          <motion.circle
            key={i}
            cx={n.cx} cy={n.cy} r="2.5"
            fill="rgba(255,217,184,0.7)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.7] }}
            transition={{ duration: 2, delay: 1 + i * 0.2, repeat: Infinity, repeatDelay: 5 }}
          />
        ))}
      </svg>

      {/* PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.35,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.55, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* FLOATING SOFTWARE PANELS — glassmorphism, parallax-bound */}
      <motion.div
        style={{ x: useTransform(sx, (v) => v * -22), y: useTransform(sy, (v) => v * -16) }}
        className="absolute right-[3%] top-[14%] w-[300px] hidden lg:block pointer-events-none"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-auto text-[10px] text-white/40 tracking-widest">analytics.vc</span>
          </div>
          <div className="text-[10px] text-white/55 tracking-widest uppercase mb-2">Today · Conversions</div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-white text-3xl" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>4,217</span>
            <span className="text-[#28C840] text-[11px] tabular-nums">+38.2%</span>
          </div>
          {/* Mini sparkline */}
          <svg viewBox="0 0 200 40" className="w-full h-9">
            <motion.polyline
              points="0,30 25,25 50,28 75,18 100,22 125,12 150,16 175,8 200,10"
              fill="none"
              stroke="#FFD9B8"
              strokeWidth="1.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.5, ease: 'easeOut' }}
            />
          </svg>
        </div>
      </motion.div>

      <motion.div
        style={{ x: useTransform(sx, (v) => v * 30), y: useTransform(sy, (v) => v * 20) }}
        className="absolute right-[12%] bottom-[18%] w-[300px] hidden lg:block pointer-events-none"
        initial={{ opacity: 0, y: 36, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="text-[10px] text-[#FFD9B8] tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD9B8] animate-pulse" /> automation.vc
          </div>
          {/* Code-fragment lines */}
          <div className="space-y-1.5 font-mono text-[11px]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            {[
              { t: 'order.received', c: 'text-white/70', d: '0.8' },
              { t: 'whatsapp.send()', c: 'text-[#FFD9B8]', d: '1.0' },
              { t: 'inventory.sync', c: 'text-white/70', d: '1.2' },
              { t: 'invoice.create', c: 'text-white/70', d: '1.4' },
              { t: '✓ shipped', c: 'text-[#28C840]', d: '1.6' },
            ].map((l, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-2 ${l.c}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: parseFloat(l.d), duration: 0.5 }}
              >
                <span className="text-white/30">{String(i + 1).padStart(2, '0')}</span>
                <span>{l.t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ x: useTransform(sx, (v) => v * 12), y: useTransform(sy, (v) => v * -10) }}
        className="absolute right-[42%] top-[18%] w-[220px] hidden xl:block pointer-events-none"
        initial={{ opacity: 0, y: 22, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 p-4">
          <div className="text-[9px] text-white/55 tracking-widest uppercase mb-2">AI · Neural</div>
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full border-2 border-white/15" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#FFD9B8] border-r-transparent border-b-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white tabular-nums">87%</div>
            </div>
            <div className="flex-1">
              <div className="text-white text-[12px]" style={{ fontFamily: 'var(--font-instrument)' }}>Training</div>
              <div className="text-white/45 text-[9px] tracking-widest">epoch 1240</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="h-24" />
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-10">
            <div className="lg:max-w-[58%]">
              {/* Kicker */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="w-10 h-px bg-white/40" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/65" style={{ fontFamily: 'var(--font-inter)' }}>
                  Premium Software Studio · Est. 2025
                </span>
              </motion.div>

              {/* HEADLINE */}
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-white leading-[0.98] tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(44px,6.4vw,92px)' }}
              >
                The Last Team
                <br />
                You&apos;ll <span className="italic text-[#FFD9B8]">Ever</span> Need.
              </motion.h1>

              {/* SUBHEAD — service list as elegant pills */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.9 }}
                className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2"
              >
                {['Websites', 'AI Automation', 'Custom Software', 'Marketing'].map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 + i * 0.1, duration: 0.6 }}
                    className="text-white/85 text-base lg:text-lg italic"
                    style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}
                  >
                    {s}{i < 3 ? <span className="not-italic text-white/30 ml-3">·</span> : ''}
                  </motion.span>
                ))}
              </motion.div>

              {/* DESCRIPTION */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.9 }}
                className="mt-8 max-w-xl text-white/65 text-[15px] lg:text-base leading-[1.7]"
                style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
              >
                We build websites, automate operations, create custom software and help businesses grow through performance-driven marketing. Everything your business needs — one team.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 bg-white text-[#1a0a04] font-semibold text-[12px] tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:bg-[#FFD9B8] transition-all"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Start Your Project
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/our-work"
                  className="group inline-flex items-center gap-3 backdrop-blur-md bg-white/5 border border-white/25 text-white text-[12px] tracking-[0.15em] uppercase font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85D2C] opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85D2C]" />
                  </span>
                  See Our Work
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* BOTTOM STATUS BAR — clean, no scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="relative z-10 border-t border-white/10 py-5 px-6 lg:px-10"
        >
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-white/45" style={{ fontFamily: 'var(--font-inter)' }}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />
              Studio status · Accepting Q2 projects
            </div>
            <div className="hidden md:flex items-center gap-5">
              <span>Valsad · Mumbai · Bengaluru · Worldwide</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   SERVICES TEASER — 3 services with 3D tilt cards
============================================================ */
function ServicesTeaser() {
  const services = [
    { n: '01', title: 'Websites', desc: 'Blazing-fast sites that load on any phone, any network.', accent: '#E85D2C', href: '/services' },
    { n: '02', title: 'Software', desc: 'Custom ERPs, dashboards, internal tools — made for your shop floor.', accent: '#FF8A3D', href: '/services' },
    { n: '03', title: 'Marketing', desc: 'Targeted local ads that fill your phone with ready-to-buy customers.', accent: '#FFD9B8', href: '/services' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading
            tag="· What we make"
            title="Three engines. One business."
            italicWord="One business."
          />
          <Link href="/services" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            View all services
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Tilt3DCard intensity={10} className="group h-full">
                <Link
                  href={s.href}
                  className="block h-full bg-white rounded-3xl p-8 lg:p-10 border border-[#0E0E10]/8 hover:border-[#E85D2C]/40 transition-all"
                  style={{ boxShadow: '0 30px 60px -30px rgba(14,14,16,0.15)' }}
                >
                  <div style={{ transform: 'translateZ(40px)' }} className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-12">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#E85D2C] font-bold">{s.n}</span>
                      <div className="w-2 h-2 rounded-full" style={{ background: s.accent }} />
                    </div>
                    <h3 className="text-[#0E0E10] tracking-[-0.01em] mb-4" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(26px,2.4vw,36px)', lineHeight: 1.05 }}>
                      {s.title}
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-12">{s.desc}</p>
                    <div className="mt-auto flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-semibold text-[#0E0E10] group-hover:text-[#E85D2C] transition-colors">
                      Read more <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   SELECTED WORK TEASER — 3D project tiles
============================================================ */
function WorkTeaser() {
  const projects = [
    { n: '01', title: 'Nirvana Eco-Resort', tag: 'Hospitality', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80' },
    { n: '02', title: 'Sutra Textile Co.', tag: 'Manufacturing', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80' },
    { n: '03', title: 'Anaya Jewels', tag: 'D2C', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10 border-t border-[#0E0E10]/8">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading tag="· Selected work · 2024 – 2025" title="Real businesses. Real numbers." italicWord="Real numbers." />
          <Link href="/our-work" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            See all case studies
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <Tilt3DCard intensity={8} className="group h-full">
                <Link href="/our-work" className="block relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100">
                  <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-[#0E0E10]/30 to-transparent" />
                  <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between" style={{ transform: 'translateZ(50px)' }}>
                    <div className="flex items-center justify-between">
                      <span className="backdrop-blur-md bg-white/15 border border-white/30 rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-semibold text-white">
                        · {p.n} · Live
                      </span>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white/70">{p.tag}</span>
                    </div>
                    <div>
                      <h3 className="text-white tracking-[-0.01em]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(26px,2.2vw,34px)', lineHeight: 1.05 }}>
                        {p.title}
                      </h3>
                      <div className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-semibold text-white group-hover:text-[#FFD9B8] transition-colors">
                        View case <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   TRUST TEASER
============================================================ */
function TrustTeaser() {
  const points = [
    { icon: MapPin, k: 'Local Partners', v: 'Right here in Valsad. Call us in Gujarati.' },
    { icon: Users, k: 'Gujarat-Native', v: 'We know your festive cycle, your customer.' },
    { icon: ShieldCheck, k: 'One Partner', v: 'No five vendors fighting each other.' },
  ]
  return (
    <section className="relative bg-[#0E0E10] text-white py-32 px-6 lg:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/12 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">
              · Why Gujarat trusts vayucodes
            </span>
            <h2 className="text-white tracking-[-0.01em] max-w-[16ch]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(36px,5vw,72px)', lineHeight: 1.02 }}>
              You don&apos;t need Mumbai.
              <span className="italic text-[#FFD9B8]"> You need us.</span>
            </h2>
          </div>
          <Link href="/why-us" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-white/70 hover:text-[#E85D2C] transition-colors">
            Read full story
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Tilt3DCard intensity={8} className="h-full">
                <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/8 transition-colors" style={{ transform: 'translateZ(0)' }}>
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="w-10 h-10 rounded-2xl bg-[#E85D2C]/15 border border-[#E85D2C]/30 flex items-center justify-center mb-6">
                      <p.icon size={18} className="text-[#E85D2C]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{p.k}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{p.v}</p>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   BENTO GRID \u2014 asymmetric 2-large + 4-small with 3D tilt
============================================================ */
function BentoGrid() {
  const cards = [
    { size: 'large', icon: '🎬', title: 'Cinema for Business', body: 'Brand films & reels shot in 4K Apple Log. Not commercials — cinema.', accent: '#E85D2C' },
    { size: 'small', icon: '⚡', title: 'Blazing-fast sites', body: 'Sub-second loads.' },
    { size: 'small', icon: '🛠', title: 'Custom Software', body: 'Built for your floor.' },
    { size: 'large', icon: '📈', title: 'Performance That Pays', body: 'Every rupee tracked to a rupee earned. Local-first growth.', accent: '#FFD9B8' },
    { size: 'small', icon: '🇮🇳', title: 'Gujarati-first', body: 'We speak your buyer.' },
    { size: 'small', icon: '🤝', title: 'One Partner', body: 'Predictable, monthly.' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading
            tag="· What we build"
            title="One studio. Six superpowers."
            italicWord="Six superpowers."
          />
          <Link href="/services" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            All services
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[200px]">
          {cards.map((c, i) => {
            const span = c.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className={span}
              >
                <Tilt3DCard intensity={c.size === 'large' ? 8 : 12} className="h-full">
                  <div className={`group relative h-full rounded-3xl overflow-hidden border border-[#0E0E10]/8 transition-all p-7 lg:p-9 flex flex-col justify-between ${
                    c.size === 'large' ? 'bg-[#0E0E10] text-white' : 'bg-white text-[#0E0E10]'
                  }`} style={{
                    boxShadow: c.size === 'large' ? '0 40px 80px -30px rgba(14,14,16,0.5)' : '0 20px 40px -20px rgba(14,14,16,0.12)'
                  }}>
                    {c.size === 'large' && c.accent && (
                      <div className="pointer-events-none absolute -top-20 -right-20 w-[40vw] h-[40vw] rounded-full blur-3xl opacity-30" style={{ background: c.accent }} />
                    )}
                    <div style={{ transform: 'translateZ(30px)' }} className="flex items-start justify-between relative z-10">
                      <div className={`text-4xl lg:text-5xl ${c.size === 'large' ? 'opacity-90' : ''}`}>
                        {c.icon}
                      </div>
                    </div>
                    <div style={{ transform: 'translateZ(50px)' }} className="relative z-10">
                      <h3 className={`${c.size === 'large' ? 'text-2xl lg:text-3xl' : 'text-lg'} leading-tight mb-2 tracking-[-0.01em]`} style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>
                        {c.title}
                      </h3>
                      <p className={`${c.size === 'large' ? 'text-base text-white/70' : 'text-sm text-zinc-600'} leading-relaxed max-w-md`}>
                        {c.body}
                      </p>
                    </div>
                  </div>
                </Tilt3DCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   ANIMATED STATS COUNTERS
============================================================ */
function useCountUp(target, duration = 2200, inView = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration)
      const e = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(target * e))
      if (t >= 1) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [target, duration, inView])
  return val
}

function StatCard({ target, suffix, label, inView, delay }) {
  const v = useCountUp(target, 2400, inView)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="text-center md:text-left"
    >
      <div className="text-[clamp(40px,5vw,72px)] leading-none text-[#0E0E10] tabular-nums tracking-[-0.02em]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>
        {v.toLocaleString()}<span className="text-[#E85D2C]">{suffix}</span>
      </div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-[#0E0E10]/60 mt-3">{label}</div>
    </motion.div>
  )
}

function AnimatedStats() {
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
    { num: 150, suffix: '+', label: 'Projects Shipped' },
    { num: 5, suffix: ' yrs', label: 'In the studio' },
    { num: 99, suffix: '%', label: 'Client Satisfaction' },
    { num: 50, suffix: '+', label: 'Brands Onboarded' },
  ]
  return (
    <section ref={ref} className="relative bg-[#F4F1EA] py-24 px-6 lg:px-10 border-t border-[#0E0E10]/8">
      <div className="max-w-[1500px] mx-auto grid md:grid-cols-4 gap-10 md:gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} target={s.num} suffix={s.suffix} label={s.label} inView={inView} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   CLIENT LOGO MARQUEE \u2014 infinite horizontal scroll
============================================================ */
function ClientMarquee() {
  const brands = ['Nirvana', 'Sutra', 'Anaya', 'Bandhan', 'ChaiSnap', 'Saurav Studios', 'Vayu Mills', 'Patel Co.', 'Lumière', 'Athena', 'Indigo Bay', 'Sahyadri Group']
  return (
    <section className="relative bg-[#F4F1EA] py-20 border-y border-[#0E0E10]/8 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 mb-10">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#0E0E10]/50">· Trusted by independent businesses across India</div>
      </div>
      <div className="relative overflow-hidden group">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          className="flex whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {[...brands, ...brands].map((b, i) => (
            <div key={i} className="flex items-center gap-12 px-12 text-[clamp(22px,2.4vw,32px)] text-[#0E0E10]/65 leading-none tracking-[-0.01em]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>
              <span className="italic">{b}</span>
              <span className="text-[#E85D2C] text-base">●</span>
            </div>
          ))}
        </motion.div>
        {/* edge fade masks */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-[#F4F1EA] to-transparent" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-[#F4F1EA] to-transparent" />
      </div>
    </section>
  )
}

/* ============================================================
   HOME
============================================================ */
export default function Home() {
  return (
    <LandingFlow>
      <Navbar darkHero={true} />
      <EditorialHero />
      <ClientMarquee />
      <BentoGrid />
      <AnimatedStats />
      <ServicesTeaser />
      <WorkTeaser />
      <TrustTeaser />
      <CTABlock
        kicker="Ready when you are"
        title="Let's talk numbers, not jargon."
        italicWord="numbers,"
      />
      <Footer />
    </LandingFlow>
  )
}
