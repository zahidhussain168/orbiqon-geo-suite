import type { Config } from 'tailwindcss';

/**
 * Stripe design system (from getdesign.md / VoltAgent awesome-design-md).
 * Signature: weight-300 elegant type with negative tracking, a pastel gradient-mesh hero
 * backdrop (cream -> orange -> lavender -> indigo -> ruby), pill CTAs, one indigo (#533AFD)
 * per band, white cards with blue-tinted shadows, tabular figures on all numbers. Geist stands
 * in for Sohne. Ink #0D253D on white; canvas-soft #F6F9FC and cream #F5E9D4 section bands.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Every token is variable-driven so the whole palette flips on the `.dark` class.
        // Channel triplets (--ch-*) are defined in globals.css for light (:root) and dark (.dark).
        canvas: 'rgb(var(--ch-canvas) / <alpha-value>)',
        paper: 'rgb(var(--ch-canvas) / <alpha-value>)',
        surface: 'rgb(var(--ch-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--ch-surface-alt) / <alpha-value>)',
        elevated: 'rgb(var(--ch-elevated) / <alpha-value>)',
        cream: 'rgb(var(--ch-cream) / <alpha-value>)',
        ink: 'rgb(var(--ch-fg) / <alpha-value>)',
        fg: 'rgb(var(--ch-fg) / <alpha-value>)',
        high: 'rgb(var(--ch-high) / <alpha-value>)',
        muted: 'rgb(var(--ch-muted) / <alpha-value>)',
        dim: 'rgb(var(--ch-dim) / <alpha-value>)',
        hair: 'rgb(var(--ch-hair) / <alpha-value>)',
        'hair-strong': 'rgb(var(--ch-hair-strong) / <alpha-value>)',
        brand: {
          50: 'rgb(var(--ch-brand-50) / <alpha-value>)',
          100: 'rgb(var(--ch-brand-100) / <alpha-value>)',
          200: 'rgb(var(--ch-brand-200) / <alpha-value>)',
          600: 'rgb(var(--ch-brand-600) / <alpha-value>)',
          700: 'rgb(var(--ch-brand-700) / <alpha-value>)',
          800: 'rgb(var(--ch-brand-800) / <alpha-value>)',
          900: 'rgb(var(--ch-brand-900) / <alpha-value>)',
          DEFAULT: 'rgb(var(--ch-brand-700) / <alpha-value>)',
        },
        accent: 'rgb(var(--ch-brand-700) / <alpha-value>)',
        ruby: 'rgb(var(--ch-ruby) / <alpha-value>)',
        magenta: 'rgb(var(--ch-magenta) / <alpha-value>)',
        signal: 'rgb(var(--ch-signal) / <alpha-value>)',
        highlight: 'rgb(var(--ch-highlight) / <alpha-value>)',
        verdict: {
          good: 'rgb(var(--ch-good) / <alpha-value>)',
          'good-graphic': 'rgb(var(--ch-good-graphic) / <alpha-value>)',
          mid: 'rgb(var(--ch-mid) / <alpha-value>)',
          'mid-graphic': 'rgb(var(--ch-mid-graphic) / <alpha-value>)',
          low: 'rgb(var(--ch-low) / <alpha-value>)',
          'low-graphic': 'rgb(var(--ch-low-graphic) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px',
      },
      boxShadow: {
        // Stripe blue-tinted elevation
        card: '0 1px 3px 0 rgb(0 55 112 / 0.08)',
        lift: '0 8px 24px 0 rgb(0 55 112 / 0.10), 0 2px 6px 0 rgb(0 55 112 / 0.05)',
        mark: '0 2px 0 0 rgb(83 58 253 / 0.9)',
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
