'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function FaqAdminPage() {
  return (
    <CollectionEditor
      collection="faq_items"
      title="FAQ"
      description="Frequently asked questions shown on the contact page."
      itemDisplay={(i) => i.question || 'Untitled'}
      itemSubtitle={(i) => i.category || ''}
      newItemDefaults={{ question: '', answer: '', category: 'general', order: 1, published: true }}
      fields={[
        { key: 'question', label: 'Question', type: 'text', wide: true },
        { key: 'answer', label: 'Answer', textarea: true, wide: true, rows: 5 },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'published', label: 'Published', type: 'boolean' },
      ]}
    />
  )
}
