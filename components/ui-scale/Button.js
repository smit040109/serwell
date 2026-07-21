'use client'

import Link from 'next/link'

/**
 * Scale.com button system.
 * Variants:
 *   - filled-dark: black bg, white text (primary CTA)
 *   - filled-light: white bg, black text (used on dark sections)
 *   - outlined: transparent, silhouette border (login-style)
 *   - ghost: no chrome (nav link)
 */
export default function Button({
  children,
  href,
  variant = 'filled-dark',
  className = '',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-aeonik font-normal text-[16px] leading-none rounded-btn transition-colors duration-200 select-none'

  const variants = {
    'filled-dark': 'bg-obsidian text-pure-white px-5 py-4 hover:bg-pure-white hover:text-obsidian',
    'filled-light': 'bg-pure-white text-obsidian px-5 py-4 hover:bg-obsidian hover:text-pure-white',
    'outlined': 'bg-transparent text-smoke border border-silhouette px-4 py-2 hover:text-obsidian hover:border-obsidian',
    'ghost': 'bg-transparent text-obsidian hover:opacity-70 p-0',
    'ghost-light': 'bg-transparent text-pure-white hover:opacity-70 p-0',
  }

  const cls = `${base} ${variants[variant] || variants['filled-dark']} ${className}`

  if (href) {
    return <Link href={href} className={cls} {...rest}>{children}</Link>
  }
  return <button className={cls} {...rest}>{children}</button>
}
