/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      // ============================================================
      // SCALE.COM DESIGN TOKENS (from tokens.json)
      // ============================================================
      colors: {
        // Scale.com palette (canonical names)
        'pure-white': '#ffffff',
        'obsidian': '#000000',
        'soft-mist': '#f2f2f2',
        'pale-stone': '#eaeaea',
        'bone': '#e5e5e5',
        'graphite': '#575757',
        'smoke': '#929292',
        'charcoal': '#212121',
        'silhouette': '#c7c7c7',
        'warm-sandstone': '#a8927c',
        'forest-sovereignty': '#193a29',
        'dusty-iris': '#79648c',
        'slate-blue': '#839cb2',

        // VayuCodes brand palette (from Shared.js COLORS)
        'vc-ink': '#0E0E10',
        'vc-bone': '#F4F1EA',
        'vc-ember': '#E85D2C',
        'vc-amber': '#FF8A3D',
        'vc-cream': '#FFD9B8',
        'vc-ash': '#3A3A3A',
        'vc-mist': '#A8A29E',

        // Legacy shadcn tokens preserved for existing pages
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      fontFamily: {
        // Aeonik substitute (Manrope has closest geometric restraint)
        aeonik: ['var(--font-aeonik)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Scale.com type scale
        'micro': ['11px', { lineHeight: '1', letterSpacing: '0.05em' }],
        'caption': ['13px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'caps': ['14px', { lineHeight: '1.4', letterSpacing: '0.025em' }],
        'body': ['16px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'body-lg': ['20px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'sub': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h-feature': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h-sub': ['36px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'h-section': ['40px', { lineHeight: '1.10', letterSpacing: '-0.01em' }],
        'h-hero': ['64px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'h-display': ['116px', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      spacing: {
        // 4px base unit
        'gap-el': '16px',
        'gap-card': '32px',
        'gap-section': '64px',
        'gap-band': '96px',
      },
      borderRadius: {
        // Scale.com radius system
        'tag': '8px',
        'btn': '8px',
        'card-nest': '12px',
        'card': '16px',
        'panel': '24px',
        // Legacy
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      maxWidth: {
        'page': '1280px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'scroll-pulse': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(4px)', opacity: '1' }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'scroll-pulse': 'scroll-pulse 1.8s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
