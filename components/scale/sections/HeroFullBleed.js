'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import ScrollPrompt from '@/components/ui-scale/ScrollPrompt'

// VayuCodes hero — cinematic dark canvas with a technical grid + node overlay
// (represents the "digital systems" VayuCodes builds, not a car street scene)
export default function HeroFullBleed() {
  const rootRef = useRef(null)
  const bgRef = useRef(null)
  const svgRef = useRef(null)
  const titleRef = useRef(null)
  const italicRef = useRef(null)
  const kickerRef = useRef(null)
  const subRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic entrance for headline (Instrument Serif italic word matches VayuCodes brand)
      gsap.set([kickerRef.current, titleRef.current, italicRef.current, subRef.current], { opacity: 0 })
      gsap.set([titleRef.current, italicRef.current, subRef.current], { y: 40 })

      const tl = gsap.timeline({ delay: 0.4 })
      tl.to(kickerRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.4')
        .to(italicRef.current, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.85')
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5')

      // Technical overlay draw-in
      const lines = svgRef.current?.querySelectorAll('.tech-line')
      const nodes = svgRef.current?.querySelectorAll('.tech-node')
      const labels = svgRef.current?.querySelectorAll('.tech-label')
      if (lines?.length) {
        gsap.fromTo(lines,
          { strokeDashoffset: 400, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.3, ease: 'power2.out', stagger: 0.08, delay: 0.7 }
        )
      }
      if (nodes?.length) {
        gsap.fromTo(nodes, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.06, delay: 1.2 })
      }
      if (labels?.length) {
        gsap.fromTo(labels, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 1.5 })
      }

      // Parallax the ambient bg on scroll
      gsap.to(bgRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  // Nodes representing DESIGN / ENGINEERING / AUTOMATION / GROWTH pillars
  const techNodes = [
    { id: 'design',     x: 22, y: 32, label: 'DESIGN' },
    { id: 'engineering',x: 74, y: 28, label: 'ENGINEERING' },
    { id: 'automation', x: 82, y: 68, label: 'AUTOMATION' },
    { id: 'growth',     x: 18, y: 72, label: 'GROWTH' },
  ]
  // Central hub — idea
  const hub = { x: 50, y: 50 }

  return (
    <section ref={rootRef} className="relative w-full h-screen min-h-[720px] overflow-hidden bg-vc-ink">
      {/* Ambient gradient canvas — dark to slightly warm */}
      <div ref={bgRef} className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(232,93,44,0.14) 0%, rgba(232,93,44,0.05) 25%, transparent 60%)',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        {/* Faint grid pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"
        }} />
      </div>

      {/* Technical node network overlay — DESIGN / ENGINEERING / AUTOMATION / GROWTH */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Connective lines from hub to each node */}
        {techNodes.map(n => (
          <line
            key={`l-${n.id}`}
            className="tech-line"
            x1={hub.x} y1={hub.y} x2={n.x} y2={n.y}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={0.12}
            strokeDasharray="400"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* Hub */}
        <circle className="tech-node" cx={hub.x} cy={hub.y} r={0.9} fill="#E85D2C" />
        <circle className="tech-node" cx={hub.x} cy={hub.y} r={2.4} fill="none" stroke="rgba(232,93,44,0.5)" strokeWidth={0.15} vectorEffect="non-scaling-stroke" />
        {/* Outer nodes + labels */}
        {techNodes.map(n => (
          <g key={`n-${n.id}`}>
            <circle className="tech-node" cx={n.x} cy={n.y} r={0.6} fill="#fff" />
            <g className="tech-label">
              <text
                x={n.x} y={n.y - 2}
                fill="rgba(255,255,255,0.75)"
                fontSize={1.4}
                fontFamily="var(--font-mono)"
                letterSpacing="0.12em"
                textAnchor="middle"
                style={{ textTransform: 'uppercase' }}
              >
                {n.label}
              </text>
            </g>
          </g>
        ))}
      </svg>

      {/* Headline block */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center">
        <div ref={kickerRef} className="eyebrow text-pure-white/60 mb-6">
          <span className="inline-flex items-center gap-3">
            <span className="w-8 h-px bg-pure-white/40" />
            An independent studio
            <span className="w-8 h-px bg-pure-white/40" />
          </span>
        </div>

        <h1
          className="text-pure-white leading-[1.02] max-w-[1100px]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(36px, 5.8vw, 82px)', letterSpacing: '-0.012em' }}
        >
          <span ref={titleRef} className="block">Engineering digital systems for</span>
          <span ref={italicRef} className="block italic text-pure-white/80">businesses built to move forward.</span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-[620px] text-pure-white/65 text-body"
        >
          We design, build and scale premium digital products — combining design, engineering, AI and automation into systems your business can rely on.
        </p>
      </div>

      {/* Scroll prompt bottom-right */}
      <ScrollPrompt className="absolute bottom-8 right-8 z-10" />
    </section>
  )
}
