import './globals.css'
import { Inter, Playfair_Display, Bebas_Neue } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${bebas.variable}`}>
      <body className="font-sans antialiased bg-[#F4F1EA] text-[#0E0E10]">
        {children}
      </body>
    </html>
  )
}
