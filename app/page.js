'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, Globe, Cpu, TrendingUp, ShieldCheck, Zap, Users,
  MapPin, CheckCircle2, AlertTriangle, BarChart3, Code2, Sparkles,
  Phone, Mail, MessageSquare, Menu, X, Play, SkipForward, Circle
} from 'lucide-react'

const NAVY = '#0A2540'
const TEAL = '#00D4B6'
const SILVER = '#F8F9FA'
const AMBER = '#FF8A3D'

const CITY_IMG_PRIMARY = 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=2400&q=80'
const CITY_IMG_SECONDARY = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=2400&q=80'
const CITY_IMG_TERTIARY = 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=2400&q=80'
const SILHOUETTE_IMG = 'https://images.pexels.com/photos/5175616/pexels-photo-5175616.jpeg'

const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1648134859187-71dadc9f815a',
  'https://images.unsplash.com/photo-1648134859177-525771773915',
  'https://images.unsplash.com/photo-1648134859196-3aa762e9440d',
  'https://images.pexels.com/photos/27141314/pexels-photo-27141314.jpeg',
  'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg',
  'https://images.unsplash.com/photo-1660970781103-ba6749cb9ce3',
  'https://images.unsplash.com/photo-1648134859186-a05fb609f41e',
  'https://images.unsplash.com/photo-1590658094082-88f4c5814ea1',
  'https://images.pexels.com/photos/8636589/pexels-photo-8636589.jpeg',
]

/* ============================================================
   LIVE CLOCK — used in editorial hero nav
============================================================ */
function LiveClock({ label, tz }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const zone = tz || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined)
    const tick = () => {
      try {
        const t = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false, timeZone: zone,
        }).format(new Date())
        setTime(t)
      } catch {
        setTime(new Date().toLocaleTimeString('en-GB'))
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tz])
  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">{label}</span>
      <span className="text-xs font-medium tabular-nums tracking-wider">{time || '--:--:--'}</span>
    </div>
  )
}

/* ============================================================
   NAV — adaptive: dark over editorial hero, glassy on scroll
============================================================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = !scrolled // transparent over dark editorial hero → white text

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-zinc-100 shadow-[0_1px_0_rgba(10,37,64,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1500px] mx-auto flex justify-between items-center py-5 px-6 lg:px-10">
        <a
          href="#top"
          className={`text-2xl font-extrabold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-[#0A2540]'
          }`}
        >
          vayu<span className="text-[#00D4B6]">.code</span>
        </a>
        <nav
          className={`hidden md:flex items-center space-x-10 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors ${
            isDark ? 'text-white/70' : 'text-zinc-600'
          }`}
        >
          <a href="#services" className={`${isDark ? 'hover:text-white' : 'hover:text-[#0A2540]'} transition-colors`}>Services</a>
          <a href="#why-us" className={`${isDark ? 'hover:text-white' : 'hover:text-[#0A2540]'} transition-colors`}>Why Us</a>
          <a href="#portfolio" className={`${isDark ? 'hover:text-white' : 'hover:text-[#0A2540]'} transition-colors`}>Our Work</a>
          <a href="#trust" className={`${isDark ? 'hover:text-white' : 'hover:text-[#0A2540]'} transition-colors`}>Trust</a>
        </nav>
        <div className="flex items-center gap-6">
          {/* live time counters — only show over dark hero */}
          <div className={`hidden lg:flex items-center gap-6 transition-opacity duration-500 ${isDark ? 'text-white opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <LiveClock label="Valsad, IN" tz="Asia/Kolkata" />
            <LiveClock label="Your Time" tz={null} />
          </div>
          <a
            href="#contact"
            className={`hidden sm:inline-flex text-[11px] font-semibold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full transition-all border ${
              isDark
                ? 'bg-white text-[#0A2540] border-white hover:bg-transparent hover:text-white'
                : 'bg-[#0A2540] text-white border-[#0A2540] hover:bg-zinc-800'
            }`}
          >
            Contact
          </a>
          <button
            className={`md:hidden p-2 ${isDark ? 'text-white' : 'text-[#0A2540]'}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 space-y-3 text-sm font-medium text-zinc-700">
          <a href="#services" onClick={() => setOpen(false)} className="block">Services</a>
          <a href="#why-us" onClick={() => setOpen(false)} className="block">Why Us</a>
          <a href="#portfolio" onClick={() => setOpen(false)} className="block">Our Work</a>
          <a href="#contact" onClick={() => setOpen(false)} className="block text-[#00D4B6]">Contact Us →</a>
        </div>
      )}
    </motion.header>
  )
}

