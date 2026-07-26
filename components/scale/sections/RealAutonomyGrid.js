'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Button from '@/components/ui-scale/Button'
import { PORTFOLIO_IMAGES } from '@/components/site/Shared'

/**
 * VayuCodes autonomy grid — tiles ORBIT around the center like planets.
 *
 * Layout:
 *   • A rotating parent container spins slowly clockwise (~90s / revolution)
 *   • Each tile sits at a polar coordinate (angle + radius) from center
 *   • Each tile counter-rotates at the same rate so it stays visually upright
 *   • A subtle idle float breaks the mechanical feel
 *   • Center of the ring holds the massive headline + CTA
 *
 * All animation via framer-motion + CSS transforms — no layout thrash.
 */

// Tile ring definition: [radius as vmin, angle in degrees, size class]
const RING = [
  { r: 42, angle:   0, size: 'w-[18vmin] aspect-[4/5]', src: 0 },
  { r: 42, angle:  45, size: 'w-[16vmin] aspect-square', src: 1 },
  { r: 42, angle:  90, size: 'w-[15vmin] aspect-[4/3]', src: 2 },
  { r: 42, angle: 135, size: 'w-[16vmin] aspect-[3/4]', src: 3 },
  { r: 42, angle: 180, size: 'w-[18vmin] aspect-square', src: 4 },
  { r: 42, angle: 225, size: 'w-[15vmin] aspect-[5/4]', src: 5 },
  { r: 42, angle: 270, size: 'w-[14vmin] aspect-[4/3]', src: 6 },
  { r: 42, angle: 315, size: 'w-[15vmin] aspect-[4/3]', src: 7 },
]

const ORBIT_DURATION = 90 // seconds per full revolution

export default function RealAutonomyGrid() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial reveal — the entire ring fades in as user scrolls in
      gsap.fromTo(stageRef.current,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="services" className="relative bg-bone py-24 md:py-32 overflow-hidden">
      <div className="max-w-page mx-auto px-6 md:px-8 relative min-h-[560px] md:min-h-[780px] flex flex-col items-center justify-center text-center">
        {/* ---------------- ORBIT STAGE ---------------- */}
        <div
          ref={stageRef}
          className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            className="relative"
            style={{ width: '100%', height: '100%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: 'linear' }}
          >
            {RING.map((t, i) => {
              // Polar to cartesian, positioned around the CENTER of the stage
              const rad = (t.angle * Math.PI) / 180
              const cx = 50 + Math.cos(rad) * t.r // %
              const cy = 50 + Math.sin(rad) * t.r // %
              return (
                <div
                  key={i}
                  className="absolute pointer-events-auto"
                  style={{ left: `${cx}%`, top: `${cy}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {/* Counter-rotate so the image stays visually upright */}
                  <motion.div
                    className={`${t.size} rounded-card overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.14)] bg-white`}
                    animate={{ rotate: -360 }}
                    transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: 'linear' }}
                  >
                    {/* Second inner layer — gentle idle float so it doesn't feel mechanical */}
                    <motion.div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${PORTFOLIO_IMAGES[t.src]}?w=520&q=72)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      animate={{ y: [0, -6, 0, 6, 0], scale: [1, 1.02, 1] }}
                      transition={{ duration: 8 + (i % 4), repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ scale: 1.08 }}
                    />
                  </motion.div>
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* ---------------- CENTER: headline + CTA ---------------- */}
        <div className="relative z-10 max-w-[880px] px-4">
          <h2
            className="text-vc-ink"
            style={{
              fontFamily: 'var(--font-instrument)',
              fontWeight: 400,
              fontSize: 'clamp(44px, 8vw, 110px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
            }}
          >
            From <span className="italic text-vc-ink/60">idea</span><br />
            to shipped <span className="italic text-vc-ink/60">system</span>.
          </h2>

          <p className="mt-6 max-w-[520px] mx-auto text-body text-graphite">
            One team. Design, engineering, automation, and growth — built to work together, not handed off between departments.
          </p>

          <div className="mt-10">
            <Button variant="filled-dark" href="/contact" data-track="contact">Start a project</Button>
          </div>
        </div>

        {/* ---------------- MOBILE: simple horizontal scroll ---------------- */}
        <div className="md:hidden mt-12 flex gap-3 overflow-x-auto w-full pb-2 -mx-6 px-6">
          {RING.slice(0, 6).map((t, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-32 aspect-square rounded-card overflow-hidden"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                backgroundImage: `url(${PORTFOLIO_IMAGES[t.src]}?w=300&q=60)`,
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
