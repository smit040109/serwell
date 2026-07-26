'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function ContactAdminPage() {
  return (
    <CollectionEditor
      collection="contact_settings"
      singleton
      title="Contact Settings"
      description="Emails, phones, office hours & social channels — used on the Contact page & across the site (mailto: links)."
      fields={[
        { key: 'ctaHeadline', label: 'CTA headline', type: 'text', wide: true },
        { key: 'ctaSubtitle', label: 'CTA subtitle', textarea: true, wide: true, rows: 3 },
        { key: 'emails', label: 'Email addresses (one per line)', type: 'stringlist', wide: true, rows: 4, help: 'Every email listed here becomes a clickable mailto card on the Contact page.' },
        { key: 'phones', label: 'Phone numbers (one per line)', type: 'stringlist', wide: true, rows: 3 },
        { key: 'addressLines', label: 'Address lines (one per line)', type: 'stringlist', wide: true, rows: 3 },
        { key: 'officeHours', label: 'Office hours', type: 'text', wide: true },
        { key: 'responseTime', label: 'Response time text', type: 'text', wide: true },
        { key: 'mapEmbedUrl', label: 'Map embed URL', type: 'text', wide: true },
        { key: 'socials.linkedin', label: 'LinkedIn URL', type: 'text' },
        { key: 'socials.twitter', label: 'Twitter URL', type: 'text' },
        { key: 'socials.instagram', label: 'Instagram URL', type: 'text' },
        { key: 'socials.whatsapp', label: 'WhatsApp URL', type: 'text' },
      ]}
    />
  )
}
