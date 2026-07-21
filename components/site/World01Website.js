'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function World01Website() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const wireOpacity = useTransform(scrollYProgress, [0, 0.25, 0.4], [1, 1, 0])
  const wireScale = useTransform(scrollYProgress, [0, 0.4], [0.96, 1.02])

  const compOpacity = useTransform(scrollYProgress, [0.25, 0.45, 0.65], [0, 1, 1])
  const compY = useTransform(scrollYProgress, [0.25, 0.5], [40, 0])

  const finalOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1])
  const finalScale = useTransform(scrollYProgress, [0.6, 0.85], [0.94, 1])

  const headlineY = useTransform(scrollYProgress, [0, 0.3], [0, -40])
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.3])

  const capabilities = ['Corporate Websites', 'Landing Pages', 'E-commerce', 'Web Applications', 'Interactive Experiences']

  return (
    <section ref={sectionRef} className="relative bg-black" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-6 lg:px-16">

        {/* Ambient glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 45%, rgba(198,255,61,0.14) 0%, rgba(198,255,61,0.04) 35%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <motion.div style={{ y: headlineY, opacity: headlineOpacity }} className="relative z-10 mb-10 text-center lg:text-left">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C6FF3D]/70 font-mono">01 / Website Creation</span>
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight" style={{ fontFamily: 'var(--font-instrument)' }}>
            Websites people <em className="not-italic text-[#C6FF3D]">remember.</em>
          </h2>
          <p className="mt-4 text-white/50 max-w-lg mx-auto lg:mx-0 text-base md:text-lg font-light">
            We design and build digital experiences that turn attention into action.
          </p>
        </motion.div>

        <div className="relative z-10 w-full max-w-3xl mx-auto h-[45vh]">
          {/* Glow behind the card stack */}
          <div
            className="absolute -inset-8 rounded-[32px] pointer-events-none"
            style={{
              background: 'radial-gradient(closest-side, rgba(198,255,61,0.18), transparent 70%)',
              filter: 'blur(24px)',
            }}
          />

          {/* Wireframe stage */}
          <motion.div
            style={{ opacity: wireOpacity, scale: wireScale }}
            className="absolute inset-0 border border-white/25 rounded-xl p-6 bg-black/40 backdrop-blur-sm shadow-[0_0_60px_rgba(198,255,61,0.08)]"
          >
            <div className="flex gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full border border-white/30" />
              <span className="w-2.5 h-2.5 rounded-full border border-white/30" />
              <span className="w-2.5 h-2.5 rounded-full border border-white/30" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-2/5 border border-dashed border-white/30 rounded" />
              <div className="h-2 w-4/5 border border-dashed border-white/20 rounded" />
              <div className="h-2 w-3/5 border border-dashed border-white/20 rounded" />
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="h-20 border border-dashed border-[#C6FF3D]/30 rounded" />
                <div className="h-20 border border-dashed border-[#C6FF3D]/30 rounded" />
                <div className="h-20 border border-dashed border-[#C6FF3D]/30 rounded" />
              </div>
            </div>
          </motion.div>

          {/* Components assembling stage */}
          <motion.div
            style={{ opacity: compOpacity, y: compY }}
            className="absolute inset-0 bg-white/[0.04] border border-white/15 rounded-xl p-6 backdrop-blur-md shadow-[0_0_60px_rgba(198,255,61,0.1)]"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C6FF3D] shadow-[0_0_12px_rgba(198,255,61,0.8)]" />
              <div className="flex gap-4 text-[10px] text-white/50 font-mono uppercase tracking-wider">
                <span>Home</span><span>Work</span><span>Contact</span>
              </div>
            </div>
            <div className="h-3 w-1/2 bg-white/30 rounded mb-3" />
            <div className="h-2 w-3/4 bg-white/15 rounded mb-6" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 bg-white/[0.08] rounded-lg border border-white/15" />
              <div className="h-20 bg-white/[0.08] rounded-lg border border-white/15" />
              <div className="h-20 bg-white/[0.08] rounded-lg border border-white/15" />
            </div>
          </motion.div>

          {/* Final site stage */}
          <motion.div
            style={{ opacity: finalOpacity, scale: finalScale }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-[#C6FF3D]/25 shadow-[0_0_80px_rgba(198,255,61,0.18)]"
            initial={false}
          >
            <div className="h-full w-full bg-gradient-to-br from-[#141814] via-[#0c0d0a] to-black p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white text-xs font-semibold tracking-wide">VAYUCODES</span>
                <span className="text-[10px] text-[#C6FF3D] font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] shadow-[0_0_8px_rgba(198,255,61,0.9)]" />
                  Live
                </span>
              </div>
              <h3 className="text-white text-xl md:text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-instrument)' }}>
                Build. Launch. Grow.
              </h3>
              <p className="text-white/40 text-xs mb-6">Premium web experiences, shipped fast.</p>
              <div className="grid grid-cols-3 gap-3">
                {capabilities.slice(0, 3).map((c, i) => (
                  <div key={i} className="h-16 rounded-lg border border-[#C6FF3D]/20 bg-[#C6FF3D]/[0.04] flex items-center justify-center hover:bg-[#C6FF3D]/[0.08] transition-colors">
                    <span className="text-[9px] text-white/60 text-center px-2 font-mono uppercase tracking-wide">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div style={{ opacity: finalOpacity }} className="relative z-10 mt-10 flex justify-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-3 font-semibold text-[12px] tracking-[0.15em] uppercase px-8 py-4 rounded-md transition-all shadow-[0_0_30px_rgba(198,255,61,0.35)] hover:shadow-[0_0_45px_rgba(198,255,61,0.5)]"
            style={{ background: '#C6FF3D', color: '#000' }}
          >
            Build Your Website
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
