'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CarouselArrow({ direction = 'right', onClick, disabled, className = '' }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      className={`w-10 h-10 rounded-btn border border-silhouette bg-pure-white text-obsidian flex items-center justify-center transition-all duration-200 hover:border-obsidian disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    >
      <Icon size={18} strokeWidth={1.5} />
    </button>
  )
}
