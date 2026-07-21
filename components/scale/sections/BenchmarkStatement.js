'use client'

import WordReveal from '@/components/animation/WordReveal'

export default function BenchmarkStatement() {
  return (
    <section className="bg-pure-white py-24 md:py-36 px-6 md:px-8">
      <div className="max-w-page mx-auto">
        <WordReveal
          as="h2"
          text="We design, build and scale the systems businesses run on."
          className="max-w-[1080px]"
          stagger={0.06}
        />
      </div>

      <style jsx>{`
        section :global(h2) {
          font-family: var(--font-instrument);
          font-weight: 400;
          font-size: clamp(36px, 5.5vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.012em;
          color: #0E0E10;
        }
        section :global(h2 .wr-inner) {
          /* nothing extra */
        }
      `}</style>
    </section>
  )
}
