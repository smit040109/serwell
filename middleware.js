import { NextResponse } from 'next/server'

/**
 * Edge middleware:
 *   - Forces HTTPS on production hosts (vayucodes.com / www).
 *   - Preview / localhost hosts are left alone so the Emergent
 *     preview iframe and local dev keep working.
 *
 * We check x-forwarded-proto because the app runs behind a proxy
 * (Kubernetes ingress) that terminates TLS upstream.
 */

const PROD_HOSTS = new Set([
  'vayucodes.com',
  'www.vayucodes.com',
])

export function middleware(request) {
  const { nextUrl } = request
  const host = (request.headers.get('host') || '').toLowerCase()
  const proto = request.headers.get('x-forwarded-proto') || nextUrl.protocol.replace(':', '')

  // HTTPS redirect — only for production hosts and only when the
  // incoming request was clearly plain HTTP.
  if (PROD_HOSTS.has(host) && proto === 'http') {
    const httpsUrl = new URL(nextUrl.toString())
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl, 308)
  }

  return NextResponse.next()
}

export const config = {
  // Skip static assets and Next internals to avoid unnecessary work.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-|apple-icon|site.webmanifest|brand/|videos/|video/|images/|uploads/|team/|draco/).*)',
  ],
}
