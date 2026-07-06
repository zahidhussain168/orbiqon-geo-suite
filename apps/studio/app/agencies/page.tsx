import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { WaitlistForm } from '@/components/marketing/WaitlistForm';
import { SectionFx, HudCorners } from '@/components/marketing/SectionFx';

export const metadata: Metadata = {
  title: 'For Agencies: white-label GEO tools for clients',
  description:
    'Add a GEO retainer line to every client. The tooling is one flat fee, we generate the fixes, ' +
    'you keep the retainer. White-label tracking, dashboards, and reports. Founding agencies waitlist.',
  alternates: { canonical: '/agencies' },
};

const MATH = [
  { label: 'You charge the client', value: '$1,500 to $2,500 / mo', tone: 'ink' },
  { label: 'The tooling costs you', value: '$199 / mo', tone: 'muted' },
  { label: 'You keep the rest, white-label', value: 'the difference', tone: 'accent' },
];

const INCLUDED = [
  'Multi-client workspaces with isolated data',
  'Scheduled tracking across every AI engine',
  'Share-of-voice dashboards and competitor benchmarking',
  'Built-in fix execution, we generate the content and schema',
  'Branded reports under your domain, logo and colors',
  'Client-ready exports for QBRs and monthly reporting',
];

export default function AgenciesPage() {
  return (
    <div className="space-y-20">
      <header className="relative max-w-3xl">
        <span className="hero-backdrop" aria-hidden />
        <p className="eyebrow">For agencies</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Add a GEO line to every client. We generate the fixes.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Sell AI visibility as a service without building the tooling. You run diagnose, fix and
          reporting under your own brand. We do the work underneath.
        </p>
      </header>

      {/* The math */}
      <section className="relative isolate">
        <SectionFx variant="dots" />
        <h2 className="text-2xl font-semibold tracking-tight text-ink">The math is simple</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {MATH.map((m) => (
            <div key={m.label} data-tilt className="card p-6">
              <p className="font-mono text-xs uppercase tracking-wide text-dim">{m.label}</p>
              <p
                className={`mt-2 text-2xl font-semibold tracking-tight ${
                  m.tone === 'accent' ? 'text-brand-700' : m.tone === 'muted' ? 'text-dim' : 'text-ink'
                }`}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          A flat fee within your tier, regardless of client count. Most white-label tools stop at
          the report. Ours lets you generate and ship the fixes, so the retainer is defensible.
        </p>
      </section>

      {/* What you get */}
      <section className="relative isolate">
        <SectionFx variant="grid" />
        <h2 className="text-2xl font-semibold tracking-tight text-ink">What you get</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-lg border border-hair bg-surface p-4 text-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Waitlist */}
      <section className="card relative isolate overflow-hidden p-6 sm:p-8">
        <SectionFx variant="scan" />
        <HudCorners />
        <span className="chip">Founding agencies</span>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
          Get in before public launch
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-muted">
          We are onboarding a small group of founding agencies at a locked rate. Join the waitlist
          and we will reach out.
        </p>
        <div className="mt-6 max-w-md">
          <WaitlistForm toolSlug="geo-studio" />
        </div>
      </section>
    </div>
  );
}
