'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function PagesAdminPage() {
  return (
    <CollectionEditor
      collection="pages"
      title="Pages"
      description="Page-level SEO and status."
      itemDisplay={(i) => i.title}
      itemSubtitle={(i) => i.slug}
      newItemDefaults={{ slug: '', title: '', status: 'published', order: 0 }}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'slug', label: 'Slug', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ]},
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'seo.title', label: 'SEO title', type: 'text', wide: true },
        { key: 'seo.description', label: 'SEO description', textarea: true, wide: true },
        { key: 'seo.ogImage', label: 'OG image URL', type: 'text', wide: true },
      ]}
    />
  )
}
