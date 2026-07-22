import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const { Schema } = mongoose

const uuid = () => uuidv4()

/* ============================================================
   ADMINS
============================================================ */
const AdminSchema = new Schema({
  _id: { type: String, default: uuid },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  role: { type: String, enum: ['super', 'editor'], default: 'super' },
  lastLoginAt: { type: Date },
}, { timestamps: true, _id: false })

/* ============================================================
   SITE SETTINGS — one document (singleton) — brand, colors, fonts, media toggles
============================================================ */
const SiteSettingsSchema = new Schema({
  _id: { type: String, default: 'main' },
  siteName: { type: String, default: 'VayuCodes' },
  tagline: { type: String, default: 'An independent studio' },
  logoLightUrl: { type: String, default: '/brand/logo-lockup.png' },
  logoDarkUrl: { type: String, default: '/brand/logo-lockup.png' },
  location: { type: String, default: 'India · Worldwide' },
  emailPrimary: { type: String, default: 'hello@vayucodes.com' },
  phonePrimary: { type: String, default: '' },
  availability: { type: String, default: 'Available · Q3 2026' },
  theme: {
    ink: { type: String, default: '#0A0A0A' },
    bg: { type: String, default: '#FAFAF7' },
    muted: { type: String, default: '#6B6B6B' },
    line: { type: String, default: '#E7E5E1' },
  },
  fonts: {
    display: { type: String, default: 'Instrument Serif' },
    body: { type: String, default: 'Geist' },
  },
  socials: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    github: { type: String, default: '' },
  },
  hero: {
    videoUrl: { type: String, default: '' },
    videoEnabled: { type: Boolean, default: false },
    videoLoop: { type: Boolean, default: true },
    videoMaxSeconds: { type: Number, default: 5 },
    headlineLine1: { type: String, default: 'We design, engineer & scale digital' },
    headlineItalicWord: { type: String, default: 'systems.' },
    subtitle: { type: String, default: 'An independent studio combining design, engineering, AI and automation into digital systems your business can rely on.' },
  },
}, { timestamps: true, _id: false, strict: false })

/* ============================================================
   PAGES
============================================================ */
const PageSchema = new Schema({
  _id: { type: String, default: uuid },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  order: { type: Number, default: 0 },
  hero: { type: Object, default: {} },
  seo: {
    title: String,
    description: String,
    ogImage: String,
    keywords: [String],
  },
}, { timestamps: true, _id: false, strict: false })

/* ============================================================
   SECTIONS — flexible per-page blocks
============================================================ */
const SectionSchema = new Schema({
  _id: { type: String, default: uuid },
  pageSlug: { type: String, required: true, index: true },
  key: { type: String, required: true },
  type: { type: String, required: true },
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  data: { type: Object, default: {} },
}, { timestamps: true, _id: false, strict: false })
SectionSchema.index({ pageSlug: 1, order: 1 })

/* ============================================================
   MEDIA LIBRARY
============================================================ */
const MediaSchema = new Schema({
  _id: { type: String, default: uuid },
  filename: { type: String, required: true },
  url: { type: String, required: true, index: true },
  type: { type: String, enum: ['image', 'video', 'other'], default: 'image', index: true },
  mime: String,
  size: Number,
  width: Number,
  height: Number,
  durationSec: Number,
  alt: { type: String, default: '' },
  tags: [String],
  uploadedBy: String,
}, { timestamps: true, _id: false })

/* ============================================================
   PORTFOLIO PROJECTS
============================================================ */
const PortfolioSchema = new Schema({
  _id: { type: String, default: uuid },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  title: { type: String, required: true },
  client: { type: String, default: '' },
  category: { type: String, default: '' },
  summary: { type: String, default: '' },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  gallery: [String],
  themeColor: { type: String, default: '#0A0A0A' },
  accentTextColor: { type: String, default: '#FFFFFF' },
  industry: String,
  services: [String],
  year: Number,
  liveUrl: String,
  featured: { type: Boolean, default: false, index: true },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true, index: true },
}, { timestamps: true, _id: false })
PortfolioSchema.index({ order: 1, featured: -1 })

/* ============================================================
   SERVICES
============================================================ */
const ServiceSchema = new Schema({
  _id: { type: String, default: uuid },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Sparkles' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  category: { type: String, enum: ['engineering', 'design', 'marketing', 'strategy'], default: 'engineering', index: true },
  bullets: [String],
  published: { type: Boolean, default: true },
}, { timestamps: true, _id: false })

