'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function TestimonialsAdminPage() {
  return (
    <CollectionEditor
      collection="testimonials"
      title="Testimonials"
      description="Client quotes shown across the site."
      itemDisplay={(i) => i.author}
      itemSubtitle={(i) => `${i.role || ''} · ${i.company || ''}`}
      newItemDefaults={{ quote: '', author: '', rating: 5, published: true, featured: false, order: 0 }}
      fields={[
        { key: 'quote', label: 'Quote', textarea: true, rows: 4, wide: true },
        { key: 'author', label: 'Author', type: 'text' },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'avatar', label: 'Avatar URL', type: 'text', wide: true },
        { key: 'rating', label: 'Rating (1-5)', type: 'number' },
        { key: 'featured', label: 'Featured', type: 'boolean' },
        { key: 'published', label: 'Published', type: 'boolean' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
    />
  )
}
