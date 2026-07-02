import type { MetadataRoute } from 'next';
import { brand, TOOLS } from '@orbiqon/config';
import { POSTS } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.url.replace(/\/$/, '');
  const staticRoutes = [
    '',
    '/check',
    '/tools',
    '/pricing',
    '/agencies',
    '/how-it-works',
    '/blog',
    '/privacy',
    '/terms',
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date('2026-07-02'),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  for (const tool of TOOLS) {
    routes.push({ url: `${base}${tool.href}`, changeFrequency: 'weekly', priority: 0.6 });
  }
  for (const post of POSTS) {
    routes.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return routes;
}
