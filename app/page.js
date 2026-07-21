import Navbar from '@/components/scale/Navbar'
import Footer from '@/components/scale/Footer'
import HeroFullBleed from '@/components/scale/sections/HeroFullBleed'
import CinematicStack from '@/components/scale/sections/CinematicStack'
import StatBlock from '@/components/scale/sections/StatBlock'
import RealAutonomyGrid from '@/components/scale/sections/RealAutonomyGrid'
import PartnerLogoGrid from '@/components/scale/sections/PartnerLogoGrid'
import ProvenIndustryCarousel from '@/components/scale/sections/ProvenIndustryCarousel'
import BenchmarkStatement from '@/components/scale/sections/BenchmarkStatement'
import ThreePillars from '@/components/scale/sections/ThreePillars'
import NewsGrid from '@/components/scale/sections/NewsGrid'
import LegacyCTA from '@/components/scale/sections/LegacyCTA'

export default function Home() {
  return (
    <main className="relative bg-pure-white text-obsidian overflow-x-hidden">
      <Navbar />
      <HeroFullBleed />
      <CinematicStack />
      <StatBlock />
      <RealAutonomyGrid />
      <PartnerLogoGrid />
      <ProvenIndustryCarousel />
      <BenchmarkStatement />
      <ThreePillars />
      <NewsGrid />
      <LegacyCTA />
      <Footer />
    </main>
  )
}
