'use client'

import { PageWrapper } from '@/components/site/Shared'
import { motion } from 'framer-motion'

const SECTIONS = [
  {
    heading: '1. Acceptance of terms',
    body: 'By accessing or using vayucodes.com and any of our services, you agree to be bound by these Terms. If you do not agree, please do not use the site or the services.',
  },
  {
    heading: '2. Scope of services',
    body: 'VayuCodes provides design, engineering, and growth services on a project basis. The specific scope, deliverables, timelines, and fees for any engagement are governed by a separate written agreement signed between the client and VayuCodes.',
  },
  {
    heading: '3. Intellectual property',
    body: 'All content on this website — text, graphics, logos, videos, illustrations, and code — is the property of VayuCodes unless otherwise stated. You may not reproduce, distribute, or create derivative works without our written permission. Work products delivered under a signed engagement follow the IP terms of that agreement.',
  },
  {
    heading: '4. Client responsibilities',
    body: 'For any engagement, the client agrees to provide timely feedback, accurate information, required approvals, and any content, assets, or access needed for VayuCodes to complete the work. Delays caused by non-response may affect delivery timelines.',
  },
  {
    heading: '5. Payments',
    body: 'Fees, milestones, and payment schedules are defined in the engagement agreement. Overdue invoices may incur late fees and, at our discretion, work may be paused until payment is received.',
  },
  {
    heading: '6. Confidentiality',
    body: 'Both parties agree to keep confidential any non-public information exchanged during an engagement. This obligation survives termination of the engagement.',
  },
  {
    heading: '7. Warranties & liability',
    body: 'The site and its content are provided "as is" without warranties of any kind. To the maximum extent permitted by law, VayuCodes shall not be liable for indirect, incidental, or consequential damages arising from your use of the site or our services.',
  },
  {
    heading: '8. Termination',
    body: 'Either party may terminate an engagement per the terms of the signed agreement. Fees for work completed up to the date of termination remain payable.',
  },
  {
    heading: '9. Governing law',
    body: 'These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.',
  },
  {
    heading: '10. Contact',
    body: 'For questions about these Terms, email hello@vayucodes.com.',
  },
]

export default function TermsPage() {
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
              Terms of <span className="italic text-[#0A0A0A]/60">Service</span>
            </h1>
            <p className="text-[15px] text-[#525252] leading-relaxed max-w-2xl">
              The ground rules for working with VayuCodes and using this website. Fair, plain-language, and up to date.
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
