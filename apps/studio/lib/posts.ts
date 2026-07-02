/** Blog post registry. The index reads from here; each slug has a matching MDX route. */
export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
}

export const POSTS: Post[] = [
  {
    slug: 'geo-is-not-monitoring',
    title: 'GEO is not monitoring',
    description:
      'Why watching your AI visibility is not the same as changing it, and what actually moves the number.',
    date: '2026-06-10',
    readingTime: '4 min read',
  },
  {
    slug: 'why-we-report-rates',
    title: 'Why we report rates, not a yes or no',
    description:
      'AI answers vary run to run. Reporting a sampled rate is the honest way to measure, and the only one worth acting on.',
    date: '2026-06-24',
    readingTime: '3 min read',
  },
];

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
