/**
 * Brand config. Placeholder name for now ("GEO Studio"). Every nav item, meta tag, OG image,
 * and footer reads from here, so renaming the company later is a one-file change.
 */
export const brand = {
  /** Placeholder company name. Change this one value to rename everywhere. */
  brandName: 'GEO Studio',
  /** Short label for tight spaces (nav, footer mark). */
  shortName: 'GEO Studio',
  /** The core positioning line, used across Home, How it works, and For Agencies. */
  thesis: 'Most tools only monitor your AI visibility. We diagnose, then fix, then manage.',
  tagline: 'The GEO platform that does the work.',
  description:
    'See whether ChatGPT, Claude, Perplexity and Gemini cite your brand, then fix it. ' +
    'Real sampled citation rates, never a fake yes or no.',
  domain: 'geostudio.ai',
  url: 'https://geostudio.ai',
  /** Interactive/brand accent (teal-700 workhorse). Large graphics use teal-600. */
  accentColor: '#0F766E',
  legalEntity: 'GEO Studio, Inc.',
  socials: {
    twitter: 'https://x.com/geostudio',
    twitterHandle: '@geostudio',
    linkedin: 'https://www.linkedin.com/company/geostudio',
    github: 'https://github.com/geostudio',
  },
} as const;

export type Brand = typeof brand;
