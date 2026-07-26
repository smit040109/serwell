import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { connectDb } from '@/lib/mongoose'
import {
  Admin, SiteSettings, Page, Section, Media, Portfolio, Service,
  TeamMember, Testimonial, ContactSettings, Navigation, Footer, SeoSettings,
  COLLECTION_MODELS, SINGLETON_COLLECTIONS, KEYED_COLLECTIONS,
} from '@/lib/models'
import { hashPassword, verifyPassword, signToken, requireAdmin } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import {
  sanitizeInput, checkRateLimit, rateLimitHeaders, corsHeaders, getClientIp,
  validateEmail, validatePasswordStrength, validateName, validatePhone,
} from '@/lib/security'
import { getAnalyticsModels, classifySource, referrerHost } from '@/lib/analyticsModels'
import { geolocateIp } from '@/lib/geo'
import UAParser from 'ua-parser-js'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

/* ---------------------------------------------------------------
   Rate limit buckets.
   - GLOBAL: 100 req / 15 min / IP
   - LOGIN:    5 req / 15 min / IP   (brute-force protection)
   - CONTACT: 20 req / 15 min / IP   (contact-form spam brake)
--------------------------------------------------------------- */
const RL = {
  global:  { limit: 100, windowMs: 15 * 60 * 1000 },
  login:   { limit: 5,   windowMs: 15 * 60 * 1000 },
  contact: { limit: 20,  windowMs: 15 * 60 * 1000 },
  track:   { limit: 600, windowMs: 15 * 60 * 1000 },  // 40/min avg per IP — page views + events
}

function json(data, status = 200, extraHeaders = {}) {
  return NextResponse.json(data, { status, headers: extraHeaders })
}

function tooMany(result, limit, extraHeaders = {}) {
  return json(
    { error: 'Too many requests. Please try again later.' },
    429,
    { ...rateLimitHeaders(result, limit), ...extraHeaders }
  )
}

/* ============================================================
   ADMIN AUTH ENDPOINTS
============================================================ */
async function handleLogin(request) {
  const ip = getClientIp(request)
  const rl = checkRateLimit(`login:${ip}`, RL.login.limit, RL.login.windowMs)
  if (!rl.allowed) return tooMany(rl, RL.login.limit)

  const raw = await request.json().catch(() => null)
  const body = sanitizeInput(raw) || {}
  const emailV = validateEmail(body.email)
  if (!emailV.ok) return json({ error: emailV.error }, 400)
  if (typeof body.password !== 'string' || !body.password) {
    return json({ error: 'Password is required' }, 400)
  }
  // Cap password length up front to avoid bcrypt DoS on huge inputs.
  if (body.password.length > 200) return json({ error: 'Invalid credentials' }, 401)

  await connectDb()
  const admin = await Admin.findOne({ email: emailV.value })
  if (!admin) return json({ error: 'Invalid credentials' }, 401)
  const ok = await verifyPassword(body.password, admin.passwordHash)
  if (!ok) return json({ error: 'Invalid credentials' }, 401)
  admin.lastLoginAt = new Date()
  await admin.save()
  const token = signToken({ id: admin._id, email: admin.email, role: admin.role, name: admin.name })
  return json(
    { token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } },
    200,
    rateLimitHeaders(rl, RL.login.limit)
  )
}

async function handleMe(request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return json({ error: auth.error }, auth.status)
  return json({ admin: auth.admin })
}

/* ============================================================
   MEDIA UPLOAD
============================================================ */
async function handleUpload(request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return json({ error: auth.error }, auth.status)

  const formData = await request.formData()
  const file = formData.get('file')
  const alt = formData.get('alt') || ''
  if (!file || typeof file === 'string') return json({ error: 'No file' }, 400)

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name).toLowerCase() || ''
  const filename = `${Date.now()}-${uuidv4().slice(0, 8)}${ext}`
  await mkdir(UPLOAD_DIR, { recursive: true })
  const filepath = path.join(UPLOAD_DIR, filename)
  await writeFile(filepath, buffer)

  const mime = file.type || ''
  const type = mime.startsWith('video/') ? 'video' : mime.startsWith('image/') ? 'image' : 'other'
  const url = `/uploads/${filename}`

  await connectDb()
  const media = await Media.create({
    filename,
    url,
    type,
    mime,
    size: buffer.length,
    alt,
    uploadedBy: auth.admin?.email || 'admin',
  })
  return json({ media })
}

