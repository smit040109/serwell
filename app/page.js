'use client'

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, MessageSquare, Search, PenTool, RefreshCw, Rocket, ChevronRight,
} from 'lucide-react'
import { PageWrapper, LandingFlow, useLandingStage, useCmsSiteSettings } from '@/components/site/Shared'

/* ============================================================
   1 · HERO — white bg, rotating word, ambient video, subtle 3D scroll
============================================================ */
const ROTATING_WORDS = [
  'digital systems',
  'AI workflows',
  'growth engines',
  'future products',
]

// Local cinematic hero video (shot on Canon EOS250D — cinematic 1080p loop)
const HERO_VIDEO_SRC = '/videos/hero-cinematic.mp4'

function Hero() {
  const [idx, setIdx] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const [settings, setSettings] = useState(null)
  const videoRef = useRef(null)
  const ref = useRef(null)
  const stage = useLandingStage()
  const introComplete = stage === 'home'
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  // Subtle parallax on the video itself for cinematic depth
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14])

  useEffect(() => {
    const id = setInterval(() => setIdx(v => v + 1), 2600)
    return () => clearInterval(id)
  }, [])

  // Fetch CMS site settings (hero headline/subtitle/video) — falls back to
  // the hardcoded defaults until the fetch resolves, so nothing flashes.
  useEffect(() => {
    fetch('/api/cms/site_settings')
      .then(r => r.json())
      .then(d => setSettings(d.data))
      .catch(() => {})
  }, [])

  const heroLine1 = settings?.hero?.headlineLine1 || 'We design, engineer'
  const heroItalicWord = settings?.hero?.headlineItalicWord || null
  const heroSubtitle = settings?.hero?.subtitle || ''
  const rotatingWords = (Array.isArray(settings?.rotatingWords) && settings.rotatingWords.filter(Boolean).length)
    ? settings.rotatingWords.filter(Boolean)
    : ROTATING_WORDS
  const videoEnabled = settings?.hero ? settings.hero.videoEnabled : true
  const videoSrc = (settings?.hero?.videoEnabled && settings?.hero?.videoUrl) || HERO_VIDEO_SRC
  const videoLoop = settings?.hero ? settings.hero.videoLoop : true

  // Force-play on mount for some mobile browsers so the browser preloads/decodes
  // the file even while the intro plays. The video is kept invisible until
  // the intro ends (see opacity below), and we rewind it to frame 0 the
  // instant the intro finishes so the user always sees the clip from the start.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => v.play().catch(() => {})
    tryPlay()
    v.addEventListener('canplay', tryPlay)
    v.addEventListener('loadeddata', tryPlay)
    return () => {
      v.removeEventListener('canplay', tryPlay)
      v.removeEventListener('loadeddata', tryPlay)
    }
  }, [])

  // When the intro finishes, restart the hero video from the beginning so the
  // user always sees a clean opening frame rather than a mid-clip moment.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !introComplete) return
    try { v.currentTime = 0 } catch { /* ignore */ }
    v.play().catch(() => {})
  }, [introComplete])

  return (
    <section ref={ref} className="relative min-h-[100vh] bg-black overflow-hidden flex items-center justify-center px-4">
      {/* Cinematic video background — full bleed */}
      <motion.div
        style={{ y: videoY, scale: videoScale }}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <video
          ref={videoRef}
          autoPlay muted loop={videoLoop} playsInline preload="auto"
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          className="w-full h-full object-cover"
          style={{
            filter: 'contrast(1.08) saturate(0.85) brightness(0.92)',
            opacity: videoReady && introComplete && videoEnabled ? 1 : 0,
            transition: 'opacity 900ms ease-out',
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Cinematic legibility overlays — very subtle so video is clearly visible */}
        {/* 1. Soft vignette so edges deepen, center stays vivid */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.75) 100%)',
        }} />
        {/* 2. Bottom-heavy gradient to anchor headline crisply */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.55) 100%)',
        }} />
        {/* 3. Film grain for that cinema feel */}
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")",
        }} />

        {/* Floating decorative particles — subtle white spec */}
        <FloatingParticles />
      </motion.div>

      {/* Headline */}
      <motion.div
        style={{ y, scale, opacity }}
        className="relative z-10 max-w-6xl mx-auto text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-white leading-[0.95] tracking-[-0.02em]"
          style={{
            fontFamily: 'var(--font-instrument)',
            fontWeight: 400,
            fontSize: 'clamp(42px,8.5vw,140px)',
            textShadow: '0 2px 30px rgba(0,0,0,0.35)',
          }}
        >
          <span className="block">{heroLine1}</span>
          <span className="block whitespace-nowrap">
            & scale{' '}
            <span className="relative inline-block align-baseline overflow-visible">
              {heroItalicWord ? (
                <span className="italic text-white/85 inline-block">{heroItalicWord}</span>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: '0.35em', filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: '-0.35em', filter: 'blur(6px)' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="italic text-white/85 inline-block"
                  >
                    {rotatingWords[idx % rotatingWords.length]}.
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          </span>
        </motion.h1>
        {heroSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-white/70 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}

function FloatingParticles() {
  const dots = [
    { x: '12%', y: '22%', s: 5, d: 6 },
    { x: '82%', y: '18%', s: 3, d: 8 },
    { x: '20%', y: '76%', s: 4, d: 7 },
    { x: '75%', y: '72%', s: 6, d: 9 },
    { x: '50%', y: '12%', s: 2, d: 10 },
    { x: '88%', y: '48%', s: 3, d: 7 },
    { x: '8%', y: '52%', s: 2, d: 8 },
  ]
  return (
    <>
      {dots.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [-14, 14, -14], x: [-6, 6, -6] }}
          transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          className="absolute rounded-full"
          style={{ left: p.x, top: p.y, width: p.s * 2, height: p.s * 2, background: '#ffffff', opacity: 0.35, boxShadow: '0 0 12px rgba(255,255,255,0.35)' }}
        />
      ))}
      {/* Slow orbit rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
        style={{ width: '86vw', height: '86vw', maxWidth: 1300, maxHeight: 1300 }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
        style={{ width: '108vw', height: '108vw', maxWidth: 1600, maxHeight: 1600 }}
      />
    </>
  )
}

/* ============================================================
   2 · HOW WE WORK — 5-step story with real photos + framer motion
============================================================ */
const STEPS = [
  {
    code: '01', title: 'Understand',
    desc: 'We start by listening. Your business, your P&L, your customers, your calendar. A 60-minute call where you talk more than us.',
    icon: MessageSquare,
    img: 'https://images.unsplash.com/photo-1573165662973-4ab3cf3d3508?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400',
    tag: 'Discovery',
  },
  {
    code: '02', title: 'Research',
    desc: 'Competitor teardowns, customer interviews, workflow audits. We show up to the second meeting knowing your industry better than most consultants.',
    icon: Search,
    img: 'https://images.pexels.com/photos/7947854/pexels-photo-7947854.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400',
    tag: 'Deep dive',
  },
  {
    code: '03', title: 'Present',
    desc: 'Fixed-scope proposal with wireframes, timelines and pricing. No surprises, no fine print, no six-meeting sales funnels.',
    icon: PenTool,
    img: 'https://images.unsplash.com/photo-1561123760-0b8467594a63?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400',
    tag: 'Proposal',
  },
  {
    code: '04', title: 'Iterate',
    desc: 'Weekly demos, weekly feedback, weekly progress. You steer the ship at every milestone — nothing gets built in the dark.',
    icon: RefreshCw,
    img: 'https://images.pexels.com/photos/3862154/pexels-photo-3862154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400',
    tag: 'Build loop',
  },
  {
    code: '05', title: 'Deliver & Ship',
    desc: 'On the deadline, in production, documented. Then we stay for the post-launch quarter so momentum never dies.',
    icon: Rocket,
    img: 'https://images.unsplash.com/photo-1652172100914-c5b691730756?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkZXZlbG9wZXIlMjB0ZWFtfGVufDB8fHxibGFja19hbmRfd2hpdGV8MTc4NDcyMjc2NXww&ixlib=rb-4.1.0&q=85&w=1400',
    tag: 'Launch',
  },
]

function HowWeWork() {
  // CMS-driven steps — falls back to the hardcoded STEPS until fetch resolves
  const [cmsSteps, setCmsSteps] = useState(null)
  useEffect(() => {
    fetch('/api/cms/how_we_work_steps')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d?.data) && d.data.length) setCmsSteps(d.data) })
      .catch(() => {})
  }, [])

  const ICONS = [MessageSquare, Search, PenTool, RefreshCw, Rocket]
  const steps = cmsSteps
    ? cmsSteps.map((s, i) => ({
        code: String(s.stepNumber || i + 1).padStart(2, '0'),
        title: s.title,
        desc: s.description,
        img: s.image || STEPS[i % STEPS.length].img,
        tag: s.accent || STEPS[i % STEPS.length].tag,
        icon: ICONS[i % ICONS.length],
      }))
    : STEPS

  return (
    <section className="relative bg-[#FAFAF7] py-24 md:py-40 px-6 md:px-10">
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
          {/* vertical line — desktop only */}
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-black/10 -translate-x-px hidden md:block" />

          <div className="space-y-16 md:space-y-32">
            {steps.map((s, i) => <StepBlock key={i} step={s} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function StepBlock({ step, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const isEven = index % 2 === 1
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className={`relative grid md:grid-cols-2 gap-8 md:gap-16 items-center ${isEven ? 'md:[direction:rtl]' : ''}`}
    >
      {/* TEXT SIDE */}
      <div className={`md:[direction:ltr] ${isEven ? 'md:text-right' : ''}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4 ${isEven ? 'flex-row-reverse' : ''}`}>
            <span className="font-mono text-[#0A0A0A] font-semibold">{step.code}</span>
            <span className="w-8 h-px bg-[#0A0A0A]" />
            <span>Step {index + 1}</span>
          </div>
          <h3 className="text-[#0A0A0A] leading-[1.05] tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4.5vw,58px)' }}>
            {step.title}
          </h3>
          <p className="text-[15px] text-[#525252] leading-relaxed max-w-md md:ml-auto md:mr-auto">{step.desc}</p>
        </motion.div>
      </div>

      {/* IMAGE SIDE */}
      <div className="md:[direction:ltr] relative">
        <motion.div
          style={{ y: imgY }}
          className="relative rounded-3xl overflow-hidden border border-black/10 aspect-[4/5] md:aspect-[5/6] bg-black"
        >
          <img
            src={step.img}
            alt={step.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(100%) contrast(1.05)' }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Overlay content */}
          <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[9px] tracking-[0.2em] uppercase font-semibold text-[#0A0A0A] px-3 py-1.5 rounded-full">
            <Icon size={11} /> {step.tag}
          </div>
          <div className="absolute top-5 right-5 font-mono text-[10px] tracking-[0.2em] text-white/70">{step.code}</div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-white text-lg md:text-xl font-medium tracking-tight">{step.title}</div>
            <div className="text-white/60 text-[11px] tracking-[0.2em] uppercase mt-1">Phase 0{index + 1}</div>
          </div>
        </motion.div>
        {/* Timeline node */}
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0A0A0A] border-4 border-[#FAFAF7]"
             style={isEven ? { right: 'calc(-50% + 20px)' } : { left: 'calc(-50% + 20px)' }} />
      </div>
    </motion.div>
  )
}

/* ============================================================
   3 · SELECTED WORK CAROUSEL — CMS-driven color-shifting
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
          <div className="max-w-2xl">
            <div className="text-[10px] tracking-[0.35em] uppercase opacity-60 mb-4">— Selected Work</div>
            <h2 className="leading-[1.02] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(36px,5.5vw,76px)' }}>
              Products that <span className="italic opacity-70">actually shipped.</span>
            </h2>
          </div>
          <Link href="/our-work" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold underline-offset-4 hover:underline">
            View all work <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
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
                  <span key={sv} className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-current/25 opacity-80">{sv}</span>
                ))}
              </div>
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
   4 · CLOSING STATEMENT
============================================================ */
function ClosingStatement() {
  // CMS-driven closing statement — text after the first '?' renders italic,
  // matching the original design. Falls back to the shipped copy.
  const cms = useCmsSiteSettings()
  const closing = cms?.closingStatement || ''
  const match = closing ? closing.match(/^([^?]*\?)\s*(.*)$/) : null
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
          {closing ? (
            match ? (
              <>{match[1]} <span className="italic text-white/60">{match[2]}</span></>
            ) : closing
          ) : (
            <>Have an idea? <span className="italic text-white/60">Let&apos;s build what comes next.</span></>
          )}
        </motion.h2>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <LandingFlow>
      <PageWrapper darkHero={false}>
        <Hero />
        <HowWeWork />
        <ClosingStatement />
      </PageWrapper>
    </LandingFlow>
  )
}
