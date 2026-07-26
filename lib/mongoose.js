import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL

let cached = global._mongooseCache
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null }
}

export async function connectDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI / MONGO_URL not configured in environment')
  }
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      ...(process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {}),
    }).then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectDb
