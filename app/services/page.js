'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Cpu, TrendingUp, Check } from 'lucide-react'
import {
  PageWrapper, PageHero, SectionHeading, CTABlock, Tilt3DCard, PORTFOLIO_IMAGES
} from '@/components/site/Shared'

/* SERVICES SPLIT SCROLLYTELLING */
function ServicesSplit() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  const blocks = [
    { tag: '01 / Websites', title: 'Your 24/7 Digital Showroom', body: 'Custom websites built from scratch — blazing fast on every phone, every village, every network. They look premium, load instantly, and turn casual visitors into paying clients while you sleep.', img: PORTFOLIO_IMAGES[0] },
    { tag: '02 / Software', title: 'Automate Your Operations', body: 'Custom systems that track inventory, orders, leads, and staff — replacing manual errors and messy registers. Built for the way your business actually works, not the way an app from America thinks it should.', img: PORTFOLIO_IMAGES[1] },
    { tag: '03 / Marketing', title: 'Consistent Customer Inflow', body: 'Targeted local ads and Gujarati-first social strategy that bring real sales inquiries — not vanity likes. We measure success in calls answered and bills raised.', img: PORTFOLIO_IMAGES[2] },
  ]

  return (
    <section ref={sectionRef} className="relative bg-[#F4F1EA]" style={{ height: `${blocks.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col md:flex-row">
        <div className="md:w-1/2 md:h-screen flex items-center justify-center bg-white border-r border-[#0E0E10]/8 px-8 md:px-16 py-12">
          <div className="max-w-md">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">
              · The three engines
            </span>
            <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1] text-[#0E0E10] tracking-[-0.02em] font-light mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              We don&apos;t do one.
              <br />
              <span className="italic text-[#E85D2C]">We do all three.</span>
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              Websites that sell. Software that runs your shop floor. Marketing that fills your phone with buyers. Three engines, stitched together — one growth machine.
            </p>
          </div>
        </div>

        <div className="md:w-1/2 md:h-screen overflow-hidden relative">
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', `-${(blocks.length - 1) * (100/blocks.length)*3}%`]) }}
            className="w-full"
          >
            {blocks.map((b, i) => (
              <div key={i} className="h-screen w-full flex items-center justify-center px-8 md:px-16 py-12">
                <div className="max-w-lg w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-[0_30px_80px_-30px_rgba(14,14,16,0.25)] mb-6 aspect-[16/10]">
                    <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] font-bold tracking-[0.25em] text-[#E85D2C] uppercase mb-3">{b.tag}</div>
                  <h3 className="text-2xl md:text-3xl font-light text-[#0E0E10] mb-3 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-playfair)' }}>{b.title}</h3>
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

/* PROCESS TIMELINE WITH 3D CARDS */
function ProcessTimeline() {
  const steps = [
    { n: '01', title: 'Discovery', desc: 'We sit with you, sip chai, and map your business pain. No tech speak. Just real talk.' },
    { n: '02', title: 'Design', desc: 'Editorial wireframes & systems thinking. We make sure it looks premium AND works for your customer.' },
    { n: '03', title: 'Build', desc: 'Hand-crafted code. No bloated templates. Every pixel tuned for speed and conversion.' },
    { n: '04', title: 'Launch', desc: 'Live in weeks, not quarters. Soft launch, A/B test, then scale with confidence.' },
    { n: '05', title: 'Optimize', desc: 'We don\'t disappear after delivery. Monthly performance reviews, dashboard insights, growth iterations.' },
  ]
  return (
    <section className="relative bg-[#0E0E10] text-white py-32 px-6 lg:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/10 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="max-w-3xl mb-20">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">· Our process</span>
          <h2 className="text-[clamp(40px,6vw,88px)] leading-[1] tracking-[-0.02em] font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
            How we ship.
            <br />
            <span className="italic text-[#FFD9B8]">Honestly.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1200 }}
            >
              <Tilt3DCard intensity={12} className="h-full">
                <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#E85D2C]/40 transition-all">
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-[#E85D2C] font-bold mb-8">{s.n}</div>
                    <h3 className="text-xl font-light tracking-tight mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{s.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* CAPABILITIES GRID */
function Capabilities() {
  const caps = [
    { title: 'Web Design & Development', items: ['Next.js / React websites', 'E-commerce platforms', 'Direct booking engines', 'Headless CMS setup'] },
    { title: 'Custom Software', items: ['ERP & dashboards', 'Inventory & POS systems', 'WhatsApp business integrations', 'AI-powered workflows'] },
    { title: 'Performance Marketing', items: ['Meta & Google Ads', 'Gujarati-first content', 'Local SEO & GBP', 'Conversion-rate optimization'] },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <SectionHeading tag="· What's inside" title="Every capability we hold under one roof." italicWord="under one roof." />

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {caps.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-white border border-[#0E0E10]/8 rounded-3xl p-8 hover:shadow-[0_30px_60px_-30px_rgba(14,14,16,0.15)] transition-all"
            >
              <h3 className="text-xl font-semibold text-[#0E0E10] mb-6">{c.title}</h3>
              <ul className="space-y-3">
                {c.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-zinc-700">
                    <Check size={14} className="text-[#E85D2C] mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  return (
    <PageWrapper darkHero={true}>
      <PageHero
        tag="· Services"
        title="What we make for businesses that mean business."
        italicWord="that mean business."
        subtitle="Three engines under one roof. Websites, custom software, and performance marketing — stitched into one growth system. No vendor juggling. No jargon. Just results that show up in your bank statement."
      />
      <ServicesSplit />
      <ProcessTimeline />
      <Capabilities />
      <CTABlock kicker="Let's build yours" title="Talk to a human, not a chatbot." italicWord="a human," />
    </PageWrapper>
  )
}
