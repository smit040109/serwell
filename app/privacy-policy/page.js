'use client'

import { PageWrapper } from '@/components/site/Shared'
import { motion } from 'framer-motion'

const SECTIONS = [
  {
    heading: '1. Who we are',
    body: 'VayuCodes is an independent design & engineering studio ("we", "our", or "us"). This policy explains how we collect, use, and protect information when you visit vayucodes.com or engage our services.',
  },
  {
    heading: '2. Information we collect',
    body: 'When you fill out a contact form, subscribe to our newsletter, or engage with us for a project, we collect the details you voluntarily share — typically your name, email, company, and a description of your project. We also collect basic analytics such as page views, referrer URLs, device and browser type, and approximate geographic region.',
  },
  {
    heading: '3. How we use it',
    body: 'We use your information solely to (a) respond to your enquiry, (b) deliver the services you engaged us for, (c) send you occasional updates about the studio (only if you opted in), and (d) improve the website based on aggregated, anonymised usage data. We do not sell your data.',
  },
  {
    heading: '4. Cookies',
    body: 'We use a small number of first-party cookies to remember your session (e.g. whether you have seen our intro sequence) and to gather anonymous analytics. You can disable cookies in your browser settings — the site will still work, though some experiences may reset each visit.',
  },
  {
    heading: '5. Third-party processors',
    body: 'We rely on a limited set of vetted third parties to run our business — hosting (Vercel, Cloud CDNs), email (transactional email providers), and analytics. Each is bound by their own privacy policies and we only share the minimum data required to operate.',
  },
  {
    heading: '6. Data retention',
    body: 'Contact enquiries are retained for as long as required to serve the client relationship and up to 24 months after the last interaction. Newsletter subscriptions are kept until you unsubscribe. Analytics data is retained in anonymised, aggregated form.',
  },
  {
    heading: '7. Your rights',
    body: 'You may request access to, correction of, or deletion of your personal data at any time by emailing hello@vayucodes.com. We will respond within 30 days. If you are in the EEA / UK, you also have the right to lodge a complaint with your local data protection authority.',
  },
  {
    heading: '8. Security',
    body: 'We follow industry best practices — encryption in transit (HTTPS), least-privilege access, and audited third-party providers. No system is ever perfectly secure, but we take our custody of your data seriously.',
  },
  {
    heading: '9. Changes to this policy',
    body: 'We may update this policy from time to time. Material changes will be communicated via the site or, where appropriate, by email. The "last updated" date below always reflects the current version.',
  },
  {
    heading: '10. Contact',
    body: 'For any questions about this policy or your data, write to hello@vayucodes.com — a founder will personally respond.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <PageWrapper darkHero={false}>
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-[#F7F6F3]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-6">Legal</div>
            <h1
              className="text-[#0A0A0A] leading-[1.0] tracking-[-0.02em] mb-6"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(40px,6vw,80px)' }}
            >
              Privacy <span className="italic text-[#0A0A0A]/60">Policy</span>
            </h1>
            <p className="text-[15px] text-[#525252] leading-relaxed max-w-2xl">
              We keep this short and human. Below is exactly what we collect, why, and how you can ask us to change or remove it.
            </p>
            <div className="mt-4 text-[11px] tracking-[0.2em] uppercase text-[#8A8A8A]">Last updated: 22 July 2026</div>
          </motion.div>

          <div className="mt-16 space-y-10">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.heading}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-black/10 pt-8"
              >
                <h2 className="text-[#0A0A0A] text-xl md:text-2xl font-semibold tracking-tight mb-3">{s.heading}</h2>
                <p className="text-[15px] text-[#4A4A4A] leading-relaxed max-w-2xl">{s.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 pt-8 border-t border-black/10 text-[11px] tracking-[0.25em] uppercase text-[#8A8A8A]">
            © {new Date().getFullYear()} VayuCodes · All rights reserved
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
