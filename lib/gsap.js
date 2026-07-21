// Central GSAP + ScrollTrigger registration
// Import this once in the client-side entrypoint (LenisProvider).

'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined' && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
