export default function Eyebrow({ children, className = '', tone = 'dark' }) {
  const color = tone === 'light' ? 'text-pure-white/70' : tone === 'muted' ? 'text-smoke' : 'text-obsidian'
  return (
    <span className={`eyebrow ${color} ${className}`}>
      {children}
    </span>
  )
}
