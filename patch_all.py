path = "/var/www/serwell/app/page.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = []

# ---------- 1. WorkTeaser ----------
old1 = """function WorkTeaser() {
  const projects = [
    { n: '01', title: 'Nirvana Eco-Resort', tag: 'Hospitality', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80' },
    { n: '02', title: 'Sutra Textile Co.', tag: 'Manufacturing', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80' },
    { n: '03', title: 'Anaya Jewels', tag: 'D2C', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10 border-t border-[#0E0E10]/8">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading tag="· Selected work · 2024 – 2025" title="Real businesses. Real numbers." italicWord="Real numbers." />
          <Link href="/our-work" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            See all case studies
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => ("""

new1 = """function WorkTeaser() {
  const { content } = useSectionContent('home', 'workTeaser', {
    tag: '· Selected work · 2024 – 2025',
    title: 'Real businesses. Real numbers.',
    italicWord: 'Real numbers.',
    linkText: 'See all case studies',
    linkHref: '/our-work',
    projects: [
      { n: '01', title: 'Nirvana Eco-Resort', tag: 'Hospitality', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80' },
      { n: '02', title: 'Sutra Textile Co.', tag: 'Manufacturing', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80' },
      { n: '03', title: 'Anaya Jewels', tag: 'D2C', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80' },
    ],
  })
  const projects = content.projects
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10 border-t border-[#0E0E10]/8">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading tag={content.tag} title={content.title} italicWord={content.italicWord} />
          <Link href={content.linkHref} className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            {content.linkText}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => ("""

replacements.append((old1, new1, "WorkTeaser"))

# ---------- 2. TrustTeaser ----------
old2 = """function TrustTeaser() {
  const points = [
    { icon: MapPin, k: 'Local Partners', v: 'Right here in Valsad. Call us in Gujarati.' },
    { icon: Users, k: 'Gujarat-Native', v: 'We know your festive cycle, your customer.' },
    { icon: ShieldCheck, k: 'One Partner', v: 'No five vendors fighting each other.' },
  ]
  return (
    <section className="relative bg-[#0E0E10] text-white py-32 px-6 lg:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/12 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">
              · Why Gujarat trusts vayucodes
            </span>
            <h2 className="text-white tracking-[-0.01em] max-w-[16ch]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(36px,5vw,72px)', lineHeight: 1.02 }}>
              You don&apos;t need Mumbai.
              <span className="italic text-[#FFD9B8]"> You need us.</span>
            </h2>
          </div>
          <Link href="/why-us" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-white/70 hover:text-[#E85D2C] transition-colors">
            Read full story
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p, i) => ("""

new2 = """function TrustTeaser() {
  const iconMap = { MapPin, Users, ShieldCheck }
  const { content } = useSectionContent('home', 'trustTeaser', {
    tag: '· Why Gujarat trusts vayucodes',
    titleLine1: "You don't need Mumbai.",
    titleItalic: 'You need us.',
    linkText: 'Read full story',
    linkHref: '/why-us',
    points: [
      { icon: 'MapPin', k: 'Local Partners', v: 'Right here in Valsad. Call us in Gujarati.' },
      { icon: 'Users', k: 'Gujarat-Native', v: 'We know your festive cycle, your customer.' },
      { icon: 'ShieldCheck', k: 'One Partner', v: 'No five vendors fighting each other.' },
    ],
  })
  const points = content.points
  return (
    <section className="relative bg-[#0E0E10] text-white py-32 px-6 lg:px-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[#E85D2C]/12 blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#E85D2C] uppercase mb-4 inline-block">
              {content.tag}
            </span>
            <h2 className="text-white tracking-[-0.01em] max-w-[16ch]" style={{ fontFamily: 'var(--font-instrument)', fontWeight: 400, fontSize: 'clamp(36px,5vw,72px)', lineHeight: 1.02 }}>
              {content.titleLine1}
              <span className="italic text-[#FFD9B8]"> {content.titleItalic}</span>
            </h2>
          </div>
          <Link href={content.linkHref} className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-white/70 hover:text-[#E85D2C] transition-colors">
            {content.linkText}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p, i) => ("""

replacements.append((old2, new2, "TrustTeaser"))

# fix icon usage inside TrustTeaser map (p.icon was a component, now it's a string)
old2b = """                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="w-10 h-10 rounded-2xl bg-[#E85D2C]/15 border border-[#E85D2C]/30 flex items-center justify-center mb-6">
                      <p.icon size={18} className="text-[#E85D2C]" />
                    </div>"""
new2b = """                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="w-10 h-10 rounded-2xl bg-[#E85D2C]/15 border border-[#E85D2C]/30 flex items-center justify-center mb-6">
                      {(() => { const Icon = iconMap[p.icon] || MapPin; return <Icon size={18} className="text-[#E85D2C]" /> })()}
                    </div>"""
replacements.append((old2b, new2b, "TrustTeaser icon fix"))