/* ============================================================
   GENERIC CRUD DISPATCHER
============================================================ */
async function handleCollectionGet(collection, request) {
  const Model = COLLECTION_MODELS[collection]
  if (!Model) return json({ error: 'Unknown collection' }, 404)
  await connectDb()
  const { searchParams } = new URL(request.url)
  const filter = {}
  // published-only filter for public reads (no auth)
  const auth = requireAdmin(request)
  if (!auth.ok && Model.schema.paths.published) filter.published = true
  const query = Model.find(filter).sort({ order: 1, createdAt: -1 })
  const limit = parseInt(searchParams.get('limit') || '0', 10)
  if (limit > 0) query.limit(limit)
  const docs = await query.lean()
  if (SINGLETON_COLLECTIONS.has(collection)) {
    let doc = docs[0]
    if (!doc) {
      doc = await Model.create({ _id: 'main' })
    }
    return json({ data: doc })
  }
  return json({ data: docs })
}

async function handleCollectionCreate(collection, request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return json({ error: auth.error }, auth.status)
  const Model = COLLECTION_MODELS[collection]
  if (!Model) return json({ error: 'Unknown collection' }, 404)
  await connectDb()
  const raw = await request.json().catch(() => null)
  const body = sanitizeInput(raw) || {}
  if (collection === 'admins') {
    if (!body.password) return json({ error: 'password required' }, 400)
    const pw = validatePasswordStrength(body.password)
    if (!pw.ok) return json({ error: pw.error }, 400)
    if (body.email) {
      const ev = validateEmail(body.email)
      if (!ev.ok) return json({ error: ev.error }, 400)
      body.email = ev.value
    }
    body.passwordHash = await hashPassword(body.password)
    delete body.password
  }
  if (SINGLETON_COLLECTIONS.has(collection)) {
    // upsert singleton
    body._id = 'main'
    const doc = await Model.findOneAndUpdate({ _id: 'main' }, body, { new: true, upsert: true, setDefaultsOnInsert: true })
    return json({ data: doc })
  }
  // KEYED_UPSERT — upsert by unique key field (e.g. legal_pages by 'key')
  const keyField = KEYED_COLLECTIONS[collection]
  if (keyField && body[keyField]) {
    delete body._id
    const doc = await Model.findOneAndUpdate(
      { [keyField]: String(body[keyField]).toLowerCase().trim() },
      { $set: body },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    )
    return json({ data: doc })
  }
  const doc = await Model.create(body)
  return json({ data: doc })
}

async function handleCollectionUpdate(collection, id, request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return json({ error: auth.error }, auth.status)
  const Model = COLLECTION_MODELS[collection]
  if (!Model) return json({ error: 'Unknown collection' }, 404)
  await connectDb()
  const raw = await request.json().catch(() => null)
  const body = sanitizeInput(raw) || {}
  if (collection === 'admins' && body.password) {
    const pw = validatePasswordStrength(body.password)
    if (!pw.ok) return json({ error: pw.error }, 400)
    body.passwordHash = await hashPassword(body.password)
    delete body.password
  }
  if (collection === 'admins' && body.email) {
    const ev = validateEmail(body.email)
    if (!ev.ok) return json({ error: ev.error }, 400)
    body.email = ev.value
  }
  delete body._id
  const targetId = SINGLETON_COLLECTIONS.has(collection) ? 'main' : id
  const doc = await Model.findByIdAndUpdate(targetId, body, { new: true, upsert: SINGLETON_COLLECTIONS.has(collection), setDefaultsOnInsert: true })
  if (!doc) return json({ error: 'Not found' }, 404)
  return json({ data: doc })
}

