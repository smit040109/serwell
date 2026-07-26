'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function AdminDigitalMarketingPage() {
  return (
    <CollectionEditor
      collection="page_content"
      keyed={{ key: 'digital-marketing', defaults: { title: 'Digital Marketing', data: {} } }}
      title="Digital Marketing Page"
      description="Slideshow, philosophy, service pillars, case study, reel grid."
      fields={[
        { key: 'data.eyebrow', label: 'HERO — eyebrow', type: 'text' },
        { key: 'data.slides', label: 'HERO — slides (5 auto-rotating)', type: 'repeater', wide: true, itemFields: [
          { key: 'code', label: 'Code (01, 02, ...)' },
          { key: 'title', label: 'Title (e.g. Performance)' },
          { key: 'italic', label: 'Italic part (e.g. Marketing)' },
          { key: 'tag', label: 'Tag line' },
          { key: 'body', label: 'Body', textarea: true, rows: 4 },
          { key: 'img', label: 'Background image URL' },
        ]},

        { key: 'data.philosophyEyebrow', label: 'PHILOSOPHY — eyebrow', type: 'text' },
        { key: 'data.philosophyHeadline1', label: 'PHILOSOPHY — headline line 1', type: 'text' },
        { key: 'data.philosophyHeadlineItalic', label: 'PHILOSOPHY — italic line', type: 'text' },
        { key: 'data.philosophyBody', label: 'PHILOSOPHY — body', textarea: true, wide: true, rows: 4 },

        { key: 'data.pillarsEyebrow', label: 'PILLARS — eyebrow', type: 'text' },
        { key: 'data.pillarsHeadline1', label: 'PILLARS — headline line 1', type: 'text' },
        { key: 'data.pillarsHeadlineItalic', label: 'PILLARS — italic part', type: 'text' },
        { key: 'data.pillars', label: 'PILLARS — 3 cards', type: 'repeater', wide: true, itemFields: [
          { key: 'code', label: 'Code (01, 02, 03)' },
          { key: 'title', label: 'Title' },
          { key: 'body', label: 'Body', textarea: true, rows: 3 },
          { key: 'points', label: 'Bullet points (comma-separated in one line — or use JSON)' },
        ]},

        { key: 'data.caseEyebrow', label: 'CASE — eyebrow', type: 'text' },
        { key: 'data.caseHeadline1', label: 'CASE — headline line 1', type: 'text' },
        { key: 'data.caseHeadlineItalic', label: 'CASE — italic part', type: 'text' },
        { key: 'data.caseHeadline2', label: 'CASE — headline line 2', type: 'text' },
        { key: 'data.caseBody', label: 'CASE — body', textarea: true, wide: true, rows: 3 },
        { key: 'data.caseStats', label: 'CASE — 4 stat cards', type: 'repeater', wide: true, itemFields: [
          { key: 'v', label: 'Value (e.g. 4×)' },
          { key: 'l', label: 'Label' },
        ]},

        { key: 'data.reelsEyebrow', label: 'REELS — eyebrow', type: 'text' },
        { key: 'data.reelsHeadline1', label: 'REELS — headline line 1', type: 'text' },
        { key: 'data.reelsHeadlineItalic', label: 'REELS — italic', type: 'text' },
        { key: 'data.reelsSubtitle', label: 'REELS — subtitle', textarea: true, wide: true, rows: 2 },
        { key: 'data.reels', label: 'REELS — 6 videos', type: 'repeater', wide: true, itemFields: [
          { key: 'src', label: 'Video URL' },
          { key: 'title', label: 'Title' },
          { key: 'tag', label: 'Tag (Reel, BTS, Ad, ...)' },
        ]},

        { key: 'data.ctaEyebrow', label: 'CTA — eyebrow', type: 'text' },
        { key: 'data.ctaHeadline1', label: 'CTA — headline line 1', type: 'text' },
        { key: 'data.ctaHeadlineItalic', label: 'CTA — italic', type: 'text' },
        { key: 'data.ctaButton', label: 'CTA — button label', type: 'text' },
      ]}
    />
  )
}
