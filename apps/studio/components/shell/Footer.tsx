import Link from 'next/link';
import { brand, LAYERS, toolsByLayer } from '@orbiqon/config';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'All tools', href: '/tools' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'For Agencies', href: '/agencies' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Check your visibility', href: '/check' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-surface-alt/50">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded bg-ink font-mono text-sm font-bold text-paper">
                G
              </span>
              <span className="font-semibold tracking-tight">{brand.brandName}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-stone-600">{brand.thesis}</p>
            <div className="mt-4 flex gap-3 text-sm">
              <a href={brand.socials.twitter} className="link" rel="noopener noreferrer">
                X
              </a>
              <a href={brand.socials.linkedin} className="link" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={brand.socials.github} className="link" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3">Tools</p>
            <ul className="space-y-2 text-sm">
              {LAYERS.flatMap((l) => toolsByLayer(l.id)).map((tool) => (
                <li key={tool.slug}>
                  <Link href={tool.href} className="text-stone-600 transition-colors hover:text-ink">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-3">{col.title}</p>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-stone-600 transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {brand.legalEntity}. We report sampled rates, never a fake yes or no. Nothing here
            guarantees inclusion in AI answers.
          </p>
          <p className="font-mono">{brand.domain}</p>
        </div>
      </div>
    </footer>
  );
}
