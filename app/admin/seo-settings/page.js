'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function SeoAdminPage() {
  return (
    <CollectionEditor
      collection="seo_settings"
      singleton
      title="SEO Settings"
      description="Site-wide SEO defaults & analytics IDs."
      fields={[
        { key: 'defaultTitle', label: 'Default title', type: 'text', wide: true },
        { key: 'titleTemplate', label: 'Title template', type: 'text', help: 'Use %s for the page title.' },
        { key: 'defaultDescription', label: 'Default description', textarea: true, wide: true },
        { key: 'defaultOgImage', label: 'OG image URL', type: 'text', wide: true },
        { key: 'twitterHandle', label: 'Twitter handle', type: 'text' },
        { key: 'robots', label: 'Robots directive', type: 'text' },
        { key: 'gaId', label: 'Google Analytics ID', type: 'text' },
        { key: 'gtmId', label: 'GTM ID', type: 'text' },
      ]}
    />
  )
}
