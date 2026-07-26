'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCmsPageContent } from '@/components/site/Shared'

const DEFAULT_MARQUEE = [
  'CUSTOM SOFTWARE', 'BRAND WEB', 'CRM SYSTEMS', 'AI AUTOMATION',
  'LMS', 'RETAIL OS', 'DIGITAL MARKETING', 'GROWTH',
]
const DEFAULT_ROTATING = ['SHIPPED', 'BUILT', 'LAUNCHED', 'SCALED']

export default function OurWorkHero() {
  const d = useCmsPageContent('our-work') || {}
  const rotating = Array.isArray(d.rotatingLabels) && d.rotatingLabels.filter(Boolean).length
    ? d.rotatingLabels.filter(Boolean) : DEFAULT_ROTATING
  const marquee = Array.isArray(d.marqueeWords) && d.marqueeWords.filter(Boolean).length
    ? d.marqueeWords.filter(Boolean) : DEFAULT_MARQUEE
  const headline1 = d.headline1 || 'Twenty products.'

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 220])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  const [labelIdx, setLabelIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setLabelIdx(v => (v + 1) % rotating.length), 2400)
    return () => clearInterval(id)
  }, [rotating.length])

  return (
    <section ref={ref} className="relative min-h-[100vh] bg-[#0A0A0A] text-white overflow-hidden flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] rounded-full"
             style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 60%)' }} />
      </div>

      <motion.div animate={{ rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
                  style={{ width: '82vw', height: '82vw', maxWidth: 1250, maxHeight: 1250 }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/6"
                  style={{ width: '110vw', height: '110vw', maxWidth: 1650, maxHeight: 1650 }} />

      <motion.div style={{ y, scale, opacity }} className="relative z-10 w-full px-6 md:px-10 text-center">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                   className="text-white leading-[0.92] tracking-[-0.02em]"
                   style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(46px,10vw,160px)' }}>
          <span className="block">{headline1}</span>
          <span className="block">
            <AnimatePresence mode="wait">
              <motion.span key={labelIdx}
                           initial={{ opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
                           animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
                           exit={{ opacity: 0, y: '-0.4em', filter: 'blur(6px)' }}
                           transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                           className="italic text-white/60 inline-block">
                {rotating[labelIdx % rotating.length]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-black/40 backdrop-blur-sm py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {[...marquee, ...marquee, ...marquee].map((w, i) => (
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