async function handleCollectionDelete(collection, id, request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return json({ error: auth.error }, auth.status)
  if (SINGLETON_COLLECTIONS.has(collection)) return json({ error: 'Cannot delete singleton' }, 400)
  const Model = COLLECTION_MODELS[collection]
  if (!Model) return json({ error: 'Unknown collection' }, 404)
  await connectDb()
  const doc = await Model.findByIdAndDelete(id)
  if (!doc) return json({ error: 'Not found' }, 404)
  // Media: also remove the physical file from /public/uploads
  if (collection === 'media' && doc.url && String(doc.url).startsWith('/uploads/')) {
    try {
      await unlink(path.join(process.cwd(), 'public', doc.url))
    } catch (e) { /* file may already be gone — ignore */ }
  }
  return json({ ok: true })
}

/* ============================================================
   PUBLIC CONTACT LEAD (existing behavior preserved)
============================================================ */
async function handleContactLead(request) {
  const ip = getClientIp(request)
  const rl = checkRateLimit(`contact:${ip}`, RL.contact.limit, RL.contact.windowMs)
  if (!rl.allowed) return tooMany(rl, RL.contact.limit)

  const raw = await request.json().catch(() => null)
  const body = sanitizeInput(raw) || {}
  const { name, email, phone, business, message } = body

  const nameV = validateName(name)
  if (!nameV.ok) return json({ error: nameV.error }, 400)
  const emailV = validateEmail(email)
  if (!emailV.ok) return json({ error: emailV.error }, 400)
  const phoneV = validatePhone(phone)
  if (!phoneV.ok) return json({ error: phoneV.error }, 400)
  if (!message || typeof message !== 'string' || !message.trim()) {
    return json({ error: 'Message is required' }, 400)
  }
  const msgT = String(message).trim()
  if (msgT.length < 10) return json({ error: 'Message is too short' }, 400)
  if (msgT.length > 5000) return json({ error: 'Message is too long' }, 400)
  const bizT = typeof business === 'string' ? business.trim().slice(0, 200) : ''

  // Attribution — pulled from body (client sends it) + IP geo enrichment.
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 80) : ''
  const visitorId = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 80) : ''
  const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : ''
  const utm_source = typeof body.utm_source === 'string' ? body.utm_source.slice(0, 100) : ''
  const utm_medium = typeof body.utm_medium === 'string' ? body.utm_medium.slice(0, 100) : ''
  const utm_campaign = typeof body.utm_campaign === 'string' ? body.utm_campaign.slice(0, 100) : ''
  const source = classifySource({ referrer, utm_source })
  const geo = await geolocateIp(ip)

  await connectDb()
  const { Lead } = getAnalyticsModels()
  const doc = await Lead.create({
    name: nameV.value,
    email: emailV.value,
    phone: phoneV.value,
    business: bizT,
    message: msgT,
    sessionId,
    visitorId,
    source,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    country: geo.country || '',
    city: geo.city || '',
  })
  return json({ ok: true, id: doc._id }, 200, rateLimitHeaders(rl, RL.contact.limit))
}

