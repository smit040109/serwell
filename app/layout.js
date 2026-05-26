import './globals.css'
import { Inter, Instrument_Serif, Playfair_Display, Bebas_Neue } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
})

// Primary editorial display — refined, modern, agency-grade
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument'
})

// Kept as secondary fallback (used in some legacy spots)
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair'
})

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas'
})

export const metadata = {
  title: 'vayu.code — Custom Software & Digital Marketing | Valsad, Gujarat',
  description: 'We build blazing-fast websites, custom business software, and run local marketing that brings ready-to-buy customers. Trusted partners for Gujarat businesses.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable} ${playfair.variable} ${bebas.variable}`}>
      <body className="font-sans antialiased bg-[#F4F1EA] text-[#0E0E10]">
        {children}
      </body>
    </html>
  )
}
