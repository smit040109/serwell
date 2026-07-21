'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X, TrendingUp, BarChart3, Layers } from 'lucide-react'
import { useState } from 'react'
import { LandingFlow, Navbar, Footer } from '@/components/site/Shared'

const C = {
  white: '#ffffff',
  black: '#000000',
  mist: '#f2f2f2',
  bone: '#e5e5e5',
  graphite: '#575757',
  smoke: '#929292',
  sandstone: '#a8927c',
  forest: '#193a29',
  iris: '#79648c',
  slate: '#839cb2',
}
const FONT = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

const HERO_IMG = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80'

const scatterVideos = [
  { src: '/videos/p1.mp4', pos: 'top-[2%] left-[6%]', size: 'w-24 h-20', rot: '-rotate-6' },
  { src: '/videos/p2.mp4', pos: 'top-[6%] right-[8%]', size: 'w-28 h-20', rot: 'rotate-4' },
  { src: '/videos/p3.mp4', pos: 'bottom-[10%] left-[10%]', size: 'w-24 h-24', rot: 'rotate-3' },
  { src: '/videos/p4.mp4', pos: 'bottom-[4%] right-[12%]', size: 'w-28 h-20', rot: '-rotate-4' },
  { src: '/videos/p5.mp4', pos: 'top-[38%] left-[2%]', size: 'w-20 h-20', rot: 'rotate-2' },
  { src: '/videos/p6.mp4', pos: 'top-[40%] right-[3%]', size: 'w-24 h-20', rot: '-rotate-3' },
]

const categories = ['Websites', 'Software', 'ERPs', 'Automation', 'AI Agents', 'Marketing', 'D2C', 'Retail', 'Textiles', 'Hospitality']

const clients = [
  { icon: '🛠', line: 'One system replacing six spreadsheets and a dozen phone calls.', name: 'Servall' },
  { icon: '🎧', line: 'A brand website built to be felt before it is read.', name: 'L&T Tunes' },
  { icon: '🧵', line: 'Generations-old craft, translated for a scroll-first audience.', name: 'Sanskar Handloom' },
  { icon: '💎', line: 'Every preference tracked across a client\u2019s lifetime.', name: 'Sajvaar Diamonds' },
  { icon: '📦', line: 'Inventory and billing unified, built for the counter.', name: 'Square Parts' },
  { icon: '🎓', line: 'Onboarding rebuilt as a habit instead of a binder.', name: 'Servall LMS' },
]

const benchmarkCards = [
  { icon: TrendingUp, title: '5 years shipping real work.', body: 'Since 2021, one studio building websites, software, and growth systems for Gujarat and beyond.' },
  { icon: BarChart3, title: 'Every project ships with a number.', body: 'Faster resolution, more orders, fewer hours lost — the outcome is always measured, not assumed.' },
  { icon: Layers, title: 'One team, start to finish.', body: 'The people who design it are the people who build and support it. No vendors to chase.' },
]

/* ============================================================
   ANNOUNCEMENT BAR
============================================================ */
function AnnouncementBar() {
  const [show, setShow] = useState(true)
  if (!show) return null
  return (
    <div className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-center relative" style={{ background: C.black }}>
      <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
        VayuCodes now building AI agents for retail and hospitality —{' '}
        <Link href="/our-work" className="underline">See the work</Link>
      </span>
      <button onClick={() => setShow(false)} className="absolute right-4">
        <X size={14} color="rgba(255,255,255,0.5)" />
      </button>
    </div>
  )
}

/* ============================================================
   HERO
============================================================ */
function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden" style={{ background: C.black }}>
      <div className="absolute inset-0" style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.7) brightness(0.65)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.5))' }} />
      <div className="relative z-10 h-full w-full flex items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white"
          style={{ fontFamily: FONT, fontWeight: 400, fontSize: 'clamp(32px, 5.5vw, 64px)', lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: '900px' }}
        >
          Gujarat's businesses need software that actually works.
        </motion.h1>
      </div>
      <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-3">
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Scroll to explore</span>
        <div className="w-9 h-9 rounded-lg border flex items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
          <span style={{ color: '#fff' }}>↓</span>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   STORY BEAT — video card + text, sides alternate per beat
