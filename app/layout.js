import './globals.css'
import LenisProvider from '@/components/animation/LenisProvider'
import {
  Inter,
  Manrope,
  JetBrains_Mono,
  Instrument_Serif,
  Cormorant_Garamond,
  Syne,
  Playfair_Display,
  Bebas_Neue,
} from 'next/font/google'

// ============================================================
// SCALE.COM CLONE FONTS
// Aeonik → Manrope (closest geometric restraint available on Google Fonts)
// Mono   → JetBrains Mono
// ============================================================
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-aeonik',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

// ============================================================
// LEGACY FONTS (kept so existing /contact, /our-work, /why-us, /digital-marketing pages don't break)
// ============================================================
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne',
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata = {
  title: 'Scale — Reliable AI for the world\u2019s most important decisions',
  description: 'Scale works across the AI stack, from the data that trains the models you rely on, to the systems that put them to work.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrains.variable} ${inter.variable} ${instrument.variable} ${cormorant.variable} ${syne.variable} ${playfair.variable} ${bebas.variable}`}
    >
      <body className="font-aeonik antialiased bg-pure-white text-obsidian">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
