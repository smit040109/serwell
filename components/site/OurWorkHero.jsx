'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'

const MARQUEE_WORDS = [
  'CUSTOM SOFTWARE', 'BRAND WEB', 'CRM SYSTEMS', 'AI AUTOMATION',
  'LMS', 'RETAIL OS', 'DIGITAL MARKETING', 'GROWTH',
]

const ROTATING_LABEL = ['SHIPPED', 'BUILT', 'LAUNCHED', 'SCALED']

export default function OurWorkHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 220])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  const [labelIdx, setLabelIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setLabelIdx(v => (v + 1) % ROTATING_LABEL.length), 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <section ref={ref} className="relative min-h-[100vh] bg-[#0A0A0A] text-white overflow-hidden flex items-center justify-center">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] rounded-full"
             style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 60%)' }} />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")"
        }} />
      </div>

      {/* Orbiting dashed rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
        style={{ width: '82vw', height: '82vw', maxWidth: 1250, maxHeight: 1250 }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/6"
        style={{ width: '110vw', height: '110vw', maxWidth: 1650, maxHeight: 1650 }}
      />

      {/* Vertical side counters */}
      <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[10px] tracking-[0.35em] uppercase text-white/40">
        Portfolio · Est. 2026
      </div>
      <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] tracking-[0.35em] uppercase text-white/40">
        Six live builds
      </div>

      {/* Center content */}
      <motion.div
        style={{ y, scale, opacity }}
        className="relative z-10 w-full px-6 md:px-10 text-center"
      >
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/70 mb-8 md:mb-12"
        >
          <Sparkles size={11} /> Selected Work · 2024 — 2026
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="text-white leading-[0.92] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(46px,10vw,160px)' }}
        >
          <span className="block">Twenty products.</span>
          <span className="block">
            <AnimatePresence mode="wait">
              <motion.span
                key={labelIdx}
                initial={{ opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: '-0.4em', filter: 'blur(6px)' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="italic text-white/60 inline-block"
              >
                {ROTATING_LABEL[labelIdx]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-8 md:mt-10 max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-white/50 leading-relaxed px-4"
        >
          Every scroll is a case study. Every color is a client. Every build shipped by two founders and a promise.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-16 md:mt-24 flex flex-col items-center gap-3"
        >
          <div className="text-[9px] tracking-[0.35em] uppercase text-white/40">Scroll to explore</div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
          >
            <ArrowDown size={12} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-black/40 backdrop-blur-sm py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <div key={i} className="inline-flex items-center gap-5 mx-5 text-[11px] tracking-[0.35em] uppercase text-white/50 font-medium">
              {w}
              <span className="w-1 h-1 rounded-full bg-white/30" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  )
}
