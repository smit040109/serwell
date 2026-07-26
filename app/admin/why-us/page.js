'use client'
import CollectionEditor from '@/components/admin/CollectionEditor'

export default function AdminWhyUsPage() {
  return (
    <CollectionEditor
      collection="page_content"
      keyed={{ key: 'why-us', defaults: { title: 'Why Us', data: {} } }}
      title="Why Us Page"
      description="Every headline, paragraph, stat and co-founder card on the /why-us page."
      fields={[
        // HERO
        { key: 'data.heroBadge', label: 'HERO — badge text', type: 'text' },
        { key: 'data.heroHeadline1', label: 'HERO — headline start', type: 'text', wide: true },
        { key: 'data.heroHeadlineItalic', label: 'HERO — headline italic part', type: 'text', wide: true },
        { key: 'data.heroSubtitle', label: 'HERO — subtitle', textarea: true, wide: true, rows: 4 },
        { key: 'data.heroStudioLine', label: 'HERO — bottom studio line', type: 'text' },

        // STATS
        { key: 'data.statsEyebrow', label: 'STATS — eyebrow', type: 'text', wide: true },
        { key: 'data.statsHeadline1', label: 'STATS — headline line 1', type: 'text' },
        { key: 'data.statsHeadline2', label: 'STATS — headline line 2', type: 'text' },
        { key: 'data.statsHeadlineItalic', label: 'STATS — italic part', type: 'text' },
        { key: 'data.stats', label: 'STATS — 4 cards', type: 'repeater', wide: true, itemFields: [
          { key: 'value', label: 'Number (e.g. 20)' },
          { key: 'suffix', label: 'Suffix (+, %, empty)' },
          { key: 'label', label: 'Bold label' },
          { key: 'sub', label: 'Subtext', textarea: true, rows: 2 },
        ]},

        // VISION & MISSION
        { key: 'data.visionEyebrow', label: 'VISION — section eyebrow', type: 'text' },
        { key: 'data.visionHeadline1', label: 'VISION — headline line 1', type: 'text' },
        { key: 'data.visionHeadlineItalic', label: 'VISION — italic word', type: 'text' },
        { key: 'data.visionHeadline2', label: 'VISION — headline line 2', type: 'text' },

        { key: 'data.visionSubEyebrow', label: 'VISION card — sub eyebrow', type: 'text' },
        { key: 'data.visionSubHeadline1', label: 'VISION card — headline line 1', type: 'text' },
        { key: 'data.visionSubHeadlineItalic', label: 'VISION card — italic line', type: 'text' },
        { key: 'data.visionBody', label: 'VISION card — body', textarea: true, wide: true, rows: 3 },
        { key: 'data.visionBullets', label: 'VISION — 3 bullets', type: 'stringlist', wide: true, rows: 3, help: 'One bullet per line.' },

        { key: 'data.missionSubEyebrow', label: 'MISSION card — sub eyebrow', type: 'text' },
        { key: 'data.missionSubHeadline1', label: 'MISSION card — headline line 1', type: 'text' },
        { key: 'data.missionSubHeadlineItalic', label: 'MISSION card — italic line', type: 'text' },
        { key: 'data.missionBody', label: 'MISSION card — body', textarea: true, wide: true, rows: 3 },
        { key: 'data.missionBullets', label: 'MISSION — 3 bullets', type: 'stringlist', wide: true, rows: 3 },
        { key: 'data.missionVideoUrl', label: 'MISSION — phone mockup video', type: 'media', mediaType: 'video', wide: true },

        // VALUES
        { key: 'data.valuesEyebrow', label: 'VALUES — eyebrow', type: 'text' },
        { key: 'data.valuesHeadline1', label: 'VALUES — headline line 1', type: 'text' },
        { key: 'data.valuesHeadlineItalic', label: 'VALUES — italic part', type: 'text' },
        { key: 'data.valuesHeadline2', label: 'VALUES — headline line 2', type: 'text' },
        { key: 'data.values', label: 'VALUES — 6 cards', type: 'repeater', wide: true, itemFields: [
          { key: 'title', label: 'Title' },
          { key: 'body', label: 'Body', textarea: true, rows: 3 },
        ]},

        // FOUNDERS
        { key: 'data.foundersEyebrow', label: 'FOUNDERS — eyebrow', type: 'text' },
        { key: 'data.foundersHeadline1', label: 'FOUNDERS — headline start', type: 'text' },
        { key: 'data.foundersHeadlineItalic', label: 'FOUNDERS — italic part', type: 'text' },
        { key: 'data.foundersHeadline2', label: 'FOUNDERS — headline end', type: 'text' },
        { key: 'data.foundersSubtitle', label: 'FOUNDERS — subtitle', textarea: true, wide: true, rows: 3 },
        { key: 'data.founders', label: 'FOUNDERS — 2 cards', type: 'repeater', wide: true, itemFields: [
          { key: 'photo', label: 'Photo URL', help: 'Pick or paste. Use Media Library to upload.' },
          { key: 'name', label: 'Name' },
          { key: 'title', label: 'Role (Co-Founder)' },
          { key: 'caption', label: 'Caption (specialty)' },
          { key: 'bio', label: 'Bio', textarea: true, rows: 5 },
          { key: 'tag', label: 'Floating tag (Building/Shipping)' },
        ]},

        // NEWSLETTER
        { key: 'data.newsletterEyebrow', label: 'NEWSLETTER — eyebrow', type: 'text' },
        { key: 'data.newsletterHeadline1', label: 'NEWSLETTER — headline start', type: 'text' },
        { key: 'data.newsletterHeadlineItalic', label: 'NEWSLETTER — italic part', type: 'text' },
        { key: 'data.newsletterHeadline2', label: 'NEWSLETTER — headline end', type: 'text' },
        { key: 'data.newsletterSubtitle', label: 'NEWSLETTER — subtitle', textarea: true, wide: true },
        { key: 'data.newsletterPlaceholder', label: 'NEWSLETTER — email placeholder', type: 'text' },
      ]}
    />
  )
}
