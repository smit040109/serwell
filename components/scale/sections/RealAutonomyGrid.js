'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Button from '@/components/ui-scale/Button'

// PLACEHOLDER floating tiles — replace with Scale-licensed assets later
const tiles = [
  { src: 'https://images.pexels.com/photos/12584013/pexels-photo-12584013.jpeg?auto=compress&cs=tinysrgb&w=400', style: 'top-[3%] left-[4%]   w-[16%] aspect-[4/5] rotate-[-6deg]', speed: 0.4 },
  { src: 'https://images.pexels.com/photos/19545617/pexels-photo-19545617.jpeg?auto=compress&cs=tinysrgb&w=400', style: 'top-[6%] right-[6%]  w-[18%] aspect-square rotate-[5deg]',  speed: 0.6 },
  { src: 'https://images.pexels.com/photos/20208915/pexels-photo-20208915.jpeg?auto=compress&cs=tinysrgb&w=400', style: 'top-[36%] left-[1%]  w-[15%] aspect-[4/3] rotate-[4deg]',  speed: 0.35 },
  { src: 'https://images.pexels.com/photos/19768241/pexels-photo-19768241.jpeg?auto=compress&cs=tinysrgb&w=400', style: 'top-[38%] right-[2%] w-[16%] aspect-[3/4] rotate-[-4deg]', speed: 0.5 },
  { src: 'https://images.pexels.com/photos/8439074/pexels-photo-8439074.jpeg?auto=compress&cs=tinysrgb&w=400', style: 'bottom-[8%] left-[10%] w-[16%] aspect-square rotate-[3deg]',   speed: 0.55 },
  { src: 'https://images.pexels.com/photos/586056/pexels-photo-586056.jpeg?auto=compress&cs=tinysrgb&w=400',   style: 'bottom-[4%] right-[12%] w-[15%] aspect-[5/4] rotate-[-5deg]', speed: 0.45 },
  { src: 'https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&w=400', style: 'top-[68%] left-[38%] w-[13%] aspect-[4/3] rotate-[2deg]',  speed: 0.3 },
  { src: 'https://images.pexels.com/photos/35076289/pexels-photo-35076289.jpeg?auto=compress&cs=tinysrgb&w=400', style: 'top-[6%] left-[42%] w-[14%] aspect-[4/3] rotate-[-3deg]', speed: 0.65 },
]

export default function RealAutonomyGrid() {
  const rootRef = useRef(null)
  const tilesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial reveal stagger
      gsap.fromTo(tilesRef.current,
        { opacity: 0, scale: 0.85, y: 20 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        }
      )

      // Per-tile parallax on scroll
      tilesRef.current.forEach((t, i) => {
        if (!t) return
        const speed = tiles[i]?.speed || 0.4
        gsap.to(t, {
          y: -80 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative bg-soft-mist py-24 md:py-32 overflow-hidden">
      <div className="max-w-page mx-auto px-6 md:px-8 relative min-h-[520px] md:min-h-[640px] flex flex-col items-center justify-center text-center">
        {/* Floating tiles */}
        {tiles.map((t, i) => (
          <div
            key={i}
            ref={el => (tilesRef.current[i] = el)}
            className={`hidden md:block absolute ${t.style} rounded-card overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.15)] will-animate`}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${t.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        ))}

        {/* Massive display headline */}
        <h2 className="relative z-10 font-aeonik font-normal text-obsidian max-w-[880px]" style={{ fontSize: 'clamp(48px, 8.5vw, 116px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
          Artificial Intelligence.<br />
          Real <span style={{ color: '#a8927c' }}>Autonomy</span>.
        </h2>

        <div className="relative z-10 mt-10">
          <Button variant="filled-dark" href="#">Get Started</Button>
        </div>

        {/* Mobile fallback: horizontal scroll of a few tiles */}
        <div className="md:hidden mt-10 flex gap-3 overflow-x-auto w-full pb-2">
          {tiles.slice(0, 6).map((t, i) => (
            <div key={i} className="flex-shrink-0 w-32 aspect-square rounded-card overflow-hidden">
              <div className="w-full h-full" style={{ backgroundImage: `url(${t.src})`, backgroundSize: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
