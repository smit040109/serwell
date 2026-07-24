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
        { key: 'hero.videoUrl', label: 'Hero video', type: 'media', mediaType: 'video', wide: true, help: 'Pick from Media Library or paste a URL. Video will auto-loop.' },
        { key: 'hero.videoEnabled', label: 'Show hero video', type: 'boolean' },
        { key: 'hero.videoLoop', label: 'Loop video', type: 'boolean' },
        { key: 'hero.videoMaxSeconds', label: 'Max seconds (loop)', type: 'number' },
        { key: 'rotatingWords', label: 'Hero rotating words', type: 'stringlist', wide: true, rows: 5, help: 'One word/phrase per line — cycles in the hero headline.' },
        { key: 'closingStatement', label: 'Closing statement', textarea: true, wide: true, rows: 2, help: 'Big statement at the bottom of the homepage. Text after the first "?" renders italic.' },
        { key: 'preloaderText', label: 'Preloader bottom text', type: 'text', wide: true, help: 'Small caption at the bottom of the loading screen.' },
        { key: 'introTypewriterText', label: 'Intro typewriter text', type: 'text', wide: true, help: 'Typed out over the cinematic intro video.' },
        { key: 'cinematicVideoUrl', label: 'Cinematic intro video', type: 'media', mediaType: 'video', wide: true, help: 'The full-screen intro video shown on first visit. Pick from Media Library.' },
        { key: 'cinematicPosterUrl', label: 'Cinematic poster image', type: 'media', mediaType: 'image', wide: true, help: 'Shown while the intro video buffers.' },
        { key: 'cinematicEnabled', label: 'Cinematic intro enabled', type: 'boolean' },
      ]}
    />
  )
}