/* ============================================================
   FIRST-PARTY ANALYTICS \u2014 /api/track  (public, unauth)
============================================================ */
async function handleTrack(request) {
  const ip = getClientIp(request)
  const rl = checkRateLimit(`track:${ip}`, RL.track.limit, RL.track.windowMs)
  if (!rl.allowed) return tooMany(rl, RL.track.limit)

  let raw = null
  try {
    // sendBeacon sends a Blob with content-type application/json
    raw = await request.json()
  } catch { raw = null }
  const body = sanitizeInput(raw) || {}
  const { type, visitorId, sessionId, path: eventPath } = body
  if (!type || !visitorId || !sessionId) return json({ ok: false }, 400)
  if (typeof visitorId !== 'string' || typeof sessionId !== 'string') return json({ ok: false }, 400)

  await connectDb()
  const { Session, Event } = getAnalyticsModels()

  // Bootstrap/update the session row for every event.
  const existing = await Session.findOne({ sessionId }).lean()
  if (!existing) {
    const ua = typeof body.ua === 'string' ? body.ua : (request.headers.get('user-agent') || '')
    const parser = new UAParser(ua)
    const b = parser.getBrowser()
    const o = parser.getOS()
    const d = parser.getDevice()
    const deviceType = d.type ? d.type.charAt(0).toUpperCase() + d.type.slice(1) : 'Desktop'

    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : ''
    const utm = (body.utm && typeof body.utm === 'object') ? body.utm : {}
    const source = classifySource({ referrer, utm_source: utm.utm_source })
    const geo = await geolocateIp(ip)

    // A visitor is "returning" if we've seen this visitorId before in another session.
    const priorAny = await Session.exists({ visitorId, sessionId: { $ne: sessionId } })

    await Session.create({
      visitorId,
      sessionId,
      referrer,
      referrerHost: referrerHost(referrer),
      source,
      utm_source: utm.utm_source || '',
      utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '',
      utm_term: utm.utm_term || '',
      utm_content: utm.utm_content || '',
      ua: ua.slice(0, 500),
      device: deviceType,
      browser: [b.name, b.version].filter(Boolean).join(' ').slice(0, 80),
      os: [o.name, o.version].filter(Boolean).join(' ').slice(0, 80),
      language: typeof body.language === 'string' ? body.language.slice(0, 20) : '',
      tz: typeof body.tz === 'string' ? body.tz.slice(0, 60) : '',
      screen: typeof body.screen === 'string' ? body.screen.slice(0, 20) : '',
      ip,
      country: geo.country || '',
      region: geo.region || '',
      city: geo.city || '',
      firstSeen: new Date(),
      lastSeen: new Date(),
      pageviews: type === 'pageview' || type === 'session_start' ? 1 : 0,
      isReturning: Boolean(priorAny),
    })
  } else {
    // Touch lastSeen; bump pageviews on pageview.
    const update = { lastSeen: new Date() }
    if (type === 'pageview') update.pageviews = (existing.pageviews || 0) + 1
    await Session.updateOne({ sessionId }, { $set: update })
  }

  // Persist the event itself (except session_start, which is metadata-only).
  if (type !== 'session_start') {
    const doc = {
      visitorId,
      sessionId,
      type,
      path: typeof eventPath === 'string' ? eventPath.slice(0, 500) : '',
    }
    if (type === 'click') {
      doc.name = String(body.name || '').slice(0, 80)
      doc.label = String(body.label || '').slice(0, 200)
      doc.href = String(body.href || '').slice(0, 500)
    } else if (type === 'section_time') {
      doc.sections = Array.isArray(body.sections)
        ? body.sections.slice(0, 20).map(s => ({
            id: String(s.id || '').slice(0, 60),
            ms: Math.max(0, Math.min(Number(s.ms) || 0, 24 * 3600 * 1000)),
          }))
        : []
    } else if (type === 'page_time') {
      doc.ms = Math.max(0, Math.min(Number(body.ms) || 0, 24 * 3600 * 1000))
    }
    try { await Event.create(doc) } catch { /* one-off failures shouldn't 500 */ }
  }

  return json({ ok: true }, 200, rateLimitHeaders(rl, RL.track.limit))
}

/* ============================================================
   ADMIN ANALYTICS SUMMARY  \u2014 /api/admin/analytics
============================================================ */
function parseRange(request) {
  const url = new URL(request.url)
  const days = Math.max(1, Math.min(365, parseInt(url.searchParams.get('days') || '7', 10)))
  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
  return { from, to, days }
}

