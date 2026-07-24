'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function PageContentAdminPage() {
  return (
    <CollectionEditor
      collection="page_content"
      title="Page Content"
      description="Flexible per-page content blocks (why-us, digital-marketing). Saving with the same key updates the existing document."
      itemDisplay={(i) => i.title || i.key || 'Untitled'}
      itemSubtitle={(i) => `key: ${i.key || '—'}`}
      newItemDefaults={{ key: '', title: '', data: {}, published: true }}
      fields={[
        { key: 'key', label: 'Key (unique)', type: 'text', help: "e.g. 'why-us' or 'digital-marketing'" },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'published', label: 'Published', type: 'boolean' },
        { key: 'data', label: 'Content data (JSON)', type: 'json', wide: true, rows: 14, help: 'Flexible JSON consumed by the page. Invalid JSON is not saved.' },
      ]}
    />
  )
}
