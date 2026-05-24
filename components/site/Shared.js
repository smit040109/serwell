'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight, Menu, X, MapPin, Mail, Phone, CheckCircle2, Circle, Sparkles
} from 'lucide-react'

/* ============================================================
   DESIGN TOKENS
============================================================ */
export const COLORS = {
  ink: '#0E0E10',
  bone: '#F4F1EA',
  ember: '#E85D2C',
  amber: '#FF8A3D',
  cream: '#FFD9B8',
  ash: '#3A3A3A',
  mist: '#A8A29E',
}

export const CITY_IMG_PRIMARY = 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=2400&q=80'
export const CITY_IMG_SECONDARY = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=2400&q=80'
export const CITY_IMG_TERTIARY = 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=2400&q=80'
export const SILHOUETTE_IMG = 'https://images.pexels.com/photos/5175616/pexels-photo-5175616.jpeg'

export const PORTFOLIO_IMAGES = [
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

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/our-work', label: 'Our Work' },
  { href: '/why-us', label: 'Why Us' },
  { href: '/contact', label: 'Contact' },
]

/* ============================================================
   3D MOUSE-TRACK TILT CARD
============================================================ */
export function Tilt3DCard({ children, className = '', intensity = 12, perspective = 1200 }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 180, damping: 18 })
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 180, damping: 18 })

  function onMove(e) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() { mx.set(0); my.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
   LIVE CLOCK
============================================================ */
export function LiveClock({ label, tz }) {
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
   WORDMARK
============================================================ */
export function Wordmark({ className = '', light = false }) {
  return (
    <Link href="/" className={`text-xl md:text-2xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#0E0E10]'} ${className}`}>
      vayu<span className="text-[#E85D2C]">codes</span>
    </Link>
  )
}

/* ============================================================
   NAVBAR — adaptive, route-aware
============================================================ */
export function Navbar({ darkHero = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = darkHero && !scrolled

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F4F1EA]/85 backdrop-blur-xl border-b border-[#0E0E10]/8'
          : darkHero ? 'bg-transparent' : 'bg-[#F4F1EA]/70 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[1500px] mx-auto flex justify-between items-center py-5 px-6 lg:px-10">
        <Wordmark light={isDark} />

        <nav className={`hidden md:flex items-center space-x-8 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors ${
          isDark ? 'text-white/70' : 'text-[#0E0E10]/70'
        }`}>
          {NAV_LINKS.filter(l => l.href !== '/').slice(0, 4).map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative transition-colors ${
                  active ? (isDark ? 'text-white' : 'text-[#0E0E10]') : (isDark ? 'hover:text-white' : 'hover:text-[#0E0E10]')
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-[#E85D2C]"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className={`hidden sm:inline-flex text-[11px] font-semibold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full transition-all border ${
              isDark
                ? 'bg-white text-[#0E0E10] border-white hover:bg-[#FFD9B8]'
                : 'bg-[#0E0E10] text-white border-[#0E0E10] hover:bg-[#E85D2C] hover:border-[#E85D2C]'
            }`}
          >
            Start Project
          </Link>
          <button
            className={`md:hidden p-2 ${isDark ? 'text-white' : 'text-[#0E0E10]'}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0E0E10] border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block text-2xl font-light tracking-tight ${
                    pathname === l.href ? 'text-[#E85D2C]' : 'text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/* ============================================================
   FOOTER — premium editorial
============================================================ */
export function Footer() {
  return (
    <footer className="relative bg-[#0E0E10] text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[60vw] h-[60vw] rounded-full bg-[#FF8A3D]/5 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[clamp(36px,6vw,96px)] leading-[0.95] tracking-[-0.02em] font-light"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Let&apos;s build
              <br />
              <span className="italic text-[#FFD9B8]">something honest.</span>
            </motion.h2>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 mt-10 bg-white text-[#0E0E10] font-semibold text-xs tracking-[0.2em] uppercase px-7 py-3.5 rounded-full hover:bg-[#E85D2C] hover:text-white transition-all"
            >
              Start a project
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-3 lg:col-start-9 space-y-8">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Navigate</div>
              <ul className="space-y-2">
                {NAV_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/80 hover:text-[#E85D2C] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Studio</div>
              <div className="text-sm text-white/80 space-y-1">
                <div>Valsad, Gujarat</div>
                <div>India · 396001</div>
                <a href="mailto:hello@vayucodes.com" className="block hover:text-[#E85D2C] transition-colors">hello@vayucodes.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40">
            © 2025 vayucodes · An independent studio
          </div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 flex items-center gap-2">
            <Circle size={6} className="fill-[#E85D2C] text-[#E85D2C] animate-pulse" />
            Available · Q3 2025
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   PRELOADER
============================================================ */
export function Preloader({ progress }) {
  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-8 left-8 text-white text-sm font-extrabold tracking-tight">
        vayu<span className="text-[#E85D2C]">codes</span>
      </div>
      <div className="absolute top-8 right-8 text-[10px] tracking-[0.3em] uppercase text-white/40">
        Loading Experience
      </div>
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
            className="h-full bg-gradient-to-r from-[#E85D2C] via-white to-[#FF8A3D]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
        <div className="mt-4 text-[10px] tracking-[0.3em] uppercase text-white/40">
          Caching cinematic assets
        </div>
      </div>
      <div className="absolute bottom-8 inset-x-0 text-center text-[10px] tracking-[0.3em] uppercase text-white/30">
        A studio based in Valsad, Gujarat
      </div>
    </motion.div>
  )
}

/* ============================================================
   VIDEO INTRO — Ken Burns cinematic carousel
============================================================ */
export function VideoIntro({ onEnd }) {
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const DURATION = 6500
  const slides = [CITY_IMG_PRIMARY, CITY_IMG_SECONDARY, CITY_IMG_TERTIARY]

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % slides.length), 2200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const t = setTimeout(onEnd, DURATION)
    return () => clearTimeout(t)
  }, [onEnd])

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

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 mix-blend-overlay" style={{
        background: 'radial-gradient(ellipse at 70% 40%, rgba(232,93,44,0.35), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,138,61,0.15), transparent 50%)'
      }} />
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
      }} />

      <div className="absolute top-0 inset-x-0 flex justify-between items-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-sm font-extrabold tracking-tight"
        >
          vayu<span className="text-[#E85D2C]">codes</span>
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
            vayu<span className="italic text-[#FFD9B8]">codes</span>
          </h2>
          <div className="mt-6 text-[10px] tracking-[0.5em] uppercase text-white/60">
            We build the wind beneath your business
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 z-10">
        <div className="h-full bg-gradient-to-r from-[#E85D2C] via-white to-[#E85D2C] transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  )
}

/* ============================================================
   LANDING FLOW — only used on home; once per session
============================================================ */
export function LandingFlow({ children }) {
  const [mounted, setMounted] = useState(false)
  const [stage, setStage] = useState('home')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    const seen = sessionStorage.getItem('vc_intro_seen')
    if (!seen) setStage('loading')
  }, [])

  useEffect(() => {
    if (!mounted || stage !== 'loading') return
    let p = 0
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 10 + 3)
      setProgress(Math.round(p))
      if (p >= 100) {
        clearInterval(id)
        setTimeout(() => setStage('intro'), 600)
      }
    }, 110)
    return () => clearInterval(id)
  }, [stage, mounted])

  useEffect(() => {
    if (stage !== 'home') document.body.style.overflow = 'hidden'
    else {
      document.body.style.overflow = ''
      if (mounted) sessionStorage.setItem('vc_intro_seen', '1')
    }
    return () => { document.body.style.overflow = '' }
  }, [stage, mounted])

  if (!mounted) return <div className="fixed inset-0 bg-black" />

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === 'loading' && <Preloader key="pre" progress={progress} />}
        {stage === 'intro' && <VideoIntro key="vid" onEnd={() => setStage('home')} />}
      </AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'home' ? 1 : 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative"
      >
        {children}
      </motion.main>
    </>
  )
}

