'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function NavAdminPage() {
  return (
    <CollectionEditor
      collection="navigation"
      singleton
      title="Navigation"
      description="Top-nav menu items and CTA."
      fields={[
        { key: 'ctaLabel', label: 'CTA label', type: 'text' },
        { key: 'ctaHref', label: 'CTA link', type: 'text' },
        { key: 'ctaEnabled', label: 'Show CTA button', type: 'boolean' },
        { key: 'items', label: 'Menu items (JSON)', textarea: true, rows: 12, wide: true, help: 'Array of { label, href, order, external }' },
      ]}
    />
  )
}