/* ============================================================
   PRELOADER — black screen with progress %
============================================================ */
function Preloader({ progress }) {
  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      {/* subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* logo wordmark — small, top-left */}
      <div className="absolute top-8 left-8 text-white text-sm font-extrabold tracking-tight">
        vayu<span className="text-[#00D4B6]">.code</span>
      </div>

      {/* loading label — top right */}
      <div className="absolute top-8 right-8 text-[10px] tracking-[0.3em] uppercase text-white/40">
        Loading Experience
      </div>

      {/* progress wheel */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(80px,18vw,220px)] font-extralight text-white leading-none tabular-nums tracking-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {String(progress).padStart(2, '0')}
          <span className="text-white/30">%</span>
        </motion.div>
        <div className="mt-6 w-[280px] h-px bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00D4B6] via-white to-[#FF8A3D]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
        <div className="mt-4 text-[10px] tracking-[0.3em] uppercase text-white/40">
          Caching cinematic assets
        </div>
      </div>

      {/* bottom credit */}
      <div className="absolute bottom-8 inset-x-0 text-center text-[10px] tracking-[0.3em] uppercase text-white/30">
        A studio based in Valsad, Gujarat
      </div>
    </motion.div>
  )
}

/* ============================================================
   VIDEO INTRO — cinematic Ken Burns image carousel + scripted reveal
============================================================ */
function VideoIntro({ onEnd }) {
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const DURATION = 6500
  const slides = [CITY_IMG_PRIMARY, CITY_IMG_SECONDARY, CITY_IMG_TERTIARY]

  // Cycle slides
  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % slides.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  // Auto-advance to home
  useEffect(() => {
    const t = setTimeout(onEnd, DURATION)
    return () => clearTimeout(t)
  }, [onEnd])

  // Progress bar
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / DURATION) * 100)
      setProgress(p)
      if (p >= 100) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      key="videointro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[90] bg-black overflow-hidden"
    >
      {/* Cinematic Ken Burns image carousel */}
      <AnimatePresence mode="sync">
        {slides.map((src, i) => idx === i && (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.18 }}
            exit={{ opacity: 0, scale: 1.25, transition: { duration: 1.2, ease: 'easeInOut' } }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 4, ease: 'linear' } }}
            className="absolute inset-0"
          >
            <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* cinematic vignette + warm tint + grading */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 mix-blend-overlay" style={{
        background: 'radial-gradient(ellipse at 70% 40%, rgba(255,138,61,0.35), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,212,182,0.15), transparent 50%)'
      }} />
      {/* faint film grain */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
      }} />

      {/* TOP BAR */}
      <div className="absolute top-0 inset-x-0 flex justify-between items-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-sm font-extrabold tracking-tight"
        >
          vayu<span className="text-[#00D4B6]">.code</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[10px] tracking-[0.3em] uppercase text-white/70"
        >
          Cinematic Intro · 2025
        </motion.div>
      </div>

      {/* CENTER LABEL */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.4, ease: 'easeOut' }}
          className="text-center px-6"
        >
          <div className="text-[10px] tracking-[0.5em] uppercase text-white/60 mb-4">
            Welcome to
          </div>
          <h2 className="text-white text-5xl md:text-7xl lg:text-9xl font-light tracking-tight leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
            vayu<span className="italic text-[#FFD9B8]">.code</span>
          </h2>
          <div className="mt-6 text-[10px] tracking-[0.5em] uppercase text-white/60">
            We build the wind beneath your business
          </div>
        </motion.div>
      </div>

      {/* BOTTOM PROGRESS LINE */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 z-10">
        <div className="h-full bg-gradient-to-r from-[#00D4B6] via-white to-[#FF8A3D] transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>

      {/* SKIP BUTTON */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={onEnd}
        className="group absolute bottom-8 right-8 z-20 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-[0.18em] uppercase px-5 py-2.5 rounded-full transition-all"
      >
        Skip Intro
        <SkipForward size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </motion.div>
  )
}

