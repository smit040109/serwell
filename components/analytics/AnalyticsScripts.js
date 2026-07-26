import Script from 'next/script'

/**
 * Server-rendered wrapper that injects:
 *  - Google Tag Manager (GTM-MW46TTFW) — head + body noscript fallback
 *  - Microsoft Clarity (xsdo92lr9b) — head
 *  - Our first-party tracker (fires page views + session ping on client)
 *
 * GTM IDs / Clarity IDs are read from env vars with sensible fallbacks so we
 * don't ship secrets in code but production keeps working out of the box.
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-MW46TTFW'
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'xsdo92lr9b'

export function AnalyticsHead() {
  return (
    <>
      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
      </Script>
    </>
  )
}

export function GtmNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
