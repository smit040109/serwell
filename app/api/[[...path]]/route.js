import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME || 'vayucodes'

let cachedClient = null
async function getDb() {
  if (cachedClient) return cachedClient.db(DB_NAME)
  const client = new MongoClient(MONGO_URL)
  await client.connect()
  cachedClient = client
  return client.db(DB_NAME)
}

async function handler(request, { params }) {
  const path = params?.path?.join('/') || ''
  const method = request.method

  try {
    if (path === '' || path === 'health') {
      return NextResponse.json({ status: 'ok', app: 'vayu.code' })
    }

    if (path === 'contact' && method === 'POST') {
      const body = await request.json()
      const { name, email, phone, business, message } = body || {}
      if (!name || !email) {
        return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
      }
      const db = await getDb()
      const doc = {
        id: uuidv4(),
        name, email, phone: phone || '', business: business || '', message: message || '',
        createdAt: new Date().toISOString(),
      }
      await db.collection('leads').insertOne(doc)
      return NextResponse.json({ ok: true, id: doc.id })
    }

    if (path === 'contact' && method === 'GET') {
      const db = await getDb()
      const leads = await db.collection('leads').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(100).toArray()
      return NextResponse.json({ leads })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
