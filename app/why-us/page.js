'use client'

import { motion, useInView, useMotionValue, useTransform, useSpring, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Sparkles, Shield, Zap, Target, Users2, Infinity as InfinityIcon,
  Check, MapPin,
} from 'lucide-react'
import { PageWrapper } from '@/components/site/Shared'

/* ============================================================
   PALETTE — monochrome only
============================================================ */
const C = {
  bg: '#FAFAF7',        // off-white
  bg2: '#F2F2EE',       // slight step down
  ink: '#0A0A0A',        // near-black
  ink2: '#171717',
  line: '#E7E5E1',
  muted: '#6B6B6B',
  faint: '#A3A3A3',
}

/* ============================================================
   COUNT-UP — for stat metrics
============================================================ */
function CountUp({ to = 100, suffix = '+', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString()}{suffix}
    </span>
  )
}

/* ============================================================
   FLOATING TILTED CARD — hero team cascade
============================================================ */
function FloatingProfileCard({ src, name, role, tag, rotate = -6, delay = 0, floatDelay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate * 1.6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
      transition={{ delay, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 30, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      className={`relative cursor-pointer group ${className}`}
      style={{ transformOrigin: 'center' }}
    >
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 5 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="relative"
      >
        <div
          className="w-[220px] md:w-[240px] rounded-[28px] overflow-hidden bg-white border border-black/10"
          style={{ boxShadow: '0 30px 60px -30px rgba(0,0,0,0.25), 0 12px 24px -12px rgba(0,0,0,0.12)' }}
        >
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            <img src={src} alt={name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" draggable={false} />
            {/* Floating status tag */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[9px] tracking-[0.15em] uppercase text-[#0A0A0A] font-semibold px-2.5 py-1.5 rounded-full border border-black/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
              {tag}
            </div>
          </div>
          <div className="p-4 bg-white">
            <div className="text-[13px] font-semibold text-[#0A0A0A] leading-tight">{name}</div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B] mt-1">{role}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ============================================================
   1 · HERO — glassmorphism nav + cascading cards
============================================================ */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-24" style={{ background: C.bg }}>
      {/* Ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[90vw] h-[70vw] rounded-full"
             style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.06), transparent 60%)' }} />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT — headline + CTAs */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/15 bg-white/60 backdrop-blur-md mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0A0A0A] font-medium">Why VayuCodes</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[#0A0A0A] leading-[0.98] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(44px,6.5vw,88px)' }}
          >
            The minds behind
            <br />
            <span className="italic text-[#0A0A0A]/70">the machine.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-8 max-w-xl text-[15px] md:text-base text-[#3F3F3F] leading-relaxed"
          >
            Two co-founders. One relentless standard. We built vayucodes because most agencies
            over-promise, under-deliver, and disappear after invoice. We built the opposite —
            an independent studio you can actually rely on.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-10 flex items-center gap-6 flex-wrap"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-[#0A0A0A] text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all hover:bg-black active:scale-[0.97]"
              style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.35)' }}
            >
              Start a project
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/our-work" className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#0A0A0A] hover:text-black">
              See our work
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — cascading tilted cards */}
        <div className="lg:col-span-5 relative h-[520px] md:h-[560px] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-[4%] top-[2%]">
              <FloatingProfileCard
                src="/team/uday.webp"
                name="Uday Tailor"
                role="Co-Founder"
                tag="Building"
                rotate={-8}
                delay={0.6}
                floatDelay={0}
              />
            </div>
            <div className="absolute right-[2%] bottom-[2%]">
              <FloatingProfileCard
                src="/team/smit.webp"
                name="Smit Patel"
                role="Co-Founder"
                tag="Shipping"
                rotate={7}
                delay={0.8}
                floatDelay={0.6}
              />
            </div>
            {/* Ambient decorative dot ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-black/8"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   2 · IMPACT STATS GRID
============================================================ */
function ImpactStats() {
  const stats = [
    { value: 20, suffix: '+', label: 'Projects Delivered', sub: 'Shipped end-to-end, on time.' },
    { value: 15, suffix: '+', label: 'Businesses Served', sub: 'From D2C brands to family enterprises.' },
    { value: 6, suffix: '+', label: 'Industries Covered', sub: 'Textile, retail, education, hospitality, and more.' },
    { value: 100, suffix: '%', label: 'Founder-Led', sub: 'Every project touched by both of us.' },
  ]
  return (
    <section className="relative py-28 md:py-36" style={{ background: C.bg }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">— A small studio, deliberately.</div>
          <h2
            className="text-[#0A0A0A] leading-[1.0] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}
          >
            Two founders. Twenty
            <br />
            products shipped. <span className="italic text-[#0A0A0A]/60">Zero excuses.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative p-8 md:p-10 rounded-2xl bg-white border border-black/10 hover:border-[#0A0A0A] transition-all duration-500"
              style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.02)' }}
            >
              <div className="text-[#0A0A0A] leading-none tracking-[-0.03em]"
                   style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(44px,5.5vw,72px)' }}>
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-6 text-[13px] font-semibold text-[#0A0A0A]">{s.label}</div>
              <div className="mt-1 text-[12px] text-[#6B6B6B] leading-relaxed">{s.sub}</div>
              <div className="absolute top-0 left-0 h-px w-0 bg-[#0A0A0A] group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   3 · VISION & MISSION — zig-zag split cards
============================================================ */
function VisionMission() {
  return (
    <section className="relative py-28 md:py-36" style={{ background: C.bg2 }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">— Vision & Mission</div>
          <h2
            className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}
          >
            Engineering the systems that <span className="italic text-[#0A0A0A]/60">quietly run</span> the businesses of tomorrow.
          </h2>
        </motion.div>

        {/* Card 1 — text left, visual right */}
        <div className="grid lg:grid-cols-12 gap-10 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">01 — Vision</div>
            <h3 className="text-[#0A0A0A] leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(28px,3.4vw,42px)' }}>
              Software that thinks. <br /><span className="italic">Systems that scale.</span>
            </h3>
            <p className="text-[15px] text-[#3F3F3F] leading-relaxed mb-6 max-w-md">
              We build custom products, automated back-offices, and AI-driven workflows for founders
              who want to grow without hiring a small army. Every line of code is written to earn
              its place in production.
            </p>
            <ul className="space-y-3">
              {['Founder-led delivery on every build', 'AI + automation baked into the base layer', 'Handover-ready. No lock-in. No black boxes.'].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-[#0A0A0A]">
                  <Check size={16} className="mt-0.5 text-[#0A0A0A] shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <MockDashboard />
          </motion.div>
        </div>

        {/* Card 2 — visual left, text right */}
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            <MockMobileUI />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">02 — Mission</div>
            <h3 className="text-[#0A0A0A] leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(28px,3.4vw,42px)' }}>
              Ship faster than agencies. <br /><span className="italic">Care deeper than freelancers.</span>
            </h3>
            <p className="text-[15px] text-[#3F3F3F] leading-relaxed mb-6 max-w-md">
              Our mission is to give every ambitious business owner a technical partner who
              treats their P&L like his own. No account managers. No chain of vendors. Just the
              two of us — engineering the future of your business.
            </p>
            <ul className="space-y-3">
              {['One point of contact — always a founder', 'Weekly demos, weekly progress, zero mystery', 'Real numbers. Real deadlines. Real launches.'].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-[#0A0A0A]">
                  <Check size={16} className="mt-0.5 text-[#0A0A0A] shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Mock UI components (black & white) ---------- */
function MockDashboard() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-white border border-black/10 p-5 md:p-6"
         style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.25)' }}>
      {/* window chrome */}
      <div className="flex items-center gap-1.5 mb-5">
        <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
        <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
        <div className="ml-4 flex-1 h-6 rounded-md bg-black/[0.04] border border-black/5" />
      </div>
      {/* dashboard body */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Uptime', val: '99.9%' },
          { label: 'Sprint velocity', val: '↑ 34%' },
          { label: 'On-time launch', val: '20 / 20' },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl bg-[#FAFAF7] border border-black/8">
            <div className="text-[9px] tracking-[0.2em] uppercase text-[#6B6B6B]">{s.label}</div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-[#0A0A0A]">{s.val}</div>
          </div>
        ))}
      </div>
      {/* chart placeholder */}
      <div className="relative h-40 rounded-xl bg-[#FAFAF7] border border-black/8 overflow-hidden">
        <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="mochart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            d="M0,120 C40,110 70,95 110,85 C160,72 190,90 230,70 C275,48 310,55 350,32 L400,20"
            stroke="#0A0A0A" strokeWidth="2" fill="none"
          />
          <path d="M0,120 C40,110 70,95 110,85 C160,72 190,90 230,70 C275,48 310,55 350,32 L400,20 L400,160 L0,160 Z" fill="url(#mochart)" />
        </svg>
        {/* floating pulse badge */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#0A0A0A] text-white text-[10px] tracking-[0.15em] uppercase font-semibold px-2.5 py-1 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          98% Match
        </motion.div>
      </div>
    </div>
  )
}

function MockMobileUI() {
  return (
    <div className="relative flex items-center justify-center py-4">
      {/* phone frame */}
      <div className="relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[42px] bg-[#0A0A0A] p-2.5"
           style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.35)' }}>
        <div className="w-full h-full rounded-[34px] bg-white overflow-hidden relative">
          {/* notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#0A0A0A]" />
          {/* content */}
          <div className="pt-14 px-5">
            <div className="text-[9px] tracking-[0.25em] uppercase text-[#6B6B6B]">Live sprint</div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-[#0A0A0A]">Anaya · Diwali Launch</div>
            <div className="mt-4 space-y-2.5">
              {[
                { label: 'Brand system', p: 100 },
                { label: 'E-commerce build', p: 92 },
                { label: 'WhatsApp automation', p: 74 },
                { label: 'Growth playbook', p: 48 },
              ].map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-[#0A0A0A]">{r.label}</span>
                    <span className="text-[#6B6B6B] tabular-nums">{r.p}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/8 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${r.p}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-[#0A0A0A]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-xl bg-[#FAFAF7] border border-black/8">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#6B6B6B]">Next demo</div>
              <div className="mt-1 text-[13px] font-semibold text-[#0A0A0A]">Friday · 5:30 PM IST</div>
            </div>
          </div>
        </div>
      </div>
      {/* floating badges */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-2 md:right-6 bg-white text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1.5 rounded-full border border-black/10 text-[#0A0A0A]"
        style={{ boxShadow: '0 12px 30px -12px rgba(0,0,0,0.2)' }}
      >
        Shipped on time
      </motion.div>
      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-0 md:left-6 flex items-center gap-2 bg-[#0A0A0A] text-white text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1.5 rounded-full"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Live build
      </motion.div>
    </div>
  )
}

/* ============================================================
   4 · CORE VALUES — 3×2 grid
============================================================ */
function CoreValues() {
  const values = [
    { icon: Zap, title: 'Speed as a discipline', body: 'Two-week sprints, weekly demos, and never a "we\'ll get to it next month." Momentum is the product.' },
    { icon: Shield, title: 'Radical transparency', body: 'You get the invoice, the timeline, the Slack channel, and the honest answer — even when it\'s inconvenient.' },
    { icon: Target, title: 'Precision over polish', body: 'We ship what moves the business. Beautiful, yes. But shipped and measurable — always first.' },
    { icon: Users2, title: 'Founder empathy', body: 'We\'ve been on your side of the table. Every decision respects your P&L, your calendar, and your team.' },
    { icon: Sparkles, title: 'Craft you can feel', body: 'Every button, every query, every workflow — engineered like it\'s the only thing we\'ll ever be judged on.' },
    { icon: InfinityIcon, title: 'Compound trust', body: 'Most of our clients come back for round two. That\'s the only metric that matters to us long-term.' },
  ]
  return (
    <section className="relative py-28 md:py-36" style={{ background: C.bg }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">— Core Values</div>
          <h2
            className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}
          >
            The <span className="italic text-[#0A0A0A]/60">six standards</span> we&rsquo;ll never negotiate on.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative p-8 rounded-2xl bg-white border border-black/10 hover:border-[#0A0A0A] transition-all duration-500"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0A0A0A]/[0.04] border border-black/10 flex items-center justify-center mb-6 group-hover:bg-[#0A0A0A] group-hover:border-[#0A0A0A] transition-all duration-500">
                <v.icon size={18} className="text-[#0A0A0A] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0A0A0A] tracking-tight leading-snug mb-3">
                {v.title}
              </h3>
              <p className="text-[13.5px] text-[#525252] leading-relaxed">{v.body}</p>
              {/* top border reveal on hover */}
              <div className="pointer-events-none absolute top-0 left-6 right-6 h-px bg-[#0A0A0A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   5 · CO-FOUNDERS SHOWCASE
============================================================ */
function CoFounders() {
  const founders = [
    {
      src: '/team/uday.webp',
      name: 'Uday Tailor',
      title: 'Co-Founder',
      caption: 'Systems, strategy & delivery',
      bio: 'Uday leads engineering and client operations. His obsession with process is why our builds ship on time and stay live long after handover.',
    },
    {
      src: '/team/smit.webp',
      name: 'Smit Patel',
      title: 'Co-Founder',
      caption: 'Design, growth & story',
      bio: 'Smit turns raw business ideas into brands and interfaces that people actually want to use. Design is his craft; growth is his obsession.',
    },
  ]
  return (
    <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: C.bg2 }}>
      {/* Ambient glow at bottom */}
      <div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full"
           style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08), transparent 60%)' }} />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">— Leadership</div>
          <h2
            className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.8vw,60px)' }}
          >
            Meet the co-founders <span className="italic text-[#0A0A0A]/60">building it</span> in the open.
          </h2>
          <p className="mt-6 text-[15px] text-[#525252] leading-relaxed max-w-xl mx-auto">
            No account managers. No offshore teams. When you work with vayucodes, you work with us — every meeting, every review, every launch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {founders.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative bg-white rounded-3xl overflow-hidden border border-black/10 transition-all duration-500 hover:border-[#0A0A0A]"
              style={{ boxShadow: '0 30px 60px -30px rgba(0,0,0,0.18)' }}
            >
              <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img
                  src={f.src}
                  alt={f.name}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-1000"
                  draggable={false}
                />
                {/* subtle gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                {/* floating badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase font-semibold text-[#0A0A0A] px-3 py-1.5 rounded-full border border-black/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
                  {f.title}
                </div>
              </div>
              <div className="p-7 md:p-8">
                <h3 className="text-[#0A0A0A] tracking-[-0.02em] leading-tight"
                    style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(26px,2.4vw,34px)' }}>
                  {f.name}
                </h3>
                <div className="mt-1 text-[11px] tracking-[0.25em] uppercase text-[#6B6B6B]">{f.caption}</div>
                <p className="mt-5 text-[14px] leading-relaxed text-[#525252]">{f.bio}</p>
                <div className="mt-6 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0A0A0A]">
                  <MapPin size={12} /> Valsad, Gujarat
                </div>
              </div>
              {/* corner accent line */}
              <div className="pointer-events-none absolute top-0 left-6 right-6 h-px bg-[#0A0A0A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   6 · NEWSLETTER / CTA
============================================================ */
function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
    setEmail('')
  }
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: C.bg }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[36px] md:rounded-[48px] overflow-hidden border border-black/10 bg-white p-10 md:p-16 lg:p-20 text-center"
          style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.18)' }}
        >
          {/* Ambient glow top */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[70%] h-[300px] rounded-full"
               style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08), transparent 65%)' }} />

          <div className="relative">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-5">— The Next Move</div>
            <h2
              className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em] max-w-3xl mx-auto"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,5vw,64px)' }}
            >
              Ready to build the <span className="italic text-[#0A0A0A]/60">next chapter</span> of your business?
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-[15px] text-[#525252] leading-relaxed">
              Get one honest email a month — what we shipped, what we learned, and the one system every founder should be using this quarter.
            </p>

            <form onSubmit={submit} className="mt-10 relative flex items-center max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                className="w-full pl-6 pr-40 py-5 rounded-full border border-black/12 bg-[#FAFAF7] text-[14px] text-[#0A0A0A] placeholder:text-[#A3A3A3] outline-none focus:border-[#0A0A0A] focus:ring-4 focus:ring-black/5 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-[#0A0A0A] text-white text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3.5 rounded-full hover:bg-black active:scale-[0.97] transition-all"
              >
                {submitted ? 'Sent ✓' : 'Subscribe'}
                {!submitted && <ArrowRight size={14} />}
              </button>
            </form>

            <div className="mt-8 text-[11px] tracking-[0.2em] uppercase text-[#A3A3A3]">
              Or — <Link href="/contact" className="text-[#0A0A0A] underline underline-offset-4 hover:no-underline">book a 20-min discovery call</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   EXPORT
============================================================ */
export default function WhyUsPage() {
  return (
    <PageWrapper darkHero={false}>
      <Hero />
      <ImpactStats />
      <VisionMission />
      <CoreValues />
      <CoFounders />
      <NewsletterCTA />
    </PageWrapper>
  )
}
