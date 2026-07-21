'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Generic scroll-triggered reveal: y-offset + fade.
 * Wrap any children to reveal them together.
 */
export default function RevealOnScroll({
  children,
  className = '',
  y = 30,
  duration = 0.9,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  as: Tag = 'div',
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const targets = stagger > 0 ? Array.from(el.children) : [el]

    // Prep initial state
    gsap.set(targets, { y, opacity: 0 })

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: 'power3.out',
            stagger,
          })
        },
      })
    }, el)

    return () => ctx.revert()
  }, [y, duration, delay, stagger, start])

  return <Tag ref={ref} className={className}>{children}</Tag>
}
