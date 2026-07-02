import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { POSTS } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog: notes on generative engine optimization',
  description:
    'Practical, honest notes on getting cited by AI: what moves the number, what does not, and how ' +
    'to measure it without fooling yourself.',
  alternates: { canonical: '/blog' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header>
        <p className="eyebrow">Blog</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Notes on getting cited by AI
        </h1>
        <p className="mt-4 text-lg text-muted">
          Practical, honest writing on generative engine optimization. What moves the number, what
          does not, and how to measure without fooling yourself.
        </p>
      </header>

      <ul className="mt-12 divide-y divide-hair border-y border-hair">
        {POSTS.map((post) => (
          <li key={post.slug} className="py-6">
            <Link href={`/blog/${post.slug}`} className="group flex flex-col">
              <span className="flex items-center gap-2 font-mono text-xs text-dim">
                {formatDate(post.date)} <span className="text-dim">/</span> {post.readingTime}
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-xl font-semibold tracking-tight text-ink">
                {post.title}
                <ArrowUpRight className="h-4 w-4 text-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <span className="mt-1.5 text-sm leading-relaxed text-muted">{post.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
