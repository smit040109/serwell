'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminShell from '@/components/admin/AdminShell'
import { MediaInput } from '@/components/admin/MediaPicker'

/*
 * Combined Contact editor:
 * - Renders ONE form with fields from BOTH contact_settings (emails, phones, hours, address, socials)
 *   AND page_content 'contact' (form labels, hero badge, form placeholders).
 * - Saves to both collections in one click.
 */

const CONTACT_FIELDS = [
  // === CONTACT INFO (contact_settings) ===
  { section: 'Contact Info (used across the site)' },
  { key: 'settings.emails', label: 'Email addresses (one per line)', type: 'stringlist', rows: 4,
    help: 'Every email here becomes a clickable mailto card on the Contact page & is used across the site.' },
  { key: 'settings.phones', label: 'Phone numbers (one per line)', type: 'stringlist', rows: 3 },
  { key: 'settings.addressLines', label: 'Address lines (one per line)', type: 'stringlist', rows: 3 },
  { key: 'settings.officeHours', label: 'Office hours', type: 'text' },
  { key: 'settings.responseTime', label: 'Response time text', type: 'text' },
  { key: 'settings.mapEmbedUrl', label: 'Map embed URL', type: 'text', wide: true },
  { key: 'settings.ctaHeadline', label: 'CTA headline (big serif line on top)', type: 'text', wide: true },
  { key: 'settings.ctaSubtitle', label: 'CTA subtitle', type: 'textarea', rows: 3, wide: true },
  { key: 'settings.socials.linkedin', label: 'LinkedIn URL', type: 'text' },
  { key: 'settings.socials.twitter', label: 'Twitter URL', type: 'text' },
  { key: 'settings.socials.instagram', label: 'Instagram URL', type: 'text' },
  { key: 'settings.socials.whatsapp', label: 'WhatsApp URL', type: 'text' },

  // === PAGE COPY (page_content 'contact') ===
  { section: 'Contact Page — Text / Labels' },
  { key: 'page.heroBadge', label: 'HERO — badge (top pill)', type: 'text' },
  { key: 'page.emailChannelLabel', label: 'Card label — Email (above the address)', type: 'text' },
  { key: 'page.officeHoursLabel', label: 'Card label — Office hours', type: 'text' },
  { key: 'page.locationLabel', label: 'Card label — Location', type: 'text' },
  { key: 'page.locationValue', label: 'Location value (e.g. India · Worldwide)', type: 'text' },
  { key: 'page.formEyebrow', label: 'FORM — eyebrow', type: 'text' },
  { key: 'page.formSubmitLabel', label: 'FORM — submit button label', type: 'text' },
  { key: 'page.formConsent', label: 'FORM — consent line', type: 'text', wide: true },
  { key: 'page.formSuccess', label: 'FORM — success message', type: 'text', wide: true },
  { key: 'page.formPlaceholders.name', label: 'FORM placeholder — Name', type: 'text' },
  { key: 'page.formPlaceholders.email', label: 'FORM placeholder — Email', type: 'text' },
  { key: 'page.formPlaceholders.phone', label: 'FORM placeholder — Phone', type: 'text' },
  { key: 'page.formPlaceholders.business', label: 'FORM placeholder — Business', type: 'text' },
  { key: 'page.formPlaceholders.message', label: 'FORM placeholder — Message', type: 'textarea', rows: 2, wide: true },
  { key: 'page.faqEyebrow', label: 'FAQ — eyebrow', type: 'text' },
  { key: 'page.faqHeadline1', label: 'FAQ — headline line 1', type: 'text' },
  { key: 'page.faqHeadlineItalic', label: 'FAQ — italic part', type: 'text' },
]

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}
function setPath(obj, path, value) {
  const keys = path.split('.')
  const next = { ...obj }
  let cur = next
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    cur[k] = { ...(cur[k] || {}) }
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
  return next
}

function TextInput({ value, onChange, placeholder, textarea, rows }) {
  const Cmp = textarea ? 'textarea' : 'input'
  return (
    <Cmp value={value ?? ''} rows={rows}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className={`w-full rounded-md bg-black/40 border border-white/12 focus:border-white/30 focus:ring-2 focus:ring-white/8 outline-none px-3 py-2 text-sm text-white placeholder:text-white/25 transition ${textarea ? 'font-mono resize-y' : ''}`} />
  )
}

