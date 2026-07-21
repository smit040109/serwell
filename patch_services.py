path = "/var/www/serwell/app/page.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = """function ServicesTeaser() {
  const services = [
    { n: '01', title: 'Websites', desc: 'Blazing-fast sites that load on any phone, any network.', accent: '#E85D2C', href: '/services' },
    { n: '02', title: 'Software', desc: 'Custom ERPs, dashboards, internal tools — made for your shop floor.', accent: '#FF8A3D', href: '/services' },
    { n: '03', title: 'Marketing', desc: 'Targeted local ads that fill your phone with ready-to-buy customers.', accent: '#FFD9B8', href: '/services' },
  ]
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading
            tag="· What we make"
            title="Three engines. One business."
            italicWord="One business."
          />
          <Link href="/services" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0E0E10] hover:text-[#E85D2C] transition-colors">
            View all services
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => ("""

new = """function ServicesTeaser() {
  const { content } = useSectionContent('home', 'servicesTeaser', {
    tag: '· What we make',
    title: 'Three engines. One business.',
    italicWord: 'One business.',
    linkText: 'View all services',
    linkHref: '/services',
    services: [
      { n: '01', title: 'Websites', desc: 'Blazing-fast sites that load on any phone, any network.', accent: '#E85D2C', href: '/services' },
      { n: '02', title: 'Software', desc: 'Custom ERPs, dashboards, internal tools — made for your shop floor.', accent: '#FF8A3D', href: '/services' },
      { n: '03', title: 'Marketing', desc: 'Targeted local ads that fill your phone with ready-to-buy customers.', accent: '#FFD9B8', href: '/services' },
    ],
  })
  const services = content.services
  return (
    <section className="relative bg-[#F4F1EA] py-28 px-6 lg:px-10">
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

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => ("""

assert content.count(old) == 1, f"anchor found {content.count(old)} times, expected 1"
content = content.replace(old, new, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ ServicesTeaser patched!")
