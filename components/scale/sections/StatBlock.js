'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import WordReveal from '@/components/animation/WordReveal'
import Eyebrow from '@/components/ui-scale/Eyebrow'

/**
 * VayuCodes signature statement (in place of the reference stat block).
 * No fabricated statistics — an honest positioning statement instead.
 * Panel uses VayuCodes ink + subtle ember gradient.
 */
export default function StatBlock() {
  const panelRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, { scale: 0.94, opacity: 0 })
      gsap.set(glowRef.current, { opacity: 0 })

      ScrollTrigger.create({
        trigger: panelRef.current,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(panelRef.current, { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out' })
          gsap.to(glowRef.current, { opacity: 1, duration: 1.6, ease: 'power2.out', delay: 0.2 })
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-vc-ink py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div
          ref={panelRef}
          className="relative rounded-panel overflow-hidden px-8 md:px-16 py-16 md:py-24"
          style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Soft white glow */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute -top-1/2 -right-1/3 w-[80%] h-[160%] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 60%)' }}
          />

          <div className="relative grid md:grid-cols-12 gap-10">
            {/* Left: eyebrow + small statement */}
            <div className="md:col-span-4">
              <Eyebrow tone="light" className="text-pure-white/60">Manifesto</Eyebrow>
              <p className="mt-6 text-body text-pure-white/60 leading-relaxed">
                We&apos;re not a marketing agency dressed up in code, and we&apos;re not a dev shop pretending to design. We are a studio built to do all of it — well.
              </p>
            </div>

            {/* Right: massive statement */}
            <div className="md:col-span-8">
              <WordReveal
                as="h2"
                text="Design. Engineering. AI. Automation. Growth. Under one roof, from idea to scale."
                className="text-pure-white leading-[1.08]"
                stagger={0.05}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        section :global(h2) {
          font-family: var(--font-instrument);
          font-weight: 400;
          font-size: clamp(28px, 3.6vw, 46px);
          letter-spacing: -0.012em;
        }
      `}</style>
    </section>
  )
}
