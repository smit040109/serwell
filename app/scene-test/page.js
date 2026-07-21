import CinematicStack from '@/components/scale/sections/CinematicStack'

export default function SceneTest() {
  return (
    <main className="bg-obsidian text-pure-white">
      {/* Spacer to allow scroll INTO the pinned section */}
      <section className="h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="eyebrow text-pure-white/60">Scene Test</p>
          <h1 className="mt-4 font-aeonik font-normal" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            Scroll down to enter the cinematic scene↓
          </h1>
        </div>
      </section>

      <CinematicStack />

      {/* Spacer after pinned section to prove exit works */}
      <section className="h-[80vh] flex items-center justify-center bg-pure-white text-obsidian px-6">
        <div className="text-center">
          <p className="eyebrow text-graphite">After exit</p>
          <h2 className="mt-3 font-aeonik font-normal" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)' }}>
            Normal scroll resumes here.
          </h2>
        </div>
      </section>
    </main>
  )
}
