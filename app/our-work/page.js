'use client'

import {
  PageWrapper, PageHero, CTABlock
} from '@/components/site/Shared'
import StackedShowcase from '@/components/site/StackedShowcase'

export default function OurWorkPage() {
  return (
    <PageWrapper darkHero={true}>
      <PageHero
        tag="· Our work"
        title="50+ businesses. Real receipts."
        italicWord="Real receipts."
        subtitle="From textile manufacturers in Surat to retail chains across South Gujarat — these are the businesses we've helped trade Excel sheets for dashboards, pamphlets for funnels, and 'we'll think about it' for 'can you start tomorrow?'."
      />
      <StackedShowcase />
      <CTABlock kicker="Want to be next?" title="Let's add your name to this list." italicWord="to this list." />
    </PageWrapper>
  )
}
