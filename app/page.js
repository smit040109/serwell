'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Sparkles, Search, PenTool, Rocket,
  MessageSquare, RefreshCw, ChevronRight, Code2, TrendingUp,
} from 'lucide-react'
import { PageWrapper } from '@/components/site/Shared'

/* ============================================================
   1 · HERO — 4-corner badges + big serif, NO sub-CTAs
============================================================ */
function Hero() {
  const corners = [
    { code: '01', label: 'Design', cls: 'left-4 md:left-10 top-24 md:top-32' },
    { code: '02', label: 'Engineering', cls: 'right-4 md:right-10 top-24 md:top-32' },
    { code: '03', label: 'AI & Automation', cls: 'left-4 md:left-10 bottom-28 md:bottom-32' },
    { code: '04', label: 'Growth', cls: 'right-4 md:right-10 bottom-28 md:bottom-32' },
  ]
  return (
    <section className="relative min-h-[100vh] bg-[#0A0A0A] text-white overflow-hidden flex items-center justify-center px-4">
      {/* subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] rounded-full"
             style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 60%)' }} />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
        }} />
      </div>

      {/* Floating corner badges */}
      {corners.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-10 ${c.cls}`}
        >
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            className="inline-flex items-center gap-2 md:gap-3 pl-2.5 pr-4 md:pl-3 md:pr-6 py-1.5 md:py-2 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium">{c.code}</span>
            </div>
            <span className="text-[11px] md:text-sm text-white font-medium tracking-tight">{c.label}</span>
          </motion.div>
        </motion.div>
      ))}

      {/* Center headline */}
      <div className="relative z-0 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-white/70 mb-8 md:mb-12"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          An independent studio · Available Q3 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-white leading-[0.98] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(38px,8vw,120px)' }}
        >
          We design, engineer
          <br />
          & scale <span className="italic text-white/60">digital systems.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-8 md:mt-10 max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-white/60 leading-relaxed px-4"
        >
          An independent studio combining design, engineering, AI and automation into
          digital systems your business can rely on.
        </motion.p>
      </div>
    </section>
  )
}

/* ============================================================
   2 · HOW WE WORK — 5-step process story
============================================================ */
function HowWeWork() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const steps = [
    { code: '01', title: 'Understand', desc: 'We start by listening. Your business, your P&L, your customers, your calendar. A 60-minute call where you talk more than us.', icon: MessageSquare },
    { code: '02', title: 'Research', desc: 'Competitor teardowns, customer interviews, workflow audits. We show up to the second meeting knowing your industry better than most consultants.', icon: Search },
    { code: '03', title: 'Present', desc: 'Fixed-scope proposal with wireframes, timelines and pricing. No surprises, no fine print, no six-meeting sales funnels.', icon: PenTool },
    { code: '04', title: 'Iterate', desc: 'Weekly demos, weekly feedback, weekly progress. You steer the ship at every milestone — nothing gets built in the dark.', icon: RefreshCw },
    { code: '05', title: 'Deliver & Ship', desc: 'On the deadline, in production, documented. Then we stay for the post-launch quarter so momentum never dies.', icon: Rocket },
  ]

  return (
    <section ref={ref} className="relative bg-[#FAFAF7] py-24 md:py-40 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">— How We Work</div>
          <h2 className="text-[#0A0A0A] leading-[1.0] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(34px,5.5vw,72px)' }}>
            Five steps. <span className="italic text-[#0A0A0A]/60">Zero mystery.</span>
          </h2>
          <p className="mt-6 text-[#525252] leading-relaxed max-w-xl">
            Every project follows the same rhythm. Whether it&apos;s a website or a 6-month platform build, the process is transparent from day one.
          </p>
        </motion.div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-black/10 -translate-x-px hidden md:block" />

          <div className="space-y-10 md:space-y-24">
            {steps.map((s, i) => {
              const isEven = i % 2 === 1
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative grid md:grid-cols-2 gap-6 md:gap-16 items-center ${isEven ? 'md:[direction:rtl]' : ''}`}
                >
                  <div className={`md:[direction:ltr] ${isEven ? 'md:text-right' : ''}`}>
                    <div className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">
                      <span className="font-mono text-[#0A0A0A] font-semibold">{s.code}</span>
                      <span className="w-8 h-px bg-[#0A0A0A]" />
                      <span>Step {i + 1}</span>
                    </div>
                    <h3 className="text-[#0A0A0A] leading-[1.05] tracking-[-0.02em] mb-4"
                        style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4vw,52px)' }}>
                      {s.title}
                    </h3>
                    <p className="text-[15px] text-[#525252] leading-relaxed max-w-md">{s.desc}</p>
                  </div>

                  <div className="md:[direction:ltr] relative">
                    <div className={`relative rounded-3xl border border-black/10 bg-white overflow-hidden aspect-[4/3] p-6 md:p-10 flex items-center justify-center ${isEven ? '' : ''}`}
                         style={{ boxShadow: '0 30px 60px -30px rgba(0,0,0,0.15)' }}>
                      <div className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">{s.code}</div>
                      <s.icon size={72} strokeWidth={1} className="text-[#0A0A0A]" />
                      <div className="absolute bottom-4 right-4 text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">{s.title}</div>
                    </div>
                    {/* central node on line */}
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0A0A0A] border-4 border-[#FAFAF7]"
                         style={isEven ? { right: 'calc(-50% + 20px)' } : { left: 'calc(-50% + 20px)' }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   3 · SELECTED WORK CAROUSEL — CMS-driven with color-shifting bg
============================================================ */
function SelectedWork() {
  const [projects, setProjects] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let cancel = false
    fetch('/api/cms/portfolio_projects').then(r => r.json()).then(d => {
      if (!cancel) setProjects(d.data || [])
    }).catch(() => {})
    return () => { cancel = true }
  }, [])

  const current = projects[active] || {}
  const bg = current.themeColor || '#0A0A0A'
  const fg = current.accentTextColor || '#FFFFFF'

  return (
    <section className="relative overflow-hidden transition-colors duration-700 ease-out"
             style={{ background: bg, color: fg }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20"
        >
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-4">— Selected Work</div>
            <h2 className="leading-[1.02] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(34px,5.5vw,72px)' }}>
              20+ businesses. <span className="italic opacity-70">One studio.</span>
            </h2>
          </div>
          <Link href="/our-work" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold underline-offset-4 hover:underline">
            See all work <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
            {/* LEFT: Big display for current */}
            <motion.div
              key={current._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-70">
                {String(active + 1).padStart(2, '0')} · {current.category}
              </div>
              <h3 className="tracking-[-0.02em] leading-[1.0]"
                  style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(38px,5vw,68px)' }}>
                {current.title}
              </h3>
              <p className="text-[15px] md:text-base opacity-80 leading-relaxed max-w-md">{current.summary}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {(current.services || []).map(sv => (
                  <span key={sv} className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-white/25 opacity-80">{sv}</span>
                ))}
              </div>
              {/* Nav dots */}
              <div className="pt-8 flex items-center gap-2">
                {projects.map((p, i) => (
                  <button
                    key={p._id}
                    onClick={() => setActive(i)}
                    className={`h-1 rounded-full transition-all ${active === i ? 'w-10 bg-current' : 'w-4 bg-current/30'}`}
                    aria-label={`View ${p.title}`}
                  />
                ))}
                <div className="ml-4 flex items-center gap-2">
                  <button onClick={() => setActive((active - 1 + projects.length) % projects.length)}
                          className="w-9 h-9 rounded-full border border-current/25 flex items-center justify-center hover:bg-white/10 transition">
                    <ChevronRight className="rotate-180" size={14} />
                  </button>
                  <button onClick={() => setActive((active + 1) % projects.length)}
                          className="w-9 h-9 rounded-full border border-current/25 flex items-center justify-center hover:bg-white/10 transition">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: image */}
            <motion.div
              key={'img-' + current._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/15"
              style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.35)' }}
            >
              {current.coverImage ? (
                <img src={current.coverImage} alt={current.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-40">No image</div>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="opacity-60 text-sm">Loading projects…</div>
        )}
      </div>
    </section>
  )
}

/* ============================================================
   4 · IMPACT STATS — realistic numbers
============================================================ */
function ImpactStats() {
  const stats = [
    { n: '20+', label: 'Products shipped' },
    { n: '15+', label: 'Businesses served' },
    { n: '6+', label: 'Industries covered' },
    { n: '100%', label: 'Founder-led delivery' },
  ]
  return (
    <section className="relative bg-[#FAFAF7] py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="p-6 md:p-8 rounded-2xl bg-white border border-black/10"
            >
              <div className="text-[#0A0A0A] leading-none tracking-[-0.03em]"
                   style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(40px,5vw,64px)' }}>
                {s.n}
              </div>
              <div className="mt-4 text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   5 · CLOSING STATEMENT
============================================================ */
function ClosingStatement() {
  return (
    <section className="relative bg-[#0A0A0A] text-white py-28 md:py-40 px-6 md:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full"
           style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 60%)' }} />
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-[10px] tracking-[0.35em] uppercase text-white/50 mb-6"
        >
          — Ready when you are
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          className="leading-[1.0] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(36px,6.5vw,84px)' }}
        >
          Have an idea? <span className="italic text-white/60">Let&apos;s build what comes next.</span>
        </motion.h2>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PageWrapper darkHero={true}>
      <Hero />
      <HowWeWork />
      <SelectedWork />
      <ImpactStats />
      <ClosingStatement />
    </PageWrapper>
  )
}
