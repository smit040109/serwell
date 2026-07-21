'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Users, ShieldCheck, Sparkles, Zap, Check, X } from 'lucide-react'
import {
  PageWrapper, PageHero, SectionHeading, CTABlock, Tilt3DCard
} from '@/components/site/Shared'

function TrustPillars() {
  const points = [
    { icon: MapPin, title: 'Local Partners, Not Distant Vendors', body: 'We\'re right here in Valsad. Walk into our office, call us in Gujarati, message us on WhatsApp. No outsourced support teams reading scripts. No 14-hour timezone delays. Just real conversations with the people building your business.' },
    { icon: Users, title: 'We Understand Gujarat\'s Market', body: 'We know the rhythm of Diwali sales, the festive ad spikes, the way your customer talks. We design for the way Gujarati buyers research, compare, and decide. Mumbai and Bangalore agencies guess — we know.' },
    { icon: ShieldCheck, title: 'Built to Scale While You Focus', body: 'You run your factory, your shop, your team. We handle the tech, the website, the leads. One predictable monthly partner — not five vendors fighting each other for credit when things go wrong.' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <SectionHeading tag="· The three pillars" title="Why local businesses pick us first." italicWord="pick us first." />

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1500 }}
            >
              <Tilt3DCard intensity={10} className="h-full">
                <div className="h-full bg-white rounded-3xl p-10 border border-[#0E0E10]/8 hover:border-[#E85D2C]/40 hover:shadow-[0_30px_60px_-30px_rgba(232,93,44,0.25)] transition-all">
                  <div style={{ transform: 'translateZ(40px)' }}>
                    <div className="w-12 h-12 rounded-2xl bg-[#E85D2C]/10 border border-[#E85D2C]/20 flex items-center justify-center mb-8">
                      <p.icon size={20} className="text-[#E85D2C]" />
                    </div>
                    <h3 className="text-xl text-[#0E0E10] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400 }}>{p.title}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{p.body}</p>
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

/* COMPARISON TABLE */
function Comparison() {
  const rows = [
    { label: 'Speaks your language', us: true, them: false },
    { label: 'Local on-ground support', us: true, them: false },
    { label: 'Understands festive cycle', us: true, them: false },
    { label: 'Custom-coded systems', us: true, them: 'Sometimes' },
    { label: 'Predictable monthly partnership', us: true, them: false },
    { label: '12-hour response time', us: true, them: false },
    { label: 'No vendor handoffs', us: true, them: false },
    { label: 'Big agency overhead in pricing', us: false, them: true },
  ]
  return (
    <section className="relative bg-[#0E0E10] text-white py-32 px-6 lg:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/10 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">· The honest comparison</span>
          <h2 className="leading-[1.02] tracking-[-0.01em]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4.5vw,60px)' }}>
            vayucodes vs.
            <br />
            <span className="italic text-[#FFD9B8]">the usual suspects.</span>
          </h2>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 lg:gap-x-12 gap-y-4 max-w-3xl">
          <div />
          <div className="text-[10px] tracking-[0.25em] uppercase text-[#E85D2C] font-bold text-center pb-4 border-b border-white/10">vayucodes</div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-bold text-center pb-4 border-b border-white/10">Big Agency</div>

          {rows.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="contents"
            >
              <div className="text-sm text-white/80 py-3 border-b border-white/5">{r.label}</div>
              <div className="flex items-center justify-center py-3 border-b border-white/5">
                {r.us === true ? <Check size={18} className="text-[#E85D2C]" /> : <X size={16} className="text-white/30" />}
              </div>
              <div className="flex items-center justify-center py-3 border-b border-white/5">
                {r.them === true ? <Check size={18} className="text-white/40" /> : r.them === false ? <X size={16} className="text-white/30" /> : <span className="text-[10px] tracking-wider uppercase text-white/40">{r.them}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* TESTIMONIALS WITH 3D TILT */
function Testimonials() {
  const quotes = [
    { quote: 'They didn\'t just build us a website. They understood our textile cycle and built systems that respect it. Like having a CTO who happens to live in Valsad.', author: 'Rakesh Patel', role: 'MD, Sutra Textile Co.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { quote: 'We tried two Mumbai agencies before. They sent decks. vayucodes shipped a working booking engine in 6 weeks. Diwali season was sold out.', author: 'Meera Joshi', role: 'Founder, Nirvana Eco-Resort', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
    { quote: 'Our Anaya brand went from 0 to ₹1.2 Cr in a single festive quarter. The team treats our business like their own — because they get it.', author: 'Anaya Vora', role: 'Founder, Anaya Jewels', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <SectionHeading tag="· What clients say" title="Receipts, not promises." italicWord="not promises." />

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Tilt3DCard intensity={10} className="h-full">
                <div className="h-full bg-white rounded-3xl p-8 border border-[#0E0E10]/8 flex flex-col" style={{ boxShadow: '0 30px 60px -30px rgba(14,14,16,0.12)' }}>
                  <div style={{ transform: 'translateZ(30px)' }} className="flex flex-col h-full">
                    <div className="text-[#E85D2C] text-5xl leading-none mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>&ldquo;</div>
                    <p className="text-zinc-700 leading-relaxed mb-8 flex-1">{q.quote}</p>
                    <div className="flex items-center gap-4 pt-6 border-t border-[#0E0E10]/8">
                      <img src={q.img} alt={q.author} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-[#0E0E10]">{q.author}</div>
                        <div className="text-xs text-zinc-500">{q.role}</div>
                      </div>
                    </div>
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

export default function WhyUsPage() {
  return (
    <PageWrapper darkHero={true}>
      <PageHero
        tag="· Why us"
        title="We're the partner you can count on."
        italicWord="count on."
        subtitle="Reliable, fast, and always by your side."
      />
      <TrustPillars />
      <Comparison />
      <Testimonials />
      <CTABlock kicker="Ready to start?" title="Less talk. More shipping." italicWord="More shipping." />
    </PageWrapper>
  )
}