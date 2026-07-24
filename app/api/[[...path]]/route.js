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

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function json(data, status = 200) {
  return NextResponse.json(data, { status })
}

/* ============================================================
   ADMIN AUTH ENDPOINTS
============================================================ */
async function handleLogin(request) {
  const { email, password } = await request.json()
  if (!email || !password) return json({ error: 'email and password required' }, 400)
  await connectDb()
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() })
  if (!admin) return json({ error: 'Invalid credentials' }, 401)
  const ok = await verifyPassword(password, admin.passwordHash)
  if (!ok) return json({ error: 'Invalid credentials' }, 401)
  admin.lastLoginAt = new Date()
  await admin.save()
  const token = signToken({ id: admin._id, email: admin.email, role: admin.role, name: admin.name })
  return json({ token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } })
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
  const body = await request.json()
  if (collection === 'admins') {
    if (!body.password) return json({ error: 'password required' }, 400)
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
  const body = await request.json()
  if (collection === 'admins' && body.password) {
    body.passwordHash = await hashPassword(body.password)
    delete body.password
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
  const body = await request.json()
  const { name, email, phone, business, message } = body || {}
  const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{1,}$/
  const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/
  if (!name || !String(name).trim()) return json({ error: 'Name is required' }, 400)
  if (!NAME_RE.test(String(name).trim())) return json({ error: 'Enter a valid name' }, 400)
  if (!email || !String(email).trim()) return json({ error: 'Email is required' }, 400)
  if (!EMAIL_RE.test(String(email).trim())) return json({ error: 'Enter a valid email' }, 400)
  if (phone && !PHONE_RE.test(String(phone).trim())) return json({ error: 'Enter a valid phone number' }, 400)
  if (!message || !String(message).trim()) return json({ error: 'Message is required' }, 400)
  if (String(message).trim().length < 10) return json({ error: 'Message is too short' }, 400)
  await connectDb()
  const mongoose = (await import('mongoose')).default
  const LeadSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    name: String, email: String, phone: String, business: String, message: String,
    createdAt: { type: Date, default: Date.now },
  }, { _id: false })
  const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema, 'leads')
  const doc = await Lead.create({ name, email, phone: phone || '', business: business || '', message: message || '' })
  return json({ ok: true, id: doc._id })
}

/* ============================================================
   MAIN HANDLER
============================================================ */
async function handler(request, { params }) {
  const segs = params?.path || []
  const method = request.method

  try {
    // health
    if (segs.length === 0 || segs[0] === 'health') {
      return json({ status: 'ok', app: 'vayucodes-cms', time: new Date().toISOString() })
    }

    // AUTH
    if (segs[0] === 'admin' && segs[1] === 'login' && method === 'POST') return handleLogin(request)
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
    if (segs[0] === 'contact' && method === 'POST') return handleContactLead(request)

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
          let doc = await Model.findById(id).lean()
          // KEYED collections: allow lookup by key (e.g. /api/cms/legal_pages/privacy)
          const keyField = KEYED_COLLECTIONS[collection]
          if (!doc && keyField) {
            doc = await Model.findOne({ [keyField]: String(id).toLowerCase().trim() }).lean()
          }
          if (!doc) return json({ error: 'Not found' }, 404)
          return json({ data: doc })
        }
        if (method === 'PUT' || method === 'PATCH') return handleCollectionUpdate(collection, id, request)
        if (method === 'DELETE') return handleCollectionDelete(collection, id, request)
      }
    }

    return json({ error: 'Not found', path: segs.join('/') }, 404)
  } catch (e) {
    console.error('[api]', e)
    return json({ error: e.message || 'Server error' }, 500)
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler

// force node runtime (needed for fs, mongoose)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
