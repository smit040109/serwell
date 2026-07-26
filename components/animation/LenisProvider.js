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
    // Expose for cross-component access (e.g. ScrollToTop on route change)
    if (typeof window !== 'undefined') window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    // GUARD: Lenis occasionally snaps scroll to 0 when the native scroll
    // position is extremely close to its computed limit (a known edge-case
    // in how it resyncs virtual scroll from native scroll events). When we
    // detect a huge jump FROM near-the-bottom TO exactly 0, we treat it as
    // bogus and immediately restore the previous position.
    let __lastScroll = 0
    let __correcting = false
    // Exposed so route-change navigation (ScrollToTop) can reset our memory
    // of "last scroll" — otherwise the guard thinks a legitimate scroll-to-0
    // on page change is a bogus jump and wrongly restores the old page's
    // scroll position.
    lenis.__resetJumpGuard = () => { __lastScroll = 0; __correcting = false }
    lenis.on('scroll', (e) => {
      const delta = e.scroll - __lastScroll
      const wasNearBottom = e.limit > 0 && __lastScroll > e.limit - 100
      const jumpedToZero = e.scroll === 0 && delta < -400

      if (!__correcting && wasNearBottom && jumpedToZero) {
        console.warn('[SCROLL-JUMP CORRECTED]', {
          from: __lastScroll, to: e.scroll, delta, limit: e.limit,
          time: new Date().toISOString(),
        })
        __correcting = true
        const restoreTo = __lastScroll
        requestAnimationFrame(() => {
          lenis.scrollTo(restoreTo, { immediate: true, force: true })
          __correcting = false
        })
        return
      }
      __lastScroll = e.scroll
    })

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
      if (typeof window !== 'undefined' && window.__lenis === lenis) delete window.__lenis
    }
  }, [])

  return <>{children}</>
}
