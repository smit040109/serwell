'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function AdminOurWorkPage() {
  return (
    <CollectionEditor
      collection="page_content"
      keyed={{ key: 'our-work', defaults: { title: 'Our Work', data: {} } }}
      title="Our Work Page"
      description="Hero headline, rotating word, marquee, CTA. Projects are managed in Portfolio."
      fields={[
        { key: 'data.headline1', label: 'HERO — headline start', type: 'text', wide: true, help: "e.g. 'Twenty products.'" },
        { key: 'data.rotatingLabels', label: 'HERO — rotating italic words', type: 'stringlist', wide: true, rows: 4, help: 'One label per line — cycles below the headline.' },
        { key: 'data.marqueeWords', label: 'HERO — bottom marquee words', type: 'stringlist', wide: true, rows: 6 },
        { key: 'data.ctaKicker', label: 'CTA — kicker', type: 'text' },
        { key: 'data.ctaTitle', label: 'CTA — title', type: 'text', wide: true },
        { key: 'data.ctaItalicWord', label: 'CTA — italic part', type: 'text' },
      ]}
    />
  )
}
