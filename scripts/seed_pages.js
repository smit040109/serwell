/*
 * VayuCodes — Seed page_content for all main pages
 * Run: node scripts/seed_pages.js — Idempotent (uses $setOnInsert for existing keys)
 * IMPORTANT: We UPSERT with $setOnInsert on `data` so admin edits are NEVER overwritten.
 * If you want to re-seed a page's data, delete its doc first from Mongo.
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
  console.log('[seed_pages] Connected. DB:', db.databaseName)
  const col = db.collection('page_content')

  const PAGES = [
    {
      key: 'home',
      title: 'Home',
      data: {
        heroLine1: 'We design, engineer',
        heroSubtitle: 'An independent studio combining design, engineering, AI and automation into digital systems your business can rely on.',
        heroVideoUrl: '/videos/hero-cinematic.mp4',
        heroVideoEnabled: true,
        howWeWorkEyebrow: '— How We Work',
        howWeWorkHeadline1: 'Five steps.',
        howWeWorkHeadlineItalic: 'Zero mystery.',
        howWeWorkSubtitle: "Every project follows the same rhythm. Whether it's a website or a 6-month platform build, the process is transparent from day one.",
        selectedWorkEyebrow: '— Selected Work',
        selectedWorkHeadline1: 'Products that',
        selectedWorkHeadlineItalic: 'actually shipped.',
      },
    },
    {
      key: 'why-us',
      title: 'Why Us',
      data: {
        heroBadge: 'Why VayuCodes',
        heroHeadline1: 'The minds behind',
        heroHeadlineItalic: 'the machine.',
        heroSubtitle: 'Two co-founders. One relentless standard. We built vayucodes because most agencies over-promise, under-deliver, and disappear after invoice. We built the opposite — an independent studio you can actually rely on.',
        heroStudioLine: 'Studio · Est. 2026',
        statsEyebrow: '— A ten-person studio, deliberately small.',
        statsHeadline1: 'A team of ten. Twenty',
        statsHeadline2: 'products shipped.',
        statsHeadlineItalic: 'Zero excuses.',
        stats: [
          { value: 20, suffix: '+', label: 'Projects Delivered', sub: 'Shipped end-to-end, on time.' },
          { value: 15, suffix: '+', label: 'Businesses Served', sub: 'From D2C brands to family enterprises.' },
          { value: 10, suffix: '', label: 'People. One Studio.', sub: 'Designers, engineers & strategists — under one roof.' },
          { value: 100, suffix: '%', label: 'Founder-Led', sub: 'Every project touched by both of us.' },
        ],
        visionEyebrow: '— Vision & Mission',
        visionHeadline1: 'Engineering the systems that',
        visionHeadlineItalic: 'quietly run',
        visionHeadline2: 'the businesses of tomorrow.',
        visionSubEyebrow: '01 — Vision',
        visionSubHeadline1: 'Software that thinks.',
        visionSubHeadlineItalic: 'Systems that scale.',
        visionBody: 'We build custom products, automated back-offices, and AI-driven workflows for founders who want to grow without hiring a small army. Every line of code is written to earn its place in production.',
        visionBullets: [
          'Founder-led delivery on every build',
          'AI + automation baked into the base layer',
          'Handover-ready. No lock-in. No black boxes.',
        ],
        missionSubEyebrow: '02 — Mission',
        missionSubHeadline1: 'Ship faster than agencies.',
        missionSubHeadlineItalic: 'Care deeper than freelancers.',
        missionBody: 'Our mission is to give every ambitious business owner a technical partner who treats their P&L like his own. No account managers. No chain of vendors. Just the two of us — engineering the future of your business.',
        missionBullets: [
          'One point of contact — always a founder',
          'Weekly demos, weekly progress, zero mystery',
          'Real numbers. Real deadlines. Real launches.',
        ],
        missionVideoUrl: '/videos/mission-full.mp4',
        valuesEyebrow: '— Core Values',
        valuesHeadline1: 'The',
        valuesHeadlineItalic: 'six standards',
        valuesHeadline2: "we'll never negotiate on.",
        values: [
          { title: 'Speed as a discipline', body: 'Two-week sprints, weekly demos, and never a "we\u2019ll get to it next month." Momentum is the product.' },
          { title: 'Radical transparency', body: 'You get the invoice, the timeline, the Slack channel, and the honest answer — even when it\u2019s inconvenient.' },
          { title: 'Precision over polish', body: 'We ship what moves the business. Beautiful, yes. But shipped and measurable — always first.' },
          { title: 'Founder empathy', body: 'We\u2019ve been on your side of the table. Every decision respects your P&L, your calendar, and your team.' },
          { title: 'Craft you can feel', body: 'Every button, every query, every workflow — engineered like it\u2019s the only thing we\u2019ll ever be judged on.' },
          { title: 'Compound trust', body: 'Most of our clients come back for round two. That\u2019s the only metric that matters to us long-term.' },
        ],
        foundersEyebrow: '— Leadership',
        foundersHeadline1: 'Meet the co-founders',
        foundersHeadlineItalic: 'building it',
        foundersHeadline2: 'in the open.',
        foundersSubtitle: 'No account managers. No offshore teams. When you work with vayucodes, you work with us — every meeting, every review, every launch.',
        founders: [
          {
            photo: '/team/smit.webp',
            name: 'Uday Tailor',
            title: 'Co-Founder',
            caption: 'Technical Operations & Backend Systems',
            bio: 'Uday manages the technical foundation of every project at VayuCodes. He is responsible for backend architecture, project structuring, system planning, and operational workflows. Alongside technical execution, he handles project documentation, gathers client requirements, and oversees accounting and internal operations to keep every project organized and efficient.',
            tag: 'Building',
          },
          {
            photo: '/team/uday.webp',
            name: 'Smit Patel',
            title: 'Co-Founder',
            caption: 'Client Strategy & Product Development',
            bio: "Smit leads client relationships, project strategy, and product execution at VayuCodes. From understanding business requirements and presenting tailored solutions to managing communication throughout the project lifecycle, he ensures every product is aligned with the client's vision. He also oversees planning, UI/UX direction, and delivery to create impactful digital experiences.",
            tag: 'Shipping',
          },
        ],
        newsletterEyebrow: '— The Next Move',
        newsletterHeadline1: 'Ready to build the',
        newsletterHeadlineItalic: 'next chapter',
        newsletterHeadline2: 'of your business?',
        newsletterSubtitle: 'Get one honest email a month — what we shipped, what we learned, and the one system every founder should be using this quarter.',
        newsletterPlaceholder: 'you@yourbusiness.com',
      },
    },
    {
      key: 'digital-marketing',
      title: 'Digital Marketing',
      data: {
        eyebrow: '— Marketing Division',
        slides: [
          { code: '01', title: 'Performance', italic: 'Marketing', tag: 'Meta · Google · LinkedIn', body: 'Creative-led performance campaigns. We test 40 variants a week, kill losers fast, scale winners harder — every rupee measured, every click accountable.', img: 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400', stats: [{ v: '4.2x', l: 'Avg ROAS' }, { v: '↓ 38%', l: 'CAC drop' }, { v: '40+', l: 'Creatives / week' }] },
          { code: '02', title: 'Brand', italic: 'Marketing', tag: 'Positioning · Voice · Story', body: 'Naming, identity, and messaging that make your business memorable. We turn positioning workshops into deliverables you can actually deploy across every channel.', img: 'https://images.unsplash.com/photo-1698328722160-7ecf41b789c5?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400', stats: [{ v: '12', l: 'Brand systems' }, { v: '6+', l: 'Industries' }, { v: '100%', l: 'Fixed-scope' }] },
          { code: '03', title: 'Content', italic: '& Creative', tag: 'Reels · Films · UGC', body: 'Vertical-first content engine. High-velocity reels with hook-first scripting, cinema-grade brand films, and a curated UGC network across India.', img: 'https://images.unsplash.com/photo-1513031300226-c8fb12de9ade?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400', stats: [{ v: '500+', l: 'Reels shipped' }, { v: '10M+', l: 'Views' }, { v: '1.5s', l: 'Avg hook' }] },
          { code: '04', title: 'Field &', italic: 'Local Marketing', tag: 'GBP · Local SEO · Events', body: 'Show up where your customers actually search. Google Business optimization, hyperlocal SEO, review systems, and on-ground activations built for your geography.', img: 'https://images.unsplash.com/photo-1611166498484-5585e08d5656?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400', stats: [{ v: '4.9★', l: 'Avg review' }, { v: '↑2.6x', l: 'Local traffic' }, { v: '25+', l: 'GBPs managed' }] },
          { code: '05', title: 'Sales', italic: 'Enablement', tag: 'WhatsApp · CRM · Funnels', body: 'Conversation-led commerce with automated WhatsApp funnels, broadcast systems, and click-to-chat ads. Where India actually buys — we close the loop.', img: 'https://images.unsplash.com/photo-1553081871-306366d02dfc?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400', stats: [{ v: '↑68%', l: 'Reply rate' }, { v: '↓5 min', l: 'Response' }, { v: '10+', l: 'Playbooks' }] },
        ],
        philosophyEyebrow: '— Our Philosophy',
        philosophyHeadline1: "We don't sell impressions.",
        philosophyHeadlineItalic: 'We sell outcomes.',
        philosophyBody: 'Every campaign we run is built to answer one question: did this move the P&L? Not likes, not reach, not vanity dashboards. Just business results your accountant can point at.',
        pillarsEyebrow: '— How we operate',
        pillarsHeadline1: 'Three principles.',
        pillarsHeadlineItalic: 'Every engagement.',
        pillars: [
          { code: '01', title: 'Data-first', body: 'Every rupee tracked with proper attribution. Meta, Google, GA4, server-side events — we set up the plumbing so decisions are made on facts, not feelings.', points: ['GA4 + Meta CAPI', 'UTM discipline', 'Weekly P&L reviews'] },
          { code: '02', title: 'Creative velocity', body: 'Content is the new targeting. We produce 40+ variants weekly, test aggressively, and let the winners scale. Slow creative teams lose — always.', points: ['Weekly creative sprints', 'Hook library', 'UGC network across India'] },
          { code: '03', title: 'Full-funnel thinking', body: 'From awareness ad to WhatsApp close. We connect brand, performance, and sales into one integrated system — no more paying to fill a leaky bucket.', points: ['Awareness → close mapping', 'CRM + WhatsApp automation', 'Retention loops built-in'] },
        ],
        caseEyebrow: '— Case in point',
        caseHeadline1: 'Sanskar Handlooms saw their',
        caseHeadlineItalic: 'footfall multiply',
        caseHeadline2: 'in a single festive season.',
        caseBody: 'We built their storefront, ran creative, closed on WhatsApp — all under one roof. One team, one goal, one accountability line.',
        caseStats: [
          { v: '4×', l: 'Store footfall growth' },
          { v: '3.6×', l: 'Repeat visitors' },
          { v: '2.3 M', l: 'Impressions served' },
          { v: '62%', l: 'WhatsApp close rate' },
        ],
        reelsEyebrow: '— Reel Grid',
        reelsHeadline1: 'Stop-the-thumb',
        reelsHeadlineItalic: 'creative.',
        reelsSubtitle: 'Vertical-first. Built to hook in 1.5s and convert in 8.',
        reels: [
          { src: '/videos/r1.mp4', title: 'Festive Hook', tag: 'Reel' },
          { src: '/videos/r2.mp4', title: 'Product Drop', tag: 'Reel' },
          { src: '/videos/r3.mp4', title: 'Behind The Loom', tag: 'BTS' },
          { src: '/videos/r4.mp4', title: 'Founder Story', tag: 'Doc' },
          { src: '/videos/r5.mp4', title: 'Sanskar Diwali', tag: 'Ad' },
          { src: '/videos/r6.mp4', title: 'Bandhan Launch', tag: 'Promo' },
        ],
        ctaEyebrow: '— Ready when you are',
        ctaHeadline1: "Let's make",
        ctaHeadlineItalic: 'something worth watching.',
        ctaButton: 'Book a discovery call',
      },
    },
    {
      key: 'our-work',
      title: 'Our Work',
      data: {
        rotatingLabels: ['SHIPPED', 'BUILT', 'LAUNCHED', 'SCALED'],
        headline1: 'Twenty products.',
        marqueeWords: ['CUSTOM SOFTWARE', 'BRAND WEB', 'CRM SYSTEMS', 'AI AUTOMATION', 'LMS', 'RETAIL OS', 'DIGITAL MARKETING', 'GROWTH'],
        ctaKicker: 'Want to be next?',
        ctaTitle: "Let's add your name to this list.",
        ctaItalicWord: 'to this list.',
      },
    },
    {
      key: 'contact',
      title: 'Contact',
      data: {
        heroBadge: 'Contact',
        emailChannelLabel: 'Email us',
        officeHoursLabel: 'Office hours',
        locationLabel: 'Location',
        locationValue: 'India · Worldwide',
        formEyebrow: '— Project inquiry',
        formSubmitLabel: 'Send inquiry',
        formConsent: 'By sending you agree to receive a reply within 12 hours.',
        formSuccess: "Got it. We'll reply within 12 hours.",
        formPlaceholders: {
          name: 'Your name',
          email: 'you@business.com',
          phone: '+91 XXXXX XXXXX',
          business: 'Company Ltd.',
          message: 'Tell us in a few sentences what you need, when, and what success looks like.',
        },
        faqEyebrow: '— Frequently asked',
        faqHeadline1: 'Questions before',
        faqHeadlineItalic: 'the first call.',
      },
    },
  ]

  for (const p of PAGES) {
    const existing = await col.findOne({ key: p.key })
    if (existing) {
      // Only set timestamps + title; PRESERVE existing data (admin edits win)
      await col.updateOne({ key: p.key }, { $set: { title: p.title, published: true, updatedAt: new Date() } })
      console.log('[seed_pages] Preserved existing page_content:', p.key)
    } else {
      await col.insertOne({ _id: uuidv4(), key: p.key, title: p.title, data: p.data, published: true, createdAt: new Date(), updatedAt: new Date() })
      console.log('[seed_pages] Inserted new page_content:', p.key)
    }
  }

  await mongoose.disconnect()
  console.log('[seed_pages] Done.')
}

run().catch((e) => { console.error(e); process.exit(1) })
