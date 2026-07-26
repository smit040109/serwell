import { NextResponse } from 'next/server'

const PROD_HOSTS = new Set([
  'vayucodes.com',
  'www.vayucodes.com',
])

export function middleware(request) {
  const { nextUrl } = request
  const host = (request.headers.get('host') || '').toLowerCase()
  const proto = request.headers.get('x-forwarded-proto') || nextUrl.protocol.replace(':', '')

  if (PROD_HOSTS.has(host) && proto === 'http') {
    const httpsUrl = new URL(nextUrl.pathname + nextUrl.search, `https://${host}`)
    const response = NextResponse.redirect(httpsUrl, 307)
    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-|apple-icon|site.webmanifest|brand/|videos/|video/|images/|uploads/|team/|draco/).*)',
  ],
}