async function handleAnalyticsSummary(request) {
  const auth = requireAdmin(request)
  if (!auth.ok) return json({ error: auth.error }, auth.status)
  await connectDb()
  const { Session, Event, Lead } = getAnalyticsModels()
  const { from, to, days } = parseRange(request)

  const dateMatch = { firstSeen: { $gte: from, $lte: to } }

  const [
    totalSessions,
    uniqueVisitors,
    returningSessions,
    leadsCount,
    byDay,
    byDevice,
    byBrowser,
    byOs,
    bySource,
    byCountry,
    byCity,
    byPage,
    byClick,
    recentLeads,
    latestSessions,
  ] = await Promise.all([
    Session.countDocuments(dateMatch),
    Session.distinct('visitorId', dateMatch).then(a => a.length),
    Session.countDocuments({ ...dateMatch, isReturning: true }),
    Lead.countDocuments({ createdAt: { $gte: from, $lte: to } }),
    Session.aggregate([
      { $match: dateMatch },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$firstSeen' } },
          sessions: { $sum: 1 },
          visitors: { $addToSet: '$visitorId' },
      }},
      { $project: { day: '$_id', _id: 0, sessions: 1, visitors: { $size: '$visitors' } } },
      { $sort: { day: 1 } },
    ]),
    Session.aggregate([{ $match: dateMatch }, { $group: { _id: '$device', c: { $sum: 1 } } }, { $sort: { c: -1 } }]),
    Session.aggregate([{ $match: dateMatch }, { $group: { _id: '$browser', c: { $sum: 1 } } }, { $sort: { c: -1 } }, { $limit: 8 }]),
    Session.aggregate([{ $match: dateMatch }, { $group: { _id: '$os', c: { $sum: 1 } } }, { $sort: { c: -1 } }, { $limit: 8 }]),
    Session.aggregate([{ $match: dateMatch }, { $group: { _id: '$source', c: { $sum: 1 } } }, { $sort: { c: -1 } }]),
    Session.aggregate([{ $match: dateMatch }, { $group: { _id: '$country', c: { $sum: 1 } } }, { $sort: { c: -1 } }, { $limit: 10 }]),
    Session.aggregate([{ $match: dateMatch }, { $group: { _id: { country: '$country', city: '$city' }, c: { $sum: 1 } } }, { $sort: { c: -1 } }, { $limit: 15 }]),
    Event.aggregate([
      { $match: { type: 'pageview', createdAt: { $gte: from, $lte: to } } },
      { $group: { _id: '$path', c: { $sum: 1 } } },
      { $sort: { c: -1 } }, { $limit: 15 },
    ]),
    Event.aggregate([
      { $match: { type: 'click', createdAt: { $gte: from, $lte: to } } },
      { $group: { _id: '$name', c: { $sum: 1 } } },
      { $sort: { c: -1 } }, { $limit: 15 },
    ]),
    Lead.find({ createdAt: { $gte: from, $lte: to } }).sort({ createdAt: -1 }).limit(20).lean(),
    Session.find(dateMatch).sort({ lastSeen: -1 }).limit(30).lean(),
  ])

  // Fill missing days with zero for a clean chart.
  const dayMap = new Map(byDay.map(d => [d.day, d]))
  const series = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(to.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    series.push(dayMap.get(key) || { day: key, sessions: 0, visitors: 0 })
  }

  return json({
    range: { from, to, days },
    totals: {
      sessions: totalSessions,
      uniqueVisitors,
      returningSessions,
      leads: leadsCount,
    },
    series,
    breakdowns: {
      device: byDevice.map(x => ({ label: x._id || 'Unknown', value: x.c })),
      browser: byBrowser.map(x => ({ label: x._id || 'Unknown', value: x.c })),
      os: byOs.map(x => ({ label: x._id || 'Unknown', value: x.c })),
      source: bySource.map(x => ({ label: x._id || 'Direct', value: x.c })),
      country: byCountry.map(x => ({ label: x._id || 'Unknown', value: x.c })),
      city: byCity.map(x => ({ label: [x._id.city, x._id.country].filter(Boolean).join(', ') || 'Unknown', value: x.c })),
      pages: byPage.map(x => ({ label: x._id || '/', value: x.c })),
      clicks: byClick.map(x => ({ label: x._id || 'unknown', value: x.c })),
    },
    recentLeads,
    latestSessions,
  })
}

async function handleSessionJourney(request, sessionId) {
  const auth = requireAdmin(request)
  if (!auth.ok) return json({ error: auth.error }, auth.status)
  await connectDb()
  const { Session, Event } = getAnalyticsModels()
  const session = await Session.findOne({ sessionId }).lean()
  if (!session) return json({ error: 'Not found' }, 404)
  const events = await Event.find({ sessionId }).sort({ createdAt: 1 }).lean()
  return json({ session, events })
}


