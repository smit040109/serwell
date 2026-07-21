'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import WordReveal from '@/components/animation/WordReveal'

// PLACEHOLDER — MRI/brain scan image
const MRI_IMG = 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=800'

export default function StatBlock() {
  const panelRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, { scale: 0.92, opacity: 0 })
      gsap.set(imgRef.current, { x: -30, opacity: 0 })

      ScrollTrigger.create({
        trigger: panelRef.current,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(panelRef.current, { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' })
          gsap.to(imgRef.current, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 })
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-obsidian py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div
          ref={panelRef}
          className="rounded-panel overflow-hidden grid md:grid-cols-5"
          style={{ background: '#193a29' }}
        >
          {/* Left: MRI image */}
          <div ref={imgRef} className="md:col-span-2 relative aspect-[4/5] md:aspect-auto min-h-[280px] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${MRI_IMG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(0.15) brightness(0.9) contrast(1.05)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest-sovereignty/70" />
          </div>

          {/* Right: stat headline */}
          <div className="md:col-span-3 p-8 md:p-14 lg:p-16 flex items-center">
            <WordReveal
              as="h2"
              text="90% of the world's leading generative AI model builders are powered by Scale."
              className="font-aeonik font-normal text-pure-white"
              stagger={0.05}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        section :global(h2) {
          font-size: clamp(28px, 3.4vw, 42px);
          line-height: 1.15;
          letter-spacing: -0.01em;
        }
      `}</style>
    </section>
  )
}
