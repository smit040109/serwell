'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Button from '@/components/ui-scale/Button'
import { PORTFOLIO_IMAGES } from '@/components/site/Shared'

/**
 * VayuCodes autonomy grid — floating portfolio tiles that:
 *  1. Fade + scale in on scroll into view (GSAP)
 *  2. Continuously ROTATE (each tile with its own rotation duration + direction, framer-motion infinite loop)
 *  3. Gently FLOAT up/down (independent per tile)
 *  4. Parallax on scroll (GSAP scrub) — different speeds per tile
 */
const tiles = [
  { src: PORTFOLIO_IMAGES[0], pos: 'top-[3%] left-[4%]',   size: 'w-[16%] aspect-[4/5]', rotAmp: 8,  rotDur: 14, floatAmp: 14, floatDur: 6.5, dir:  1, scrollSpeed: 0.4 },
  { src: PORTFOLIO_IMAGES[1], pos: 'top-[6%] right-[6%]',  size: 'w-[18%] aspect-square', rotAmp: 6,  rotDur: 18, floatAmp: 16, floatDur: 8.0, dir: -1, scrollSpeed: 0.6 },
  { src: PORTFOLIO_IMAGES[2], pos: 'top-[36%] left-[1%]',  size: 'w-[15%] aspect-[4/3]',  rotAmp: 5,  rotDur: 22, floatAmp: 12, floatDur: 7.2, dir:  1, scrollSpeed: 0.35 },
  { src: PORTFOLIO_IMAGES[3], pos: 'top-[38%] right-[2%]', size: 'w-[16%] aspect-[3/4]',  rotAmp: 7,  rotDur: 16, floatAmp: 14, floatDur: 5.8, dir: -1, scrollSpeed: 0.5 },
  { src: PORTFOLIO_IMAGES[4], pos: 'bottom-[8%] left-[10%]',size: 'w-[16%] aspect-square',rotAmp: 9,  rotDur: 12, floatAmp: 18, floatDur: 7.0, dir:  1, scrollSpeed: 0.55 },
  { src: PORTFOLIO_IMAGES[5], pos: 'bottom-[4%] right-[12%]',size:'w-[15%] aspect-[5/4]', rotAmp: 6,  rotDur: 20, floatAmp: 12, floatDur: 6.8, dir: -1, scrollSpeed: 0.45 },
  { src: PORTFOLIO_IMAGES[6], pos: 'top-[68%] left-[38%]', size: 'w-[13%] aspect-[4/3]', rotAmp: 4,  rotDur: 24, floatAmp: 10, floatDur: 8.5, dir:  1, scrollSpeed: 0.3 },
  { src: PORTFOLIO_IMAGES[7], pos: 'top-[6%] left-[42%]',  size: 'w-[14%] aspect-[4/3]', rotAmp: 8,  rotDur: 15, floatAmp: 13, floatDur: 6.0, dir: -1, scrollSpeed: 0.65 },
]

export default function RealAutonomyGrid() {
  const rootRef = useRef(null)
  const tilesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial reveal stagger
      gsap.fromTo(tilesRef.current,
        { opacity: 0, scale: 0.8, y: 24 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        }
      )

      // Per-tile scroll parallax
      tilesRef.current.forEach((t, i) => {
        if (!t) return
        const speed = tiles[i]?.scrollSpeed || 0.4
        gsap.to(t, {
          y: -100 * speed,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="services" className="relative bg-soft-mist py-24 md:py-32 overflow-hidden">
      <div className="max-w-page mx-auto px-6 md:px-8 relative min-h-[520px] md:min-h-[720px] flex flex-col items-center justify-center text-center">
        {/* Floating tiles — continuous rotation + float via framer-motion */}
        {tiles.map((t, i) => (
          <div
            key={i}
            ref={el => (tilesRef.current[i] = el)}
            className={`hidden md:block absolute ${t.pos} ${t.size} will-animate`}
          >
            <motion.div
              className="w-full h-full rounded-card overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.18)]"
              animate={{
                rotate: t.dir > 0 ? [-t.rotAmp, t.rotAmp, -t.rotAmp] : [t.rotAmp, -t.rotAmp, t.rotAmp],
                y: [0, -t.floatAmp, 0],
              }}
              transition={{
                rotate: { duration: t.rotDur, repeat: Infinity, ease: 'easeInOut' },
                y:      { duration: t.floatDur, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                backgroundImage: `url(${t.src}?w=520&q=72)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              whileHover={{ scale: 1.08, transition: { duration: 0.4 } }}
            />
          </div>
        ))}

        {/* Massive display headline */}
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
            <motion.div
              key={i}
              className="flex-shrink-0 w-32 aspect-square rounded-card overflow-hidden"
              animate={{ rotate: t.dir > 0 ? [-4, 4, -4] : [4, -4, 4] }}
              transition={{ duration: t.rotDur * 0.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                backgroundImage: `url(${t.src}?w=300&q=60)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
