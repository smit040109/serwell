'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function HowWeWorkAdminPage() {
  return (
    <CollectionEditor
      collection="how_we_work_steps"
      title="How We Work — Steps"
      description="The 5-step process shown on the homepage. Pick an image per step from the Media Library."
      itemDisplay={(i) => `${String(i.stepNumber || 0).padStart(2, '0')} · ${i.title || 'Untitled'}`}
      itemSubtitle={(i) => i.accent || `Order ${i.order ?? 0}`}
      newItemDefaults={{ stepNumber: 1, title: '', description: '', image: '', accent: '', order: 1, published: true }}
      fields={[
        { key: 'stepNumber', label: 'Step number', type: 'number' },
        { key: 'order', label: 'Display order', type: 'number' },
        { key: 'title', label: 'Title', type: 'text', wide: true },
        { key: 'accent', label: 'Tag / accent label', type: 'text', help: 'Small label over the image, e.g. Discovery' },
        { key: 'published', label: 'Published', type: 'boolean' },
        { key: 'description', label: 'Description', textarea: true, wide: true, rows: 4 },
        { key: 'image', label: 'Step image', type: 'media', mediaType: 'image', wide: true, help: 'Click Browse to pick from the Media Library or upload a new image.' },
      ]}
    />
  )
}
