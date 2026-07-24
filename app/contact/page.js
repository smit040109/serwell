'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, Mail, MessageCircle, CheckCircle2, Plus, Minus, Clock, Globe2 } from 'lucide-react'
import { PageWrapper } from '@/components/site/Shared'

/* ============================================================
   HERO + CONTACT FORM (side by side)
============================================================ */
function ContactHero() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' })
  const [status, setStatus] = useState({ loading: false, ok: false, err: '' })

  useEffect(() => {
    fetch('/api/cms/contact_settings').then(r => r.json()).then(d => setSettings(d.data)).catch(() => {})
  }, [])

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

  const emails = settings?.emails?.length ? settings.emails : ['hello@vayucodes.com']
  const office = settings?.officeHours || 'Mon–Fri · 10am–7pm IST'
  const responseTime = settings?.responseTime || 'We respond within 12 hours.'

  return (
    <section className="relative min-h-[100vh] bg-[#FAFAF7] pt-32 md:pt-40 pb-16 px-6 md:px-10 overflow-hidden">
      {/* ambient */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] rounded-full"
           style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05), transparent 60%)' }} />

      <div className="relative max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-10 md:gap-16 items-start">
        {/* LEFT: intro */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 border border-black/12 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0A0A0A] font-medium">Contact</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#0A0A0A] leading-[0.98] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(42px,6vw,92px)' }}
          >
            {settings?.ctaHeadline || 'Tell us about your project.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-8 max-w-md text-[15px] text-[#525252] leading-relaxed"
          >
            {settings?.ctaSubtitle || 'We reply to every serious inquiry within 12 hours — not next week. One founder-led call, an honest scope, and a clear path forward.'}
          </motion.p>

          {/* Contact channels */}
          <div className="mt-12 space-y-5">
            {emails.map((e, i) => (
              <a key={i} href={`mailto:${e}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-white/60 hover:bg-white hover:border-[#0A0A0A] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center"><Mail size={16} /></div>
                <div className="flex-1">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">Email us</div>
                  <div className="text-sm font-semibold text-[#0A0A0A]">{e}</div>
                </div>
                <ArrowRight size={14} className="text-[#0A0A0A] group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-white/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-black/10 text-[#0A0A0A] flex items-center justify-center"><Clock size={16} /></div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">Office hours</div>
                <div className="text-sm font-semibold text-[#0A0A0A]">{office}</div>
                <div className="text-[11px] text-[#6B6B6B] mt-0.5">{responseTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-white/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-black/10 text-[#0A0A0A] flex items-center justify-center"><Globe2 size={16} /></div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">Location</div>
                <div className="text-sm font-semibold text-[#0A0A0A]">India · Worldwide</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <form onSubmit={submit} className="bg-white rounded-3xl p-6 md:p-10 border border-black/10"
                style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.15)' }}>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-8">— Project inquiry</div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Your name" required value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Your name" />
              <Field label="Email" type="email" required value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@business.com" />
              <Field label="Phone (optional)" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+91 XXXXX XXXXX" />
              <Field label="Business name" value={form.business} onChange={v => setForm(f => ({ ...f, business: v }))} placeholder="Company Ltd." />
            </div>

            <div className="mt-5">
              <label className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#6B6B6B] mb-2 block">What are you building?</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us in a few sentences what you need, when, and what success looks like."
                className="w-full px-4 py-3 rounded-xl bg-[#FAFAF7] border border-black/10 focus:border-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-black/5 text-sm text-[#0A0A0A] placeholder:text-[#A3A3A3] resize-none transition-all"
              />
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <div className="text-[11px] text-[#6B6B6B]">By sending you agree to receive a reply within 12 hours.</div>
              <button
                type="submit"
                disabled={status.loading}
                className="group inline-flex items-center gap-3 bg-[#0A0A0A] text-white font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-black active:scale-[0.97] transition-all disabled:opacity-60"
                style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.35)' }}
              >
                {status.loading ? 'Sending…' : 'Send inquiry'}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {status.ok && (
              <div className="mt-5 flex items-center gap-2 text-sm text-[#0A0A0A] font-medium bg-[#FAFAF7] px-4 py-3 rounded-xl border border-black/8">
                <CheckCircle2 size={16} /> Got it. We&apos;ll reply within 12 hours.
              </div>
            )}
            {status.err && <div className="mt-5 text-sm text-red-600 font-medium">{status.err}</div>}
          </form>
        </motion.div>
      </div>
    </section>
  )
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#6B6B6B] mb-2 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF7] border border-black/10 focus:border-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-black/5 text-sm text-[#0A0A0A] placeholder:text-[#A3A3A3] transition-all"
      />
    </div>
  )
}

/* ============================================================
   FAQ
============================================================ */
function FAQ() {
  const faqs = [
    { q: 'How quickly can you start?', a: 'Most projects begin within 5–10 days of signing. For urgent launches (festive, product launch), we keep buffer slots open.' },
    { q: 'Do you work outside India?', a: 'Yes — we work with clients across the US, UK, UAE and India. We\u2019re a distributed studio serving founders worldwide.' },
    { q: 'What does a typical engagement cost?', a: 'Cost depends on your requirements, scope and timeline. Every quote is fixed-scope, transparent and shared upfront — no surprises, no hidden fees.' },
    { q: 'Do you offer ongoing maintenance?', a: 'Always. We don\u2019t do build-and-disappear. Most clients move into a monthly partnership for reviews, improvements, and growth experiments.' },
    { q: 'Can you work with our existing team?', a: 'Absolutely. We frequently slot in as the senior tech/design partner while your in-house team handles operations. We integrate, not replace.' },
  ]
  const [open, setOpen] = useState(0)
  return (
    <section className="relative bg-[#FAFAF7] py-24 md:py-32 px-6 md:px-10 border-t border-black/8">
      <div className="max-w-[1100px] mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">— Frequently asked</div>
          <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4.5vw,56px)' }}>
            Questions before <span className="italic text-[#0A0A0A]/60">the first call.</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white border border-black/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-black/[0.02] transition-colors"
              >
                <span className="text-base lg:text-lg font-medium text-[#0A0A0A]">{f.q}</span>
                {open === i ? <Minus size={18} className="text-[#0A0A0A] flex-shrink-0" /> : <Plus size={18} className="text-[#0A0A0A]/40 flex-shrink-0" />}
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-sm text-[#525252] leading-relaxed">{f.a}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <PageWrapper darkHero={false}>
      <ContactHero />
      <FAQ />
    </PageWrapper>
  )
}
