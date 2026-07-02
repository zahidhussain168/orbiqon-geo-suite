import type { MetadataRoute } from 'next';
import { brand } from '@orbiqon/config';

/**
 * We of all companies must welcome the AI crawlers. Explicit Allow lines for the major bots,
 * plus a catch-all Allow. Nothing here is blocked.
 */
export default function robots(): MetadataRoute.Robots {
  const base = brand.url.replace(/\/$/, '');
  const aiBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot', 'anthropic-ai'];

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiBots.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
