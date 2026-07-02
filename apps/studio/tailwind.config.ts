import type { Config } from 'tailwindcss';

/**
 * GEO Studio, dark editorial-tech. Near-black canvas, hairline borders, one electric teal
 * accent (bright on dark; buttons use dark text on the bright accent). Verdict colors are
 * reserved for the score only. Semantic token names so the theme is cohesive.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces (kept legacy names so existing bg-paper/bg-surface map to dark)
        canvas: '#09090B',
        paper: '#09090B',
        surface: '#141417',
        'surface-alt': '#19191D',
        elevated: '#1F1F24',
        ink: '#FAFAFA', // legacy alias: now the foreground
        // Foreground scale
        fg: '#FAFAFA',
        muted: '#A1A1AA',
        dim: '#71717A',
        // Hairlines
        hair: '#26262B',
        'hair-strong': '#3A3A42',
        // One electric accent (teal), tuned for dark
        brand: {
          50: '#04211E', // dark tint fill
          100: '#0A3D37',
          200: '#115E56', // subtle borders
          600: '#5EEAD4', // large graphics / hover-light
          700: '#2DD4BF', // workhorse: links, accents, button fill
          800: '#14B8A6', // pressed
          DEFAULT: '#2DD4BF',
        },
        accent: '#2DD4BF',
        verdict: {
          good: '#34D399',
          'good-graphic': '#34D399',
          mid: '#FBBF24',
          'mid-graphic': '#FBBF24',
          low: '#FB7185',
          'low-graphic': '#FB7185',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 1px 2px 0 rgb(0 0 0 / 0.4)',
        lift: '0 1px 0 0 rgb(255 255 255 / 0.05) inset, 0 20px 50px -24px rgb(0 0 0 / 0.7)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'sov-grow': { '0%': { width: '0%' }, '100%': { width: 'var(--sov, 60%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,0.61,0.36,1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
