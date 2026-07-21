import Eyebrow from '@/components/ui-scale/Eyebrow'
import RevealOnScroll from '@/components/animation/RevealOnScroll'

// Text-based logo placeholders (mono, high-contrast)
const partners = [
  { name: 'META',          style: 'font-black tracking-tight' },
  { name: 'Microsoft',     style: 'font-normal tracking-tight' },
  { name: 'OpenAI',        style: 'font-medium tracking-tight' },
  { name: 'Anthropic',     style: 'font-medium tracking-tight' },
  { name: 'NVIDIA',        style: 'font-black tracking-widest' },
  { name: 'Morgan Stanley',style: 'font-normal tracking-tight' },
  { name: 'Toyota',        style: 'font-normal tracking-wider uppercase' },
  { name: 'Deloitte',      style: 'font-medium tracking-tight' },
  { name: 'US Army',       style: 'font-black tracking-widest uppercase' },
  { name: 'Mayo Clinic',   style: 'font-normal tracking-tight' },
]

export default function PartnerLogoGrid() {
  return (
    <section className="bg-pure-white py-20 md:py-28 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div className="text-center mb-14">
          <Eyebrow tone="muted">Trusted by the world&apos;s leaders</Eyebrow>
        </div>

        <RevealOnScroll y={20} stagger={0.06} className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10 items-center justify-items-center">
          {partners.map(p => (
            <div
              key={p.name}
              className={`text-graphite text-[20px] md:text-[22px] ${p.style} grayscale hover:text-obsidian transition-colors cursor-default`}
            >
              {p.name}
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  )
}
