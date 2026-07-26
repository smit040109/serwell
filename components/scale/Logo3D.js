'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// Module-level cache — GLB downloads + decodes only ONCE per browser session,
// every subsequent Logo3D mount (page navigation) reuses the cached model instantly.
let cachedModelPromise = null
function getModel() {
  if (!cachedModelPromise) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    cachedModelPromise = new Promise((resolve, reject) => {
      loader.load('/brand/logo-3d.glb', (gltf) => resolve(gltf.scene), undefined, reject)
    })
  }
  return cachedModelPromise
}

export default function Logo3D({ className = '', light = false }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Wait one frame so the browser has finished layout (fixes 0-size canvas on mobile,
    // where clientWidth/clientHeight can read as 0 immediately on mount).
    let width = mount.clientWidth || 120
    let height = mount.clientHeight || 40

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    camera.position.set(0, 0.3, 3.2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // ResizeObserver keeps the canvas correctly sized even if the container
    // wasn't laid out yet at mount time (common on mobile).
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || width
        const h = entry.contentRect.height || height
        if (w > 0 && h > 0 && (w !== width || h !== height)) {
          width = w
          height = h
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.setSize(width, height)
        }
      }
    })
    ro.observe(mount)

    const ambient = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 1.2)
    dir.position.set(2, 3, 4)
    scene.add(dir)

    const solidColor = light ? 0xffffff : 0x0a0a0a
    const overrideMaterial = new THREE.MeshStandardMaterial({
      color: solidColor,
      roughness: 0.4,
      metalness: 0.1,
    })

    let model
    let cancelled = false

    getModel().then((cachedScene) => {
      if (cancelled) return
      model = cachedScene.clone(true)
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = overrideMaterial
        }
      })
      scene.add(model)

      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)

      const maxDim = Math.max(size.x, size.y, size.z)
      camera.position.set(0, 0, maxDim * 2.2)
      camera.lookAt(0, 0, 0)
    })

    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = mount.clientWidth || 120
      const h = mount.clientHeight || 40
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelled = true
      ro.disconnect()
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      overrideMaterial.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [light])

  return <div ref={mountRef} className={className} style={{ pointerEvents: 'none', minWidth: '110px', minHeight: '40px', display: 'block' }} />
}
