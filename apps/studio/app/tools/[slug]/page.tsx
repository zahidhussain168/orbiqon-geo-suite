import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { TOOLS, LAYERS, toolBySlug } from '@orbiqon/config';
import { ComingSoonTool } from '@/components/marketing/ComingSoonTool';
import { toolSteps, toolFaq } from '@/lib/tool-content';

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = toolBySlug(params.slug);
  if (!tool) return { title: 'Tool not found' };
  return {
    title: `${tool.name}: ${tool.oneLiner.slice(0, 90)}`,
    description: tool.oneLiner,
    alternates: { canonical: tool.href },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = toolBySlug(params.slug);
  if (!tool) notFound();

  const layer = LAYERS.find((l) => l.id === tool.layer);
  const steps = toolSteps(tool);
  const faq = toolFaq(tool);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: tool.oneLiner,
    ...(tool.status === 'live'
      ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }
      : {}),
  };

  return (
    <div className="space-y-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify([appJsonLd, faqJsonLd]) }}
      />

      {/* Hero */}
      <header className="relative max-w-3xl">
        <span className="hero-backdrop" aria-hidden />
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{layer?.label} layer</span>
          {tool.status === 'live' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> Live
            </span>
          ) : (
            <span className="rounded-full bg-elevated px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-dim">
              Coming soon
            </span>
          )}
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{tool.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{tool.oneLiner}</p>
        {tool.status === 'live' && (
          <Link href={tool.href} className="btn-primary mt-6 px-5">
            Open {tool.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </header>

      {/* What it does */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">What it does</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {tool.capabilities.map((cap) => (
            <li key={cap} data-tilt className="card p-5">
              <Check className="h-5 w-5 text-brand-700" />
              <p className="mt-3 text-sm leading-relaxed text-muted">{cap}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works in 3 steps */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">How it works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n}>
              <p className="font-mono text-sm font-semibold text-brand-700">{step.n}</p>
              <p className="mt-2 font-semibold text-ink">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Preview area, crafted panel */}
      <section>
        <div data-tilt className="overflow-hidden rounded-lg border border-hair bg-surface shadow-lift">
          <div className="flex items-center gap-1.5 border-b border-hair px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
            <span className="ml-3 font-mono text-xs text-dim">geostudio.ai{tool.href}</span>
          </div>
          <div className="dotgrid relative grid aspect-[16/9] place-items-center">
            <span className="glow left-1/2 top-1/2 h-56 w-80 -translate-x-1/2 -translate-y-1/2 opacity-50" />
            <p className="relative rounded-full border border-hair bg-surface px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {tool.status === 'live' ? 'Live now' : 'Product preview coming soon'}
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist for coming-soon */}
      {tool.status === 'soon' && (
        <section>
          <ComingSoonTool tool={tool} />
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Questions</h2>
        <dl className="mt-6 divide-y divide-hair border-y border-hair">
          {faq.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-semibold text-ink">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
