/*
 * VayuCodes CMS — Phase 1-3 Seed (how_we_work_steps, faq_items, legal_pages, page_content, site_settings extended)
 * Run: node scripts/seed_phase3.js — Idempotent.
 */
require('dotenv').config({ path: '/app/.env' })
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1) }

async function run() {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    ...(process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {}),
  })
  const db = mongoose.connection.db
  console.log('[seed_phase3] Connected. DB:', db.databaseName)

  // 1) SITE SETTINGS — extended fields (only set if absent)
  await db.collection('site_settings').updateOne(
    { _id: 'main' },
    {
      $setOnInsert: { _id: 'main', createdAt: new Date() },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  )
  const ss = await db.collection('site_settings').findOne({ _id: 'main' })
  const extDefaults = {
    rotatingWords: ['digital systems', 'AI workflows', 'growth engines', 'future products'],
    closingStatement: "Let's build something you can rely on.",
    preloaderText: 'DESIGNING EXPERIENCES',
    cinematicVideoUrl: '/video/intro.mp4',
    cinematicPosterUrl: '/video/intro-poster.jpg',
    cinematicEnabled: true,
    introTypewriterText: 'Welcome to the VayuCodes World',
  }
  const toSet = {}
  for (const [k, v] of Object.entries(extDefaults)) {
    if (ss[k] === undefined) toSet[k] = v
  }
  if (Object.keys(toSet).length) {
    await db.collection('site_settings').updateOne({ _id: 'main' }, { $set: toSet })
    console.log('[seed_phase3] site_settings extended fields set:', Object.keys(toSet).join(', '))
  } else {
    console.log('[seed_phase3] site_settings extended fields already present')
  }

  // 2) HOW WE WORK STEPS (5)
  const steps = [
    { stepNumber: 1, title: 'Discover & Define', description: 'We dig into your business, market and users. Every engagement starts with a working brief — goals, constraints, success metrics.', image: '/images/journey/discover.jpg' },
    { stepNumber: 2, title: 'Design the System', description: 'Brand, interface and architecture designed together. You see clickable prototypes before a single line of production code.', image: '/images/journey/design.jpg' },
    { stepNumber: 3, title: 'Engineer & Build', description: 'Weekly shippable increments. Clean, tested code across web, mobile and AI workflows — no black boxes.', image: '/images/journey/build.jpg' },
    { stepNumber: 4, title: 'Launch & Measure', description: 'Deployment, analytics and observability from day one. We watch real users and iterate fast.', image: '/images/journey/launch.jpg' },
    { stepNumber: 5, title: 'Deliver & Ship', description: 'Handover with documentation, training and a growth roadmap. We stay available as your long-term product partner.', image: '/images/journey/ship.jpg' },
  ]
  const hww = db.collection('how_we_work_steps')
  for (const s of steps) {
    const exists = await hww.findOne({ stepNumber: s.stepNumber })
    if (!exists) {
      await hww.insertOne({ _id: uuidv4(), ...s, accent: '', order: s.stepNumber, published: true, createdAt: new Date(), updatedAt: new Date() })
    }
  }
  console.log('[seed_phase3] how_we_work_steps:', await hww.countDocuments())

  // 3) FAQ ITEMS
  const faqs = [
    { question: 'How much does a project cost?', answer: 'Cost depends on your requirements — scope, complexity and timeline. Tell us what you are building and we will send a detailed estimate within 48 hours.', order: 1 },
    { question: 'How long does a typical build take?', answer: 'A focused MVP ships in 4–8 weeks. Full product builds with brand, web and AI workflows typically run 8–16 weeks.', order: 2 },
    { question: 'Do you work with international clients?', answer: 'Yes. We are based in India and work worldwide across time zones with async-first communication.', order: 3 },
    { question: 'What happens after launch?', answer: 'Every build includes a post-launch support window. Most clients continue with a monthly growth retainer for iteration, marketing and infrastructure.', order: 4 },
  ]
  const faqCol = db.collection('faq_items')
  for (const f of faqs) {
    const exists = await faqCol.findOne({ question: f.question })
    if (!exists) {
      await faqCol.insertOne({ _id: uuidv4(), ...f, category: 'general', published: true, createdAt: new Date(), updatedAt: new Date() })
    }
  }
  console.log('[seed_phase3] faq_items:', await faqCol.countDocuments())

  // 4) LEGAL PAGES — keyed upsert (privacy, terms)
  const legal = [
    {
      key: 'privacy',
      title: 'Privacy Policy',
      lastUpdated: '22 July 2026',
      sections: [
        { heading: 'Overview', body: 'VayuCodes ("we", "our") respects your privacy. This policy explains what data we collect and how we use it.' },
        { heading: 'Data We Collect', body: 'Contact form submissions (name, email, phone, message), and basic analytics data (pages visited, device type).' },
        { heading: 'How We Use Data', body: 'To respond to inquiries, deliver services, and improve our website. We never sell your data.' },
        { heading: 'Contact', body: 'Questions? Email hello@vayucodes.com.' },
      ],
    },
    {
      key: 'terms',
      title: 'Terms of Service',
      lastUpdated: '22 July 2026',
      sections: [
        { heading: 'Acceptance of Terms', body: 'By using this website you agree to these terms.' },
        { heading: 'Services', body: 'VayuCodes provides design, engineering and digital marketing services under separate written agreements.' },
        { heading: 'Intellectual Property', body: 'All site content, branding and code samples are the property of VayuCodes unless stated otherwise.' },
        { heading: 'Contact', body: 'Questions? Email hello@vayucodes.com.' },
      ],
    },
  ]
  const legalCol = db.collection('legal_pages')
  for (const l of legal) {
    const exists = await legalCol.findOne({ key: l.key })
    if (!exists) {
      await legalCol.insertOne({ _id: uuidv4(), ...l, seoDescription: '', published: true, createdAt: new Date(), updatedAt: new Date() })
    }
  }
  console.log('[seed_phase3] legal_pages:', await legalCol.countDocuments())

  // 5) PAGE CONTENT — keyed upsert (why-us, digital-marketing)
  const pageContent = [
    {
      key: 'why-us',
      title: 'Why Us',
      data: {
        eyebrow: 'A ten-person studio',
        headline: 'A team of ten. One studio.',
        subtitle: 'Founders on every project. No account managers, no hand-offs.',
        statCard: '10 People. One Studio.',
      },
    },
    {
      key: 'digital-marketing',
      title: 'Digital Marketing',
      data: {
        eyebrow: 'Growth · Performance · Content',
        headline: 'Marketing that compounds.',
        subtitle: 'Full-funnel campaigns, content engines and analytics that turn attention into revenue.',
      },
    },
  ]
  const pcCol = db.collection('page_content')
  for (const p of pageContent) {
    const exists = await pcCol.findOne({ key: p.key })
    if (!exists) {
      await pcCol.insertOne({ _id: uuidv4(), ...p, published: true, createdAt: new Date(), updatedAt: new Date() })
    }
  }
  console.log('[seed_phase3] page_content:', await pcCol.countDocuments())

  console.log('[seed_phase3] DONE')
  await mongoose.disconnect()
}

run().catch((e) => { console.error(e); process.exit(1) })
