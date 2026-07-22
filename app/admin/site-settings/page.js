'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function SiteSettingsPage() {
  return (
    <CollectionEditor
      collection="site_settings"
      singleton
      title="Site Settings"
      description="Global brand, theme, fonts and hero video."
      fields={[
        { key: 'siteName', label: 'Site name', type: 'text' },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'location', label: 'Location text', type: 'text', help: 'e.g. India · Worldwide' },
        { key: 'emailPrimary', label: 'Primary email', type: 'email' },
        { key: 'phonePrimary', label: 'Primary phone', type: 'text' },
        { key: 'availability', label: 'Availability text', type: 'text' },
        { key: 'logoLightUrl', label: 'Logo (light bg)', type: 'text' },
        { key: 'logoDarkUrl', label: 'Logo (dark bg)', type: 'text' },
        { key: 'theme.ink', label: 'Ink (text) color', type: 'color' },
        { key: 'theme.bg', label: 'Background color', type: 'color' },
        { key: 'theme.muted', label: 'Muted color', type: 'color' },
        { key: 'theme.line', label: 'Line color', type: 'color' },
        { key: 'fonts.display', label: 'Display font', type: 'text' },
        { key: 'fonts.body', label: 'Body font', type: 'text' },
        { key: 'socials.linkedin', label: 'LinkedIn URL', type: 'text' },
        { key: 'socials.twitter', label: 'Twitter URL', type: 'text' },
        { key: 'socials.instagram', label: 'Instagram URL', type: 'text' },
        { key: 'socials.github', label: 'Github URL', type: 'text' },
        { key: 'hero.headlineLine1', label: 'Hero headline', type: 'text', wide: true },
        { key: 'hero.headlineItalicWord', label: 'Italic emphasis word', type: 'text' },
        { key: 'hero.subtitle', label: 'Hero subtitle', textarea: true, wide: true },
        { key: 'hero.videoUrl', label: 'Hero video URL', type: 'text', wide: true, help: 'Upload in Media Library first, then paste the URL. Video will auto-loop.' },
        { key: 'hero.videoEnabled', label: 'Show hero video', type: 'boolean' },
        { key: 'hero.videoLoop', label: 'Loop video', type: 'boolean' },
        { key: 'hero.videoMaxSeconds', label: 'Max seconds (loop)', type: 'number' },
      ]}
    />
  )
}
