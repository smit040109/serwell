/**
 * Server-side IP geolocation via ip-api.com (free, no key needed).
 *   - 45 req/min per IP soft limit — we cache aggressively.
 *   - Returns {country, region, city, org} or {} on failure.
 *
 * Cache is process-local (Map) with 24h TTL. Fine for MVP scale.
 */

const CACHE = new Map() // ip -> { data, expires }
const TTL_MS = 24 * 60 * 60 * 1000
const PRIVATE_RE = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|127\.|::1|fc00:|fe80:)/i

export async function geolocateIp(ip) {
  if (!ip || ip === 'unknown' || PRIVATE_RE.test(ip)) {
    return { country: '', region: '', city: '' }
  }
  const now = Date.now()
  const hit = CACHE.get(ip)
  if (hit && hit.expires > now) return hit.data

  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2500)
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp`,
      { signal: ctrl.signal }
    )
    clearTimeout(t)
    if (!res.ok) throw new Error('ipapi ' + res.status)
    const j = await res.json()
    if (j.status !== 'success') throw new Error('ipapi fail')
    const data = {
      country: j.country || '',
      region: j.regionName || '',
      city: j.city || '',
      isp: j.isp || '',
    }
    CACHE.set(ip, { data, expires: now + TTL_MS })
    return data
  } catch {
    const data = { country: '', region: '', city: '' }
    CACHE.set(ip, { data, expires: now + 5 * 60 * 1000 }) // short negative-cache
    return data
  }
}
