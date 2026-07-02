import type { Config } from 'tailwindcss';

/**
 * GEO Studio tokens: warm ink on warm paper, one teal accent (teal-700 workhorse,
 * teal-600 for large graphics), verdict colors reserved for the score only.
 * Warm grays come from Tailwind's `stone` scale; `slate` is not used.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14110F',
        paper: '#FAF8F4',
        surface: '#FFFFFF',
        'surface-alt': '#F3EFE9',
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          DEFAULT: '#0F766E',
        },
        verdict: {
          good: '#047857',
          'good-graphic': '#059669',
          mid: '#B45309',
          'mid-graphic': '#D97706',
          low: '#BE123C',
          'low-graphic': '#E11D48',
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
        card: '0 1px 2px 0 rgb(20 17 15 / 0.04), 0 8px 24px -12px rgb(20 17 15 / 0.10)',
        lift: '0 1px 2px 0 rgb(20 17 15 / 0.05), 0 14px 32px -14px rgb(20 17 15 / 0.16)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'sov-grow': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--sov, 60%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.22,0.61,0.36,1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
