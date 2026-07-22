'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function FooterAdminPage() {
  return (
    <CollectionEditor
      collection="footer"
      singleton
      title="Footer"
      description="Footer tagline, columns and copyright."
      fields={[
        { key: 'tagline', label: 'Big tagline', type: 'text', wide: true },
        { key: 'copyright', label: 'Copyright line', type: 'text', wide: true },
        { key: 'availability', label: 'Availability status', type: 'text' },
        { key: 'bottomNote', label: 'Bottom note', type: 'text', wide: true },
        { key: 'columns', label: 'Columns (JSON)', textarea: true, rows: 14, wide: true, help: 'Array of { heading, links: [{ label, href, external }] }' },
      ]}
    />
  )
}
