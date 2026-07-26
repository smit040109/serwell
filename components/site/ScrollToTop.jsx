'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * ScrollToTop
 * Ensures every route change lands the user at the very top of the page.
 * Uses instant scroll (no smooth) so the transition feels crisp.
 * Runs on both browser scroll AND Lenis smooth-scroll instance (if present).
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1) Kill Lenis smooth-scroll if it's mounted (it hijacks scrollTo otherwise)
    const lenis = window.__lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      if (typeof lenis.__resetJumpGuard === 'function') lenis.__resetJumpGuard()
      lenis.scrollTo(0, { immediate: true, force: true })
    }

    // 2) Native fallback — instant jump
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // Some browsers reject 'instant' in TS-typed defs; hard-set as safety
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Also disable the browser's default scroll-restoration so back/forward
    // navigations don't reset us to a mid-page position mid-transition.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [pathname])

  return null
}
