'use client'
import {
  PageWrapper, CTABlock
} from '@/components/site/Shared'
import PortfolioSlider from '@/components/PortfolioSlider'
import OurWorkHero from '@/components/site/OurWorkHero'
export default function OurWorkPage() {
  return (
    <PageWrapper darkHero={true}>
      <OurWorkHero />
      <PortfolioSlider />
      <CTABlock kicker="Want to be next?" title="Let's add your name to this list." italicWord="to this list." />
    </PageWrapper>
  )
}