/* ============================================================
   PAGE WRAPPER — for non-home pages, with fade-in
============================================================ */
export function PageWrapper({ children, darkHero = true }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="fixed inset-0 bg-[#0E0E10]" />

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-[#F4F1EA]"
    >
      <Navbar darkHero={darkHero} />
      {children}
      <Footer />
    </motion.main>
  )
}

/* ============================================================
   PAGE HERO — reusable dark editorial hero with 3D parallax
============================================================ */
export function PageHero({ tag, title, italicWord, subtitle, accent = '#E85D2C' }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 60, damping: 20 })
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 60, damping: 20 })

  function onMove(e) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  // Split title with italic word
  const renderTitle = () => {
    if (!italicWord) return title
    const parts = title.split(italicWord)
    return (
      <>
        {parts[0]}
        <span className="italic text-[#FFD9B8]">{italicWord}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative w-full min-h-[90vh] bg-[#0E0E10] overflow-hidden flex items-end pb-20 pt-32"
    >
      {/* Ambient gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 70% 50% at 80% 60%, ${accent}50 0%, ${accent}20 25%, transparent 60%)`,
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        {/* film grain */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
        }} />
      </div>

      <motion.div
        style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective: 1500 }}
        className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-8"
          style={{ transform: 'translateZ(40px)' }}
        >
          <span className="w-10 h-px bg-white/40" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/60">{tag}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-[clamp(56px,11vw,180px)] leading-[0.92] tracking-[-0.03em] font-light max-w-[18ch]"
          style={{ fontFamily: 'var(--font-playfair)', transform: 'translateZ(60px)' }}
        >
          {renderTitle()}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="mt-8 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed"
            style={{ transform: 'translateZ(30px)' }}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}

