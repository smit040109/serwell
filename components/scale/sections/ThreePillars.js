'use client'

import Link from 'next/link'
import { TrendingUp, BarChart3, Eye, ArrowRight } from 'lucide-react'
import RevealOnScroll from '@/components/animation/RevealOnScroll'

const pillars = [
  {
    Icon: TrendingUp,
    title: '10 years powering the world\u2019s biggest AI breakthroughs.',
    body: 'From the first labels behind self-driving cars to the frontier models of today — Scale has been the foundation for a decade of AI progress.',
  },
  {
    Icon: BarChart3,
    title: 'The standard every frontier model is measured against.',
    body: 'Our benchmarks, evaluations, and red teams define what “working” actually means for enterprise-grade generative AI.',
  },
  {
    Icon: Eye,
    title: 'Behind the model. Behind the mission. Behind it all.',
    body: 'Reliable AI isn’t just a model — it’s a system. Scale operates across the entire stack so outcomes are engineered, not hoped for.',
  },
]

export default function ThreePillars() {
  return (
    <section className="bg-pure-white pb-24 md:pb-32 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <RevealOnScroll y={30} stagger={0.12} className="grid md:grid-cols-3 gap-6">
          {pillars.map(({ Icon, title, body }) => (
            <article key={title} className="rounded-card p-8 md:p-10 bg-soft-mist flex flex-col">
              <div className="w-12 h-12 rounded-card-nest bg-pure-white flex items-center justify-center">
                <Icon size={22} strokeWidth={1.4} className="text-obsidian" />
              </div>
              <h3 className="mt-8 font-aeonik font-normal text-obsidian" style={{ fontSize: '22px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                {title}
              </h3>
              <p className="mt-4 text-body text-graphite">{body}</p>
              <Link href="#" className="group inline-flex items-center gap-1.5 mt-8 text-[14px] font-aeonik text-obsidian">
                Learn more
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  )
}
