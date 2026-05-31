'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Sparkles, Target, Cpu, Code2, Globe2 } from 'lucide-react'

/* ============================================================
   MARKETING CAPABILITIES — Scroll-driven, NOT click-based
   - Outer container 500vh tall
   - Inside, sticky 100vh viewport with split layout
   - Each capability transitions IN as user scrolls
   - Cinematic blur/desaturate/zoom between sections
============================================================ */

const GOLD = '#D4AF37'

const SECTIONS = [
  {
    no: '01',
    icon: Sparkles,
    label: 'Reels & Shorts',
    title: 'Stop-the-thumb creative.',
    desc: 'Scroll-stopping short-form content designed to capture attention and generate engagement. We engineer hooks, frame rhythms, and platform-native edits that get watched, saved, and shared.',
    videoSrc: '/videos/p1.mp4',
    metric: '40+ variants / week',
  },
  {
    no: '02',
    icon: Target,
    label: 'Performance Marketing',
    title: 'Turn clicks into customers.',
    desc: 'Data-driven advertising focused on leads, conversions and measurable business growth. We test 40 variants a week, kill losers fast, and scale winners harder across Meta and Google.',
    videoSrc: '/videos/p2.mp4',
    metric: '3.8 ROAS · blended',
  },
  {
    no: '03',
    icon: Cpu,
    label: 'AI Automation',
    title: 'Work less. Scale faster.',
    desc: 'Automate repetitive tasks and build workflows that run 24/7. From WhatsApp routing to invoice generation to lead enrichment — your operations on autopilot.',
    videoSrc: '/videos/p3.mp4',
    metric: '24×7 · automated',
  },
  {
    no: '04',
    icon: Code2,
    label: 'Custom Software',
    title: 'Built around your business.',
    desc: 'Custom software solutions designed specifically for your workflows. ERPs, internal tools, multi-outlet dashboards — engineered for your edge cases, not someone else\u2019s template.',
    videoSrc: '/videos/p4.mp4',
    metric: '50+ shipped',
  },
  {
    no: '05',
    icon: Globe2,
    label: 'Website Development',
    title: 'Your digital first impression.',
    desc: 'Fast, modern and conversion-focused websites built to grow your business. Built on Next.js, optimized for Core Web Vitals, instrumented for revenue from day one.',
    videoSrc: '/videos/p5.mp4',
    metric: '< 1.2s LCP',
  },
]

function CapabilityPanel({ section, isActive, prev }) {
  const Icon = section.icon
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : prev ? 0.96 : 1.04,
        filter: isActive ? 'blur(0px)' : 'blur(8px)',
      }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center"
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full items-center px-6 lg:px-10">
        {/* TEXT */}
        <div className="lg:col-span-6 max-w-xl">
          {/* Number */}
          <motion.div
            initial={false}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: isActive ? 0.05 : 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span
              className="text-[11px] tracking-[0.35em] tabular-nums"
              style={{ color: GOLD, fontFamily: 'var(--font-inter)', fontWeight: 600 }}
            >
              {section.no}
            </span>
            <span className="block w-10 h-px" style={{ background: GOLD, opacity: 0.4 }} />
            <Icon size={14} style={{ color: GOLD, opacity: 0.7 }} />
            <span
              className="text-[10px] tracking-[0.3em] uppercase text-white/55"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            >
              {section.label}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={false}
            animate={isActive ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 36, filter: 'blur(6px)' }}
            transition={{ duration: 0.9, delay: isActive ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="text-white leading-[1.02] tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(34px,4.5vw,68px)' }}
          >
            {section.title.split(' ').map((word, i) => {
              const isLast = i === section.title.split(' ').length - 1
              return (
                <motion.span
                  key={i}
                  initial={false}
                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: isActive ? 0.2 + i * 0.05 : 0 }}
                  className={isLast ? 'italic' : ''}
                  style={isLast ? { color: GOLD } : {}}
                >
                  {word}{i < section.title.split(' ').length - 1 ? ' ' : ''}
                </motion.span>
              )
            })}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={false}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: isActive ? 0.4 : 0 }}
            className="mt-7 text-white/65 max-w-md"
            style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: 'clamp(13px,1vw,15px)', lineHeight: 1.75 }}
          >
            {section.desc}
          </motion.p>

          {/* Metric chip */}
          <motion.div
            initial={false}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: isActive ? 0.55 : 0 }}
            className="mt-8 inline-flex items-center gap-2.5 backdrop-blur-md border rounded-full px-4 py-2"
            style={{ borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            <span
              className="text-[10px] tracking-[0.25em] uppercase font-medium"
              style={{ color: GOLD, fontFamily: 'var(--font-inter)' }}
            >
              {section.metric}
            </span>
          </motion.div>
        </div>

        {/* MEDIA — video panel */}
        <div className="lg:col-span-6">
          <motion.div
            initial={false}
            animate={isActive ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0.15, scale: 0.97, filter: 'blur(12px) saturate(0.4)' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
          >
            <video
              src={section.videoSrc}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/10 pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-white/10 rounded-3xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MarketingCapabilities() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const [activeIdx, setActiveIdx] = useState(0)

  // Update active section based on scroll progress
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(SECTIONS.length - 1, Math.floor(v * SECTIONS.length))
      setActiveIdx(idx)
    })
  }, [scrollYProgress])

  // Progress bar
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={containerRef}
      className="relative bg-[#080808]"
      style={{ height: `${SECTIONS.length * 100}vh` }}
    >
      {/* Ambient gold radial */}
      <div className="pointer-events-none absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(212,175,55,0.10), transparent 60%)',
        filter: 'blur(60px)',
      }} />

      {/* STICKY VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="max-w-[1500px] mx-auto h-full relative pt-24">
          {/* Header */}
          <div className="absolute top-24 left-6 lg:left-10 right-6 lg:right-10 flex flex-wrap items-end justify-between gap-4 z-20 pointer-events-none">
            <div>
              <div
                className="text-[10px] tracking-[0.4em] uppercase mb-2"
                style={{ color: GOLD, fontFamily: 'var(--font-inter)', fontWeight: 500 }}
              >
                · Capabilities · Marketing OS
              </div>
              <div
                className="text-white tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(20px,2vw,30px)' }}
              >
                Five engines. <span className="italic" style={{ color: GOLD }}>One growth system.</span>
              </div>
            </div>
            <div
              className="text-[10px] tracking-[0.3em] uppercase text-white/40 tabular-nums"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            >
              {String(activeIdx + 1).padStart(2, '0')} <span className="opacity-50">/ {String(SECTIONS.length).padStart(2, '0')}</span> · scroll
            </div>
          </div>

          {/* Panels stack */}
          <div className="absolute inset-0 pt-20 lg:pt-24 pb-16">
            {SECTIONS.map((s, i) => (
              <CapabilityPanel
                key={s.no}
                section={s}
                isActive={i === activeIdx}
                prev={i < activeIdx}
              />
            ))}
          </div>

          {/* Vertical progress rail */}
          <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-3">
            {SECTIONS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: 2,
                  height: i === activeIdx ? 36 : 10,
                  background: i === activeIdx ? GOLD : 'rgba(255,255,255,0.18)',
                }}
              />
            ))}
          </div>

          {/* Bottom progress line */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-white/8">
            <motion.div
              className="h-full"
              style={{ width: progressWidth, background: GOLD, opacity: 0.7 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export { SECTIONS }
