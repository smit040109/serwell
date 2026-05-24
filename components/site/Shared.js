'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight, Menu, X, MapPin, Mail, Phone, CheckCircle2, Circle, Sparkles, Volume2
} from 'lucide-react'

/* ============================================================
   VIDEO COLOR CONTEXT \u2014 propagate sampled color from intro to hero
============================================================ */
export const VideoColorContext = createContext(null)
export function useVideoColor() { return useContext(VideoColorContext) }

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
   CINEMATIC VIDEO INTRO \u2014 iPhone 15 Pro Max footage + typewriter + sound
============================================================ */
export const CINEMATIC_VIDEO_URL = '/video/intro.mp4'
export const CINEMATIC_VIDEO_POSTER = '/video/intro-poster.jpg'

// Typing-sound: synthesized via Web Audio API for crisp mechanical clicks
function useTypingSound() {
  const ctxRef = useRef(null)
  const readyRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    ctxRef.current = ctx

    const resume = () => {
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => { readyRef.current = true }).catch(() => {})
      } else {
        readyRef.current = true
      }
    }
    // Try immediately
    resume()
    // Also bind to first interaction
    const events = ['click', 'touchstart', 'keydown', 'pointerdown', 'mousemove']
    events.forEach(e => document.addEventListener(e, resume, { once: true, passive: true }))

    return () => {
      events.forEach(e => document.removeEventListener(e, resume))
      ctx.close().catch(() => {})
    }
  }, [])

  return useCallback((isSpace = false) => {
    const ctx = ctxRef.current
    if (!ctx || ctx.state !== 'running') return
    try {
      const t = ctx.currentTime
      // OSC layer \u2014 main click pitch
      const osc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()
      osc.type = 'square'
      const baseFreq = isSpace ? 320 : 1100 + Math.random() * 700
      osc.frequency.setValueAtTime(baseFreq, t)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, t + 0.04)
      filter.type = 'bandpass'
      filter.frequency.value = isSpace ? 600 : 2400
      filter.Q.value = 6
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.09, t + 0.002)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
      osc.start(t); osc.stop(t + 0.06)

      // Noise burst layer \u2014 mechanical attack
      const bufferSize = 0.02 * ctx.sampleRate
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4))
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.value = 1800
      const noiseGain = ctx.createGain()
      noiseGain.gain.value = 0.05
      noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ctx.destination)
      noise.start(t)
      noise.stop(t + 0.02)
    } catch (e) { /* silently fail */ }
  }, [])
}

