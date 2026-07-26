'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function AdminContactPage() {
  return (
    <CollectionEditor
      collection="page_content"
      keyed={{ key: 'contact', defaults: { title: 'Contact', data: {} } }}
      title="Contact Page (Copy)"
      description="Text/labels for the Contact page. Email addresses, phones, office hours go in 'Contact Settings'. FAQ items go in 'FAQ'."
      fields={[
        { key: 'data.heroBadge', label: 'HERO — badge (top pill)', type: 'text' },
        { key: 'data.emailChannelLabel', label: 'Card label — Email', type: 'text' },
        { key: 'data.officeHoursLabel', label: 'Card label — Office hours', type: 'text' },
        { key: 'data.locationLabel', label: 'Card label — Location', type: 'text' },
        { key: 'data.locationValue', label: 'Location value', type: 'text' },
        { key: 'data.formEyebrow', label: 'FORM — eyebrow', type: 'text' },
        { key: 'data.formSubmitLabel', label: 'FORM — submit button', type: 'text' },
        { key: 'data.formConsent', label: 'FORM — consent line', type: 'text', wide: true },
        { key: 'data.formSuccess', label: 'FORM — success message', type: 'text', wide: true },
        { key: 'data.formPlaceholders.name', label: 'FORM placeholder — Name', type: 'text' },
        { key: 'data.formPlaceholders.email', label: 'FORM placeholder — Email', type: 'text' },
        { key: 'data.formPlaceholders.phone', label: 'FORM placeholder — Phone', type: 'text' },
        { key: 'data.formPlaceholders.business', label: 'FORM placeholder — Business', type: 'text' },
        { key: 'data.formPlaceholders.message', label: 'FORM placeholder — Message', textarea: true, wide: true },
        { key: 'data.faqEyebrow', label: 'FAQ — eyebrow', type: 'text' },
        { key: 'data.faqHeadline1', label: 'FAQ — headline line 1', type: 'text' },
        { key: 'data.faqHeadlineItalic', label: 'FAQ — italic part', type: 'text' },
      ]}
    />
  )
}
