'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Eyebrow from '@/components/ui-scale/Eyebrow'
import Button from '@/components/ui-scale/Button'

// PLACEHOLDER hero image inside phone screen (replace later with Scale's real asset)
const PHONE_SCREEN = 'https://images.pexels.com/photos/8913522/pexels-photo-8913522.jpeg?auto=compress&cs=tinysrgb&w=800'

/**
 * CinematicStack — the signature pinned + scrubbed 3D scene.
 *
 * Structure:
 *  - A parent .pin-wrap (height 400vh) with an inner .sticky-viewport (100vh)
 *  - Inside sticky-viewport: perspective container + 4 layered planes forming a phone-like device
 *  - 3 text panels (SceneA, SceneB, SceneC) that fade in/out at different scroll progress
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
      // Base layer positions (start states)
      gsap.set(stageRef.current, { rotateY: -25, rotateX: 8, scale: 0.6, opacity: 0 })
      gsap.set(layer1Ref.current, { z: 0 })
      gsap.set(layer2Ref.current, { z: 0, opacity: 0 })
      gsap.set(layer3Ref.current, { z: 0, opacity: 0 })
      gsap.set(layer4Ref.current, { z: 0, opacity: 0.3 })

      gsap.set(sceneARef.current, { opacity: 0, y: 30 })
      gsap.set(sceneBRef.current, { opacity: 0, y: 30 })
      gsap.set(sceneCRef.current, { opacity: 0, y: 30 })

      // Main pinned + scrubbed timeline
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

      // 0% -> 25%  :  Phone rotates in + Scene A reveals
      tl.to(stageRef.current, { rotateY: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 0)
        .to(layer2Ref.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.15)
        .to(layer3Ref.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.2)
        .to(sceneARef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.15)

      // 25% -> 45% : Sit still, Scene A stays

      // 45% -> 55% : Scene A fades out, layers separate for Scene B
      tl.to(sceneARef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, 1.7)
        .to(layer1Ref.current, { z: 80, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(layer3Ref.current, { z: -120, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(layer4Ref.current, { z: -220, opacity: 0.5, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(stageRef.current, { rotateY: -12, rotateX: -3, duration: 0.8, ease: 'power2.inOut' }, 1.7)
        .to(sceneBRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 2.0)

      // 55% -> 70% : Scene B holds

      // 70% -> 82% : Transition to Scene C (Data — dusty iris headline)
      tl.to(sceneBRef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, 2.9)
        .to(stageRef.current, { rotateY: 15, rotateX: 4, duration: 0.8, ease: 'power2.inOut' }, 2.9)
        .to(layer1Ref.current, { z: 40, duration: 0.8, ease: 'power2.inOut' }, 2.9)
        .to(layer3Ref.current, { z: -180, duration: 0.8, ease: 'power2.inOut' }, 2.9)
        .to(gridRef.current, { opacity: 0.6, duration: 0.6, ease: 'power2.out' }, 2.9)
        .to(sceneCRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 3.2)

      // 82% -> 100% : Exit — everything fades, phone scales down
      tl.to(sceneCRef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, 4.1)
        .to(stageRef.current, { scale: 0.7, opacity: 0, rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power2.in' }, 4.2)
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapRef} className="relative w-full bg-obsidian" style={{ height: '400vh' }}>
      <div ref={stickyRef} className="relative w-full h-screen overflow-hidden">
        {/* Ambient technical grid background */}
        <div
          ref={gridRef}
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Perspective stage */}
        <div className="absolute inset-0 flex items-center justify-center perspective-scene">
          <div ref={stageRef} className="relative preserve-3d will-animate" style={{ width: 320, height: 640 }}>
            {/* Layer 4: back data grid (deepest) */}
            <div
              ref={layer4Ref}
              className="absolute inset-0 rounded-[40px] preserve-3d"
              style={{
                background:
                  'linear-gradient(180deg, rgba(30,42,50,0.9) 0%, rgba(10,15,20,0.9) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <svg viewBox="0 0 320 640" className="w-full h-full opacity-40">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 32} x2={320} y2={i * 32} stroke="#5eead4" strokeWidth={0.3} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 32} y1={0} x2={i * 32} y2={640} stroke="#5eead4" strokeWidth={0.3} />
                ))}
              </svg>
            </div>

            {/* Layer 3: annotation grid mid-back */}
            <div
              ref={layer3Ref}
              className="absolute inset-4 rounded-[36px] preserve-3d overflow-hidden"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <svg viewBox="0 0 300 600" className="w-full h-full">
                {/* fake data points */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const x = 20 + (i * 37) % 260
                  const y = 40 + Math.floor(i / 7) * 90
                  return (
                    <g key={`dp${i}`} opacity={0.7}>
                      <circle cx={x} cy={y} r={2} fill="#79648c" />
                      <text x={x + 6} y={y + 3} fill="#79648c" fontSize={7} fontFamily="monospace">
                        {(0.4 + (i * 0.037) % 0.6).toFixed(2)}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Layer 2: mid — annotations + bounding boxes */}
            <div
              ref={layer2Ref}
              className="absolute inset-8 rounded-[30px] preserve-3d overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.35)' }}
            >
              <svg viewBox="0 0 100 200" className="w-full h-full" preserveAspectRatio="none">
                <rect x="18" y="70" width="40" height="25" fill="none" stroke="#3B82F6" strokeWidth={0.5} />
                <rect x="62" y="78" width="20" height="14" fill="none" stroke="#F97316" strokeWidth={0.5} />
                <rect x="8"  y="80" width="14" height="10" fill="none" stroke="#F97316" strokeWidth={0.5} />
                <rect x="70" y="55" width="12" height="9"  fill="none" stroke="#F97316" strokeWidth={0.5} />
              </svg>
            </div>

            {/* Layer 1: front — actual photo screen */}
            <div
              ref={layer1Ref}
              className="absolute inset-10 rounded-[26px] overflow-hidden preserve-3d"
              style={{
                boxShadow: '0 0 80px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${PHONE_SCREEN})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.85) contrast(1.1) saturate(0.9)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            </div>
          </div>
        </div>

        {/* Scene A: Reliable AI has no shortcuts (top-left) */}
        <div
          ref={sceneARef}
          className="absolute z-10 top-1/2 -translate-y-1/2 left-6 md:left-16 max-w-[440px] px-4"
        >
          <h2 className="font-aeonik font-normal text-pure-white" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            Reliable AI has no shortcuts.
          </h2>
          <p className="mt-5 text-body text-pure-white/70">
            Scale works across the AI stack, from the data that trains the models you rely on, to the systems that put them to work. Humans stay in the loop.
          </p>
        </div>

        {/* Scene B: Applications */}
        <div
          ref={sceneBRef}
          className="absolute z-10 top-1/2 -translate-y-1/2 left-6 md:left-16 max-w-[440px] px-4"
        >
          <Eyebrow tone="light" className="text-pure-white/70">APPLICATIONS</Eyebrow>
          <h2 className="mt-3 font-aeonik font-normal text-pure-white" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            AI systems that actually work.
          </h2>
          <p className="mt-5 text-body text-pure-white/70">
            Most AI deployments in enterprise and government fail. We find the right use case, build the system, and own the outcome.
          </p>
          <div className="mt-6">
            <Button variant="filled-light" href="#">For Enterprise</Button>
          </div>
        </div>

        {/* Scene C: Data */}
        <div
          ref={sceneCRef}
          className="absolute z-10 top-1/2 -translate-y-1/2 right-6 md:right-16 max-w-[440px] px-4 text-right"
        >
          <Eyebrow tone="light" className="text-pure-white/70">DATA</Eyebrow>
          <h2 className="mt-3 font-aeonik font-normal" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.01em', color: '#79648c' }}>
            The data powering the world&apos;s best AI.
          </h2>
          <p className="mt-5 text-body text-pure-white/70">
            The models at the frontier run on Scale data. We source contributions from the world&apos;s most sophisticated experts across every domain.
          </p>
          <div className="mt-6 flex justify-end">
            <Button variant="filled-light" href="#">For Data Teams</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
