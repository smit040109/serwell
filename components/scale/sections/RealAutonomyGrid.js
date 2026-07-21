'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Button from '@/components/ui-scale/Button'
import { PORTFOLIO_IMAGES } from '@/components/site/Shared'

// PLACEHOLDER — tiles use portfolio images from the existing VayuCodes project.
// Replace with real VayuCodes case-study thumbnails when available.
const tiles = [
  { src: PORTFOLIO_IMAGES[0], style: 'top-[3%] left-[4%]   w-[16%] aspect-[4/5] rotate-[-6deg]', speed: 0.4 },
  { src: PORTFOLIO_IMAGES[1], style: 'top-[6%] right-[6%]  w-[18%] aspect-square rotate-[5deg]',  speed: 0.6 },
  { src: PORTFOLIO_IMAGES[2], style: 'top-[36%] left-[1%]  w-[15%] aspect-[4/3] rotate-[4deg]',  speed: 0.35 },
  { src: PORTFOLIO_IMAGES[3], style: 'top-[38%] right-[2%] w-[16%] aspect-[3/4] rotate-[-4deg]', speed: 0.5 },
  { src: PORTFOLIO_IMAGES[4], style: 'bottom-[8%] left-[10%] w-[16%] aspect-square rotate-[3deg]',   speed: 0.55 },
  { src: PORTFOLIO_IMAGES[5], style: 'bottom-[4%] right-[12%] w-[15%] aspect-[5/4] rotate-[-5deg]', speed: 0.45 },
  { src: PORTFOLIO_IMAGES[6], style: 'top-[68%] left-[38%] w-[13%] aspect-[4/3] rotate-[2deg]',  speed: 0.3 },
  { src: PORTFOLIO_IMAGES[7], style: 'top-[6%] left-[42%] w-[14%] aspect-[4/3] rotate-[-3deg]', speed: 0.65 },
]

export default function RealAutonomyGrid() {
  const rootRef = useRef(null)
  const tilesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(tilesRef.current,
        { opacity: 0, scale: 0.85, y: 20 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        }
      )

      tilesRef.current.forEach((t, i) => {
        if (!t) return
        const speed = tiles[i]?.speed || 0.4
        gsap.to(t, {
          y: -80 * speed,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="services" className="relative bg-soft-mist py-24 md:py-32 overflow-hidden">
      <div className="max-w-page mx-auto px-6 md:px-8 relative min-h-[520px] md:min-h-[680px] flex flex-col items-center justify-center text-center">
        {tiles.map((t, i) => (
          <div
            key={i}
            ref={el => (tilesRef.current[i] = el)}
            className={`hidden md:block absolute ${t.style} rounded-card overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.15)] will-animate`}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${t.src}?w=500&q=70)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        ))}

        {/* Massive display headline — Instrument Serif italic word matches VayuCodes brand */}
        <h2
          className="relative z-10 text-vc-ink max-w-[880px]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(48px, 8.5vw, 116px)', lineHeight: 0.98, letterSpacing: '-0.02em' }}
        >
          From <span className="italic" style={{ color: '#E85D2C' }}>idea</span><br />
          to shipped <span className="italic" style={{ color: '#E85D2C' }}>system</span>.
        </h2>

        <p className="relative z-10 mt-6 max-w-[520px] text-body text-graphite">
          One team. Design, engineering, automation, and growth — built to work together, not handed off between departments.
        </p>

        <div className="relative z-10 mt-10">
          <Button variant="filled-dark" href="/contact">Start a project</Button>
        </div>

        {/* Mobile fallback */}
        <div className="md:hidden mt-10 flex gap-3 overflow-x-auto w-full pb-2">
          {tiles.slice(0, 6).map((t, i) => (
            <div key={i} className="flex-shrink-0 w-32 aspect-square rounded-card overflow-hidden">
              <div className="w-full h-full" style={{ backgroundImage: `url(${t.src}?w=300&q=60)`, backgroundSize: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
