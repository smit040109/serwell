import './globals.css'
import LenisProvider from '@/components/animation/LenisProvider'
import ScrollToTop from '@/components/site/ScrollToTop'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata = {
  title: 'VayuCodes — An independent design & engineering studio',
  description: 'We design, engineer and scale digital systems for businesses built to move forward.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrument.variable}`}
      style={{
        // Legacy variables remap: all previously used font vars now point to Geist for unified typography.
        // Instrument Serif remains for display italics.
        ['--font-aeonik']: 'var(--font-geist-sans)',
        ['--font-inter']: 'var(--font-geist-sans)',
        ['--font-syne']: 'var(--font-geist-sans)',
        ['--font-cormorant']: 'var(--font-instrument)',
        ['--font-playfair']: 'var(--font-instrument)',
        ['--font-bebas']: 'var(--font-geist-sans)',
        ['--font-mono']: 'var(--font-geist-mono)',
      }}
    >
      <body className="antialiased bg-[#FAFAF7] text-[#0A0A0A]" style={{ fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif' }}>
        <ScrollToTop />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
