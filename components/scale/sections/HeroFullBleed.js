'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'

/**
 * VayuCodes hero — pure monochrome, editorial, human-crafted feel.
 *
 * Composition (no color accents):
 *   • Deep ink background with soft white nebula blobs (very low opacity)
 *   • Cursor-tracked soft white glow orb
 *   • Faint dot-grid + noise
 *   • Whole content block gets subtle mouse-parallax 3D tilt
 *   • Rotating headline: word-by-word rotateX reveal
 *   • Cycling word swap on the accent noun
 *   • 4 glass service pills floating in 3D positions with independent idle rotation + float
 *   • Bottom marquee ticker
 *   • Modern scroll indicator (bottom-right)
 */

const HEADLINE_ACCENT_WORDS = ['systems.', 'products.', 'platforms.', 'experiences.']

const PILLS = [
  { n: '01', label: 'Design',          pos: 'top-[14%] left-[6%]',    delay: 0.0,  floatY: 12, rotDur: 22 },
  { n: '02', label: 'Engineering',     pos: 'top-[20%] right-[7%]',   delay: 0.15, floatY: 10, rotDur: 28 },
  { n: '03', label: 'AI & Automation', pos: 'bottom-[22%] left-[8%]', delay: 0.30, floatY: 14, rotDur: 32 },
  { n: '04', label: 'Growth',          pos: 'bottom-[18%] right-[9%]',delay: 0.45, floatY: 11, rotDur: 26 },
]

export default function HeroFullBleed() {
  const rootRef = useRef(null)
  const [accentIdx, setAccentIdx] = useState(0)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 20 })

  const tiltX = useTransform(smoothY, [0, 1], [4, -4])
  const tiltY = useTransform(smoothX, [0, 1], [-4, 4])
  const orbLeft = useTransform(smoothX, v => `${v * 100}%`)
  const orbTop = useTransform(smoothY, v => `${v * 100}%`)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      mouseX.set((e.clientX - r.left) / r.width)
      mouseY.set((e.clientY - r.top) / r.height)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    const id = setInterval(() => setAccentIdx(i => (i + 1) % HEADLINE_ACCENT_WORDS.length), 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative w-full min-h-screen h-screen min-h-[720px] overflow-hidden bg-vc-ink text-pure-white"
    >
      {/* --- Soft monochrome nebula blobs --- */}
      <motion.div
        className="pointer-events-none absolute rounded-full blur-[110px] opacity-[0.10]"
        style={{ width: '60vw', height: '60vw', background: 'radial-gradient(circle, #ffffff 0%, transparent 60%)', left: '-15%', top: '-20%' }}
        animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0], scale: [1, 1.1, 0.98, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute rounded-full blur-[120px] opacity-[0.08]"
        style={{ width: '65vw', height: '65vw', background: 'radial-gradient(circle, #ffffff 0%, transparent 60%)', right: '-20%', bottom: '-20%' }}
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* --- Cursor-tracked soft glow orb --- */}
      <motion.div
        className="pointer-events-none absolute w-[560px] h-[560px] rounded-full blur-[100px] opacity-[0.10]"
        style={{
          left: orbLeft, top: orbTop, translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 45%, transparent 70%)',
        }}
      />

      {/* --- Grid overlay --- */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* --- Film grain --- */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        }}
      />

      {/* --- Floating service pills (monochrome glass) --- */}
      {PILLS.map((p) => (
        <motion.div
          key={p.n}
          className={`hidden md:flex absolute ${p.pos} items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-md z-10`}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 + p.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06, y: -4 }}
        >
          <motion.div
            className="flex items-center gap-3"
            animate={{ y: [0, -p.floatY, 0], rotate: [0, 2, -2, 0] }}
            transition={{ y: { duration: 6 + p.delay * 2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: p.rotDur, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="eyebrow text-pure-white/45">{p.n}</span>
            <span className="text-[13px] font-medium text-pure-white tracking-wide">{p.label}</span>
          </motion.div>
        </motion.div>
      ))}

      {/* --- Content stack (mouse-tilt 3D parallax) --- */}
      <div className="relative z-20 h-full w-full flex flex-col items-center justify-center px-6 text-center" style={{ perspective: 1600 }}>
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
          className="max-w-[1180px]"
        >
          {/* Kicker — minimal, no icon color */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur"
            style={{ transform: 'translateZ(60px)' }}
          >
            <span className="w-1 h-1 rounded-full bg-white/60" />
            <span className="eyebrow text-pure-white/70">An independent studio · Available Q3 2026</span>
            <span className="w-1 h-1 rounded-full bg-white/60" />
          </motion.div>

          {/* Headline — word-by-word 3D flip reveal */}
          <h1
            className="text-pure-white leading-[1.02] max-w-[1180px] mx-auto"
            style={{
              fontFamily: 'var(--font-instrument)',
              fontWeight: 400,
              fontSize: 'clamp(38px, 6.4vw, 96px)',
              letterSpacing: '-0.015em',
              transform: 'translateZ(80px)',
            }}
          >
            <WordFlip words={['We', 'design,', 'engineer', '&', 'scale']} delay={0.55} />
            <span className="italic text-pure-white/70 block mt-1">
              digital&nbsp;
              <AccentSwap words={HEADLINE_ACCENT_WORDS} index={accentIdx} />
            </span>
          </h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.9 }}
            className="mt-8 max-w-[640px] mx-auto text-pure-white/55 text-body"
            style={{ transform: 'translateZ(40px)' }}
          >
            An independent studio combining design, engineering, AI and automation into digital systems your business can rely on.
          </motion.p>

          {/* CTAs — pure black & white */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.75, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ transform: 'translateZ(50px)' }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-pure-white text-vc-ink eyebrow px-7 py-4 rounded-full font-medium hover:bg-pure-white/90 transition-colors"
            >
              Start a project
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/our-work"
              className="inline-flex items-center gap-3 bg-transparent text-pure-white eyebrow px-7 py-4 rounded-full border border-white/25 hover:bg-white/10 transition-colors backdrop-blur"
            >
              See our work
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* --- Marquee ticker (bottom) --- */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/40 backdrop-blur-sm py-4 overflow-hidden z-10">
        <Marquee items={[
          'AVAILABLE Q3 2026',
          'VALSAD · GUJARAT',
          'SHIPPING WORLDWIDE',
          'DESIGN · ENGINEERING · AI · AUTOMATION · GROWTH',
          'HELLO@VAYUCODES.COM',
        ]} />
      </div>

      {/* --- Scroll indicator --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
        className="hidden md:flex absolute bottom-16 right-8 items-center gap-3 z-10"
      >
        <span className="eyebrow text-pure-white/50">Scroll</span>
        <motion.div
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} className="text-pure-white" strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ---------------------- Reusable pieces ---------------------- */

function WordFlip({ words, delay = 0 }) {
  return (
    <span className="block">
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.24em' }}>
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotateX: -60, opacity: 0 }}
            animate={{ y: '0%', rotateX: 0, opacity: 1 }}
            transition={{ delay: delay + i * 0.1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '50% 100%', transformStyle: 'preserve-3d' }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function AccentSwap({ words, index }) {
  return (
    <span className="relative inline-block align-baseline" style={{ minWidth: '5.5ch' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-pure-white"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Marquee({ items }) {
  const list = [...items, ...items, ...items]
  return (
    <div className="whitespace-nowrap">
      <motion.div
        className="inline-flex gap-10 items-center"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {list.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10 eyebrow text-pure-white/55">
            {item}
            <span className="inline-block w-1 h-1 rounded-full bg-white/40" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
