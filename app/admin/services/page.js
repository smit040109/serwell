'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function ServicesAdminPage() {
  return (
    <CollectionEditor
      collection="services"
      title="Services"
      description="What we offer — shown on marketing & homepage."
      itemDisplay={(i) => i.title}
      itemSubtitle={(i) => i.category}
      newItemDefaults={{ title: '', slug: '', category: 'engineering', published: true, order: 0 }}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'slug', label: 'Slug', type: 'text' },
        { key: 'category', label: 'Category', type: 'select', options: [
          { value: 'engineering', label: 'Engineering' },
          { value: 'design', label: 'Design' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'strategy', label: 'Strategy' },
        ]},
        { key: 'icon', label: 'Icon (lucide name)', type: 'text' },
        { key: 'tagline', label: 'Tagline', type: 'text', wide: true },
        { key: 'description', label: 'Description', textarea: true, rows: 4, wide: true },
        { key: 'image', label: 'Image URL', type: 'text', wide: true },
        { key: 'published', label: 'Published', type: 'boolean' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
    />
  )
}
