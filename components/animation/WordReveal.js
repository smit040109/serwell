'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * WordReveal — splits text into words and animates each up from below on scroll into view.
 *
 * Props:
 *   text         string  — the content
 *   as           tag     — element tag (default h2)
 *   className    string  — applied to the root
 *   stagger      number  — seconds between each word (default 0.06)
 *   delay        number  — initial delay before start (default 0)
 *   trigger      bool    — if true (default), animates on scroll; if false, animates on mount
 *   accentWords  Array<{ index: number, className: string }> — style specific words
 */
export default function WordReveal({
  text,
  as: Tag = 'h2',
  className = '',
  stagger = 0.06,
  delay = 0,
  trigger = true,
  accentWords = [],
}) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!rootRef.current) return
    const el = rootRef.current
    const words = el.querySelectorAll('.wr-inner')

    const ctx = gsap.context(() => {
      const anim = gsap.to(words, {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        delay,
      })

      if (trigger) {
        anim.pause()
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          once: true,
          onEnter: () => anim.play(),
        })
      }
    }, el)

    return () => ctx.revert()
  }, [text, stagger, delay, trigger])

  const words = String(text).split(' ')

  return (
    <Tag ref={rootRef} className={className} aria-label={text}>
      {words.map((w, i) => {
        const accent = accentWords.find(a => a.index === i)
        return (
          <span
            key={`${w}-${i}`}
            className="word-reveal-word"
            aria-hidden="true"
            style={{ marginRight: '0.28em' }}
          >
            <span className={`wr-inner ${accent ? accent.className : ''}`}>{w}</span>
          </span>
        )
      })}
    </Tag>
  )
}
