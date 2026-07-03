import type { Config } from 'tailwindcss';

/**
 * Linear design system (adopted from getdesign.md/linear.app).
 * Indigo #5e6ad2 accent, layered near-black surfaces, hairline borders, Inter + JetBrains Mono,
 * 12px cards / 8px controls, medium (500) UI weight. Verdict colors are the score only.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Layered near-black surfaces (Linear)
        canvas: '#08090A',
        paper: '#08090A',
        surface: '#141516',
        'surface-alt': '#18191A',
        elevated: '#1C1D1F',
        ink: '#F7F8F8', // legacy alias: foreground
        // Foreground scale
        fg: '#F7F8F8',
        high: '#D0D6E0',
        muted: '#8A8F98',
        dim: '#62666D',
        // Hairlines
        hair: '#23252A',
        'hair-strong': '#34343A',
        // Accent: Linear indigo
        brand: {
          50: '#1A1B2E', // dark tint fill
          100: '#23264A',
          200: '#343A6B', // subtle borders
          600: '#828FFF', // light accent / hover-bright
          700: '#5E6AD2', // workhorse: buttons, links, accents
          800: '#4C56B8', // pressed
          DEFAULT: '#5E6AD2',
        },
        accent: '#5E6AD2',
        verdict: {
          good: '#27A644',
          'good-graphic': '#3FB950',
          mid: '#E2A336',
          'mid-graphic': '#E2A336',
          low: '#EB5757',
          'low-graphic': '#EB5757',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 1px 2px 0 rgb(0 0 0 / 0.4)',
        lift: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 16px 40px -20px rgb(0 0 0 / 0.7)',
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
