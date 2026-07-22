'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function SectionsAdminPage() {
  return (
    <CollectionEditor
      collection="sections"
      title="Sections"
      description="Flexible per-page content blocks."
      itemDisplay={(i) => `${i.key} — ${i.pageSlug}`}
      itemSubtitle={(i) => i.type}
      newItemDefaults={{ pageSlug: 'home', key: '', type: 'hero', enabled: true, order: 0, data: {} }}
      fields={[
        { key: 'pageSlug', label: 'Page slug', type: 'text' },
        { key: 'key', label: 'Section key', type: 'text' },
        { key: 'type', label: 'Type', type: 'text' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'enabled', label: 'Enabled', type: 'boolean' },
        { key: 'data', label: 'Data (JSON)', textarea: true, rows: 12, wide: true, help: 'Free-form JSON for section content.' },
      ]}
    />
  )
}
