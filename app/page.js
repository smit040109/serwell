'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, ShieldCheck, Zap, Users } from 'lucide-react'
import {
  LandingFlow, Navbar, Footer, SILHOUETTE_IMG, PORTFOLIO_IMAGES,
  Tilt3DCard, SectionHeading, CTABlock
} from '@/components/site/Shared'

/* ============================================================
   EDITORIAL HERO
============================================================ */
function EditorialHero() {
  return (
    <section id="top" className="relative w-full min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 90% 70% at 75% 50%, #FFB36B 0%, #FF8A3D 20%, #D24B0E 45%, #4A1505 70%, #0B0604 100%)'
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
        }} />
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] xl:w-[55%] pointer-events-none">
        <img src={SILHOUETTE_IMG} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-70 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="h-24" />
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="w-10 h-px bg-white/40" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/60">
                  Independent Studio · Est. 2025 · Valsad, IN
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-white text-[clamp(48px,8vw,128px)] leading-[0.95] tracking-[-0.02em] font-light"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Art direction
                <br />
                with a <span className="italic text-[#FFD9B8]">Systems</span>
                <br />
                Brain.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.9 }}
                className="mt-8 max-w-md text-white/70 text-base leading-relaxed"
              >
                We craft websites, custom software & marketing systems for ambitious businesses across Gujarat — engineered to run, designed to seduce.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 bg-white text-[#1a0a04] font-semibold text-[12px] tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:bg-[#FFD9B8] transition-all"
                >
                  Start here
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/our-work"
                  className="group inline-flex items-center gap-3 backdrop-blur-md bg-white/5 border border-white/25 text-white text-[12px] tracking-[0.15em] uppercase font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85D2C] opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85D2C]" />
                  </span>
                  See our work
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="lg:col-span-5 hidden lg:flex flex-col justify-end h-full pb-12"
            >
              <div className="ml-auto max-w-xs space-y-4 text-right">
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">Currently shipping</div>
                <div className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Three local manufacturers · One D2C jewelry brand · Two retail chains · Custom CRM for a textile exporter.
                </div>
                <div className="flex justify-end gap-6 pt-4 border-t border-white/10">
                  <div><div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Projects</div><div className="text-white text-xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair)' }}>50+</div></div>
                  <div><div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Avg. Lift</div><div className="text-white text-xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair)' }}>3.2×</div></div>
                  <div><div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Uptime</div><div className="text-white text-xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair)' }}>99.9</div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="relative z-10 border-t border-white/10 py-5 px-6 lg:px-10"
        >
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2C] animate-pulse" />
              In the studio: brewing chai, shipping pixels
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span>↓ Scroll to see what we make</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   SERVICES TEASER — 3 services with 3D tilt cards
============================================================ */
function ServicesTeaser() {
  const services = [
    { n: '01', title: 'Websites', desc: 'Blazing-fast sites that load on any phone, any network.', accent: '#E85D2C', href: '/services' },
    { n: '02', title: 'Software', desc: 'Custom ERPs, dashboards, internal tools — made for your shop floor.', accent: '#FF8A3D', href: '/services' },
    { n: '03', title: 'Marketing', desc: 'Targeted local ads that fill your phone with ready-to-buy customers.', accent: '#FFD9B8', href: '/services' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading
            tag="· What we make"
            title="Three engines. One business."
            italicWord="One business."
          />
          <Link href="/services" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            View all services
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Tilt3DCard intensity={10} className="group h-full">
                <Link
                  href={s.href}
                  className="block h-full bg-white rounded-3xl p-8 lg:p-10 border border-[#0E0E10]/8 hover:border-[#E85D2C]/40 transition-all"
                  style={{ boxShadow: '0 30px 60px -30px rgba(14,14,16,0.15)' }}
                >
                  <div style={{ transform: 'translateZ(40px)' }} className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-12">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#E85D2C] font-bold">{s.n}</span>
                      <div className="w-2 h-2 rounded-full" style={{ background: s.accent }} />
                    </div>
                    <h3 className="text-[clamp(28px,3vw,44px)] leading-[1] text-[#0E0E10] tracking-[-0.02em] font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {s.title}
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-12">{s.desc}</p>
                    <div className="mt-auto flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-semibold text-[#0E0E10] group-hover:text-[#E85D2C] transition-colors">
                      Read more <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   SELECTED WORK TEASER — 3D project tiles
============================================================ */
function WorkTeaser() {
  const projects = [
    { n: '01', title: 'Nirvana Eco-Resort', tag: 'Hospitality', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80' },
    { n: '02', title: 'Sutra Textile Co.', tag: 'Manufacturing', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80' },
    { n: '03', title: 'Anaya Jewels', tag: 'D2C', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10 border-t border-[#0E0E10]/8">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading tag="· Selected work · 2024 – 2025" title="Real businesses. Real numbers." italicWord="Real numbers." />
          <Link href="/our-work" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            See all case studies
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <Tilt3DCard intensity={8} className="group h-full">
                <Link href="/our-work" className="block relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100">
                  <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-[#0E0E10]/30 to-transparent" />
                  <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between" style={{ transform: 'translateZ(50px)' }}>
                    <div className="flex items-center justify-between">
                      <span className="backdrop-blur-md bg-white/15 border border-white/30 rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-semibold text-white">
                        · {p.n} · Live
                      </span>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white/70">{p.tag}</span>
                    </div>
                    <div>
                      <h3 className="text-white text-[clamp(28px,2.6vw,40px)] leading-[1] tracking-[-0.02em] font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {p.title}
                      </h3>
                      <div className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-semibold text-white group-hover:text-[#FFD9B8] transition-colors">
                        View case <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   TRUST TEASER
============================================================ */
function TrustTeaser() {
  const points = [
    { icon: MapPin, k: 'Local Partners', v: 'Right here in Valsad. Call us in Gujarati.' },
    { icon: Users, k: 'Gujarat-Native', v: 'We know your festive cycle, your customer.' },
    { icon: ShieldCheck, k: 'One Partner', v: 'No five vendors fighting each other.' },
  ]
  return (
    <section className="relative bg-[#0E0E10] text-white py-32 px-6 lg:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/12 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">
              · Why Gujarat trusts vayucodes
            </span>
            <h2 className="text-[clamp(40px,6vw,88px)] leading-[1] tracking-[-0.02em] font-light max-w-[16ch]" style={{ fontFamily: 'var(--font-playfair)' }}>
              You don&apos;t need Mumbai.
              <span className="italic text-[#FFD9B8]"> You need us.</span>
            </h2>
          </div>
          <Link href="/why-us" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-white/70 hover:text-[#E85D2C] transition-colors">
            Read full story
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Tilt3DCard intensity={8} className="h-full">
                <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/8 transition-colors" style={{ transform: 'translateZ(0)' }}>
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="w-10 h-10 rounded-2xl bg-[#E85D2C]/15 border border-[#E85D2C]/30 flex items-center justify-center mb-6">
                      <p.icon size={18} className="text-[#E85D2C]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{p.k}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{p.v}</p>
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

/* ============================================================
   HOME
============================================================ */
export default function Home() {
  return (
    <LandingFlow>
      <Navbar darkHero={true} />
      <EditorialHero />
      <ServicesTeaser />
      <WorkTeaser />
      <TrustTeaser />
      <CTABlock
        kicker="Ready when you are"
        title="Let's talk numbers, not jargon."
        italicWord="numbers,"
      />
      <Footer />
    </LandingFlow>
  )
}
