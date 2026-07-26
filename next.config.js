const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    // Remove if not using Server Components
    serverComponentsExternalPackages: ['mongodb'],
  },
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  poweredByHeader: false,
  async headers() {
    // Security header set applied to every response.
    // Note: X-Frame-Options / frame-ancestors are permissive so the
    // Emergent preview iframe keeps working. Tighten to 'SAMEORIGIN'
    // on standalone hosting if you don't need the iframe embed.
    const securityHeaders = [
      // HSTS — force HTTPS for 2 years, include subdomains, preload.
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      // Prevent MIME sniffing.
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Legacy XSS filter (mostly for older browsers).
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      // Control referrer leakage.
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // Restrict powerful browser features by default.
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()' },
      // Iframe embedding — kept ALLOWALL for Emergent preview compatibility.
      { key: 'X-Frame-Options', value: 'ALLOWALL' },
      { key: 'Content-Security-Policy', value: 'frame-ancestors *;' },
      // Cross-origin isolation — safe defaults for a marketing site.
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
    ]

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: '/marketing', destination: '/digital-marketing', permanent: false },
    ];
  },
};

module.exports = nextConfig;
