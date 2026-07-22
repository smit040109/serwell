'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function ContactAdminPage() {
  return (
    <CollectionEditor
      collection="contact_settings"
      singleton
      title="Contact Settings"
      description="Contact page content and channels."
      fields={[
        { key: 'ctaHeadline', label: 'CTA headline', type: 'text', wide: true },
        { key: 'ctaSubtitle', label: 'CTA subtitle', textarea: true, wide: true },
        { key: 'officeHours', label: 'Office hours', type: 'text' },
        { key: 'responseTime', label: 'Response time', type: 'text' },
        { key: 'mapEmbedUrl', label: 'Map embed URL', type: 'text', wide: true },
        { key: 'socials.linkedin', label: 'LinkedIn URL', type: 'text' },
        { key: 'socials.twitter', label: 'Twitter URL', type: 'text' },
        { key: 'socials.instagram', label: 'Instagram URL', type: 'text' },
        { key: 'socials.whatsapp', label: 'WhatsApp URL', type: 'text' },
      ]}
    />
  )
}
