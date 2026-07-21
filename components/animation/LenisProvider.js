'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * LenisProvider — water-like buttery smooth scroll.
 * Tuned for a very soft, cinematic feel:
 *   - Long duration (1.8s inertia) — scroll feels weighted
 *   - Custom quintic ease-out for the softest deceleration
 *   - Wheel + touch multipliers dialed back so the page "flows" instead of snapping
 *   - Synced with GSAP ticker so pinned/scrub timelines stay perfectly locked
 */
export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.8,
      // Quintic ease-out — the softest, most "liquid" deceleration
      easing: (t) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      lerp: 0.08,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onReady = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') {
      onReady()
    } else {
      window.addEventListener('load', onReady, { once: true })
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
