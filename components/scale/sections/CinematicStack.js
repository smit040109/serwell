'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Eyebrow from '@/components/ui-scale/Eyebrow'
import Button from '@/components/ui-scale/Button'

/**
 * CinematicStack — pinned + scrubbed 3D scene telling the VayuCodes story.
 *
 * Story arc: IDEA → DESIGN → ENGINEERING → AUTOMATION → SCALE
 * Compressed into 3 revealed sub-scenes over 400vh:
 *   Scene A  —  01 DESIGN
 *   Scene B  —  02 ENGINEERING & AUTOMATION
 *   Scene C  —  03 GROWTH & SCALE  (ember accent)
 *
 * Central visual: a stylized "product surface" — 4 stacked planes representing
 * (from back to front): blueprint grid → code / architecture nodes → UI wireframe → polished product mockup.
 */
export default function CinematicStack() {
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)
  const stageRef = useRef(null)
  const layer1Ref = useRef(null)
  const layer2Ref = useRef(null)
  const layer3Ref = useRef(null)
  const layer4Ref = useRef(null)
  const sceneARef = useRef(null)
  const sceneBRef = useRef(null)
  const sceneCRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const ctx = gsap.context(() => {
      gsap.set(stageRef.current, { rotateY: -25, rotateX: 8, scale: 0.62, opacity: 0 })
      gsap.set(layer1Ref.current, { z: 0 })
      gsap.set(layer2Ref.current, { z: 0, opacity: 0 })
      gsap.set(layer3Ref.current, { z: 0, opacity: 0 })
      gsap.set(layer4Ref.current, { z: 0, opacity: 0.3 })
      gsap.set([sceneARef.current, sceneBRef.current, sceneCRef.current], { opacity: 0, y: 30 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        },
      })

      // 0 → 25% : Stage enters, Scene A (DESIGN)
      tl.to(stageRef.current, { rotateY: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 0)
        .to(layer2Ref.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.15)
        .to(layer3Ref.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.2)
        .to(sceneARef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.2)

      // 45% → 55% : Scene A exits, layers separate for Scene B
      tl.to(sceneARef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, 1.7)
        .to(layer1Ref.current, { z: 80, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(layer3Ref.current, { z: -120, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(layer4Ref.current, { z: -220, opacity: 0.5, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(stageRef.current, { rotateY: -12, rotateX: -3, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(sceneBRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 2.0)

      // 70% → 82% : Scene B exits, Scene C (GROWTH — ember accent)
      tl.to(sceneBRef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, 2.9)
        .to(stageRef.current, { rotateY: 15, rotateX: 4, duration: 0.8, ease: 'power2.inOut' }, 2.9)
        .to(layer1Ref.current, { z: 40, duration: 0.8, ease: 'power2.inOut' }, 2.9)
        .to(layer3Ref.current, { z: -180, duration: 0.8, ease: 'power2.inOut' }, 2.9)
        .to(gridRef.current, { opacity: 0.6, duration: 0.6, ease: 'power2.out' }, 2.9)
        .to(sceneCRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 3.2)

      // 90% → 100% : Exit
      tl.to(sceneCRef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, 4.1)
        .to(stageRef.current, { scale: 0.7, opacity: 0, rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power2.in' }, 4.2)
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapRef} className="relative w-full bg-vc-ink" style={{ height: '400vh' }}>
      <div ref={stickyRef} className="relative w-full h-screen overflow-hidden">
        {/* Ambient technical grid */}
        <div
          ref={gridRef}
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Perspective stage — "the product surface" */}
        <div className="absolute inset-0 flex items-center justify-center perspective-scene">
          <div ref={stageRef} className="relative preserve-3d will-animate" style={{ width: 380, height: 560 }}>
            {/* Layer 4: deepest — blueprint grid */}
            <div
              ref={layer4Ref}
              className="absolute inset-0 rounded-[28px] preserve-3d"
              style={{
                background: 'linear-gradient(180deg, rgba(30,42,50,0.9) 0%, rgba(10,15,20,0.9) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <svg viewBox="0 0 380 560" className="w-full h-full opacity-40">
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 32} x2={380} y2={i * 32} stroke="#5eead4" strokeWidth={0.3} />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 32} y1={0} x2={i * 32} y2={560} stroke="#5eead4" strokeWidth={0.3} />
                ))}
              </svg>
            </div>

            {/* Layer 3: code / architecture nodes */}
            <div
              ref={layer3Ref}
              className="absolute inset-4 rounded-[24px] preserve-3d overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg viewBox="0 0 360 520" className="w-full h-full">
                {/* Code-like lines */}
                {Array.from({ length: 14 }).map((_, i) => {
                  const w = 60 + (i * 47) % 220
                  const color = 'rgba(255,255,255,0.55)'
                  return (
                    <g key={`code-${i}`} opacity={0.85}>
                      <text x={30} y={40 + i * 28} fill={color} fontSize={11} fontFamily="var(--font-mono), monospace">
                        {i % 4 === 0 ? 'export' : i % 3 === 0 ? 'const' : i % 2 === 0 ? 'return' : 'function'}
                      </text>
                      <rect x={95} y={30 + i * 28} width={w} height={4} fill={color} opacity={0.4} />
                    </g>
                  )
                })}
                {/* Connection nodes on the right */}
                {[80, 160, 240, 320, 400].map((y, i) => (
                  <g key={`node-${i}`}>
                    <circle cx={310} cy={y} r={4} fill="rgba(255,255,255,0.7)" />
                    <line x1={280} y1={y} x2={306} y2={y} stroke="rgba(255,255,255,0.4)" strokeWidth={0.6} />
                  </g>
                ))}
              </svg>
            </div>

            {/* Layer 2: UI wireframe overlay */}
            <div
              ref={layer2Ref}
              className="absolute inset-10 rounded-[20px] preserve-3d overflow-hidden"
              style={{ background: 'rgba(15,15,20,0.72)', border: '1px solid rgba(255,255,255,0.14)' }}
            >
              <svg viewBox="0 0 340 480" className="w-full h-full">
                {/* Header bar */}
                <rect x={20} y={22} width={80} height={12} rx={3} fill="rgba(255,255,255,0.7)" />
                <rect x={280} y={22} width={40} height={12} rx={3} fill="rgba(255,255,255,0.35)" />
                {/* Content blocks */}
                <rect x={20} y={60} width={300} height={90} rx={6} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} strokeDasharray="3 3" />
                <rect x={20} y={170} width={140} height={100} rx={6} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} strokeDasharray="3 3" />
                <rect x={180} y={170} width={140} height={100} rx={6} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} strokeDasharray="3 3" />
                <rect x={20} y={290} width={300} height={60} rx={6} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} strokeDasharray="3 3" />
                <rect x={20} y={370} width={200} height={22} rx={11} fill="rgba(255,255,255,0.9)" />
              </svg>
            </div>

            {/* Layer 1: front — polished product surface (dashboard) */}
            <div
              ref={layer1Ref}
              className="absolute inset-14 rounded-[16px] overflow-hidden preserve-3d"
              style={{ boxShadow: '0 0 80px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(255,255,255,0.08)' }}
            >
              {/* Dashboard mockup: monochrome gradient + fake analytics */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0a0c 0%, #17171b 55%, #0f0f13 100%)' }} />
              <div className="absolute inset-0 opacity-90">
                <svg viewBox="0 0 300 420" className="w-full h-full">
                  {/* Top nav */}
                  <rect x={16} y={16} width={70} height={8} rx={2} fill="rgba(255,255,255,0.9)" />
                  <circle cx={280} cy={20} r={4} fill="rgba(255,255,255,0.7)" />
                  {/* Big number */}
                  <text x={20} y={80} fill="#fff" fontSize={28} fontFamily="var(--font-aeonik), sans-serif" fontWeight="400" letterSpacing="-0.02em">$482,940</text>
                  <text x={20} y={100} fill="rgba(255,255,255,0.55)" fontSize={10} fontFamily="var(--font-mono), monospace">↗ +18.4%</text>
                  {/* Growth chart line */}
                  <path
                    d="M 20,220 L 55,205 L 90,215 L 125,180 L 160,190 L 195,150 L 230,155 L 265,120 L 280,110"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20,220 L 55,205 L 90,215 L 125,180 L 160,190 L 195,150 L 230,155 L 265,120 L 280,110 L 280,240 L 20,240 Z"
                    fill="url(#whiteGradient)"
                    opacity={0.25}
                  />
                  <defs>
                    <linearGradient id="whiteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Bars */}
                  {[280, 300, 320, 340, 360, 380].map((y, i) => (
                    <rect key={`bar-${i}`} x={20 + i * 45} y={y} width={30} height={400 - y} rx={2} fill={i === 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)'} />
                  ))}
                </svg>
              </div>
              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            </div>
          </div>
        </div>

        {/* ---------------- Scene A: 01 DESIGN ---------------- */}
        <div
          ref={sceneARef}
          className="absolute z-10 top-1/2 -translate-y-1/2 left-6 md:left-16 max-w-[440px] px-4"
        >
          <Eyebrow tone="light" className="text-pure-white/60">01 — DESIGN</Eyebrow>
          <h2
            className="mt-4 text-pure-white leading-[1.08]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px, 3.8vw, 48px)', letterSpacing: '-0.01em' }}
          >
            We shape the <span className="italic text-pure-white/75">interface</span>.
          </h2>
          <p className="mt-5 text-body text-pure-white/70">
            Every product starts as a rough idea. We turn it into pixel-tight interfaces, motion systems, and design decisions your users can actually feel.
          </p>
        </div>

        {/* ---------------- Scene B: 02 ENGINEERING & AUTOMATION ---------------- */}
        <div
          ref={sceneBRef}
          className="absolute z-10 top-1/2 -translate-y-1/2 left-6 md:left-16 max-w-[460px] px-4"
        >
          <Eyebrow tone="light" className="text-pure-white/60">02 — ENGINEERING & AUTOMATION</Eyebrow>
          <h2
            className="mt-4 text-pure-white leading-[1.08]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px, 3.8vw, 48px)', letterSpacing: '-0.01em' }}
          >
            We turn design into <span className="italic text-pure-white/75">working systems</span>.
          </h2>
          <p className="mt-5 text-body text-pure-white/70">
            Custom software, high-performance web, automated workflows, AI integrations. Whatever the stack, we ship production-grade systems that hold up in the real world.
          </p>
          <div className="mt-7">
            <Button variant="filled-light" href="/why-us">How we build</Button>
          </div>
        </div>

        {/* ---------------- Scene C: 03 GROWTH & SCALE (ember accent) ---------------- */}
        <div
          ref={sceneCRef}
          className="absolute z-10 top-1/2 -translate-y-1/2 right-6 md:right-16 max-w-[460px] px-4 text-right"
        >
          <Eyebrow tone="light" className="text-pure-white/60">03 — GROWTH & SCALE</Eyebrow>
          <h2
            className="mt-4 text-pure-white leading-[1.08]"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(30px, 3.8vw, 48px)', letterSpacing: '-0.01em' }}
          >
            And we help them <span className="italic text-pure-white/60">grow</span>.
          </h2>
          <p className="mt-5 text-body text-pure-white/70">
            Performance marketing, analytics, iterative optimization. We stay with the product after launch — because building is only half the job.
          </p>
          <div className="mt-7 flex justify-end">
            <Button variant="filled-light" href="/digital-marketing">See growth work</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
