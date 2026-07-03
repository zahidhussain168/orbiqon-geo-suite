import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing: free to diagnose, fair to fix',
  description:
    'Diagnose your AI visibility for free. Fix tools launching soon at honest indie prices. ' +
    'Agency white-label from $199. No fake testimonials, no overclaiming.',
  alternates: { canonical: '/pricing' },
};

const TIERS = [
  {
    name: 'Diagnose',
    price: 'Free',
    note: 'No signup, unlimited',
    blurb: 'The free checks that show where AI ignores you.',
    features: ['AmICited multi-engine visibility check', 'Competitor reveal', 'Honest sampled rates'],
    cta: { label: 'Check your visibility', href: '/check' },
    highlight: false,
    tag: 'Available now',
  },
  {
    name: 'Fix',
    price: '$29 to $49',
    note: 'Per month, launching soon',
    blurb: 'We generate the content and schema that earns citations.',
    features: ['SchemaForge, $29/mo planned', 'Citation Content Builder, $49/mo planned', 'Publish or export'],
    cta: { label: 'Join the waitlist', href: '/tools/schemaforge' },
    highlight: true,
    tag: 'Launching soon',
  },
  {
    name: 'Agency',
    price: '$199 to $299',
    note: 'Per month, founding agencies',
    blurb: 'White-label the whole loop across every client.',
    features: ['Multi-client workspaces', 'Built-in fix execution', 'Branded client reports'],
    cta: { label: 'Founding agencies waitlist', href: '/agencies' },
    highlight: false,
    tag: 'Founding waitlist',
  },
];

const COMPARISON: { label: string; diagnose: boolean; fix: boolean; agency: boolean }[] = [
  { label: 'Multi-engine visibility check', diagnose: true, fix: true, agency: true },
  { label: 'Competitor reveal', diagnose: true, fix: true, agency: true },
  { label: 'Generated schema and answer blocks', diagnose: false, fix: true, agency: true },
  { label: 'Content that earns citations', diagnose: false, fix: true, agency: true },
  { label: 'Multi-client workspaces', diagnose: false, fix: false, agency: true },
  { label: 'White-label branded reports', diagnose: false, fix: false, agency: true },
];

export default function PricingPage() {
  return (
    <div className="space-y-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Pricing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Free to diagnose. Fair to fix.
        </h1>
        <p className="mt-4 text-lg text-muted">
          The diagnosis is free and unlimited. The fix tools launch at honest indie prices. No fake
          testimonials, no promises we cannot keep.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            data-tilt
            className={`card flex flex-col p-6 ${tier.highlight ? 'ring-1 ring-brand-700' : ''}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-ink">
                {tier.name}
              </h2>
              <span className="rounded-full bg-surface-alt px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-dim">
                {tier.tag}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-ink">{tier.price}</p>
            <p className="font-mono text-xs text-dim">{tier.note}</p>
            <p className="mt-3 text-sm text-muted">{tier.blurb}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={tier.cta.href}
              className={`mt-6 ${tier.highlight ? 'btn-primary' : 'btn-secondary'} w-full`}
            >
              {tier.cta.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Honest comparison table */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">What is included</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-hair text-left">
                <th className="py-3 pr-4 font-medium text-dim">Capability</th>
                <th className="px-3 py-3 text-center font-mono text-xs uppercase text-dim">Diagnose</th>
                <th className="px-3 py-3 text-center font-mono text-xs uppercase text-dim">Fix</th>
                <th className="px-3 py-3 text-center font-mono text-xs uppercase text-dim">Agency</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-hair">
                  <td className="py-3 pr-4 text-muted">{row.label}</td>
                  <Cell on={row.diagnose} />
                  <Cell on={row.fix} />
                  <Cell on={row.agency} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-xs text-dim">
          Fix and Agency tiers are pre-launch. Prices are planned and may change before release.
        </p>
      </section>
    </div>
  );
}

function Cell({ on }: { on: boolean }) {
  return (
    <td className="px-3 py-3 text-center">
      {on ? (
        <Check className="mx-auto h-4 w-4 text-brand-700" />
      ) : (
        <Minus className="mx-auto h-4 w-4 text-dim" />
      )}
    </td>
  );
}