function StringList({ value, onChange, rows = 4 }) {
  const text = Array.isArray(value) ? value.join('\n') : (value || '')
  return (
    <textarea value={text} rows={rows}
              onChange={(e) => onChange(e.target.value.split('\n').map(x => x).filter(x => x !== undefined))}
              placeholder="One per line"
              className="w-full rounded-md bg-black/40 border border-white/12 focus:border-white/30 focus:ring-2 focus:ring-white/8 outline-none px-3 py-2 text-sm text-white placeholder:text-white/25 transition font-mono resize-y" />
  )
}

export default function AdminContactPage() {
  const { apiFetch } = useAdmin() || {}
  const [state, setState] = useState({ settings: {}, page: {} })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [s, p] = await Promise.all([
        apiFetch(`/api/cms/contact_settings`).catch(() => ({ data: {} })),
        apiFetch(`/api/cms/page_content/contact`).catch(() => ({ data: { data: {} } })),
      ])
      const settings = s?.data || {}
      const page = p?.data?.data || {}
      setState({ settings, page })
    } catch (e) {
      setMsg('Load failed: ' + e.message)
    }
    setLoading(false)
  }, [apiFetch])

  useEffect(() => { load() }, [load])

  const getField = (path) => {
    // path is like 'settings.emails' or 'page.heroBadge' or 'settings.socials.linkedin'
    const [root, ...rest] = path.split('.')
    return getPath(state[root] || {}, rest.join('.'))
  }
  const updateField = (path, val) => {
    const [root, ...rest] = path.split('.')
    setState(prev => ({ ...prev, [root]: setPath(prev[root] || {}, rest.join('.'), val) }))
  }

  async function save() {
    setSaving(true)
    setMsg('')
    try {
      await apiFetch(`/api/cms/contact_settings`, { method: 'POST', body: JSON.stringify(state.settings) })
      await apiFetch(`/api/cms/page_content`, { method: 'POST', body: JSON.stringify({ key: 'contact', title: 'Contact', data: state.page }) })
      setMsg('Saved ✓')
      await load()
    } catch (e) {
      setMsg('Error: ' + e.message)
    }
    setSaving(false)
  }

  return (
    <AdminShell
      title="Contact Page"
      description="Everything on the Contact page — emails, phones, office hours, headlines, form labels, FAQ text — all in one place."
      action={
        <button onClick={save} disabled={saving || loading}
                className="inline-flex items-center gap-2 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded-md hover:bg-white/90 disabled:opacity-50 transition">
          {saving ? 'Saving…' : 'Save all'}
        </button>
      }
    >
      {loading ? (
        <div className="text-white/50 text-sm">Loading…</div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            {CONTACT_FIELDS.map((f, i) => {
              if (f.section) {
                return (
                  <div key={'s-' + i} className="md:col-span-2 mt-4 mb-2 pb-2 border-b border-white/10">
                    <div className="text-[11px] tracking-[0.25em] uppercase text-white/70 font-semibold">{f.section}</div>
                  </div>
                )
              }
              const val = getField(f.key)
              return (
                <div key={f.key} className={f.wide ? 'md:col-span-2' : ''}>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">{f.label}</label>
                  {f.type === 'stringlist' ? (
                    <StringList value={val} onChange={(v) => updateField(f.key, v)} rows={f.rows} />
                  ) : f.type === 'textarea' ? (
                    <TextInput value={val} onChange={(v) => updateField(f.key, v)} textarea rows={f.rows || 3} />
                  ) : f.type === 'media' ? (
                    <MediaInput value={val} onChange={(v) => updateField(f.key, v)} mediaType={f.mediaType} />
                  ) : (
                    <TextInput value={val} onChange={(v) => updateField(f.key, v)} />
                  )}
                  {f.help && <div className="text-[10px] text-white/40 mt-1">{f.help}</div>}
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/8 flex items-center justify-between">
            <div className="text-xs text-white/50">{msg}</div>
            <button onClick={save} disabled={saving}
                    className="inline-flex items-center gap-2 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase px-6 py-2.5 rounded-md hover:bg-white/90 disabled:opacity-50 transition">
              {saving ? 'Saving…' : 'Save all'}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