// Typewriter hook with variable timing
function useTypewriter(text, { speed = 180, startDelay = 1200, jitter = 80, onChar = () => {} } = {}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let cancelled = false
    let i = 0
    const tick = () => {
      if (cancelled) return
      if (i < text.length) {
        const ch = text[i]
        setDisplayed(text.slice(0, i + 1))
        onChar(ch)
        i++
        const next = speed + (Math.random() - 0.5) * jitter
        setTimeout(tick, next)
      } else {
        setDone(true)
      }
    }
    const start = setTimeout(tick, startDelay)
    return () => { cancelled = true; clearTimeout(start) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  return { displayed, done }
}

export function VideoIntro({ onEnd, onColor }) {
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const [soundHint, setSoundHint] = useState(true)
  const playClick = useTypingSound()
  const TARGET = 'vayucodes'
  const { displayed, done } = useTypewriter(TARGET, {
    speed: 180,
    startDelay: 1400,
    jitter: 90,
    onChar: () => playClick(),
  })

  // Color sampling from video frames
  const sampledRef = useRef(false)
  const sampleColor = useCallback(() => {
    const v = videoRef.current
    if (!v || sampledRef.current) return
    try {
      const cw = 32, ch = 18
      const canvas = document.createElement('canvas')
      canvas.width = cw; canvas.height = ch
      const cx = canvas.getContext('2d')
      cx.drawImage(v, 0, 0, cw, ch)
      const data = cx.getImageData(0, 0, cw, ch).data
      let r = 0, g = 0, b = 0, count = 0
      // Find vibrant non-dark pixels
      for (let i = 0; i < data.length; i += 4) {
        const lum = (data[i] + data[i+1] + data[i+2]) / 3
        if (lum < 25 || lum > 240) continue
        r += data[i]; g += data[i+1]; b += data[i+2]; count++
      }
      if (count > 50) {
        const color = { r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) }
        // Boost saturation a bit for hero gradient
        sampledRef.current = true
        onColor?.(color)
        try { sessionStorage.setItem('vc_video_color', JSON.stringify(color)) } catch {}
      }
    } catch (e) { /* CORS or other \u2014 silently fall back */ }
  }, [onColor])

  // Auto-end after duration OR onEnded fires
  useEffect(() => {
    const DURATION = 8500
    const id = setTimeout(() => { sampleColor(); onEnd() }, DURATION)
    return () => clearTimeout(id)
  }, [onEnd, sampleColor])

  // Progress bar
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / 8500) * 100)
      setProgress(p)
      if (p >= 100) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [])

  // Sample color periodically while playing
  useEffect(() => {
    const id = setInterval(sampleColor, 1500)
    return () => clearInterval(id)
  }, [sampleColor])

  // Hide sound hint after any interaction or 3s
  useEffect(() => {
    const hide = () => setSoundHint(false)
    const t = setTimeout(hide, 4500)
    document.addEventListener('click', hide, { once: true })
    document.addEventListener('touchstart', hide, { once: true })
    return () => { clearTimeout(t); document.removeEventListener('click', hide); document.removeEventListener('touchstart', hide) }
  }, [])

  return (
    <motion.div
      key="videointro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.0, ease: 'easeInOut' } }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[90] bg-black overflow-hidden"
    >
      {/* THE CINEMATIC VIDEO \u2014 same-origin H.264 for universal playback */}
      <video
        ref={videoRef}
        src={CINEMATIC_VIDEO_URL}
        poster={CINEMATIC_VIDEO_POSTER}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Soft cinematic fallback \u2014 visible until first video frame */}
      {!videoReady && (
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 8, ease: 'linear' }}
          className="absolute inset-0 z-0"
        >
          <img src={CINEMATIC_VIDEO_POSTER} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
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
          vayu<span className="text-[#E85D2C]">codes</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[10px] tracking-[0.3em] uppercase text-white/70 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2C] animate-pulse" />
          {'Cinematic Intro · 2025'}
        </motion.div>
      </div>

      {/* TYPEWRITER CENTER */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-[10px] tracking-[0.5em] uppercase text-white/70 mb-6"
          >
            {'— An independent studio —'}
          </motion.div>

          <h2
            className="text-white text-[clamp(64px,12vw,200px)] font-light tracking-[-0.03em] leading-none inline-flex items-baseline"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.4))' }}>
              {displayed.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className={i >= 4 ? 'italic text-[#FFD9B8]' : ''}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
            {/* Blinking caret */}
            <motion.span
              animate={{ opacity: done ? [1, 0, 1] : 1 }}
              transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-[0.06em] h-[0.85em] ml-[0.04em] bg-[#FFD9B8]"
              style={{ transform: 'translateY(0.05em)' }}
            />
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 10 }}
            transition={{ duration: 0.8, delay: done ? 0.4 : 0 }}
            className="mt-8 text-[10px] tracking-[0.5em] uppercase text-white/70"
          >
            {'Valsad, Gujarat · Worldwide'}
          </motion.div>
        </motion.div>
      </div>

      {/* SOUND HINT (subtle, auto-hides) */}
      <AnimatePresence>
        {soundHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-12 left-8 flex items-center gap-3 backdrop-blur-md bg-white/8 border border-white/15 rounded-full px-4 py-2 z-20"
          >
            <Volume2 size={12} className="text-white/70" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/70">Tap for sound</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM PROGRESS LINE */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 z-10">
        <div className="h-full bg-gradient-to-r from-[#E85D2C] via-white to-[#FFD9B8] transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  )
}

/* ============================================================
   LANDING FLOW \u2014 cinematic intro + color context
============================================================ */
export function LandingFlow({ children }) {
  const [mounted, setMounted] = useState(false)
  const [stage, setStage] = useState('home')
  const [progress, setProgress] = useState(0)
  const [videoColor, setVideoColor] = useState(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    // Try to restore previously sampled color
    try {
      const saved = sessionStorage.getItem('vc_video_color')
      if (saved) setVideoColor(JSON.parse(saved))
    } catch {}
    const seen = sessionStorage.getItem('vc_intro_seen')
    if (!seen) setStage('loading')
  }, [])

  useEffect(() => {
    if (!mounted || stage !== 'loading') return
    let p = 0
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 12 + 4)
      setProgress(Math.round(p))
      if (p >= 100) {
        clearInterval(id)
        setTimeout(() => setStage('intro'), 600)
      }
    }, 100)
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
    <VideoColorContext.Provider value={videoColor}>
      <AnimatePresence mode="wait">
        {stage === 'loading' && <Preloader key="pre" progress={progress} />}
        {stage === 'intro' && (
          <VideoIntro
            key="vid"
            onColor={(c) => setVideoColor(c)}
            onEnd={() => setStage('home')}
          />
        )}
      </AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'home' ? 1 : 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="relative"
      >
        {children}
      </motion.main>
    </VideoColorContext.Provider>
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
