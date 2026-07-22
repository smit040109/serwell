'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function TeamAdminPage() {
  return (
    <CollectionEditor
      collection="team_members"
      title="Team Members"
      description="Co-founders and team."
      itemDisplay={(i) => i.name}
      itemSubtitle={(i) => i.role}
      newItemDefaults={{ name: '', role: 'Co-Founder', published: true, isCoFounder: true, order: 0 }}
      fields={[
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'caption', label: 'Caption', type: 'text', wide: true },
        { key: 'bio', label: 'Bio', textarea: true, rows: 5, wide: true },
        { key: 'photo', label: 'Photo URL', type: 'text', wide: true },
        { key: 'socials.linkedin', label: 'LinkedIn', type: 'text' },
        { key: 'socials.twitter', label: 'Twitter', type: 'text' },
        { key: 'socials.email', label: 'Email', type: 'text' },
        { key: 'isCoFounder', label: 'Co-Founder', type: 'boolean' },
        { key: 'published', label: 'Published', type: 'boolean' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
    />
  )
}
