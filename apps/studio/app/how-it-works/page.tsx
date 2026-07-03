import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gauge, Wrench, LayoutDashboard } from 'lucide-react';
import { LAYERS, toolsByLayer } from '@orbiqon/config';

export const metadata: Metadata = {
  title: 'How it works: diagnose, fix, manage',
  description:
    'The GEO Studio workflow: diagnose where AI ignores you for free, fix it with generated ' +
    'content and schema, then manage it across clients. We do the work, not just the report.',
  alternates: { canonical: '/how-it-works' },
};

const ICON = { DIAGNOSE: Gauge, FIX: Wrench, MANAGE: LayoutDashboard } as const;

export default function HowItWorksPage() {
  return (
    <div className="space-y-20">
      <header className="max-w-3xl">
        <p className="eyebrow">How it works</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Diagnose, fix, manage
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Most tools stop at the dashboard. Our workflow is a loop: find where AI ignores you, do
          the work to fix it, then run it at scale. Each step feeds the next.
        </p>
      </header>

      {/* Visual flow */}
      <section className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {LAYERS.map((layer, i) => {
          const Icon = ICON[layer.id];
          return (
            <div key={layer.id} className="contents">
              <div data-tilt className="card flex flex-col p-6">
                <span className="grid h-10 w-10 place-items-center rounded bg-surface-alt text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-mono text-sm font-semibold uppercase tracking-wide text-ink">
                  {layer.label}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{layer.blurb}</p>
                <ul className="mt-4 space-y-1.5 border-t border-hair pt-4 text-sm text-muted">
                  {toolsByLayer(layer.id).map((t) => (
                    <li key={t.slug}>
                      <Link href={t.href} className="transition-colors hover:text-brand-700">
                        {t.name}
                        {t.status === 'soon' ? ' (soon)' : ''}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {i < LAYERS.length - 1 && (
                <div className="hidden items-center justify-center sm:flex" aria-hidden>
                  <ArrowRight className="h-5 w-5 text-dim" />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Honesty */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Why we report rates</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Ask an AI the same question twice and you can get different brands. So we sample every
          prompt several times per engine and report how often you are cited. A rate you can trust
          beats a yes or no you cannot. We never claim schema or an llms.txt file alone will get you
          cited, because that is not true. The levers that move the needle are content, structure and
          earned mentions, and that is what the fix tools build.
        </p>
      </section>

      <section className="text-center">
        <Link href="/check" className="btn-primary px-6">
          Start with a free check
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