/* ============================================================
   EDITORIAL HERO — dark amber gradient, silhouette, serif headline
============================================================ */
function EditorialHero() {
  return (
    <section id="top" className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* AMBIENT RADIAL GLOW */}
      <div className="absolute inset-0">
        {/* base warm gradient */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 90% 70% at 75% 50%, #FFB36B 0%, #FF8A3D 20%, #D24B0E 45%, #4A1505 70%, #0B0604 100%)'
        }} />
        {/* deep shadow on left to anchor type */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        {/* film grain */}
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
        }} />
        {/* warm vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }} />
      </div>

      {/* SILHOUETTE IMAGE — right side */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] xl:w-[55%] pointer-events-none">
        <img
          src={SILHOUETTE_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 mix-blend-screen"
        />
        {/* darken edges of image */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* CONTENT GRID */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* nav spacer */}
        <div className="h-24" />

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-8 items-center">
            {/* LEFT — Editorial headline */}
            <div className="lg:col-span-7 xl:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="w-10 h-px bg-white/40" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/60">
                  Independent Studio · Est. 2025 · Valsad, IN
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-white text-[clamp(48px,8vw,128px)] leading-[0.95] tracking-[-0.02em] font-light"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Art direction
                <br />
                with a <span className="italic text-[#FFD9B8]">Systems</span>
                <br />
                Brain.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.9 }}
                className="mt-8 max-w-md text-white/70 text-base leading-relaxed"
              >
                We craft websites, custom software & marketing systems for ambitious businesses across Gujarat — engineered to run, designed to seduce.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 bg-white text-[#1a0a04] font-semibold text-[12px] tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:bg-[#FFD9B8] transition-all"
                >
                  Start here
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#services"
                  className="group inline-flex items-center gap-3 backdrop-blur-md bg-white/5 border border-white/25 text-white text-[12px] tracking-[0.15em] uppercase font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4B6] opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4B6]" />
                  </span>
                  Available · Q3 2025
                </a>
              </motion.div>
            </div>

            {/* RIGHT — Spec details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="lg:col-span-5 xl:col-span-5 hidden lg:flex flex-col justify-end h-full pb-12"
            >
              <div className="ml-auto max-w-xs space-y-4 text-right">
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">Currently shipping</div>
                <div className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Three local manufacturers · One D2C jewelry brand · Two retail chains · Custom CRM for a textile exporter.
                </div>
                <div className="flex justify-end gap-6 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Projects</div>
                    <div className="text-white text-xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair)' }}>50+</div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Avg. Lift</div>
                    <div className="text-white text-xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair)' }}>3.2×</div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Uptime</div>
                    <div className="text-white text-xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair)' }}>99.9</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FOOTER BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="relative z-10 border-t border-white/10 py-5 px-6 lg:px-10"
        >
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-white/50">
            <div className="flex items-center gap-2">
              <Circle size={6} className="fill-[#00D4B6] text-[#00D4B6]" />
              In the studio: brewing chai, shipping pixels
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span>↓ Scroll to see what we make</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   PROBLEM SECTION — pain points
============================================================ */
function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Losing Customers to Online Competitors',
      body: 'Your competitors show up first on Google while your shop relies on word-of-mouth. Every day without a strong online presence is a customer walking into someone else\'s store.',
    },
    {
      icon: BarChart3,
      title: 'Drowning in Excel Sheets & Paper Registers',
      body: 'Inventory mismatched, orders missed, staff confused. Your business runs on memory and messy spreadsheets — one mistake costs you lakhs in lost stock and trust.',
    },
    {
      icon: TrendingUp,
      title: 'Marketing Money That Brings Zero Sales',
      body: 'You\'ve paid agencies for "posts" and "likes" — but not one ready-to-buy customer walked in. Marketing without sales is just expensive decoration.',
    },
  ]
  return (
    <section className="relative bg-white py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
            // The Problem We Solve
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.1] text-balance">
            Running a business in 2025 shouldn&apos;t feel like fighting fires every morning.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative bg-[#F8F9FA] rounded-3xl p-8 border border-zinc-100 hover:border-[#00D4B6]/40 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(10,37,64,0.15)] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-6 group-hover:bg-[#0A2540] group-hover:border-[#0A2540] transition-colors">
                <p.icon size={20} className="text-[#0A2540] group-hover:text-[#00D4B6] transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-3 leading-snug">{p.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   SPLIT PINNED SECTION — left sticky, right scrolling mockups (grayscale → color)
============================================================ */
function SplitPinnedSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const yTrack = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66%'])

  const blocks = [
    {
      tag: '01 / WEBSITES',
      title: 'Your 24/7 Digital Showroom',
      body: 'Custom websites built from scratch — blazing fast on every phone, every village, every network. They look premium, load instantly, and turn casual visitors into paying clients while you sleep.',
      img: PORTFOLIO_IMAGES[0],
    },
    {
      tag: '02 / SOFTWARE',
      title: 'Automate Your Daily Operations',
      body: 'Custom systems that track inventory, orders, leads, and staff — replacing manual errors and messy registers. Made for the way your business actually works, not the way an app from America thinks it should.',
      img: PORTFOLIO_IMAGES[1],
    },
    {
      tag: '03 / MARKETING',
      title: 'Consistent Customer Inflow',
      body: 'Targeted local ads and Gujarati-first social strategy that bring real sales inquiries — not vanity likes. We measure success in calls answered and bills raised.',
      img: PORTFOLIO_IMAGES[2],
    },
  ]

  return (
    <section ref={sectionRef} id="services" className="relative bg-[#F8F9FA]" style={{ height: `${blocks.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col md:flex-row">
        {/* LEFT — sticky header */}
        <div className="md:w-1/2 w-full md:h-screen flex items-center justify-center bg-white border-r border-zinc-100 px-8 md:px-16 py-12">
          <div className="max-w-md">
            <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
              // What We Build
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.05] mb-6 text-balance">
              Three engines.
              <br />
              <span className="bg-gradient-to-r from-[#0A2540] to-[#00D4B6] bg-clip-text text-transparent">
                One unstoppable business.
              </span>
            </h2>
            <p className="text-zinc-600 text-base leading-relaxed mb-8">
              Websites that sell. Software that runs your shop floor. Marketing that fills your phone with buyers. We don&apos;t do one — we do all three, stitched together.
            </p>
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
              <div className="flex -space-x-2">
                {[TEAL, NAVY, '#1a4d8a'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              Scroll → to explore each
            </div>
          </div>
        </div>

        {/* RIGHT — scrolling blocks */}
        <div className="md:w-1/2 w-full md:h-screen overflow-hidden relative">
          <motion.div
            style={{ y: yTrack }}
            className="w-full"
          >
            {blocks.map((b, i) => (
              <div key={i} className="h-screen w-full flex items-center justify-center px-8 md:px-16 py-12">
                <div className="max-w-lg w-full">
                  <div
                    className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-[0_30px_80px_-30px_rgba(10,37,64,0.25)] mb-6 aspect-[16/10]"
                  >
                    <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] font-bold tracking-widest text-[#00D4B6] uppercase mb-3">{b.tag}</div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#0A2540] mb-3 tracking-tight">{b.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   TILTED PORTFOLIO GRID — 50/50, left tilted img grid scrolls up, right copy fades
============================================================ */
function TiltedPortfolio() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const yShift = useTransform(scrollYProgress, [0, 1], ['10%', '-25%'])

  return (
    <section ref={sectionRef} id="portfolio" className="relative bg-white py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT — Tilted grid */}
        <div className="relative h-[600px] lg:h-[700px] overflow-hidden rounded-3xl bg-[#F8F9FA] border border-zinc-100">
          <motion.div
            style={{ y: yShift, rotate: -12 }}
            className="absolute inset-0 -inset-x-20 grid grid-cols-3 gap-4 p-8 origin-center"
          >
            {PORTFOLIO_IMAGES.concat(PORTFOLIO_IMAGES).slice(0, 12).map((src, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-zinc-200 shadow-[0_20px_50px_-20px_rgba(10,37,64,0.25)] aspect-[3/4]"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        {/* RIGHT — cross-fading trust copy */}
        <div className="space-y-10">
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase">
            // Proof of Work
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.05] text-balance">
            Real businesses.
            <br />
            <span className="bg-gradient-to-r from-[#0A2540] to-[#00D4B6] bg-clip-text text-transparent">
              Real numbers.
            </span>
          </h2>
          <p className="text-zinc-600 text-lg leading-relaxed">
            From textile manufacturers in Surat to retail chains across South Gujarat — we&apos;ve replaced registers with real-time dashboards, replaced pamphlets with WhatsApp funnels, and replaced &quot;we&apos;ll think about it&quot; with &quot;can you start tomorrow?&quot;.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {[
              { k: '50+', v: 'Local Businesses Modernized' },
              { k: '3.2x', v: 'Average Sales Lift in 90 days' },
              { k: '99.9%', v: 'Website Uptime Delivered' },
              { k: '12 hr', v: 'Average Response Time' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-l-2 border-[#00D4B6] pl-4"
              >
                <div className="text-3xl font-extrabold text-[#0A2540]">{s.k}</div>
                <div className="text-sm text-zinc-500 mt-1">{s.v}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   WHY GUJARAT TRUSTS US
============================================================ */
function TrustSection() {
  const points = [
    { icon: MapPin, title: 'Local Partners, Not Distant Vendors', body: 'We\'re right here in Valsad. Walk into our office, call us in Gujarati, message us on WhatsApp. No outsourced support teams reading scripts.' },
    { icon: Users, title: 'We Understand Gujarat\'s Market', body: 'We know the rhythm of Diwali sales, the festive ad spikes, the way your customer talks. Mumbai and Bangalore agencies guess — we know.' },
    { icon: ShieldCheck, title: 'Built to Scale While You Focus on Execution', body: 'You run your factory, your shop, your team. We handle the tech, the website, the leads. One predictable monthly partner — not five vendors fighting each other.' },
  ]
  return (
    <section id="trust" className="relative bg-[#0A2540] text-white py-32 px-6 overflow-hidden">
      {/* ambient teal glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#00D4B6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[60vw] h-[60vw] rounded-full bg-[#00D4B6]/5 blur-3xl" />

      <div id="why-us" className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
            // Why Gujarat Trusts vayu.code
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
            You don&apos;t need a Mumbai agency.
            <br />
            <span className="text-[#00D4B6]">You need a partner who picks up the phone.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#00D4B6]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00D4B6]/15 border border-[#00D4B6]/30 flex items-center justify-center mb-6">
                <p.icon size={20} className="text-[#00D4B6]" />
              </div>
              <h3 className="text-lg font-bold mb-3 leading-snug">{p.title}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-1">Ready to stop losing customers to outdated systems?</h3>
            <p className="text-zinc-300 text-sm">Book a free 30-minute consultation. We&apos;ll tell you exactly what to fix — even if you don&apos;t hire us.</p>
          </div>
          <a href="#contact" className="group flex items-center gap-3 bg-[#00D4B6] text-[#0A2540] font-bold text-sm px-8 py-4 rounded-full hover:bg-white transition-all whitespace-nowrap">
            Book Free Consultation
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   CONTACT FORM
============================================================ */
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' })
  const [status, setStatus] = useState({ loading: false, ok: false, err: '' })

  async function submit(e) {
    e.preventDefault()
    setStatus({ loading: true, ok: false, err: '' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStatus({ loading: false, ok: true, err: '' })
      setForm({ name: '', email: '', phone: '', business: '', message: '' })
    } catch (err) {
      setStatus({ loading: false, ok: false, err: err.message })
    }
  }

  return (
    <section id="contact" className="relative bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
            // Let&apos;s Build Together
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.05] mb-6 text-balance">
            Tell us about your business.
          </h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Drop your details. We&apos;ll call within 12 hours — not next week. Free consultation, no obligations, no jargon.
          </p>
          <div className="space-y-4 text-sm text-zinc-700">
            <div className="flex items-center gap-3"><MapPin size={16} className="text-[#00D4B6]" /> Valsad, Gujarat — India</div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-[#00D4B6]" /> hello@vayu.code</div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-[#00D4B6]" /> +91 — Available on WhatsApp</div>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-3 bg-[#F8F9FA] rounded-3xl p-8 md:p-10 border border-zinc-100 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Your Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
            <Input label="Phone (optional)" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
            <Input label="Business Name" value={form.business} onChange={v => setForm({ ...form, business: v })} />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2 block">
              Tell us briefly what you need
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#00D4B6]/30 text-sm text-[#0A2540] placeholder:text-zinc-400 resize-none"
              placeholder="e.g. We run a textile shop in Surat — need a website and want to start running ads."
            />
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0A2540] text-white font-semibold text-sm px-8 py-4 rounded-full shadow-md hover:bg-zinc-800 transition-all disabled:opacity-60"
          >
            {status.loading ? 'Sending…' : 'Send Inquiry'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          {status.ok && (
            <div className="flex items-center gap-2 text-sm text-[#00D4B6] font-medium">
              <CheckCircle2 size={16} /> Got it! We&apos;ll call within 12 hours.
            </div>
          )}
          {status.err && (
            <div className="text-sm text-red-600 font-medium">{status.err}</div>
          )}
        </form>
      </div>
    </section>
  )
}

function Input({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#00D4B6]/30 text-sm text-[#0A2540] placeholder:text-zinc-400"
      />
    </div>
  )
}

/* ============================================================
   FOOTER
============================================================ */
function Footer() {
  return (
    <footer className="bg-[#F8F9FA] border-t border-zinc-100 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold tracking-tight text-[#0A2540]">
            vayu<span className="text-[#00D4B6]">.code</span>
          </span>
          <span className="text-xs text-zinc-400">© 2025 — Built in Valsad, Gujarat 🇮🇳</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#services" className="hover:text-[#0A2540] transition-colors">Services</a>
          <a href="#portfolio" className="hover:text-[#0A2540] transition-colors">Work</a>
          <a href="#contact" className="hover:text-[#0A2540] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   APP — with cinematic intro state machine
============================================================ */
function App() {
  const [stage, setStage] = useState('loading') // loading | intro | home
  const [progress, setProgress] = useState(0)

  // Preloader progress simulation
  useEffect(() => {
    if (stage !== 'loading') return
    let p = 0
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 12 + 4)
      setProgress(Math.round(p))
      if (p >= 100) {
        clearInterval(id)
        setTimeout(() => setStage('intro'), 500)
      }
    }, 110)
    return () => clearInterval(id)
  }, [stage])

  // Lock scroll while intro is playing
  useEffect(() => {
    if (stage !== 'home') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [stage])

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === 'loading' && <Preloader key="pre" progress={progress} />}
        {stage === 'intro' && <VideoIntro key="vid" onEnd={() => setStage('home')} />}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'home' ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative bg-white"
      >
        <Navbar />
        <EditorialHero />
        <ProblemSection />
        <SplitPinnedSection />
        <TiltedPortfolio />
        <TrustSection />
        <ContactSection />
        <Footer />
      </motion.main>
    </>
  )
}

export default App
