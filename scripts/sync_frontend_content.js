/*
 * Sync CMS content to match the CURRENT live frontend content, so wiring the
 * frontend to CMS changes nothing visually. Run: node scripts/sync_frontend_content.js
 */
require('dotenv').config({ path: '/app/.env' })
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL

const HOMEPAGE_STEPS = [
  { stepNumber: 1, title: 'Understand', accent: 'Discovery', description: 'We start by listening. Your business, your P&L, your customers, your calendar. A 60-minute call where you talk more than us.', image: 'https://images.unsplash.com/photo-1573165662973-4ab3cf3d3508?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400' },
  { stepNumber: 2, title: 'Research', accent: 'Deep dive', description: 'Competitor teardowns, customer interviews, workflow audits. We show up to the second meeting knowing your industry better than most consultants.', image: 'https://images.pexels.com/photos/7947854/pexels-photo-7947854.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400' },
  { stepNumber: 3, title: 'Present', accent: 'Proposal', description: 'Fixed-scope proposal with wireframes, timelines and pricing. No surprises, no fine print, no six-meeting sales funnels.', image: 'https://images.unsplash.com/photo-1561123760-0b8467594a63?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400' },
  { stepNumber: 4, title: 'Iterate', accent: 'Build loop', description: 'Weekly demos, weekly feedback, weekly progress. You steer the ship at every milestone — nothing gets built in the dark.', image: 'https://images.pexels.com/photos/3862154/pexels-photo-3862154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400' },
  { stepNumber: 5, title: 'Deliver & Ship', accent: 'Launch', description: 'On the deadline, in production, documented. Then we stay for the post-launch quarter so momentum never dies.', image: 'https://images.unsplash.com/photo-1652172100914-c5b691730756?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkZXZlbG9wZXIlMjB0ZWFtfGVufDB8fHxibGFja19hbmRfd2hpdGV8MTc4NDcyMjc2NXww&ixlib=rb-4.1.0&q=85&w=1400' },
]

async function run() {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    ...(process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {}),
  })
  const db = mongoose.connection.db
  console.log('[sync] Connected. DB:', db.databaseName)

  // 1) how_we_work_steps ← current homepage content (match by stepNumber, upsert)
  const hww = db.collection('how_we_work_steps')
  for (const s of HOMEPAGE_STEPS) {
    await hww.updateOne(
      { stepNumber: s.stepNumber },
      {
        $set: { ...s, order: s.stepNumber, published: true, updatedAt: new Date() },
        $setOnInsert: { _id: uuidv4(), createdAt: new Date() },
      },
      { upsert: true }
    )
  }
  console.log('[sync] how_we_work_steps synced to homepage content (5 steps)')

  // 2) site_settings ← current live constants so visuals stay identical
  await db.collection('site_settings').updateOne(
    { _id: 'main' },
    {
      $set: {
        preloaderText: 'A studio worldwide · Shipping globally',
        closingStatement: "Have an idea? Let's build what comes next.",
        cinematicVideoUrl: '/video/intro.mp4?v=4',
        cinematicPosterUrl: '/video/intro-poster.jpg?v=4',
        cinematicEnabled: true,
        introTypewriterText: 'Welcome to the VayuCodes World',
        rotatingWords: ['digital systems', 'AI workflows', 'growth engines', 'future products'],
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  )
  console.log('[sync] site_settings extended fields synced to live values')

  console.log('[sync] DONE')
  await mongoose.disconnect()
}

run().catch((e) => { console.error(e); process.exit(1) })
