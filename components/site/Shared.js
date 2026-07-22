'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight, Menu, X, MapPin, Mail, Phone, CheckCircle2, Circle, Sparkles, Volume2, VolumeX
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
  ink: '#0A0A0A',
  bone: '#FAFAF7',
  ember: '#0A0A0A',
  amber: '#171717',
  cream: '#E7E5E1',
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
  { href: '/our-work', label: 'Our Work' },
  { href: '/digital-marketing', label: 'Marketing' },
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
   RESPONSIVE HELPER — detect mobile viewport for reduced 3D intensity
============================================================ */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
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
   WORDMARK — VayuCodes logo image
============================================================ */
export function Wordmark({ className = '', light = false }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="VayuCodes home">
      <img
        src="/brand/logo-lockup.png"
        alt="VayuCodes"
        className={`h-7 md:h-8 w-auto select-none ${light ? 'invert brightness-200' : ''}`}
        style={{ filter: light ? 'invert(1) brightness(2)' : 'none' }}
        draggable={false}
      />
    </Link>
  )
}

/* ============================================================
   NAVBAR — adaptive, route-aware
============================================================ */
export function Navbar({ darkHero = false }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Lock body scroll while mobile menu is open (prevents underlying content from showing through)
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="fixed top-0 inset-x-0 z-40 bg-transparent"
      // Disable difference blend when the mobile menu is open — otherwise the
      // menu text mixes with the underlying page and appears "overlapping".
      style={{ mixBlendMode: open ? 'normal' : 'difference' }}
    >
      <div className={`max-w-[1500px] mx-auto flex justify-between items-center py-5 px-6 lg:px-10 ${open ? 'bg-[#0A0A0A]' : ''}`}>
        <Wordmark light={true} />

        <nav className="hidden md:flex items-center space-x-8 text-[11px] font-medium tracking-[0.18em] uppercase text-white/70">
          {NAV_LINKS.filter(l => l.href !== '/').slice(0, 5).map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative transition-colors ${active ? 'text-white' : 'hover:text-white'}`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-white"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:inline-flex text-[11px] font-semibold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full transition-all border bg-white text-[#111111] border-white hover:bg-[#E5E5E5]"
          >
            Start Project
          </Link>
          <button
            className="md:hidden p-2 text-white"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden fixed inset-x-0 top-[64px] bottom-0 bg-[#0A0A0A] overflow-y-auto"
            style={{ isolation: 'isolate' }}
          >
            <div className="px-6 py-10 space-y-2 flex flex-col">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 border-b border-white/8 text-3xl tracking-tight ${
                      pathname === l.href ? 'text-white/50' : 'text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-8 mt-4">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#0A0A0A] text-xs font-semibold tracking-[0.2em] uppercase px-6 py-4 rounded-full active:scale-[0.98] transition-all"
                >
                  Start Project
                  <ArrowRight size={14} />
                </Link>
                <div className="mt-6 text-[10px] tracking-[0.3em] uppercase text-white/40 text-center">
                  Studio · India · Worldwide
                </div>
              </div>
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
    <footer className="relative bg-[#111111] text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[60vw] h-[60vw] rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3 lg:col-start-9 space-y-8">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Navigate</div>
              <ul className="space-y-2">
                {NAV_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/80 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Studio</div>
              <div className="text-sm text-white/80 space-y-1">
                <div>India · Worldwide</div>
                <a href="mailto:hello@vayucodes.com" className="block hover:text-white transition-colors">hello@vayucodes.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 text-center md:text-left">
            © {new Date().getFullYear()} VayuCodes · All rights reserved
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] tracking-[0.25em] uppercase text-white/60">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:hello@vayucodes.com" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 flex items-center gap-2">
            <Circle size={6} className="fill-white/60 text-white/60 animate-pulse" />
            Available · Q3 2026
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   PRELOADER \u2014 Editorial wordmark reveal (no numbers, top 0.1% agency feel)
============================================================ */
const LOADER_STATES = ['Designing', 'Compiling', 'Rendering', 'Almost there']

export function Preloader({ progress }) {
  const WORD = 'vayucodes'
  const letters = WORD.split('')

  // Cycle through status words
  const statusIdx = Math.min(LOADER_STATES.length - 1, Math.floor(progress / (100 / LOADER_STATES.length)))
  const status = LOADER_STATES[statusIdx]

  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] }
      }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
      }} />
      {/* Subtle radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)'
      }} />

      {/* CENTER: Editorial reveal */}
      <div className="relative flex flex-col items-center px-6">
        {/* Tiny status label that cycles */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-8"
          >
            {status + '…'}
          </motion.div>
        </AnimatePresence>

        {/* The logo — cinematic reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          <img
            src="/brand/logo-full.png"
            alt="VayuCodes"
            className="w-[min(340px,72vw)] h-auto select-none"
            style={{ filter: 'invert(1) brightness(2)' }}
            draggable={false}
          />
          {/* Subtle bloom behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.18] }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(232,93,44,0.35), transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
        </motion.div>

        {/* Thin animated underline (sole progress indicator, no numbers) */}
        <div className="mt-10 w-[min(420px,80vw)] h-px bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white to-white"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
          />
        </div>
      </div>

      {/* BOTTOM CREDIT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 inset-x-0 text-center text-[10px] tracking-[0.4em] uppercase text-white/30"
      >
        {'A studio worldwide \u00b7 Shipping globally'}
      </motion.div>
    </motion.div>
  )
}

/* ============================================================
   CINEMATIC VIDEO INTRO \u2014 iPhone 15 Pro Max footage + typewriter + sound
============================================================ */
export const CINEMATIC_VIDEO_URL = '/video/intro.mp4?v=4'
export const CINEMATIC_VIDEO_POSTER = '/video/intro-poster.jpg?v=4'

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
      // Layer 1 \u2014 ABS keycap clack: short filtered noise transient (the sharp top strike)
      const clackDur = 0.018
      const clackBuffer = ctx.createBuffer(1, clackDur * ctx.sampleRate, ctx.sampleRate)
      const clackData = clackBuffer.getChannelData(0)
      for (let i = 0; i < clackData.length; i++) {
        clackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clackData.length * 0.22))
      }
      const clackSrc = ctx.createBufferSource()
      clackSrc.buffer = clackBuffer
      const clackFilter = ctx.createBiquadFilter()
      clackFilter.type = 'bandpass'
      clackFilter.frequency.value = isSpace ? 1900 : 3100 + Math.random() * 500
      clackFilter.Q.value = 1.4
      const clackGain = ctx.createGain()
      clackGain.gain.setValueAtTime(isSpace ? 0.05 : 0.065, t)
      clackGain.gain.exponentialRampToValueAtTime(0.0001, t + clackDur)
      clackSrc.connect(clackFilter); clackFilter.connect(clackGain); clackGain.connect(ctx.destination)
      clackSrc.start(t)

      // Layer 2 \u2014 switch bottom-out: brief low body resonance (linear MX Red thock, no click bump)
      const bodyOsc = ctx.createOscillator()
      const bodyGain = ctx.createGain()
      bodyOsc.type = 'triangle'
      const bodyFreq = isSpace ? 150 : 210 + Math.random() * 60
      bodyOsc.frequency.setValueAtTime(bodyFreq, t)
      bodyOsc.frequency.exponentialRampToValueAtTime(bodyFreq * 0.7, t + 0.03)
      bodyOsc.connect(bodyGain); bodyGain.connect(ctx.destination)
      bodyGain.gain.setValueAtTime(0, t)
      bodyGain.gain.linearRampToValueAtTime(isSpace ? 0.04 : 0.028, t + 0.003)
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
      bodyOsc.start(t + 0.002); bodyOsc.stop(t + 0.05)
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

// Cinematic welcome text — fade-in kicker/subtitle + typewriter main line with sound
function CinematicWelcomeText() {
  const { displayed, done } = useTypewriter('Welcome to the VayuCodes World', {
    speed: 110,
    startDelay: 900,
    jitter: 20,
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(14px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-[10px] tracking-[0.5em] uppercase text-white/60 mb-8"
      >
        {'— An independent studio —'}
      </motion.div>

      <h1
        className="text-white leading-[1.05] tracking-[-0.01em] min-h-[1.2em]"
        style={{
          fontFamily: 'var(--font-instrument)',
          fontWeight: 400,
          fontSize: 'clamp(30px,5vw,64px)',
        }}
      >
        {displayed}
        <motion.span
          animate={{ opacity: done ? 0 : [1, 0] }}
          transition={{ duration: 0.6, repeat: done ? 0 : Infinity }}
          className="inline-block w-[3px] h-[0.9em] bg-white ml-1 align-middle"
        />
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 10 }}
        transition={{ duration: 0.8 }}
        className="mt-8 text-[10px] tracking-[0.5em] uppercase text-white/70"
      >
        {'India · Worldwide'}
      </motion.div>
    </motion.div>
  )
}

export function VideoIntro({ onEnd, onColor }) {
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [videoReady, setVideoReady] = useState(false)

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

  // Force-play on mount — some browsers pause muted autoplay if tab regains
  // focus mid-load or if there's any hiccup. Retry a few times to be robust.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let cancelled = false
    const tryPlay = () => {
      if (cancelled) return
      const pr = v.play()
      if (pr && typeof pr.catch === 'function') {
        pr.catch(() => {
          // Retry once shortly after
          setTimeout(() => { if (!cancelled) v.play().catch(() => {}) }, 400)
        })
      }
    }
    tryPlay()
    v.addEventListener('canplay', tryPlay)
    v.addEventListener('loadeddata', tryPlay)
    return () => {
      cancelled = true
      v.removeEventListener('canplay', tryPlay)
      v.removeEventListener('loadeddata', tryPlay)
    }
  }, [])

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

      {/* TOP BAR — minimal logo only, top-left, premium */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute top-8 left-8 z-10"
      >
        <img
          src="/brand/logo-lockup.png"
          alt="VayuCodes"
          className="h-14 md:h-16 w-auto select-none"
          style={{ filter: 'invert(1) brightness(2)' }}
          draggable={false}
        />
      </motion.div>

      {/* CINEMATIC WELCOME TEXT — center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-6">
        <CinematicWelcomeText />
      </div>

      {/* BOTTOM PROGRESS LINE */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 z-10">
        <div className="h-full bg-gradient-to-r from-white via-white to-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  )
}

/* ============================================================
   LANDING FLOW \u2014 cinematic intro + color context
============================================================ */
function EnterGate({ onEnter }) {
  return (
    <motion.div
      key="entergate"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={onEnter}
    >
      <motion.img
        src="/brand/logo-lockup.png"
        alt="VayuCodes"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="h-16 md:h-20 w-auto select-none mb-16"
        style={{ filter: 'invert(1) brightness(2) drop-shadow(0 2px 12px rgba(0,0,0,0.4))' }}
        draggable={false}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-6"
      >
        <div className="relative w-24 h-24 rounded-full border border-white/25 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-white/40"
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/90">Enter</span>
        </div>
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/40">Tap anywhere</span>
      </motion.div>
    </motion.div>
  )
}

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
    const seen = sessionStorage.getItem('vc_intro_seen_v4')
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
      if (mounted) sessionStorage.setItem('vc_intro_seen_v4', '1')
    }
    return () => { document.body.style.overflow = '' }
  }, [stage, mounted])

  if (!mounted) return <div className="fixed inset-0 bg-black" />

  return (
    <VideoColorContext.Provider value={videoColor}>
      <CustomCursor />
      <GrainOverlay />
      <AnimatePresence mode="wait">
        {stage === 'gate' && <EnterGate key="gate" onEnter={() => setStage('loading')} />}
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

  if (!mounted) return <div className="fixed inset-0 bg-[#111111]" />

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-[#F7F6F3]"
    >
      <CustomCursor />
      <GrainOverlay />
      <Navbar darkHero={darkHero} />
      {children}
      <Footer />
    </motion.main>
  )
}

/* ============================================================
   PAGE HERO — reusable dark editorial hero with 3D parallax
============================================================ */
export function PageHero({ tag, title, italicWord, subtitle, accent = '#8A8A8A' }) {
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
        <span className="italic text-white/70">{italicWord}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative w-full min-h-[90vh] bg-[#111111] overflow-hidden flex items-end pb-20 pt-32"
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
          className="text-white leading-[1.0] tracking-[-0.01em] max-w-[20ch]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(40px,5.5vw,84px)', transform: 'translateZ(60px)' }}
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
        <span className="italic text-[#111111]/60">{italicWord}</span>
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
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#111111]/50 uppercase mb-4 inline-block">
          {tag}
        </span>
      )}
      <h2
        className="text-[#111111] leading-[1.02] tracking-[-0.01em]"
        style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.5vw,60px)' }}
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
    <section className="relative bg-[#F7F6F3] py-28 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <Tilt3DCard intensity={6} className="relative bg-[#111111] rounded-[32px] p-12 lg:p-20 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[60vw] h-[60vw] rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[50vw] h-[50vw] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8" style={{ transform: 'translateZ(40px)' }}>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6">
                · {kicker}
              </div>
              <h3 className="text-white leading-[1.02] tracking-[-0.01em]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.5vw,64px)' }}>
                {italicWord ? (
                  <>
                    {title.split(italicWord)[0]}
                    <span className="italic text-white/70">{italicWord}</span>
                    {title.split(italicWord)[1]}
                  </>
                ) : title}
              </h3>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end" style={{ transform: 'translateZ(60px)' }}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-white text-[#111111] font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#E5E5E5] transition-all"
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

/* ============================================================
   CUSTOM CURSOR — dot + trailing ring, mix-blend-difference
============================================================ */
export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hoverState, setHoverState] = useState('default')
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30 })
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return // skip on touch
    setVisible(true)
    const move = (e) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      const el = e.target.closest('a, button, [data-cursor]')
      if (el) setHoverState(el.getAttribute('data-cursor') || 'link')
      else setHoverState('default')
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [dotX, dotY])

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] hidden md:block" style={{ mixBlendMode: 'difference' }}>
      <motion.div
        style={{ left: dotX, top: dotY, translateX: '-50%', translateY: '-50%' }}
        className="fixed w-2 h-2 rounded-full bg-white"
      />
      <motion.div
        style={{ left: ringX, top: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hoverState === 'view' ? 90 : hoverState !== 'default' ? 56 : 32,
          height: hoverState === 'view' ? 90 : hoverState !== 'default' ? 56 : 32,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="fixed rounded-full border border-white flex items-center justify-center"
      >
        {hoverState === 'view' && (
          <span className="text-[9px] tracking-[0.15em] uppercase text-white font-semibold">View</span>
        )}
      </motion.div>
    </div>
  )
}

/* ============================================================
   FILM GRAIN — global subtle texture overlay
============================================================ */
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[150] opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

/* ============================================================
   MAGNETIC BUTTON — pulls toward cursor within radius
============================================================ */
export function Magnetic({ children, className = '', strength = 0.35 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 })

  function onMove(e) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const cx = e.clientX - (r.left + r.width / 2)
    const cy = e.clientY - (r.top + r.height / 2)
    x.set(cx * strength)
    y.set(cy * strength)
  }
  function onLeave() { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