============================================================ */
function StoryBeat({ video, tag, title, desc, ctaText, ctaAccent, reverse }) {
  return (
    <section className="relative w-full py-28 px-6" style={{ background: C.black }}>
      <div className={`max-w-[1200px] mx-auto grid md:grid-cols-2 gap-14 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-[520px] aspect-[16/10] rounded-2xl overflow-hidden mx-auto"
          style={{ border: '1px solid rgba(255,255,255,0.15)', direction: 'ltr' }}
        >
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={video} type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ direction: 'ltr' }}
        >
          <span className="text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: FONT, color: 'rgba(255,255,255,0.4)' }}>{tag}</span>
          <h3 className="mt-3" style={{ fontFamily: FONT, fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#fff' }}>{title}</h3>
          <p className="mt-4 max-w-md" style={{ fontFamily: FONT, fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
          {ctaText && (
            <Link href="/our-work" className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-lg text-sm" style={{ fontFamily: FONT, background: ctaAccent, color: '#fff' }}>
              {ctaText} <ArrowRight size={14} />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   GREEN HIGHLIGHT PANEL
============================================================ */
function GreenPanel() {
  return (
    <section className="relative w-full py-24 px-6" style={{ background: C.black }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1000px] mx-auto rounded-3xl p-14 text-center"
        style={{ background: C.forest }}
      >
        <p style={{ fontFamily: FONT, fontWeight: 400, fontSize: 'clamp(22px, 3vw, 34px)', color: '#fff', lineHeight: 1.4 }}>
          150+ projects shipped for businesses across Gujarat and beyond.
        </p>
      </motion.div>
    </section>
  )
}

/* ============================================================
   SCATTER HEADLINE — looping videos with hover-zoom
============================================================ */
function CategoryHeadline() {
  return (
    <section className="relative w-full py-28 px-6" style={{ background: C.mist }}>
      <div className="max-w-[1100px] mx-auto relative text-center min-h-[420px] flex flex-col items-center justify-center">
        {scatterVideos.map((v, i) => (
          <div
            key={i}
            className={`hidden md:block absolute ${v.pos} ${v.size} ${v.rot} rounded-lg overflow-hidden transition-transform duration-300 hover:scale-125 hover:z-20 cursor-pointer`}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
          >
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src={v.src} type="video/mp4" />
            </video>
          </div>
        ))}

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
          style={{ fontFamily: FONT, fontWeight: 400, fontSize: 'clamp(30px, 5vw, 52px)', color: C.black, letterSpacing: '-0.02em' }}
        >
          Websites. Software. <span style={{ color: C.sandstone }}>Growth.</span>
        </motion.h2>

        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          {categories.map((c) => (
            <span key={c} className="px-3 py-1.5 rounded-full text-[12px]" style={{ fontFamily: FONT, background: C.white, color: C.graphite, border: `1px solid ${C.bone}` }}>{c}</span>
          ))}
        </div>

        <Link href="/contact" className="relative z-10 inline-block mt-9 px-6 py-3 rounded-lg text-sm" style={{ fontFamily: FONT, background: C.black, color: C.white }}>
          Get Started
        </Link>
      </div>
    </section>
  )
}

/* ============================================================
   CLIENT CAROUSEL
============================================================ */
function ClientCarousel() {
  const [start, setStart] = useState(0)
  const visible = 4
  const max = Math.max(0, clients.length - visible)
  return (
    <section className="relative w-full py-20 px-6" style={{ background: C.mist }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h3 style={{ fontFamily: FONT, fontWeight: 400, fontSize: '22px', color: C.black }}>Proven across every industry.</h3>
          <div className="flex gap-2">
            <button onClick={() => setStart(Math.max(0, start - 1))} className="w-9 h-9 rounded-lg border flex items-center justify-center" style={{ borderColor: C.bone, background: C.white }}>
              <ChevronLeft size={16} color={C.graphite} />
            </button>
            <button onClick={() => setStart(Math.min(max, start + 1))} className="w-9 h-9 rounded-lg border flex items-center justify-center" style={{ borderColor: C.bone, background: C.white }}>
              <ChevronRight size={16} color={C.graphite} />
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <motion.div className="flex gap-4" animate={{ x: `-${start * (100 / visible)}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            {clients.map((c) => (
              <div key={c.name} className="flex-shrink-0 rounded-xl p-6" style={{ width: `calc(${100 / visible}% - 12px)`, background: C.white, border: `1px solid ${C.bone}` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: C.mist }}>{c.icon}</div>
                <p className="mt-5" style={{ fontFamily: FONT, fontSize: '14px', lineHeight: 1.55, color: C.black }}>{c.line}</p>
                <div className="mt-5 text-[12px]" style={{ fontFamily: FONT, color: C.smoke }}>{c.name}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   BENCHMARK
============================================================ */
function Benchmark() {
  return (
    <section className="relative w-full py-24 px-6" style={{ background: C.white }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="mb-12" style={{ fontFamily: FONT, fontWeight: 400, fontSize: 'clamp(24px, 3vw, 32px)', color: C.black }}>
          We set the benchmark for what's possible in Gujarat.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benchmarkCards.map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="rounded-2xl p-7" style={{ background: C.mist }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.white }}>
                <b.icon size={17} color={C.graphite} />
              </div>
              <h3 className="mt-5" style={{ fontFamily: FONT, fontWeight: 400, fontSize: '18px', color: C.black }}>{b.title}</h3>
              <p className="mt-3" style={{ fontFamily: FONT, fontSize: '14px', lineHeight: 1.6, color: C.graphite }}>{b.body}</p>
              <Link href="/our-work" className="inline-flex items-center gap-1.5 mt-5 text-[13px]" style={{ fontFamily: FONT, color: C.black }}>
                Learn more <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   BENTO GRID
============================================================ */
function BentoGrid() {
  return (
    <section className="relative w-full py-24 px-6" style={{ background: C.white }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="mb-12 text-center" style={{ fontFamily: FONT, fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 36px)', color: C.iris }}>
          From the studio floor. The latest from VayuCodes.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl p-8 h-[260px] flex flex-col justify-end md:col-span-1 md:row-span-2" style={{ background: C.forest }}>
            <span className="text-[11px] uppercase tracking-[0.15em]" style={{ fontFamily: FONT, color: 'rgba(255,255,255,0.7)' }}>Case Study</span>
            <h3 className="mt-2" style={{ fontFamily: FONT, fontWeight: 400, fontSize: '20px', color: '#fff' }}>Servall × VayuCodes</h3>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.06 }} className="rounded-2xl p-8 h-[120px] flex flex-col justify-end md:col-span-2" style={{ background: C.sandstone }}>
            <span className="text-[11px] uppercase tracking-[0.15em]" style={{ fontFamily: FONT, color: 'rgba(0,0,0,0.55)' }}>Story</span>
            <h3 className="mt-2" style={{ fontFamily: FONT, fontWeight: 400, fontSize: '19px', color: C.black }}>How Sanskar Handloom scaled festive orders</h3>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.12 }} className="rounded-2xl p-8 h-[120px] flex flex-col justify-end" style={{ background: C.mist }}>
            <span className="text-[11px] uppercase tracking-[0.15em]" style={{ fontFamily: FONT, color: C.smoke }}>Notes</span>
            <h3 className="mt-2" style={{ fontFamily: FONT, fontWeight: 400, fontSize: '17px', color: C.black }}>Building AI agents that don't sleep</h3>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.18 }} className="rounded-2xl p-8 h-[120px] flex flex-col justify-end" style={{ background: C.slate }}>
            <span className="text-[11px] uppercase tracking-[0.15em]" style={{ fontFamily: FONT, color: 'rgba(255,255,255,0.7)' }}>Case Study</span>
            <h3 className="mt-2" style={{ fontFamily: FONT, fontWeight: 400, fontSize: '17px', color: '#fff' }}>Inside the Square Parts rollout</h3>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FINAL CTA
============================================================ */
function FinalCta() {
  return (
    <section className="relative w-full py-20 px-6" style={{ background: C.white }}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-2xl overflow-hidden px-10 py-16 md:px-16" style={{ background: C.sandstone }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 400, fontSize: 'clamp(28px, 4vw, 44px)', color: C.black, letterSpacing: '-0.02em' }}>Our work, your growth.</h2>
          <p className="mt-4 max-w-md" style={{ fontFamily: FONT, fontSize: '15px', lineHeight: 1.6, color: 'rgba(0,0,0,0.7)' }}>
            Book a call today and see how VayuCodes can build the system your business actually needs.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg text-sm" style={{ fontFamily: FONT, background: C.black, color: C.white }}>
            Get Started <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   PAGE
============================================================ */
export default function Home() {
  return (
    <LandingFlow>
      <AnnouncementBar />
      <Navbar darkHero={true} />
      <Hero />
      <StoryBeat
        video="/videos/p1.mp4"
        tag="Applications"
        title="Systems that actually work."
        desc="Most software projects in Gujarat stall halfway. We find the right build, ship it end to end, and own the outcome."
        ctaText="See Our Work"
        ctaAccent={C.forest}
        reverse={false}
      />
      <StoryBeat
        video="/videos/p2.mp4"
        tag="Data"
        title="The plan behind every pixel."
        desc="Every build starts as a system diagram before it becomes a single screen — so what ships is built to last."
        ctaText="Our Process"
        ctaAccent={C.iris}
        reverse={true}
      />
      <GreenPanel />
      <CategoryHeadline />
      <ClientCarousel />
      <Benchmark />
      <BentoGrid />
      <FinalCta />
      <Footer />
    </LandingFlow>
  )
}
