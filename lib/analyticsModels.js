/**
 * MongoDB models for our first-party analytics store.
 *   - Session: one row per (visitorId, sessionId). Enriched w/ geo + UA.
 *   - Event:   one row per pageview/click/section_time.
 *   - Lead:    contact-form submission (extended w/ attribution).
 */
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const SessionSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  visitorId: { type: String, index: true },
  sessionId: { type: String, index: true, unique: true },
  // Attribution (first-touch on the session).
  referrer: String,
  referrerHost: { type: String, index: true },
  source: { type: String, index: true },        // google, facebook, instagram, linkedin, direct, referral, ...
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  utm_term: String,
  utm_content: String,
  // Device.
  ua: String,
  device: String,           // Mobile / Desktop / Tablet
  browser: String,
  os: String,
  language: String,
  tz: String,
  screen: String,
  // Geo.
  ip: String,
  country: { type: String, index: true },
  region: String,
  city: { type: String, index: true },
  // Time.
  firstSeen: { type: Date, default: Date.now, index: true },
  lastSeen:  { type: Date, default: Date.now, index: true },
  pageviews: { type: Number, default: 0 },
  isReturning: { type: Boolean, default: false },
}, { _id: false })

const EventSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  visitorId: { type: String, index: true },
  sessionId: { type: String, index: true },
  type: { type: String, index: true },   // pageview | click | section_time | page_time
  path: String,
  name: String,        // for click: label
  label: String,
  href: String,
  ms: Number,          // for time events
  sections: [{ id: String, ms: Number }],
  createdAt: { type: Date, default: Date.now, index: true },
}, { _id: false })

EventSchema.index({ sessionId: 1, createdAt: 1 })

const LeadSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  name: String,
  email: String,
  phone: String,
  business: String,
  message: String,
  // Attribution.
  sessionId: String,
  visitorId: String,
  source: String,
  referrer: String,
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  country: String,
  city: String,
  createdAt: { type: Date, default: Date.now, index: true },
}, { _id: false })

export function getAnalyticsModels() {
  const Session = mongoose.models.AnalyticsSession || mongoose.model('AnalyticsSession', SessionSchema, 'analytics_sessions')
  const Event = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', EventSchema, 'analytics_events')
  const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema, 'leads')
  return { Session, Event, Lead }
}

/**
 * Classify referrer URL into a coarse source bucket for reporting.
 */
export function classifySource({ referrer = '', utm_source = '' } = {}) {
  const u = (utm_source || '').toLowerCase()
  if (u) {
    if (u.includes('google')) return 'Google'
    if (u.includes('facebook') || u.includes('fb')) return 'Facebook'
    if (u.includes('instagram') || u.includes('ig')) return 'Instagram'
    if (u.includes('linkedin')) return 'LinkedIn'
    if (u.includes('twitter') || u.includes('x.com')) return 'Twitter/X'
    if (u.includes('youtube')) return 'YouTube'
    return u.charAt(0).toUpperCase() + u.slice(1)
  }
  if (!referrer) return 'Direct'
  const r = referrer.toLowerCase()
  if (r.includes('google.')) return 'Google'
  if (r.includes('facebook.') || r.includes('fb.')) return 'Facebook'
  if (r.includes('instagram.')) return 'Instagram'
  if (r.includes('linkedin.')) return 'LinkedIn'
  if (r.includes('twitter.') || r.includes('t.co') || r.includes('x.com')) return 'Twitter/X'
  if (r.includes('youtube.') || r.includes('youtu.be')) return 'YouTube'
  if (r.includes('bing.')) return 'Bing'
  if (r.includes('duckduckgo.')) return 'DuckDuckGo'
  return 'Referral'
}

export function referrerHost(referrer) {
  if (!referrer) return ''
  try { return new URL(referrer).hostname.replace(/^www\./, '') } catch { return '' }
}
