'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  PageWrapper, PageHero, SectionHeading, CTABlock, Tilt3DCard, PORTFOLIO_IMAGES
} from '@/components/site/Shared'

const CASE_STUDIES = [
  {
    n: '01', tag: 'Hospitality · Website + Booking', title: 'Nirvana Eco-Resort', location: 'Saputara, Gujarat',
    body: 'A 24-villa boutique resort tucked into the Sahyadri ghats. We built a cinematic website with a real-time direct-booking engine, replacing OTA commissions with a clean revenue stream — 4.2× direct bookings in 90 days.',
    stat: '4.2×', statLabel: 'Direct Bookings',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80',
    accent: '#FF8A3D',
  },
  {
    n: '02', tag: 'Manufacturing · Custom ERP', title: 'Sutra Textile Co.', location: 'Surat, Gujarat',
    body: 'A third-generation textile exporter drowning in registers. We engineered a custom ERP — order intake on WhatsApp, real-time loom tracking, and one-tap dispatch — cutting reconciliation from 4 days to 9 minutes.',
    stat: '9 min', statLabel: 'Recon Time',
    img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1800&q=80',
    accent: '#E85D2C',
  },
  {
    n: '03', tag: 'D2C · E-commerce + Ads', title: 'Anaya Jewels', location: 'Rajkot → Pan-India',
    body: 'A heritage jewelry house ready to skip the showroom era. We shipped a slick D2C store, plugged Instagram and Meta funnels, and ran festive performance ads — ₹1.2 Cr in 60 days from a cold audience.',
    stat: '₹1.2 Cr', statLabel: 'GMV · 60 days',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=80',
    accent: '#FFD9B8',
  },
  {
    n: '04', tag: 'Retail · POS + Local SEO', title: 'Bandhan Retail', location: '11 outlets · South Gujarat',
    body: 'Eleven outlets, eleven Excel sheets, zero clarity. We deployed a unified POS, synced inventory across stores, and lit up local-SEO — footfall up 38%, stockouts down 71% within a quarter.',
    stat: '+38%', statLabel: 'Footfall',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=80',
    accent: '#FF8A3D',
  },
]

/* CASE STUDY SLIDE — fixed overlap */
function CaseStudySlide({ scrollYProgress, index, total, project }) {
  const start = index / total
  const center = (index + 0.5) / total
  const end = (index + 1) / total

  const borderRadius = useTransform(scrollYProgress, [start, center, end], ['50%', '22px', '50%'])
  const scale = useTransform(scrollYProgress, [start, center, end], [0.62, 1, 0.62])
  const imgScale = useTransform(scrollYProgress, [start, center, end], [1.25, 1, 1.25])
  const textOpacity = useTransform(scrollYProgress, [start + 0.02, center - 0.02, center + 0.02, end - 0.02], [0, 1, 1, 0])
  const textY = useTransform(scrollYProgress, [start, center, end], [50, 0, -50])

  return (
    <div className="relative h-screen w-screen flex-shrink-0 flex items-center px-6 lg:px-20 pt-40">
      <div className="relative w-full max-w-[1500px] mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div style={{ opacity: textOpacity, y: textY }} className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-[#0E0E10]/30" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0E0E10]/60">
              Case Study · {project.tag}
            </span>
          </div>

          <h3 className="text-[clamp(36px,4.2vw,64px)] leading-[1] text-[#0E0E10] tracking-[-0.02em] font-light mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            {project.title}
          </h3>
          <div className="text-xs tracking-[0.2em] uppercase text-[#0E0E10]/50 mb-6">{project.location}</div>
          <p className="text-zinc-600 leading-relaxed max-w-md mb-8">{project.body}</p>

          <div className="flex items-end gap-6 pt-6 border-t border-[#0E0E10]/15">
            <div>
              <div className="text-5xl font-light text-[#0E0E10] tabular-nums leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                {project.stat}
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#0E0E10]/50 mt-2">{project.statLabel}</div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <motion.div
            style={{ borderRadius, scale, boxShadow: `0 40px 80px -30px ${project.accent}40, 0 0 0 1px rgba(14,14,16,0.05)` }}
            className="relative aspect-[4/3] w-full max-w-[640px] overflow-hidden bg-[#F4F1EA]"
          >
            <motion.img
              src={project.img}
              alt={project.title}
              style={{ scale: imgScale }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 mix-blend-multiply opacity-15" style={{ background: `radial-gradient(circle at 30% 30%, ${project.accent}, transparent 60%)` }} />
            <div className="absolute top-5 left-5 backdrop-blur-md bg-white/70 border border-white/40 rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase font-semibold text-[#0E0E10]">
              · {project.n} · Live
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function HorizontalCaseStudies() {
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const total = CASE_STUDIES.length
  const xPct = useTransform(scrollYProgress, [0, 1], ['0%', `-${(total - 1) * (100 / total)}%`])

  const [activeIdx, setActiveIdx] = useState(0)
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      const idx = Math.min(total - 1, Math.max(0, Math.round(v * (total - 1) + 0.0001)))
      setActiveIdx(idx)
    })
  }, [scrollYProgress, total])

  return (
    <section ref={trackRef} className="relative bg-[#F4F1EA]" style={{ height: `${total * 100}vh` }}>
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <div className="absolute top-0 inset-x-0 z-20 pt-20 px-6 lg:px-20 pointer-events-none">
          <div className="max-w-[1500px] mx-auto flex items-end justify-between">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#0E0E10]/60 mb-2 inline-block">
                · Selected work · 2024 – 2025
              </span>
              <h2 className="text-[clamp(24px,3vw,44px)] leading-[1] text-[#0E0E10] tracking-[-0.02em] font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                Case <span className="italic text-[#E85D2C]">studies.</span>
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[10px] tracking-[0.3em] uppercase text-[#0E0E10]/50">
              <span className="tabular-nums">
                {String(activeIdx + 1).padStart(2, '0')} <span className="opacity-40">/ {String(total).padStart(2, '0')}</span>
              </span>
              <span className="opacity-60">Scroll ↓ to navigate →</span>
            </div>
          </div>
        </div>

        <motion.div style={{ x: xPct, width: `${total * 100}vw` }} className="flex h-full">
          {CASE_STUDIES.map((p, i) => (
            <CaseStudySlide key={p.n} scrollYProgress={scrollYProgress} index={i} total={total} project={p} />
          ))}
        </motion.div>

        <div className="absolute bottom-10 inset-x-0 px-6 lg:px-20 z-20">
          <div className="max-w-[1500px] mx-auto flex items-center gap-3">
            {CASE_STUDIES.map((_, i) => (
              <div key={i} className="flex-1 h-[2px] bg-[#0E0E10]/10 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-[#0E0E10]"
                  initial={false}
                  animate={{ width: i <= activeIdx ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* MORE PROJECTS GRID */
function MoreProjects() {
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10 border-t border-[#0E0E10]/8">
      <div className="max-w-[1500px] mx-auto">
        <SectionHeading tag="· More work" title="A peek inside the studio." italicWord="inside the studio." />

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_IMAGES.slice(0, 6).map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
            >
              <Tilt3DCard intensity={8} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100">
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10]/60 via-transparent to-transparent" />
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function OurWorkPage() {
  return (
    <PageWrapper darkHero={true}>
      <PageHero
        tag="· Our work"
        title="50+ businesses. Real receipts."
        italicWord="Real receipts."
        subtitle="From textile manufacturers in Surat to retail chains across South Gujarat — these are the businesses we've helped trade Excel sheets for dashboards, pamphlets for funnels, and ‘we'll think about it’ for ‘can you start tomorrow?’."
      />
      <HorizontalCaseStudies />
      <MoreProjects />
      <CTABlock kicker="Want to be next?" title="Let's add your name to this list." italicWord="to this list." />
    </PageWrapper>
  )
}
