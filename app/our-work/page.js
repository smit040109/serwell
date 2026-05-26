'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import {
  PageWrapper, PageHero, SectionHeading, CTABlock, Tilt3DCard, PORTFOLIO_IMAGES
} from '@/components/site/Shared'
import ScrollShowcase from '@/components/site/ScrollShowcase'

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
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
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
        subtitle="From textile manufacturers in Surat to retail chains across South Gujarat — these are the businesses we've helped trade Excel sheets for dashboards, pamphlets for funnels, and 'we'll think about it' for 'can you start tomorrow?'."
      />
      <ScrollShowcase showIntro={false} showOutro={true} />
      <MoreProjects />
      <CTABlock kicker="Want to be next?" title="Let's add your name to this list." italicWord="to this list." />
    </PageWrapper>
  )
}