async function handler(request, { params }) {
  const segs = params?.path || []
  const method = request.method
  const cHeaders = corsHeaders(request)

  // CORS preflight — respond fast with allowed methods/headers.
  if (method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: cHeaders })
  }

  // Global rate limit — 100 req / 15 min / IP for everything except health.
  const ip = getClientIp(request)
  if (!(segs.length === 0 || segs[0] === 'health')) {
    const rl = checkRateLimit(`api:${ip}`, RL.global.limit, RL.global.windowMs)
    if (!rl.allowed) return tooMany(rl, RL.global.limit, cHeaders)
  }

  try {
    // health
    if (segs.length === 0 || segs[0] === 'health') {
      return json({ status: 'ok', app: 'vayucodes-cms', time: new Date().toISOString() }, 200, cHeaders)
    }

    // FIRST-PARTY TRACKING (public, no auth) — /api/track
    if (segs[0] === 'track' && method === 'POST') {
      // Skip the earlier global rate limit — we have our own track bucket.
      const res = await handleTrack(request)
      Object.entries(cHeaders).forEach(([k, v]) => res.headers.set(k, v))
      return res
    }

    // ADMIN ANALYTICS — /api/admin/analytics(?days=N) and /api/admin/analytics/session/:sessionId
    if (segs[0] === 'admin' && segs[1] === 'analytics') {
      if (method !== 'GET') return json({ error: 'Method not allowed' }, 405, cHeaders)
      if (segs[2] === 'session' && segs[3]) return handleSessionJourney(request, segs[3])
      return handleAnalyticsSummary(request)
    }

    // AUTH
    if (segs[0] === 'admin' && segs[1] === 'login' && method === 'POST') {
      const res = await handleLogin(request)
      Object.entries(cHeaders).forEach(([k, v]) => res.headers.set(k, v))
      return res
    }
    if (segs[0] === 'admin' && segs[1] === 'me' && method === 'GET') return handleMe(request)

    // MEDIA upload
    if (segs[0] === 'admin' && segs[1] === 'upload' && method === 'POST') return handleUpload(request)

    // MEDIA library endpoints (Phase 4): /api/admin/media
    if (segs[0] === 'admin' && segs[1] === 'media') {
      if (method === 'POST') return handleUpload(request)
      if (method === 'GET') {
        const auth = requireAdmin(request)
        if (!auth.ok) return json({ error: auth.error }, auth.status)
        await connectDb()
        const docs = await Media.find({}).sort({ createdAt: -1 }).lean()
        return json({ data: docs })
      }
      if (method === 'DELETE' && segs[2]) return handleCollectionDelete('media', segs[2], request)
    }

    // Legacy public contact lead (kept for backwards-compat)
    if (segs[0] === 'contact' && method === 'POST') {
      const res = await handleContactLead(request)
      Object.entries(cHeaders).forEach(([k, v]) => res.headers.set(k, v))
      return res
    }

    // CMS collections
    // /api/cms/{collection} (GET all, POST create)
    // /api/cms/{collection}/{id} (GET one, PUT update, DELETE)
    if (segs[0] === 'cms' && segs[1]) {
      const collection = segs[1]
      const id = segs[2]
      if (!id) {
        if (method === 'GET') return handleCollectionGet(collection, request)
        if (method === 'POST') return handleCollectionCreate(collection, request)
      } else {
        if (method === 'GET') {
          const Model = COLLECTION_MODELS[collection]
          if (!Model) return json({ error: 'Unknown collection' }, 404)
          await connectDb()
          // `id` is user input — accept only safe strings before mongo lookup.
          const safeId = typeof id === 'string' ? id.slice(0, 200).replace(/[^A-Za-z0-9_\-:.]/g, '') : ''
          let doc = safeId ? await Model.findById(safeId).lean() : null
          // KEYED collections: allow lookup by key (e.g. /api/cms/legal_pages/privacy)
          const keyField = KEYED_COLLECTIONS[collection]
          if (!doc && keyField && safeId) {
            doc = await Model.findOne({ [keyField]: String(safeId).toLowerCase().trim() }).lean()
          }
          if (!doc) return json({ error: 'Not found' }, 404)
          return json({ data: doc })
        }
        if (method === 'PUT' || method === 'PATCH') return handleCollectionUpdate(collection, id, request)
        if (method === 'DELETE') return handleCollectionDelete(collection, id, request)
      }
    }

    return json({ error: 'Not found', path: segs.join('/') }, 404, cHeaders)
  } catch (e) {
    console.error('[api]', e)
    return json({ error: e.message || 'Server error' }, 500, cHeaders)
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
export const OPTIONS = handler

// force node runtime (needed for fs, mongoose)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
