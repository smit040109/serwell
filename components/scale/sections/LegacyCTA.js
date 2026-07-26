'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import WordReveal from '@/components/animation/WordReveal'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Final CTA — VayuCodes signature. Dark ink panel with ember glow + blueprint SVG that draws in.
 */
export default function LegacyCTA() {
  const svgRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return
    const ctx = gsap.context(() => {
      const paths = svgRef.current.querySelectorAll('path, circle, line, rect')
      paths.forEach(p => {
        const length = p.getTotalLength ? p.getTotalLength() : 500
        p.style.strokeDasharray = length
        p.style.strokeDashoffset = length
      })

      ScrollTrigger.create({
        trigger: svgRef.current,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.05 })
          gsap.fromTo(glowRef.current, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'power2.out' })
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="px-6 md:px-8 py-16 md:py-20 bg-pure-white">
      <div className="max-w-page mx-auto">
        <div
          className="relative rounded-panel overflow-hidden px-8 md:px-16 py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center"
          style={{ background: '#0E0E10' }}
        >
          {/* Soft white glow */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute -top-1/3 -right-1/4 w-[80%] h-[140%] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
          />

          {/* Left: text + CTA */}
          <div className="relative md:col-span-7">
            <WordReveal
              as="h2"
              text="Have an idea? Let's build what comes next."
              className="text-pure-white"
              stagger={0.08}
            />
            <p className="mt-6 max-w-md text-body text-pure-white/70">
              Tell us what you&apos;re trying to build. We&apos;ll come back with a plan, a timeline, and an honest quote — not a sales pitch.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/contact" data-track="contact"
                className="group inline-flex items-center gap-3 bg-pure-white text-vc-ink font-medium eyebrow px-7 py-4 rounded-btn hover:bg-white/90 transition-colors"
              >
                Start a project
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact" data-track="contact"
                className="inline-flex items-center gap-3 bg-transparent text-pure-white border border-white/25 eyebrow px-7 py-4 rounded-btn hover:bg-white/10 transition-colors"
              >
                Book a call
              </Link>
            </div>
          </div>

          {/* Right: blueprint SVG technical schematic */}
          <div className="relative md:col-span-5 w-full aspect-square max-w-[480px] mx-auto">
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              className="w-full h-full"
              fill="none"
              stroke="rgba(255,217,184,0.75)"
              strokeWidth="1"
              strokeLinecap="round"
            >
              <circle cx="200" cy="200" r="170" />
              <circle cx="200" cy="200" r="120" />
              <circle cx="200" cy="200" r="60" />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 * Math.PI) / 180
                const x1 = 200 + Math.cos(a) * 60
                const y1 = 200 + Math.sin(a) * 60
                const x2 = 200 + Math.cos(a) * 170
                const y2 = 200 + Math.sin(a) * 170
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
              })}
              <path d="M 30,200 Q 100,80 200,60 T 370,200" />
              <path d="M 30,200 Q 100,320 200,340 T 370,200" />
              {[[90, 100],[310, 100],[90, 300],[310, 300],[200, 30],[200, 370],[30, 200],[370, 200]].map(([x, y], i) => (
                <circle key={`n${i}`} cx={x} cy={y} r="6" />
              ))}
              <path d="M 200,160 L 235,180 L 235,220 L 200,240 L 165,220 L 165,180 Z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
              {Array.from({ length: 36 }).map((_, i) => {
                const a = (i * 10 * Math.PI) / 180
                const x1 = 200 + Math.cos(a) * 175
                const y1 = 200 + Math.sin(a) * 175
                const x2 = 200 + Math.cos(a) * 180
                const y2 = 200 + Math.sin(a) * 180
                return <line key={`tk${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.6" />
              })}
            </svg>
          </div>
        </div>

        <style jsx>{`
          section :global(h2) {
            font-family: var(--font-instrument);
            font-weight: 400;
            font-size: clamp(36px, 5vw, 60px);
            line-height: 1.05;
            letter-spacing: -0.012em;
          }
        `}</style>
      </div>
    </section>
  )
}
