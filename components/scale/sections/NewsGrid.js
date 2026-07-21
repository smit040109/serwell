'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Eyebrow from '@/components/ui-scale/Eyebrow'
import RevealOnScroll from '@/components/animation/RevealOnScroll'

const news = [
  {
    tag: 'Announcement',
    title: 'Introducing Scale Labs.',
    img: 'https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&w=800',
    size: 'lg', // large featured
    tint: '#193a29',
  },
  {
    tag: 'Healthcare',
    title: 'Mayo Clinic + Scale: Reliable AI for better healthcare.',
    img: 'https://images.pexels.com/photos/31499386/pexels-photo-31499386.jpeg?auto=compress&cs=tinysrgb&w=600',
    size: 'md',
  },
  {
    tag: 'Financial Services',
    title: 'How Morgan Stanley deploys AI that actually works.',
    img: 'https://images.pexels.com/photos/6949865/pexels-photo-6949865.jpeg?auto=compress&cs=tinysrgb&w=600',
    size: 'md',
  },
  {
    tag: 'Public Sector',
    title: 'The next phase of U.S. AI policy and governance.',
    img: 'https://images.pexels.com/photos/19574309/pexels-photo-19574309.jpeg?auto=compress&cs=tinysrgb&w=600',
    size: 'md',
  },
  {
    tag: 'Defense',
    title: 'Scale AI + BAE Systems combine forces on mission-critical AI.',
    img: 'https://images.pexels.com/photos/5275919/pexels-photo-5275919.jpeg?auto=compress&cs=tinysrgb&w=600',
    size: 'md',
  },
]

export default function NewsGrid() {
  return (
    <section className="bg-soft-mist py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div className="mb-12">
          <Eyebrow tone="muted">Newsroom</Eyebrow>
          <h2 className="mt-3 font-aeonik font-normal text-obsidian" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            The latest from Scale.
          </h2>
        </div>

        <RevealOnScroll y={30} stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.map((n, i) => (
            <Link
              key={n.title}
              href="#"
              className={`group relative rounded-card overflow-hidden bg-pure-white flex flex-col ${
                n.size === 'lg' ? 'md:col-span-2 md:row-span-2 md:min-h-[520px]' : 'min-h-[320px]'
              }`}
            >
              {/* Image */}
              <div className="relative flex-1 overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${n.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {n.tint && (
                  <div className="absolute inset-0 mix-blend-multiply opacity-60" style={{ background: n.tint }} />
                )}
              </div>

              {/* Text */}
              <div className="p-6 md:p-8">
                <Eyebrow tone="muted">{n.tag}</Eyebrow>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <h3 className="font-aeonik font-normal text-obsidian" style={{ fontSize: n.size === 'lg' ? '28px' : '20px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                    {n.title}
                  </h3>
                  <ArrowUpRight size={20} className="flex-shrink-0 text-obsidian transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  )
}
