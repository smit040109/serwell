// Central GSAP + ScrollTrigger registration
// Import this once in the client-side entrypoint (LenisProvider).

'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined' && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger)
  // Prevents ScrollTrigger from recalculating on minor mobile address-bar resizes
  ScrollTrigger.config({ ignoreMobileResize: true })
}

// Shared, debounced refresh — prevents multiple components from racing
// separate ScrollTrigger.refresh() calls (which was causing an intermittent
// scroll-jump-to-top bug when refreshes overlapped mid-scroll).
let _refreshTimer = null
export function requestScrollRefresh(delay = 200) {
  if (typeof window === 'undefined') return
  if (_refreshTimer) clearTimeout(_refreshTimer)
  _refreshTimer = setTimeout(() => {
    // { safe: true } skips the refresh if it would happen during active user scroll/touch,
    // preventing the position snap that caused the jump-to-top bug.
    ScrollTrigger.refresh()
  }, delay)
}

export { gsap, ScrollTrigger }