/* ============================================================
   SECTION HEADING — consistent across pages
============================================================ */
export function SectionHeading({ tag, title, italicWord, subtitle, align = 'left' }) {
  const renderTitle = () => {
    if (!italicWord) return title
    const parts = title.split(italicWord)
    return (
      <>
        {parts[0]}
        <span className="italic text-[#E85D2C]">{italicWord}</span>
        {parts[1]}
      </>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {tag && (
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">
          {tag}
        </span>
      )}
      <h2
        className="text-[clamp(36px,6vw,80px)] leading-[1] text-[#0E0E10] tracking-[-0.02em] font-light"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="mt-6 text-zinc-600 text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

/* ============================================================
   CTA BLOCK — used at bottom of subpages
============================================================ */
export function CTABlock({ kicker = 'Ready when you are', title = 'Let&apos;s talk numbers, not jargon.', italicWord = 'numbers,' }) {
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <Tilt3DCard intensity={6} className="relative bg-[#0E0E10] rounded-[32px] p-12 lg:p-20 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[50vw] h-[50vw] rounded-full bg-[#FF8A3D]/10 blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8" style={{ transform: 'translateZ(40px)' }}>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#E85D2C] mb-6">
                · {kicker}
              </div>
              <h3 className="text-white text-[clamp(40px,5.5vw,80px)] leading-[1] tracking-[-0.02em] font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                {italicWord ? (
                  <>
                    {title.split(italicWord)[0]}
                    <span className="italic text-[#FFD9B8]">{italicWord}</span>
                    {title.split(italicWord)[1]}
                  </>
                ) : title}
              </h3>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end" style={{ transform: 'translateZ(60px)' }}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-white text-[#0E0E10] font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#E85D2C] hover:text-white transition-all"
              >
                Book a call
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </Tilt3DCard>
      </div>
    </section>
  )
}
