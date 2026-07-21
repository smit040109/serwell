'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'

function Spacecraft({ launching }) {
  const meshRef = useRef(null)
  const groupRef = useRef(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
    }
    if (groupRef.current && launching) {
      groupRef.current.position.y += delta * 2.5
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#C8FF3D"
          emissive="#C8FF3D"
          emissiveIntensity={launching ? 1.4 : 0.5}
          metalness={0.6}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial color="#C8FF3D" wireframe transparent opacity={0.25} />
      </mesh>
      <pointLight position={[0, -1.5, 0]} color="#C8FF3D" intensity={launching ? 6 : 2} distance={5} />
    </group>
  )
}

function Particles({ launching }) {
  const pointsRef = useRef(null)
  const count = 300
  const positions = useRef(
    new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 12)
  )

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const speed = launching ? 4 : 0.3
    const arr = pointsRef.current.geometry.attributes.position.array
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += delta * speed
      if (arr[i] > 6) arr[i] = -6
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#C8FF3D" transparent opacity={0.5} />
    </points>
  )
}

export default function LaunchExperience({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const [launching, setLaunching] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('vayucodes-launch-seen')
    if (alreadySeen) {
      setDismissed(true)
      onComplete?.()
      return
    }

    setShown(true)
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 2600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onComplete])

  const handleLaunch = () => {
    if (launching) return
    setLaunching(true)
    document.body.style.overflow = ''
    sessionStorage.setItem('vayucodes-launch-seen', '1')
    setTimeout(() => {
      setDismissed(true)
      onComplete?.()
    }, 1400)
  }

  if (dismissed || !shown) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: launching ? 0 : 1 }}
        transition={{ duration: 1.2, delay: launching ? 0.3 : 0 }}
        onAnimationComplete={() => {
          if (launching) document.getElementById('launch-overlay')?.remove()
        }}
        id="launch-overlay"
      >
        <div className="absolute inset-0 opacity-70">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.3} />
            <Spacecraft launching={launching} />
            <Particles launching={launching} />
          </Canvas>
        </div>

        <div className="relative z-10 text-center px-6">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.h1
                key="p0"
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.15em' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-white text-3xl md:text-5xl font-mono uppercase tracking-widest"
              >
                VAYUCODES
              </motion.h1>
            )}
            {phase === 1 && (
              <motion.h1
                key="p1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-white/70 text-xl md:text-3xl font-light tracking-wide"
              >
                WE DON'T BUILD DIGITAL PRODUCTS.
              </motion.h1>
            )}
            {phase === 2 && (
              <motion.div
                key="p2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-white text-3xl md:text-5xl font-semibold tracking-tight mb-10">
                  WE LAUNCH THEM.
                </h1>
                <motion.button
                  onClick={handleLaunch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-[#C8FF3D]/50 text-[#C8FF3D] text-xs tracking-[0.3em] uppercase px-8 py-4 rounded-full hover:bg-[#C8FF3D]/10 transition-colors"
                >
                  [ Initiate Launch ]
                </motion.button>
                <p className="text-white/30 text-[11px] mt-6 tracking-widest uppercase">or scroll to continue</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
