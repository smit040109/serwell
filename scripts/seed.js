/*
 * VayuCodes CMS Seed Script
 * Run: node scripts/seed.js
 * Idempotent — safe to run multiple times.
 */
require('dotenv').config({ path: '/app/.env' })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1) }

const ADMIN_EMAIL = 'admin@vayucodes.com'
const ADMIN_PASSWORD = 'VayuAdmin@2026'

async function run() {
  console.log('[seed] Connecting to', MONGODB_URI.replace(/:[^:@]+@/, ':****@'))
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  console.log('[seed] Connected. DB:', mongoose.connection.db.databaseName)

  const db = mongoose.connection.db

  // 1) ADMIN
  const admins = db.collection('admins')
  const existingAdmin = await admins.findOne({ email: ADMIN_EMAIL })
  if (!existingAdmin) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await admins.insertOne({
      _id: uuidv4(),
      email: ADMIN_EMAIL,
      passwordHash: hash,
      name: 'Admin',
      role: 'super',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('[seed] ✅ Admin created:', ADMIN_EMAIL, '/', ADMIN_PASSWORD)
  } else {
    // Rotate password to the default (so credentials in md always work)
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await admins.updateOne({ email: ADMIN_EMAIL }, { $set: { passwordHash: hash, updatedAt: new Date() } })
    console.log('[seed] ✅ Admin password reset:', ADMIN_EMAIL, '/', ADMIN_PASSWORD)
  }

  // 2) SITE SETTINGS (singleton)
  await db.collection('site_settings').updateOne(
    { _id: 'main' },
    {
      $setOnInsert: {
        _id: 'main',
        siteName: 'VayuCodes',
        tagline: 'An independent studio',
        logoLightUrl: '/brand/logo-lockup.png',
        logoDarkUrl: '/brand/logo-lockup.png',
        location: 'India · Worldwide',
        emailPrimary: 'hello@vayucodes.com',
        availability: 'Available · Q3 2026',
        theme: { ink: '#0A0A0A', bg: '#FAFAF7', muted: '#6B6B6B', line: '#E7E5E1' },
        fonts: { display: 'Instrument Serif', body: 'Geist' },
        socials: { linkedin: '', twitter: '', instagram: '', github: '' },
        hero: {
          videoUrl: '', videoEnabled: false, videoLoop: true, videoMaxSeconds: 5,
          headlineLine1: 'We design, engineer & scale digital',
          headlineItalicWord: 'systems.',
          subtitle: 'An independent studio combining design, engineering, AI and automation into digital systems your business can rely on.',
        },
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  )
  console.log('[seed] ✅ site_settings')

  // 3) NAVIGATION
  await db.collection('navigations').updateOne(
    { _id: 'main' },
    {
      $setOnInsert: {
        _id: 'main',
        items: [
          { label: 'Our Work', href: '/our-work', order: 1 },
          { label: 'Marketing', href: '/digital-marketing', order: 2 },
          { label: 'Why Us', href: '/why-us', order: 3 },
          { label: 'Contact', href: '/contact', order: 4 },
        ],
        ctaLabel: 'Start Project',
        ctaHref: '/contact',
        ctaEnabled: true,
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  )
  console.log('[seed] ✅ navigation')

  // 4) FOOTER
  await db.collection('footers').updateOne(
    { _id: 'main' },
    {
      $setOnInsert: {
        _id: 'main',
        tagline: 'Let\u2019s build something you can rely on.',
        columns: [
          { heading: 'Studio', links: [
            { label: 'About', href: '/why-us' },
            { label: 'Work', href: '/our-work' },
            { label: 'Contact', href: '/contact' },
          ]},
          { heading: 'Services', links: [
            { label: 'Design', href: '/#design' },
            { label: 'Engineering', href: '/#engineering' },
            { label: 'AI & Automation', href: '/#ai' },
            { label: 'Growth', href: '/digital-marketing' },
          ]},
          { heading: 'Contact', links: [
            { label: 'hello@vayucodes.com', href: 'mailto:hello@vayucodes.com', external: true },
            { label: 'India · Worldwide', href: '#' },
          ]},
        ],
        copyright: '© 2026 VayuCodes · An independent studio',
        availability: 'Available · Q3 2026',
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  )
  console.log('[seed] ✅ footer')

  // 5) SEO SETTINGS
  await db.collection('seo_settings').updateOne(
    { _id: 'main' },
    {
      $setOnInsert: {
        _id: 'main',
        defaultTitle: 'VayuCodes — An independent design & engineering studio',
        titleTemplate: '%s — VayuCodes',
        defaultDescription: 'We design, engineer and scale digital systems for businesses built to move forward.',
        keywords: ['design studio', 'engineering', 'AI automation', 'India'],
        robots: 'index,follow',
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  )
  console.log('[seed] ✅ seo_settings')

  // 6) CONTACT SETTINGS
  await db.collection('contact_settings').updateOne(
    { _id: 'main' },
    {
      $setOnInsert: {
        _id: 'main',
        emails: ['hello@vayucodes.com'],
        phones: [],
        addressLines: ['India', 'Worldwide'],
        officeHours: 'Mon–Fri · 10am–7pm IST',
        responseTime: 'We respond within 12 hours.',
        socials: { linkedin: '', twitter: '', instagram: '', whatsapp: '' },
        ctaHeadline: 'Tell us about your project.',
        ctaSubtitle: 'We reply to every serious inquiry within 12 hours.',
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  )
  console.log('[seed] ✅ contact_settings')

  // 7) TEAM MEMBERS — Uday & Smit (with swapped names per user)
  // User: "photo 1 uday tailor" (was 3-piece) & "photo 2 smit patel" (was black shirt) — later swap
  // Latest user request: swap the names → so photo of 3-piece = Smit Patel, photo of black-shirt = Uday Tailor
  const teamCol = db.collection('team_members')
  const teamCount = await teamCol.countDocuments({})
  if (teamCount === 0) {
    await teamCol.insertMany([
      {
        _id: uuidv4(),
        name: 'Uday Tailor',
        role: 'Co-Founder',
        caption: 'Systems, strategy & delivery',
        bio: 'Uday leads engineering and client operations. His obsession with process is why our builds ship on time and stay live long after handover.',
        photo: '/team/smit.webp', // 3-piece formal photo (actual file)
        order: 1,
        isCoFounder: true,
        published: true,
        createdAt: new Date(),
      },
      {
        _id: uuidv4(),
        name: 'Smit Patel',
        role: 'Co-Founder',
        caption: 'Design, growth & story',
        bio: 'Smit turns raw business ideas into brands and interfaces that people actually want to use. Design is his craft; growth is his obsession.',
        photo: '/team/uday.webp', // casual outdoor photo (actual file)
        order: 2,
        isCoFounder: true,
        published: true,
        createdAt: new Date(),
      },
    ])
    console.log('[seed] ✅ team_members (2 co-founders)')
  } else {
    console.log('[seed] ⏩ team_members already seeded (' + teamCount + ')')
  }

  // 8) SERVICES
  const servicesCol = db.collection('services')
  const servicesCount = await servicesCol.countDocuments({})
  if (servicesCount === 0) {
    await servicesCol.insertMany([
      { _id: uuidv4(), slug: 'custom-software', title: 'Custom Software', tagline: 'Systems that scale with you.', description: 'Custom-coded platforms, admin panels, and internal tools designed for your workflow — not a template.', icon: 'Code2', order: 1, category: 'engineering', bullets: ['Full-stack builds', 'Handover-ready code', 'Post-launch support'], published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'web-development', title: 'Web Development', tagline: 'Websites that convert.', description: 'Marketing sites, storefronts, and web apps that load fast, look sharp, and rank well.', icon: 'Globe', order: 2, category: 'engineering', bullets: ['Next.js + React', 'CMS integrations', 'SEO baked-in'], published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'ai-automation', title: 'AI & Automation', tagline: 'Software that thinks.', description: 'AI-powered workflows, chatbots, and automations that replace repetitive work.', icon: 'Sparkles', order: 3, category: 'engineering', bullets: ['LLM integrations', 'Workflow automation', 'Data pipelines'], published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'performance-marketing', title: 'Performance Marketing', tagline: 'Every rupee measured.', description: 'Paid ads, tracking, and growth loops that turn spend into revenue.', icon: 'TrendingUp', order: 4, category: 'marketing', bullets: ['Meta + Google Ads', 'Attribution setup', 'Weekly reporting'], published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'brand-strategy', title: 'Brand & Strategy', tagline: 'Positioning that lasts.', description: 'Naming, identity, and messaging that make your business memorable and trusted.', icon: 'Target', order: 5, category: 'strategy', bullets: ['Brand audits', 'Visual identity', 'Messaging framework'], published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'digital-strategy', title: 'Digital Strategy', tagline: 'A roadmap, not a guess.', description: '90-day roadmaps that align your tech, marketing, and operations toward one goal.', icon: 'Map', order: 6, category: 'strategy', bullets: ['Discovery workshops', 'Roadmap & KPIs', 'Quarterly reviews'], published: true, createdAt: new Date() },
    ])
    console.log('[seed] ✅ services (6)')
  } else {
    console.log('[seed] ⏩ services already seeded (' + servicesCount + ')')
  }

  // 9) PORTFOLIO PROJECTS — with color themes
  const portfolioCol = db.collection('portfolio_projects')
  const portfolioCount = await portfolioCol.countDocuments({})
  if (portfolioCount === 0) {
    await portfolioCol.insertMany([
      { _id: uuidv4(), slug: 'servall-lt', title: 'Servall-LT', client: 'Servall', category: 'Custom Platform', summary: 'A field-service platform that eliminated 40% of manual dispatch time.', description: '', coverImage: '/team/uday.webp', themeColor: '#B91C1C', accentTextColor: '#FFFFFF', industry: 'Automotive', services: ['Engineering', 'Automation'], year: 2025, featured: true, order: 1, published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'anskar-handlooms', title: 'Anskar Handlooms', client: 'Anskar', category: 'D2C Storefront', summary: 'Diwali-ready storefront that hit ₹1.2 Cr in a single festive quarter.', description: '', coverImage: '/team/smit.webp', themeColor: '#065F46', accentTextColor: '#FFFFFF', industry: 'Textile', services: ['Design', 'Engineering', 'Marketing'], year: 2025, featured: true, order: 2, published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'sajvarr-diamonds', title: 'Sajvarr Diamonds', client: 'Sajvarr', category: 'Brand + Web', summary: 'Reimagined a family diamond business with an editorial digital-first identity.', description: '', coverImage: '/team/uday.webp', themeColor: '#1E3A8A', accentTextColor: '#FFFFFF', industry: 'Jewelry', services: ['Brand', 'Web'], year: 2024, featured: true, order: 3, published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'squar-parts', title: 'Squar Parts', client: 'Squar', category: 'Inventory OS', summary: 'A parts-inventory OS that replaced 3 spreadsheets and 1 whiteboard.', description: '', coverImage: '/team/smit.webp', themeColor: '#0F172A', accentTextColor: '#FFFFFF', industry: 'Manufacturing', services: ['Engineering'], year: 2024, featured: true, order: 4, published: true, createdAt: new Date() },
      { _id: uuidv4(), slug: 'servall-lms', title: 'Servall LMS', client: 'Servall', category: 'Learning Platform', summary: 'Field-team training LMS with certifications and mobile-first delivery.', description: '', coverImage: '/team/uday.webp', themeColor: '#7C2D12', accentTextColor: '#FFFFFF', industry: 'Automotive', services: ['Engineering', 'Design'], year: 2024, featured: true, order: 5, published: true, createdAt: new Date() },
    ])
    console.log('[seed] ✅ portfolio_projects (5)')
  } else {
    console.log('[seed] ⏩ portfolio_projects already seeded (' + portfolioCount + ')')
  }

  // 10) TESTIMONIALS
  const tCol = db.collection('testimonials')
  const tCount = await tCol.countDocuments({})
  if (tCount === 0) {
    await tCol.insertMany([
      { _id: uuidv4(), quote: 'They didn\'t just build a website — they built the system our business runs on. Handover was clean, everything documented.', author: 'Rakesh Patel', role: 'MD', company: 'Sutra Textile Co.', rating: 5, featured: true, order: 1, published: true, createdAt: new Date() },
      { _id: uuidv4(), quote: 'Shipped in 6 weeks what two other agencies couldn\'t in 4 months. And it just… works.', author: 'Meera Joshi', role: 'Founder', company: 'Nirvana Eco-Resort', rating: 5, featured: true, order: 2, published: true, createdAt: new Date() },
      { _id: uuidv4(), quote: 'Our brand went from 0 to ₹1.2 Cr in a single festive quarter. They treat our P&L like their own.', author: 'Anaya Vora', role: 'Founder', company: 'Anaya Jewels', rating: 5, featured: true, order: 3, published: true, createdAt: new Date() },
    ])
    console.log('[seed] ✅ testimonials (3)')
  } else {
    console.log('[seed] ⏩ testimonials already seeded (' + tCount + ')')
  }

  // 11) PAGES
  const pagesCol = db.collection('pages')
  const pagesCount = await pagesCol.countDocuments({})
  if (pagesCount === 0) {
    await pagesCol.insertMany([
      { _id: uuidv4(), slug: 'home', title: 'Home', status: 'published', order: 1, seo: { title: 'VayuCodes — Design · Engineering · Scale', description: 'Independent studio building digital systems for businesses built to move forward.' }, createdAt: new Date() },
      { _id: uuidv4(), slug: 'our-work', title: 'Our Work', status: 'published', order: 2, seo: { title: 'Selected Work' }, createdAt: new Date() },
      { _id: uuidv4(), slug: 'digital-marketing', title: 'Marketing', status: 'published', order: 3, createdAt: new Date() },
      { _id: uuidv4(), slug: 'why-us', title: 'Why Us', status: 'published', order: 4, createdAt: new Date() },
      { _id: uuidv4(), slug: 'contact', title: 'Contact', status: 'published', order: 5, createdAt: new Date() },
    ])
    console.log('[seed] ✅ pages (5)')
  } else {
    console.log('[seed] ⏩ pages already seeded (' + pagesCount + ')')
  }

  // 12) SECTIONS (empty by default — created via admin)
  // 13) MEDIA (empty by default)

  console.log('\n[seed] All done ✅')
  await mongoose.disconnect()
}

run().catch((e) => { console.error(e); process.exit(1) })
