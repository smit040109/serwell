'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, MapPin, Mail, Phone, CheckCircle2, Plus, Minus } from 'lucide-react'
import {
  PageWrapper, PageHero, SectionHeading, Tilt3DCard
} from '@/components/site/Shared'

function Input({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-500 mb-2 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-[#0E0E10] focus:outline-none focus:ring-2 focus:ring-[#E85D2C]/30 text-sm text-[#0E0E10] placeholder:text-zinc-400 transition-all"
      />
    </div>
  )
}

function ContactForm() {
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
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">
            · Let&apos;s build together
          </span>
          <h2 className="text-[#0E0E10] tracking-[-0.01em] mb-6" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(32px,4vw,56px)', lineHeight: 1.05 }}>
            Tell us about
            <br />
            <span className="italic text-[#E85D2C]">your business.</span>
          </h2>
          <p className="text-zinc-600 mb-10 leading-relaxed">
            Drop your details. We&apos;ll call within 12 hours — not next week. Free consultation, no obligations, no jargon.
          </p>

          <div className="space-y-4 text-sm text-zinc-700">
            <div className="flex items-center gap-3"><MapPin size={16} className="text-[#E85D2C]" /><span>Valsad, Gujarat — India</span></div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-[#E85D2C]" /><a href="mailto:hello@vayucodes.com" className="hover:text-[#E85D2C] transition-colors">hello@vayucodes.com</a></div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-[#E85D2C]" /><span>+91 — Available on WhatsApp</span></div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Tilt3DCard intensity={4} className="">
            <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-12 border border-[#0E0E10]/8 space-y-5 shadow-[0_40px_80px_-30px_rgba(14,14,16,0.15)]" style={{ transform: 'translateZ(20px)' }}>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Your Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
                <Input label="Phone (optional)" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                <Input label="Business Name" value={form.business} onChange={v => setForm({ ...form, business: v })} />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-500 mb-2 block">
                  Tell us briefly what you need
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:border-[#0E0E10] focus:outline-none focus:ring-2 focus:ring-[#E85D2C]/30 text-sm text-[#0E0E10] placeholder:text-zinc-400 resize-none transition-all"
                  placeholder="e.g. We run a textile shop in Surat — need a website and want to start running ads."
                />
              </div>
              <button
                type="submit"
                disabled={status.loading}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0E0E10] text-white font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full shadow-md hover:bg-[#E85D2C] transition-all disabled:opacity-60"
              >
                {status.loading ? 'Sending…' : 'Send Inquiry'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {status.ok && (
                <div className="flex items-center gap-2 text-sm text-[#E85D2C] font-medium">
                  <CheckCircle2 size={16} /> Got it! We&apos;ll call within 12 hours.
                </div>
              )}
              {status.err && <div className="text-sm text-red-600 font-medium">{status.err}</div>}
            </form>
          </Tilt3DCard>
        </div>
      </div>
    </section>
  )
}

/* FAQ ACCORDION */
function FAQ() {
  const faqs = [
    { q: 'How quickly can you start?', a: 'Most projects begin within 5–10 days of signing. For urgent launches (Diwali, IPO, festive), we keep buffer slots open.' },
    { q: 'Do you work with businesses outside Gujarat?', a: 'Yes — we work with clients across India and a handful in the UAE & UK. But our heart, office, and on-ground team are in Valsad.' },
    { q: 'What does a typical engagement cost?', a: 'Websites start around ₹1.5 L. Custom software from ₹4 L. Performance marketing retainers from ₹45k/month. Every quote is fixed-scope and transparent — no surprise invoices.' },
    { q: 'Do you offer ongoing maintenance?', a: 'Always. We don\'t do “build and disappear.” Most clients move into a monthly partnership for performance reviews, iterative improvements, and growth experiments.' },
    { q: 'Can you work with our existing team / vendors?', a: 'Absolutely. We frequently slot in as the senior tech/design partner while your in-house team handles operations. We integrate, not replace.' },
  ]
  const [open, setOpen] = useState(0)
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10 border-t border-[#0E0E10]/8">
      <div className="max-w-[1100px] mx-auto">
        <SectionHeading tag="· Frequently asked" title="Questions before the chai." italicWord="before the chai." />

        <div className="mt-16 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white border border-[#0E0E10]/8 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#0E0E10]/[0.02] transition-colors"
              >
                <span className="text-base lg:text-lg font-medium text-[#0E0E10]">{f.q}</span>
                {open === i ? <Minus size={18} className="text-[#E85D2C] flex-shrink-0" /> : <Plus size={18} className="text-[#0E0E10]/40 flex-shrink-0" />}
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-sm text-zinc-600 leading-relaxed">{f.a}</div>
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
    <PageWrapper darkHero={true}>
      <PageHero
        tag="· Contact"
        title="Drop a line. Get a callback."
        italicWord="Get a callback."
        subtitle="No discovery decks. No 6-meeting funnels. Just one real call, an honest scope, and a clear path forward — within 12 hours of you hitting send."
      />
      <ContactForm />
      <FAQ />
    </PageWrapper>
  )
}
