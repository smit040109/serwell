'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import WordReveal from '@/components/animation/WordReveal'
import ScrollPrompt from '@/components/ui-scale/ScrollPrompt'

// PLACEHOLDER — replace with Scale.com's original hero video/image if licensed later
const HERO_BG = 'https://images.pexels.com/photos/8913522/pexels-photo-8913522.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'

// SVG bounding boxes with labels (simulating autonomous vehicle perception)
const boxes = [
  { id: 'primary', x: 32, y: 55, w: 30, h: 18, color: '#3B82F6', label: null }, // main car
  { id: 'b1', x: 8,  y: 60, w: 14, h: 10, color: '#F97316', label: 'Sedan' },
  { id: 'b2', x: 70, y: 62, w: 12, h: 10, color: '#F97316', label: 'Truck' },
  { id: 'b3', x: 82, y: 45, w: 10, h: 8,  color: '#F97316', label: 'Van' },
  { id: 'b4', x: 20, y: 45, w: 9,  h: 8,  color: '#F97316', label: 'Sedan' },
]

export default function HeroFullBleed() {
  const rootRef = useRef(null)
  const bgRef = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bounding boxes draw-in on load
      const rects = svgRef.current?.querySelectorAll('.bb-rect')
      const labels = svgRef.current?.querySelectorAll('.bb-label')
      if (rects && rects.length) {
        gsap.fromTo(rects,
          { strokeDashoffset: 500, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.1, ease: 'power2.out', stagger: 0.12, delay: 0.35 }
        )
      }
      if (labels && labels.length) {
        gsap.fromTo(labels,
          { opacity: 0, y: -4 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12, delay: 0.9 }
        )
      }

      // Parallax the background image as user scrolls
      gsap.to(bgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative w-full h-screen min-h-[640px] overflow-hidden bg-obsidian">
      {/* Background photo */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(0.75) brightness(0.55) contrast(1.05)',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/70" />

      {/* SVG bounding boxes overlay */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {boxes.map(b => (
          <g key={b.id}>
            <rect
              className="bb-rect"
              x={b.x} y={b.y} width={b.w} height={b.h}
              fill="none"
              stroke={b.color}
              strokeWidth={0.18}
              strokeDasharray="500"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}
            />
            {b.label && (
              <g className="bb-label">
                <rect x={b.x} y={b.y - 2.5} width={b.label.length * 1.2 + 1} height={2.2} fill={b.color} vectorEffect="non-scaling-stroke" />
                <text
                  x={b.x + 0.5} y={b.y - 0.8}
                  fill="#fff"
                  fontSize={1.4}
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.08em"
                  style={{ textTransform: 'uppercase' }}
                >
                  {b.label}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Headline */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-6">
        <WordReveal
          as="h1"
          text="The world's most important decisions need reliable AI systems."
          className="font-aeonik font-normal text-pure-white text-center max-w-[1000px]"
          stagger={0.055}
          delay={0.25}
          trigger={false}
        />
      </div>

      {/* Inline style for the H1 sizing */}
      <style jsx>{`
        section :global(h1) {
          font-size: clamp(36px, 5.4vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.01em;
        }
      `}</style>

      {/* Scroll prompt */}
      <ScrollPrompt className="absolute bottom-8 right-8 z-10" />
    </section>
  )
}