/* ============================================================
   TEAM MEMBERS
============================================================ */
const TeamSchema = new Schema({
  _id: { type: String, default: uuid },
  name: { type: String, required: true },
  role: { type: String, required: true },
  caption: { type: String, default: '' },
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isCoFounder: { type: Boolean, default: false, index: true },
  socials: {
    linkedin: String,
    twitter: String,
    email: String,
  },
  published: { type: Boolean, default: true },
}, { timestamps: true, _id: false })

/* ============================================================
   TESTIMONIALS
============================================================ */
const TestimonialSchema = new Schema({
  _id: { type: String, default: uuid },
  quote: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  avatar: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  featured: { type: Boolean, default: false, index: true },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true, _id: false })

/* ============================================================
   CONTACT SETTINGS — singleton
============================================================ */
const ContactSettingsSchema = new Schema({
  _id: { type: String, default: 'main' },
  emails: [String],
  phones: [String],
  addressLines: [String],
  mapEmbedUrl: { type: String, default: '' },
  officeHours: { type: String, default: 'Mon–Fri · 10am–7pm IST' },
  responseTime: { type: String, default: 'We respond within 12 hours.' },
  socials: {
    linkedin: String,
    twitter: String,
    instagram: String,
    whatsapp: String,
  },
  ctaHeadline: { type: String, default: 'Tell us about your project.' },
  ctaSubtitle: { type: String, default: 'We reply to every serious inquiry within 12 hours.' },
}, { timestamps: true, _id: false, strict: false })

/* ============================================================
   NAVIGATION — singleton
============================================================ */
const NavigationSchema = new Schema({
  _id: { type: String, default: 'main' },
  items: [{
    _id: false,
    label: String,
    href: String,
    order: Number,
    external: { type: Boolean, default: false },
  }],
  ctaLabel: { type: String, default: 'Start Project' },
  ctaHref: { type: String, default: '/contact' },
  ctaEnabled: { type: Boolean, default: true },
}, { timestamps: true, _id: false })

/* ============================================================
   FOOTER — singleton
============================================================ */
const FooterSchema = new Schema({
  _id: { type: String, default: 'main' },
  tagline: { type: String, default: 'Let&apos;s build something you can rely on.' },
  columns: [{
    _id: false,
    heading: String,
    links: [{
      _id: false,
      label: String,
      href: String,
      external: Boolean,
    }],
  }],
  copyright: { type: String, default: '© 2026 VayuCodes · An independent studio' },
  availability: { type: String, default: 'Available · Q3 2026' },
  bottomNote: { type: String, default: '' },
}, { timestamps: true, _id: false, strict: false })

/* ============================================================
   SEO SETTINGS — singleton
============================================================ */
const SeoSettingsSchema = new Schema({
  _id: { type: String, default: 'main' },
  defaultTitle: { type: String, default: 'VayuCodes — An independent design & engineering studio' },
  titleTemplate: { type: String, default: '%s — VayuCodes' },
  defaultDescription: { type: String, default: 'We design, engineer and scale digital systems for businesses built to move forward.' },
  defaultOgImage: { type: String, default: '/brand/og-default.png' },
  keywords: [String],
  twitterHandle: { type: String, default: '' },
  robots: { type: String, default: 'index,follow' },
  gaId: { type: String, default: '' },
  gtmId: { type: String, default: '' },
}, { timestamps: true, _id: false, strict: false })

/* ============================================================
   Export models (guard against re-registration in hot-reload)
============================================================ */
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema)
export const Page = mongoose.models.Page || mongoose.model('Page', PageSchema)
export const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema)
export const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema)
export const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema, 'portfolio_projects')
export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema)
export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamSchema, 'team_members')
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)
export const ContactSettings = mongoose.models.ContactSettings || mongoose.model('ContactSettings', ContactSettingsSchema, 'contact_settings')
export const Navigation = mongoose.models.Navigation || mongoose.model('Navigation', NavigationSchema)
export const Footer = mongoose.models.Footer || mongoose.model('Footer', FooterSchema)
export const SeoSettings = mongoose.models.SeoSettings || mongoose.model('SeoSettings', SeoSettingsSchema, 'seo_settings')

export const COLLECTION_MODELS = {
  admins: Admin,
  site_settings: SiteSettings,
  pages: Page,
  sections: Section,
  media: Media,
  portfolio_projects: Portfolio,
  services: Service,
  team_members: TeamMember,
  testimonials: Testimonial,
  contact_settings: ContactSettings,
  navigation: Navigation,
  footer: Footer,
  seo_settings: SeoSettings,
}

export const SINGLETON_COLLECTIONS = new Set([
  'site_settings', 'contact_settings', 'navigation', 'footer', 'seo_settings',
])