# ---------- 3. BentoGrid ----------
old3 = """function BentoGrid() {
  const cards = [
    { size: 'large', icon: '🎬', title: 'Cinema for Business', body: 'Brand films & reels shot in 4K Apple Log. Not commercials — cinema.', accent: '#E85D2C' },
    { size: 'small', icon: '⚡', title: 'Blazing-fast sites', body: 'Sub-second loads.' },
    { size: 'small', icon: '🛠', title: 'Custom Software', body: 'Built for your floor.' },
    { size: 'large', icon: '📈', title: 'Performance That Pays', body: 'Every rupee tracked to a rupee earned. Local-first growth.', accent: '#FFD9B8' },
    { size: 'small', icon: '🇮🇳', title: 'Gujarati-first', body: 'We speak your buyer.' },
    { size: 'small', icon: '🤝', title: 'One Partner', body: 'Predictable, monthly.' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading
            tag="· What we build"
            title="One studio. Six superpowers."
            italicWord="Six superpowers."
          />
          <Link href="/services" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            All services
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[200px]">
          {cards.map((c, i) => {"""

new3 = """function BentoGrid() {
  const { content } = useSectionContent('home', 'bentoGrid', {
    tag: '· What we build',
    title: 'One studio. Six superpowers.',
    italicWord: 'Six superpowers.',
    linkText: 'All services',
    linkHref: '/services',
    cards: [
      { size: 'large', icon: '🎬', title: 'Cinema for Business', body: 'Brand films & reels shot in 4K Apple Log. Not commercials — cinema.', accent: '#E85D2C' },
      { size: 'small', icon: '⚡', title: 'Blazing-fast sites', body: 'Sub-second loads.', accent: '' },
      { size: 'small', icon: '🛠', title: 'Custom Software', body: 'Built for your floor.', accent: '' },
      { size: 'large', icon: '📈', title: 'Performance That Pays', body: 'Every rupee tracked to a rupee earned. Local-first growth.', accent: '#FFD9B8' },
      { size: 'small', icon: '🇮🇳', title: 'Gujarati-first', body: 'We speak your buyer.', accent: '' },
      { size: 'small', icon: '🤝', title: 'One Partner', body: 'Predictable, monthly.', accent: '' },
    ],
  })
  const cards = content.cards
  return (
    <section className="relative bg-[#F4F1EA] py-32 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading
            tag={content.tag}
            title={content.title}
            italicWord={content.italicWord}
          />
          <Link href={content.linkHref} className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            {content.linkText}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[200px]">
          {cards.map((c, i) => {"""

replacements.append((old3, new3, "BentoGrid"))

# ---------- 4. AnimatedStats ----------
old4 = """function AnimatedStats() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const stats = [
    { num: 150, suffix: '+', label: 'Projects Shipped' },
    { num: 5, suffix: ' yrs', label: 'In the studio' },
    { num: 99, suffix: '%', label: 'Client Satisfaction' },
    { num: 50, suffix: '+', label: 'Brands Onboarded' },
  ]
  return ("""

new4 = """function AnimatedStats() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const { content } = useSectionContent('home', 'animatedStats', {
    stats: [
      { num: 150, suffix: '+', label: 'Projects Shipped' },
      { num: 5, suffix: ' yrs', label: 'In the studio' },
      { num: 99, suffix: '%', label: 'Client Satisfaction' },
      { num: 50, suffix: '+', label: 'Brands Onboarded' },
    ],
  })
  const stats = content.stats
  return ("""

replacements.append((old4, new4, "AnimatedStats"))

# ---------- 5. ClientMarquee ----------
old5 = """function ClientMarquee() {
  const brands = ['Nirvana', 'Sutra', 'Anaya', 'Bandhan', 'ChaiSnap', 'Saurav Studios', 'Vayu Mills', 'Patel Co.', 'Lumière', 'Athena', 'Indigo Bay', 'Sahyadri Group']
  return (
    <section className="relative bg-[#F4F1EA] py-20 border-y border-[#0E0E10]/8 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 mb-10">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#0E0E10]/50">· Trusted by independent businesses across India</div>
      </div>"""

new5 = """function ClientMarquee() {
  const { content } = useSectionContent('home', 'clientMarquee', {
    tag: '· Trusted by independent businesses across India',
    brands: ['Nirvana', 'Sutra', 'Anaya', 'Bandhan', 'ChaiSnap', 'Saurav Studios', 'Vayu Mills', 'Patel Co.', 'Lumière', 'Athena', 'Indigo Bay', 'Sahyadri Group'],
  })
  const brands = content.brands
  return (
    <section className="relative bg-[#F4F1EA] py-20 border-y border-[#0E0E10]/8 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 mb-10">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#0E0E10]/50">{content.tag}</div>
      </div>"""

replacements.append((old5, new5, "ClientMarquee"))

# Apply all
for old, new, label in replacements:
    cnt = content.count(old)
    assert cnt == 1, f"❌ {label}: anchor found {cnt} times, expected 1"
    content = content.replace(old, new, 1)
    print(f"✅ {label} patched")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ ALL 5 sections patched successfully!")
