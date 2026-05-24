import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'vayu.code — Custom Software & Digital Marketing | Valsad, Gujarat',
  description: 'We build blazing-fast websites, custom business software, and run local marketing that brings ready-to-buy customers. Trusted partners for Gujarat businesses.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-[#0A2540]">
        {children}
      </body>
    </html>
  )
}
