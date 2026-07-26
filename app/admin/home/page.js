'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function AdminHomePage() {
  return (
    <CollectionEditor
      collection="page_content"
      keyed={{ key: 'home', defaults: { title: 'Home', data: {} } }}
      title="Home Page"
      description="Edit every text, image and video visible on the homepage."
      fields={[
        { key: 'title', label: 'Page label (internal)', type: 'text' },

        // HERO
        { key: 'data.heroLine1', label: 'HERO — headline (line 1)', type: 'text', wide: true, help: 'Big serif line at the top. The rotating word ("digital systems / AI workflows / ...") comes from Site Settings → Hero rotating words.' },
        { key: 'data.heroSubtitle', label: 'HERO — subtitle', textarea: true, wide: true, rows: 3 },
        { key: 'data.heroVideoUrl', label: 'HERO — desktop video', type: 'media', mediaType: 'video', wide: true, help: 'Full-bleed cinematic video behind the hero on DESKTOP / tablet. Upload/pick from Media Library.' },
        { key: 'data.heroVideoUrlMobile', label: 'HERO — mobile video (optional)', type: 'media', mediaType: 'video', wide: true, help: 'Alternate video shown ONLY on mobile (< 768px). Leave empty to use desktop video everywhere. Recommend vertical 9:16 for best mobile framing.' },
        { key: 'data.heroVideoEnabled', label: 'HERO — show video?', type: 'boolean' },

        // HOW WE WORK
        { key: 'data.howWeWorkEyebrow', label: 'HOW WE WORK — eyebrow', type: 'text' },
        { key: 'data.howWeWorkHeadline1', label: 'HOW WE WORK — headline start', type: 'text' },
        { key: 'data.howWeWorkHeadlineItalic', label: 'HOW WE WORK — italic part', type: 'text' },
        { key: 'data.howWeWorkSubtitle', label: 'HOW WE WORK — subtitle', textarea: true, wide: true },

        // SELECTED WORK
        { key: 'data.selectedWorkEyebrow', label: 'SELECTED WORK — eyebrow', type: 'text' },
        { key: 'data.selectedWorkHeadline1', label: 'SELECTED WORK — headline start', type: 'text' },
        { key: 'data.selectedWorkHeadlineItalic', label: 'SELECTED WORK — italic part', type: 'text' },
      ]}
    />
  )
}
