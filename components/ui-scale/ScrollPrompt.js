'use client'

import { ArrowDown } from 'lucide-react'

export default function ScrollPrompt({ className = '' }) {
  return (
    <div className={`hidden md:flex items-center gap-3 ${className}`}>
      <span className="eyebrow text-pure-white/80">Scroll to explore</span>
      <div className="w-10 h-10 rounded-btn border border-pure-white/30 flex items-center justify-center animate-scroll-pulse">
        <ArrowDown size={16} className="text-pure-white" strokeWidth={1.5} />
      </div>
    </div>
  )
}
