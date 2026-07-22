'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function PortfolioAdminPage() {
  return (
    <CollectionEditor
      collection="portfolio_projects"
      title="Portfolio Projects"
      description="Selected work shown on /our-work and homepage carousel."
      itemDisplay={(i) => i.title}
      itemSubtitle={(i) => `${i.category || ''} · ${i.year || ''}`}
      newItemDefaults={{ title: '', slug: '', category: '', themeColor: '#0A0A0A', accentTextColor: '#FFFFFF', published: true, featured: false, order: 0 }}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'slug', label: 'Slug', type: 'text', help: 'URL-friendly, e.g. servall-lt' },
        { key: 'client', label: 'Client', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'industry', label: 'Industry', type: 'text' },
        { key: 'year', label: 'Year', type: 'number' },
        { key: 'summary', label: 'Summary', textarea: true, wide: true },
        { key: 'description', label: 'Description', textarea: true, rows: 6, wide: true },
        { key: 'coverImage', label: 'Cover image URL', type: 'text', wide: true },
        { key: 'themeColor', label: 'Theme background color', type: 'color', help: 'Used in scrolling carousel to color the section.' },
        { key: 'accentTextColor', label: 'Text color on theme', type: 'color' },
        { key: 'liveUrl', label: 'Live URL', type: 'text' },
        { key: 'featured', label: 'Featured', type: 'boolean' },
        { key: 'published', label: 'Published', type: 'boolean' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
    />
  )
}
