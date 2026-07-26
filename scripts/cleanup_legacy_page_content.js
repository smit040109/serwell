/*
 * Clean up legacy page_content docs where _id was set to the key string
 * (breaks new keyed lookup). Keeps the new UUID-id + `data` docs.
 */
require('dotenv').config({ path: '/app/.env' })
const mongoose = require('mongoose')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    ...(process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {}),
  })
  const col = mongoose.connection.db.collection('page_content')
  const legacyKeys = ['home', 'why-us', 'digital-marketing', 'our-work', 'contact']
  for (const k of legacyKeys) {
    const legacy = await col.findOne({ _id: k })
    if (legacy) {
      const r = await col.deleteOne({ _id: k })
      console.log('[cleanup] Deleted legacy doc _id=', k, r.deletedCount)
    }
  }
  await mongoose.disconnect()
  console.log('[cleanup] Done.')
}
run().catch(e => { console.error(e); process.exit(1) })
