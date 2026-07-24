'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function LegalAdminPage() {
  return (
    <CollectionEditor
      collection="legal_pages"
      title="Legal Pages"
      description="Privacy Policy and Terms of Service. Saving with the same key updates the existing page (no duplicates)."
      itemDisplay={(i) => i.title || i.key || 'Untitled'}
      itemSubtitle={(i) => `key: ${i.key || '—'}`}
      newItemDefaults={{ key: '', title: '', lastUpdated: '', sections: [], seoDescription: '', published: true }}
      fields={[
        { key: 'key', label: 'Key (unique)', type: 'text', help: "e.g. 'privacy' or 'terms' — saving upserts by this key" },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'lastUpdated', label: 'Last updated', type: 'text', help: 'e.g. 22 July 2026' },
        { key: 'published', label: 'Published', type: 'boolean' },
        { key: 'seoDescription', label: 'SEO description', textarea: true, wide: true, rows: 2 },
        {
          key: 'sections', label: 'Sections', type: 'repeater', wide: true,
          itemFields: [
            { key: 'heading', label: 'Heading', type: 'text' },
            { key: 'body', label: 'Body', textarea: true, rows: 4 },
          ],
        },
      ]}
    />
  )
}
