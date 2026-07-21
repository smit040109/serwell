'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const STATS = [
  { value: '50+', label: 'Businesses shipped' },
  { value: '4.2×', label: 'Avg. direct bookings lift' },
  { value: '9 min', label: 'Reconciliation time, down from 4 days' },
  { value: '₹1.2 Cr', label: 'Festive GMV, cold audience' },
]

const INDUSTRIES = ['Hospitality', 'Manufacturing', 'D2C Retail', 'Multi-Outlet Retail', 'F&B', 'Creator Tooling', 'Textiles', 'SaaS']

export default function OurWorkHero() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 60, damping: 20 })
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 60, damping: 20 })
  const spotlight = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(600px circle at ${50 + x * 60}% ${50 + y * 60}%, rgba(255,255,255,0.06), transparent 60%)`
  )
  const [statIndex, setStatIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStatIndex((i) => (i + 1) % STATS.length), 2800)
    return () => clearInterval(t)
  }, [])

  function onMove(e) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative w-full min-h-[92vh] bg-[#0B0B0C] overflow-hidden flex flex-col pt-32 pb-0"
    >
      {/* Ghost numeral background */}
      <div
        aria-hidden="true"
        className="absolute -top-[6vw] right-[-4vw] select-none pointer-events-none text-white/[0.035]"
        style={{
          fontFamily: 'var(--font-instrument)',
          fontSize: 'clamp(280px,42vw,640px)',
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        50+
      </div>

      {/* Mouse spotlight */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: spotlight }} />

      {/* grain */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
      }} />

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-10 flex-1 flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT — copy */}
        <div className="w-full lg:basis-[58%]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-10 h-px bg-white/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-white/60" style={{ fontFamily: 'var(--font-syne)' }}>
              · Our Work
            </span>
          </motion.div>

          <h1 className="text-white leading-[0.98] tracking-[-0.01em]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(44px,6vw,92px)' }}>
            {['50+', 'businesses.'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.28em]"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="italic text-white/65 inline-block"
            >
              Real receipts.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-8 max-w-xl text-white/65 text-base lg:text-lg leading-relaxed"
          >
            From textile manufacturers in Surat to retail chains across South Gujarat — these are the businesses we've helped trade Excel sheets for dashboards, pamphlets for funnels, and 'we'll think about it' for 'can you start tomorrow?'.
          </motion.p>
        </div>

        {/* RIGHT — rotating stat card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective: 1200 }}
          className="w-full lg:basis-[42%]"
        >
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-10 lg:p-12 overflow-hidden min-h-[220px]">
            <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(255,255,255,0.06), transparent 60%)' }} />
            <div className="relative">
              {STATS.map((s, i) => (
                i === statIndex && (
                  <motion.div
                    key={s.value}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-white leading-none" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(52px,5vw,76px)' }}>
                      {s.value}
                    </div>
                    <div className="mt-3 text-white/50 text-sm tracking-wide" style={{ fontFamily: 'var(--font-syne)' }}>
                      {s.label}
                    </div>
                  </motion.div>
                )
              ))}
              <div className="flex gap-1.5 mt-10">
                {STATS.map((_, i) => (
                  <span
                    key={i}
                    className="h-[3px] rounded-full transition-all duration-500"
                    style={{ width: i === statIndex ? 24 : 8, background: i === statIndex ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Industries marquee */}
      <div className="relative z-10 border-t border-white/10 mt-16 py-6 overflow-hidden">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...INDUSTRIES, ...INDUSTRIES].map((ind, i) => (
            <span key={i} className="flex items-center gap-10 text-white/35 text-[13px] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-syne)' }}>
              {ind}
              <span className="text-white/20">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
