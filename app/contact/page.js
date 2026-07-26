'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, Mail, MessageCircle, CheckCircle2, Plus, Minus, Clock, Globe2 } from 'lucide-react'
import { PageWrapper, useCmsPageContent, useCmsContactSettings } from '@/components/site/Shared'

/* ============================================================
   HERO + CONTACT FORM (side by side)
============================================================ */
function ContactHero() {
  const pc = useCmsPageContent('contact')
  const settings = useCmsContactSettings()
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ loading: false, ok: false, err: '' })

  // Validation helpers
  const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{1,}$/
  const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/

  function validate(f) {
    const e = {}
    if (!f.name.trim()) e.name = 'Please enter your name.'
    else if (!NAME_RE.test(f.name.trim())) e.name = 'Only letters, spaces, apostrophes and hyphens.'
    if (!f.email.trim()) e.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address.'
    if (f.phone.trim() && !PHONE_RE.test(f.phone.trim())) e.phone = 'Enter a valid phone number.'
    if (!f.message.trim()) e.message = 'Please tell us what you\u2019re building.'
    else if (f.message.trim().length < 10) e.message = 'Give us a little more detail (10+ chars).'
    return e
  }

  const updateField = (key) => (val) => {
    let v = val
    if (key === 'name') v = v.replace(/[^A-Za-z\s.'-]/g, '')
    else if (key === 'phone') { v = v.replace(/[^0-9+\s\-()]/g, ''); v = v.replace(/(?!^)\+/g, '') }
    setForm(f => ({ ...f, [key]: v }))
    setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  async function submit(e) {
    e.preventDefault()
    const eMap = validate(form)
    setErrors(eMap)
    if (Object.keys(eMap).length) { setStatus({ loading: false, ok: false, err: '' }); return }
    setStatus({ loading: true, ok: false, err: '' })
    try {
      // Attach attribution: session/visitor ids from cookies, plus current UTM + referrer.
      const readCookie = (n) => {
        try {
          const m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'))
          return m ? decodeURIComponent(m[1]) : ''
        } catch { return '' }
      }
      const utm = (() => { try { return JSON.parse(readCookie('vc_utm') || '{}') } catch { return {} } })()
      let sessionId = ''
      try { sessionId = sessionStorage.getItem('vc_sid') || '' } catch { /* ignore */ }
      const payload = {
        ...form,
        sessionId,
        visitorId: readCookie('vc_vid'),
        referrer: readCookie('vc_ref') || document.referrer || '',
        utm_source: utm.utm_source || '',
        utm_medium: utm.utm_medium || '',
        utm_campaign: utm.utm_campaign || '',
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStatus({ loading: false, ok: true, err: '' })
      setForm({ name: '', email: '', phone: '', business: '', message: '' })
      setErrors({})
      // Fire a click event so admin can attribute the conversion cleanly.
      try {
        navigator.sendBeacon?.('/api/track', new Blob([JSON.stringify({
          type: 'click',
          visitorId: readCookie('vc_vid'),
          sessionId,
          path: location.pathname,
          name: 'lead_submit',
          label: 'contact_form',
          ts: Date.now(),
        })], { type: 'application/json' }))
      } catch { /* ignore */ }
    } catch (err) {
      setStatus({ loading: false, ok: false, err: err.message })
    }
  }

  const emails = settings?.emails?.length ? settings.emails : ['hello@vayucodes.com']
  const office = settings?.officeHours || 'Mon–Fri · 10am–7pm IST'
  const responseTime = settings?.responseTime || 'We respond within 12 hours.'
  const d = pc || {}
  const ph = d.formPlaceholders || {}

  return (
    <section className="relative min-h-[100vh] bg-[#FAFAF7] pt-32 md:pt-40 pb-16 px-6 md:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] rounded-full"
           style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05), transparent 60%)' }} />

      <div className="relative max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                      className="inline-flex items-center gap-2 border border-black/12 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0A0A0A] font-medium">{d.heroBadge || 'Contact'}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 1.0, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                     className="text-[#0A0A0A] leading-[0.98] tracking-[-0.02em]"
                     style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(42px,6vw,92px)' }}>
            {settings?.ctaHeadline || 'Tell us about your project.'}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className="mt-8 max-w-md text-[15px] text-[#525252] leading-relaxed">
            {settings?.ctaSubtitle || 'We reply to every serious inquiry within 12 hours — not next week.'}
          </motion.p>

          <div className="mt-12 space-y-5">
            {emails.map((e, i) => (
              <a key={i} href={`mailto:${e}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-white/60 hover:bg-white hover:border-[#0A0A0A] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center"><Mail size={16} /></div>
                <div className="flex-1">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">{d.emailChannelLabel || 'Email us'}</div>
                  <div className="text-sm font-semibold text-[#0A0A0A]">{e}</div>
                </div>
                <ArrowRight size={14} className="text-[#0A0A0A] group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
            {(settings?.phones || []).map((p, i) => (
              <a key={'p'+i} href={`tel:${p.replace(/[^+0-9]/g, '')}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-white/60 hover:bg-white hover:border-[#0A0A0A] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center"><MessageCircle size={16} /></div>
                <div className="flex-1">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">Phone</div>
                  <div className="text-sm font-semibold text-[#0A0A0A]">{p}</div>
                </div>
                <ArrowRight size={14} className="text-[#0A0A0A] group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-white/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-black/10 text-[#0A0A0A] flex items-center justify-center"><Clock size={16} /></div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">{d.officeHoursLabel || 'Office hours'}</div>
                <div className="text-sm font-semibold text-[#0A0A0A]">{office}</div>
                <div className="text-[11px] text-[#6B6B6B] mt-0.5">{responseTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-white/60">
              <div className="w-10 h-10 rounded-xl bg-white border border-black/10 text-[#0A0A0A] flex items-center justify-center"><Globe2 size={16} /></div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">{d.locationLabel || 'Location'}</div>
                <div className="text-sm font-semibold text-[#0A0A0A]">{d.locationValue || 'India · Worldwide'}</div>
              </div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-7">
          <form onSubmit={submit} className="bg-white rounded-3xl p-6 md:p-10 border border-black/10"
                style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.15)' }}>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-8">{d.formEyebrow || '— Project inquiry'}</div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Your name" required value={form.name} onChange={updateField('name')}
                     placeholder={ph.name || 'Your name'} error={errors.name} autoComplete="name" maxLength={60} />
              <Field label="Email" type="email" required value={form.email} onChange={updateField('email')}
                     placeholder={ph.email || 'you@business.com'} error={errors.email} autoComplete="email" inputMode="email" />
              <Field label="Phone (optional)" value={form.phone} onChange={updateField('phone')}
                     placeholder={ph.phone || '+91 XXXXX XXXXX'} error={errors.phone} autoComplete="tel" inputMode="tel" maxLength={20} />
              <Field label="Business name" value={form.business} onChange={v => setForm(f => ({ ...f, business: v }))}
                     placeholder={ph.business || 'Company Ltd.'} autoComplete="organization" maxLength={80} />
            </div>

            <div className="mt-5">
              <label className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#6B6B6B] mb-2 block">
                What are you building? <span className="text-[#0A0A0A]">*</span>
              </label>
              <textarea rows={5} required value={form.message}
                        onChange={e => { const v = e.target.value; setForm({ ...form, message: v }); setErrors(prev => (prev.message ? { ...prev, message: undefined } : prev)) }}
                        placeholder={ph.message || 'Tell us in a few sentences what you need.'}
                        className={`w-full px-4 py-3 rounded-xl bg-[#FAFAF7] border ${errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-black/10 focus:border-[#0A0A0A] focus:ring-black/5'} focus:outline-none focus:ring-2 text-sm text-[#0A0A0A] placeholder:text-[#A3A3A3] resize-none transition-all`} />
              {errors.message && <div className="mt-1.5 text-[11px] text-red-600">{errors.message}</div>}
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <div className="text-[11px] text-[#6B6B6B]">{d.formConsent || 'By sending you agree to receive a reply within 12 hours.'}</div>
              <button type="submit" disabled={status.loading}
                      className="group inline-flex items-center gap-3 bg-[#0A0A0A] text-white font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-black active:scale-[0.97] transition-all disabled:opacity-60"
                      style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.35)' }}>
                {status.loading ? 'Sending…' : (d.formSubmitLabel || 'Send inquiry')}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {status.ok && (
              <div className="mt-5 flex items-center gap-2 text-sm text-[#0A0A0A] font-medium bg-[#FAFAF7] px-4 py-3 rounded-xl border border-black/8">
                <CheckCircle2 size={16} /> {d.formSuccess || "Got it. We'll reply within 12 hours."}
              </div>
            )}
            {status.err && <div className="mt-5 text-sm text-red-600 font-medium">{status.err}</div>}
          </form>
        </motion.div>
      </div>
    </section>
  )
}

function Field({ label, value, onChange, type = 'text', required, placeholder, error, autoComplete, inputMode, maxLength }) {
  return (
    <div>
      <label className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#6B6B6B] mb-2 block">
        {label}{required && <span className="text-[#0A0A0A]"> *</span>}
      </label>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
             placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength}
             aria-invalid={!!error}
             className={`w-full px-4 py-3 rounded-xl bg-[#FAFAF7] border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-black/10 focus:border-[#0A0A0A] focus:ring-black/5'} focus:outline-none focus:ring-2 text-sm text-[#0A0A0A] placeholder:text-[#A3A3A3] transition-all`} />
      {error && <div className="mt-1.5 text-[11px] text-red-600">{error}</div>}
    </div>
  )
}

/* ============================================================
   FAQ — from CMS faq_items
============================================================ */
function FAQ() {
  const pc = useCmsPageContent('contact')
  const d = pc || {}
  const [faqs, setFaqs] = useState([])
  useEffect(() => {
    fetch('/api/cms/faq_items').then(r => r.json()).then(j => {
      const items = (j?.data || []).map(x => ({ q: x.question, a: x.answer }))
      setFaqs(items)
    }).catch(() => setFaqs([]))
  }, [])
  const [open, setOpen] = useState(0)

  if (!faqs.length) return null
  return (
    <section className="relative bg-[#FAFAF7] py-24 md:py-32 px-6 md:px-10 border-t border-black/8">
      <div className="max-w-[1100px] mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-4">{d.faqEyebrow || '— Frequently asked'}</div>
          <h2 className="text-[#0A0A0A] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px,4.5vw,56px)' }}>
            {d.faqHeadline1 || 'Questions before'} <span className="italic text-[#0A0A0A]/60">{d.faqHeadlineItalic || 'the first call.'}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="bg-white border border-black/10 rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-black/[0.02] transition-colors">
                <span className="text-base lg:text-lg font-medium text-[#0A0A0A]">{f.q}</span>
                {open === i ? <Minus size={18} className="text-[#0A0A0A] flex-shrink-0" /> : <Plus size={18} className="text-[#0A0A0A]/40 flex-shrink-0" />}
              </button>
              <motion.div initial={false} animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }} className="overflow-hidden">
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
