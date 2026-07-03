import type { Config } from 'tailwindcss';

/**
 * Aurora design system.
 * Dark glass over a violet-tinted near-black canvas, a violet→cyan accent that glows,
 * gradient headlines and buttons, hairline borders, Geist + Geist Mono. Rich and alive,
 * not flat. Verdict colors are the score only.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Violet-tinted near-black surfaces
        canvas: '#0A0A12',
        paper: '#0A0A12',
        surface: '#13131F',
        'surface-alt': '#171728',
        elevated: '#1C1C30',
        ink: '#F4F4FF', // legacy alias: foreground
        // Foreground scale
        fg: '#F4F4FF',
        high: '#D2D2EE',
        muted: '#A7A7CF',
        dim: '#74749A',
        // Hairlines
        hair: '#24243A',
        'hair-strong': '#37375A',
        // Accent: Aurora violet (workhorse) with a cyan partner for gradients
        brand: {
          50: '#17172E', // dark tint fill
          100: '#221F45',
          200: '#38306E', // subtle borders
          600: '#A78BFA', // light accent / hover-bright
          700: '#7C5CFF', // workhorse: buttons, links, accents
          800: '#6D28D9', // pressed
          DEFAULT: '#7C5CFF',
        },
        accent: '#7C5CFF',
        accent2: '#22D3EE', // cyan, second stop of the aurora gradient
        amber: '#FF8A3D', // warm hero-glow accent (globe atmosphere, highlights)
        verdict: {
          good: '#2FBE6E',
          'good-graphic': '#34D399',
          mid: '#E2A336',
          'mid-graphic': '#F4B740',
          low: '#F0577B',
          'low-graphic': '#FB7185',
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
        card: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 1px 2px 0 rgb(0 0 0 / 0.4)',
        lift: '0 1px 0 0 rgb(255 255 255 / 0.06) inset, 0 24px 60px -28px rgb(0 0 0 / 0.85)',
        glow: '0 0 0 1px rgb(124 92 255 / 0.35), 0 10px 40px -12px rgb(124 92 255 / 0.5)',
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
