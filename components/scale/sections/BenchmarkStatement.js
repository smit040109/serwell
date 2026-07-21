'use client'

import WordReveal from '@/components/animation/WordReveal'

export default function BenchmarkStatement() {
  return (
    <section className="bg-pure-white py-24 md:py-36 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <WordReveal
          as="h2"
          text="We set the benchmark for what's possible with AI."
          className="font-aeonik font-normal max-w-[1080px]"
          stagger={0.06}
        />
      </div>

      <style jsx>{`
        section :global(h2) {
          font-size: clamp(36px, 5.5vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #79648c;
        }
      `}</style>
    </section>
  )
}
