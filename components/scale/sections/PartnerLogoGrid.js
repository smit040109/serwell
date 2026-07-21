import Eyebrow from '@/components/ui-scale/Eyebrow'
import RevealOnScroll from '@/components/animation/RevealOnScroll'

// Tools / tech VayuCodes builds with. Honest — no fake clients.
const tech = [
  { name: 'React',      style: 'font-medium' },
  { name: 'Next.js',    style: 'font-medium tracking-tight' },
  { name: 'TypeScript', style: 'font-medium tracking-tight' },
  { name: 'Node',       style: 'font-medium' },
  { name: 'Python',     style: 'font-medium tracking-tight' },
  { name: 'Tailwind',   style: 'font-medium tracking-tight' },
  { name: 'GSAP',       style: 'font-black tracking-wide uppercase' },
  { name: 'Framer',     style: 'font-medium tracking-tight' },
  { name: 'Figma',      style: 'font-medium tracking-tight' },
  { name: 'OpenAI',     style: 'font-medium tracking-tight' },
]

export default function PartnerLogoGrid() {
  return (
    <section className="bg-pure-white py-20 md:py-24 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <div className="text-center mb-12">
          <Eyebrow tone="muted">Built with tools we love</Eyebrow>
        </div>

        <RevealOnScroll y={20} stagger={0.05} className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10 items-center justify-items-center">
          {tech.map(t => (
            <div
              key={t.name}
              className={`text-graphite text-[20px] md:text-[22px] ${t.style} hover:text-vc-ink transition-colors cursor-default select-none`}
            >
              {t.name}
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  )
}
