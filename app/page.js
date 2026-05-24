'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, Globe, Cpu, TrendingUp, ShieldCheck, Zap, Users,
  MapPin, CheckCircle2, AlertTriangle, BarChart3, Code2, Sparkles,
  Phone, Mail, MessageSquare, Menu, X
} from 'lucide-react'

const NAVY = '#0A2540'
const TEAL = '#00D4B6'
const SILVER = '#F8F9FA'

const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1648134859187-71dadc9f815a',
  'https://images.unsplash.com/photo-1648134859177-525771773915',
  'https://images.unsplash.com/photo-1648134859196-3aa762e9440d',
  'https://images.pexels.com/photos/27141314/pexels-photo-27141314.jpeg',
  'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg',
  'https://images.unsplash.com/photo-1660970781103-ba6749cb9ce3',
  'https://images.unsplash.com/photo-1648134859186-a05fb609f41e',
  'https://images.unsplash.com/photo-1590658094082-88f4c5814ea1',
  'https://images.pexels.com/photos/8636589/pexels-photo-8636589.jpeg',
]

/* ============================================================
   NAV — fixed top, glassy on scroll
============================================================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-100 shadow-[0_1px_0_rgba(10,37,64,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <a href="#top" className="text-2xl font-extrabold tracking-tight text-[#0A2540]">
          vayu<span className="text-[#00D4B6]">.code</span>
        </a>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-600">
          <a href="#services" className="hover:text-[#0A2540] transition-colors">Services</a>
          <a href="#why-us" className="hover:text-[#0A2540] transition-colors">Why Us</a>
          <a href="#portfolio" className="hover:text-[#0A2540] transition-colors">Our Work</a>
          <a href="#trust" className="hover:text-[#0A2540] transition-colors">Trust</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex bg-[#0A2540] text-white text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-full hover:bg-zinc-800 transition-all shadow-sm"
          >
            Contact Us
          </a>
          <button
            className="md:hidden p-2 text-[#0A2540]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 space-y-3 text-sm font-medium text-zinc-700">
          <a href="#services" onClick={() => setOpen(false)} className="block">Services</a>
          <a href="#why-us" onClick={() => setOpen(false)} className="block">Why Us</a>
          <a href="#portfolio" onClick={() => setOpen(false)} className="block">Our Work</a>
          <a href="#contact" onClick={() => setOpen(false)} className="block text-[#00D4B6]">Contact Us →</a>
        </div>
      )}
    </motion.header>
  )
}

/* ============================================================
   HERO — expanding canvas (Lesse Studio mechanic)
============================================================ */
function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const containerPadding = useTransform(scrollYProgress, [0, 0.4], ['24px', '0px'])
  const containerRadius = useTransform(scrollYProgress, [0, 0.4], ['32px', '0px'])
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} id="top" className="relative w-full min-h-[160vh] bg-[#F8F9FA]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ padding: containerPadding, borderRadius: containerRadius }}
          className="relative w-full h-full bg-white flex flex-col justify-between border border-zinc-100 overflow-hidden"
        >
          {/* Ambient wind / glassmorphic waves */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/3 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-[#00D4B6]/10 via-[#00D4B6]/0 to-transparent blur-3xl" />
            <div className="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] rounded-full bg-gradient-to-tl from-[#0A2540]/8 via-[#0A2540]/0 to-transparent blur-3xl" />
            {/* subtle grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0A2540" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* wind streams */}
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="wind-stream absolute h-px bg-gradient-to-r from-transparent via-[#00D4B6]/40 to-transparent"
                style={{ top: `${20 + i * 18}%`, width: '40%', animationDelay: `${i * 2}s` }}
              />
            ))}
          </div>

          {/* placeholder for nav-height since Navbar is fixed */}
          <div className="h-20" />

          {/* HERO CONTENT */}
          <motion.main
            style={{ scale: textScale, opacity: textOpacity }}
            className="relative z-10 w-full max-w-5xl mx-auto text-center px-6 my-auto flex flex-col items-center justify-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-6 bg-[#00D4B6]/10 px-4 py-1.5 rounded-full"
            >
              <MapPin size={12} /> Based in Valsad, Gujarat
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0A2540] tracking-tight leading-[1.05] mb-6 text-balance"
            >
              We Build the Tech That Runs Your Business.
              <br />
              <span className="bg-gradient-to-r from-[#0A2540] via-[#1a4d8a] to-[#00D4B6] bg-clip-text text-transparent">
                We Run the Marketing That Drives Your Growth.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-normal leading-relaxed mb-10 text-balance"
            >
              No complex jargon. Just blazing-fast websites that never crash, custom software that automates your daily operations, and targeted local marketing that fills your business with ready-to-buy customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <a
                href="#contact"
                className="group flex items-center gap-3 bg-[#0A2540] text-white font-semibold text-sm px-8 py-4 rounded-full shadow-[0_10px_30px_-10px_rgba(10,37,64,0.45)] hover:shadow-[0_18px_40px_-10px_rgba(10,37,64,0.5)] hover:bg-zinc-800 transition-all"
              >
                Modernize My Business Today
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#portfolio"
                className="flex items-center gap-2 text-sm font-medium text-[#0A2540] hover:text-[#00D4B6] transition-colors px-4 py-2"
              >
                See our work
                <ArrowRight size={14} />
              </a>
            </motion.div>

            {/* Trust micro-row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#00D4B6]" /> Local Gujarat Team</span>
              <span className="flex items-center gap-2"><Zap size={14} className="text-[#00D4B6]" /> Blazing-fast Delivery</span>
              <span className="flex items-center gap-2"><Users size={14} className="text-[#00D4B6]" /> 50+ Local Businesses</span>
            </div>
          </motion.main>

          <div className="relative z-10 pb-8 text-center text-xs text-zinc-400 font-medium uppercase tracking-widest">
            Scroll down to explore ↓
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ============================================================
   PROBLEM SECTION — pain points
============================================================ */
function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Losing Customers to Online Competitors',
      body: 'Your competitors show up first on Google while your shop relies on word-of-mouth. Every day without a strong online presence is a customer walking into someone else\'s store.',
    },
    {
      icon: BarChart3,
      title: 'Drowning in Excel Sheets & Paper Registers',
      body: 'Inventory mismatched, orders missed, staff confused. Your business runs on memory and messy spreadsheets — one mistake costs you lakhs in lost stock and trust.',
    },
    {
      icon: TrendingUp,
      title: 'Marketing Money That Brings Zero Sales',
      body: 'You\'ve paid agencies for "posts" and "likes" — but not one ready-to-buy customer walked in. Marketing without sales is just expensive decoration.',
    },
  ]
  return (
    <section className="relative bg-white py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
            // The Problem We Solve
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.1] text-balance">
            Running a business in 2025 shouldn&apos;t feel like fighting fires every morning.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative bg-[#F8F9FA] rounded-3xl p-8 border border-zinc-100 hover:border-[#00D4B6]/40 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(10,37,64,0.15)] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-6 group-hover:bg-[#0A2540] group-hover:border-[#0A2540] transition-colors">
                <p.icon size={20} className="text-[#0A2540] group-hover:text-[#00D4B6] transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-3 leading-snug">{p.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   SPLIT PINNED SECTION — left sticky, right scrolling mockups (grayscale → color)
============================================================ */
function SplitPinnedSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const yTrack = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66%'])

  const blocks = [
    {
      tag: '01 / WEBSITES',
      title: 'Your 24/7 Digital Showroom',
      body: 'Custom websites built from scratch — blazing fast on every phone, every village, every network. They look premium, load instantly, and turn casual visitors into paying clients while you sleep.',
      img: PORTFOLIO_IMAGES[0],
    },
    {
      tag: '02 / SOFTWARE',
      title: 'Automate Your Daily Operations',
      body: 'Custom systems that track inventory, orders, leads, and staff — replacing manual errors and messy registers. Made for the way your business actually works, not the way an app from America thinks it should.',
      img: PORTFOLIO_IMAGES[1],
    },
    {
      tag: '03 / MARKETING',
      title: 'Consistent Customer Inflow',
      body: 'Targeted local ads and Gujarati-first social strategy that bring real sales inquiries — not vanity likes. We measure success in calls answered and bills raised.',
      img: PORTFOLIO_IMAGES[2],
    },
  ]

  return (
    <section ref={sectionRef} id="services" className="relative bg-[#F8F9FA]" style={{ height: `${blocks.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col md:flex-row">
        {/* LEFT — sticky header */}
        <div className="md:w-1/2 w-full md:h-screen flex items-center justify-center bg-white border-r border-zinc-100 px-8 md:px-16 py-12">
          <div className="max-w-md">
            <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
              // What We Build
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.05] mb-6 text-balance">
              Three engines.
              <br />
              <span className="bg-gradient-to-r from-[#0A2540] to-[#00D4B6] bg-clip-text text-transparent">
                One unstoppable business.
              </span>
            </h2>
            <p className="text-zinc-600 text-base leading-relaxed mb-8">
              Websites that sell. Software that runs your shop floor. Marketing that fills your phone with buyers. We don&apos;t do one — we do all three, stitched together.
            </p>
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
              <div className="flex -space-x-2">
                {[TEAL, NAVY, '#1a4d8a'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              Scroll → to explore each
            </div>
          </div>
        </div>

        {/* RIGHT — scrolling blocks */}
        <div className="md:w-1/2 w-full md:h-screen overflow-hidden relative">
          <motion.div
            style={{ y: yTrack }}
            className="w-full"
          >
            {blocks.map((b, i) => (
              <div key={i} className="h-screen w-full flex items-center justify-center px-8 md:px-16 py-12">
                <div className="max-w-lg w-full">
                  <div
                    className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-[0_30px_80px_-30px_rgba(10,37,64,0.25)] mb-6 aspect-[16/10]"
                  >
                    <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] font-bold tracking-widest text-[#00D4B6] uppercase mb-3">{b.tag}</div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#0A2540] mb-3 tracking-tight">{b.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   TILTED PORTFOLIO GRID — 50/50, left tilted img grid scrolls up, right copy fades
============================================================ */
function TiltedPortfolio() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const yShift = useTransform(scrollYProgress, [0, 1], ['10%', '-25%'])

  return (
    <section ref={sectionRef} id="portfolio" className="relative bg-white py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT — Tilted grid */}
        <div className="relative h-[600px] lg:h-[700px] overflow-hidden rounded-3xl bg-[#F8F9FA] border border-zinc-100">
          <motion.div
            style={{ y: yShift, rotate: -12 }}
            className="absolute inset-0 -inset-x-20 grid grid-cols-3 gap-4 p-8 origin-center"
          >
            {PORTFOLIO_IMAGES.concat(PORTFOLIO_IMAGES).slice(0, 12).map((src, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-zinc-200 shadow-[0_20px_50px_-20px_rgba(10,37,64,0.25)] aspect-[3/4]"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        {/* RIGHT — cross-fading trust copy */}
        <div className="space-y-10">
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase">
            // Proof of Work
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.05] text-balance">
            Real businesses.
            <br />
            <span className="bg-gradient-to-r from-[#0A2540] to-[#00D4B6] bg-clip-text text-transparent">
              Real numbers.
            </span>
          </h2>
          <p className="text-zinc-600 text-lg leading-relaxed">
            From textile manufacturers in Surat to retail chains across South Gujarat — we&apos;ve replaced registers with real-time dashboards, replaced pamphlets with WhatsApp funnels, and replaced &quot;we&apos;ll think about it&quot; with &quot;can you start tomorrow?&quot;.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {[
              { k: '50+', v: 'Local Businesses Modernized' },
              { k: '3.2x', v: 'Average Sales Lift in 90 days' },
              { k: '99.9%', v: 'Website Uptime Delivered' },
              { k: '12 hr', v: 'Average Response Time' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-l-2 border-[#00D4B6] pl-4"
              >
                <div className="text-3xl font-extrabold text-[#0A2540]">{s.k}</div>
                <div className="text-sm text-zinc-500 mt-1">{s.v}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   WHY GUJARAT TRUSTS US
============================================================ */
function TrustSection() {
  const points = [
    { icon: MapPin, title: 'Local Partners, Not Distant Vendors', body: 'We\'re right here in Valsad. Walk into our office, call us in Gujarati, message us on WhatsApp. No outsourced support teams reading scripts.' },
    { icon: Users, title: 'We Understand Gujarat\'s Market', body: 'We know the rhythm of Diwali sales, the festive ad spikes, the way your customer talks. Mumbai and Bangalore agencies guess — we know.' },
    { icon: ShieldCheck, title: 'Built to Scale While You Focus on Execution', body: 'You run your factory, your shop, your team. We handle the tech, the website, the leads. One predictable monthly partner — not five vendors fighting each other.' },
  ]
  return (
    <section id="trust" className="relative bg-[#0A2540] text-white py-32 px-6 overflow-hidden">
      {/* ambient teal glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#00D4B6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[60vw] h-[60vw] rounded-full bg-[#00D4B6]/5 blur-3xl" />

      <div id="why-us" className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
            // Why Gujarat Trusts vayu.code
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
            You don&apos;t need a Mumbai agency.
            <br />
            <span className="text-[#00D4B6]">You need a partner who picks up the phone.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#00D4B6]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00D4B6]/15 border border-[#00D4B6]/30 flex items-center justify-center mb-6">
                <p.icon size={20} className="text-[#00D4B6]" />
              </div>
              <h3 className="text-lg font-bold mb-3 leading-snug">{p.title}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-1">Ready to stop losing customers to outdated systems?</h3>
            <p className="text-zinc-300 text-sm">Book a free 30-minute consultation. We&apos;ll tell you exactly what to fix — even if you don&apos;t hire us.</p>
          </div>
          <a href="#contact" className="group flex items-center gap-3 bg-[#00D4B6] text-[#0A2540] font-bold text-sm px-8 py-4 rounded-full hover:bg-white transition-all whitespace-nowrap">
            Book Free Consultation
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   CONTACT FORM
============================================================ */
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' })
  const [status, setStatus] = useState({ loading: false, ok: false, err: '' })

  async function submit(e) {
    e.preventDefault()
    setStatus({ loading: true, ok: false, err: '' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStatus({ loading: false, ok: true, err: '' })
      setForm({ name: '', email: '', phone: '', business: '', message: '' })
    } catch (err) {
      setStatus({ loading: false, ok: false, err: err.message })
    }
  }

  return (
    <section id="contact" className="relative bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <span className="text-xs font-bold tracking-widest text-[#00D4B6] uppercase mb-4 inline-block">
            // Let&apos;s Build Together
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-[1.05] mb-6 text-balance">
            Tell us about your business.
          </h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Drop your details. We&apos;ll call within 12 hours — not next week. Free consultation, no obligations, no jargon.
          </p>
          <div className="space-y-4 text-sm text-zinc-700">
            <div className="flex items-center gap-3"><MapPin size={16} className="text-[#00D4B6]" /> Valsad, Gujarat — India</div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-[#00D4B6]" /> hello@vayu.code</div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-[#00D4B6]" /> +91 — Available on WhatsApp</div>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-3 bg-[#F8F9FA] rounded-3xl p-8 md:p-10 border border-zinc-100 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Your Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
            <Input label="Phone (optional)" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
            <Input label="Business Name" value={form.business} onChange={v => setForm({ ...form, business: v })} />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2 block">
              Tell us briefly what you need
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#00D4B6]/30 text-sm text-[#0A2540] placeholder:text-zinc-400 resize-none"
              placeholder="e.g. We run a textile shop in Surat — need a website and want to start running ads."
            />
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0A2540] text-white font-semibold text-sm px-8 py-4 rounded-full shadow-md hover:bg-zinc-800 transition-all disabled:opacity-60"
          >
            {status.loading ? 'Sending…' : 'Send Inquiry'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          {status.ok && (
            <div className="flex items-center gap-2 text-sm text-[#00D4B6] font-medium">
              <CheckCircle2 size={16} /> Got it! We&apos;ll call within 12 hours.
            </div>
          )}
          {status.err && (
            <div className="text-sm text-red-600 font-medium">{status.err}</div>
          )}
        </form>
      </div>
    </section>
  )
}

function Input({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#00D4B6]/30 text-sm text-[#0A2540] placeholder:text-zinc-400"
      />
    </div>
  )
}

/* ============================================================
   FOOTER
============================================================ */
function Footer() {
  return (
    <footer className="bg-[#F8F9FA] border-t border-zinc-100 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold tracking-tight text-[#0A2540]">
            vayu<span className="text-[#00D4B6]">.code</span>
          </span>
          <span className="text-xs text-zinc-400">© 2025 — Built in Valsad, Gujarat 🇮🇳</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#services" className="hover:text-[#0A2540] transition-colors">Services</a>
          <a href="#portfolio" className="hover:text-[#0A2540] transition-colors">Work</a>
          <a href="#contact" className="hover:text-[#0A2540] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   APP
============================================================ */
function App() {
  return (
    <main className="relative bg-white">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SplitPinnedSection />
      <TiltedPortfolio />
      <TrustSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

export default App
