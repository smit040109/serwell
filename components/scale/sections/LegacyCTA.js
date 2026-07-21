'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Button from '@/components/ui-scale/Button'
import WordReveal from '@/components/animation/WordReveal'

export default function LegacyCTA() {
  const svgRef = useRef(null)

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
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.inOut',
            stagger: 0.05,
          })
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="px-6 md:px-8 py-16 md:py-20 bg-pure-white">
      <div className="max-w-page mx-auto">
        <div className="relative rounded-panel overflow-hidden px-8 md:px-16 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center" style={{ background: '#a8927c' }}>
          {/* Left: text + CTA */}
          <div>
            <WordReveal
              as="h2"
              text="Our legacy, your success."
              className="font-aeonik font-normal text-pure-white"
              stagger={0.08}
            />
            <p className="mt-5 max-w-md text-body text-pure-white/80">
              Book a demo today and see how Scale can build reliable AI for your organization.
            </p>
            <div className="mt-8">
              <Button variant="filled-dark" href="#">Get Started</Button>
            </div>
          </div>

          {/* Right: blueprint SVG illustration (technical schematic) */}
          <div className="relative w-full aspect-square max-w-[520px] mx-auto">
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              className="w-full h-full"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1"
              strokeLinecap="round"
            >
              {/* Outer circle */}
              <circle cx="200" cy="200" r="170" />
              <circle cx="200" cy="200" r="120" />
              <circle cx="200" cy="200" r="60" />
              {/* Radial spokes */}
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 * Math.PI) / 180
                const x1 = 200 + Math.cos(a) * 60
                const y1 = 200 + Math.sin(a) * 60
                const x2 = 200 + Math.cos(a) * 170
                const y2 = 200 + Math.sin(a) * 170
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
              })}
              {/* Connective arcs */}
              <path d="M 30,200 Q 100,80 200,60 T 370,200" />
              <path d="M 30,200 Q 100,320 200,340 T 370,200" />
              {/* Nodes */}
              {[[90, 100],[310, 100],[90, 300],[310, 300],[200, 30],[200, 370],[30, 200],[370, 200]].map(([x, y], i) => (
                <circle key={`n${i}`} cx={x} cy={y} r="6" />
              ))}
              {/* Central hex */}
              <path d="M 200,160 L 235,180 L 235,220 L 200,240 L 165,220 L 165,180 Z" />
              {/* Technical labels/ticks */}
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
            font-size: clamp(36px, 5vw, 60px);
            line-height: 1.05;
            letter-spacing: -0.01em;
          }
        `}</style>
      </div>
    </section>
  )
}
