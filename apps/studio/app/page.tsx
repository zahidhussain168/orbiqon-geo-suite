import Link from 'next/link';
import { ArrowRight, Gauge, Wrench, LayoutDashboard, Info } from 'lucide-react';
import { brand, TOOLS, LAYERS } from '@orbiqon/config';
import { HeroChecker } from '@/components/marketing/HeroChecker';
import { SovPeek } from '@/components/marketing/SovPeek';
import { ToolsGrid } from '@/components/marketing/ToolsGrid';
import { Reveal } from '@/components/motion';

const LAYER_ICON = { DIAGNOSE: Gauge, FIX: Wrench, MANAGE: LayoutDashboard } as const;

export default function HomePage() {
  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero: the checker input is the hero */}
      <section className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <span className="hero-backdrop" aria-hidden />
        <div>
          <p className="eyebrow">Diagnose. Fix. Manage.</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Find out if AI recommends you. Then fix it.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
            See whether ChatGPT, Claude, Perplexity and Gemini cite your brand, who they name
            instead, and where you rank. Real sampled rates, never a fake yes or no.
          </p>
          <div className="mt-7 max-w-lg">
            <HeroChecker />
          </div>
        </div>
        <Reveal>
          <SovPeek />
        </Reveal>
      </section>

      {/* Thesis band */}
      <Reveal as="section" className="border-y border-stone-200 py-14 text-center">
        <p className="mx-auto max-w-3xl text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
          Most tools only monitor your AI visibility. We diagnose, then fix, then manage.{' '}
          <span className="text-brand-700">We do the work.</span>
        </p>
      </Reveal>

      {/* Three layers + the six tools */}
      <section>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The suite</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Three layers, one workflow
          </h2>
          <p className="mt-3 text-stone-600">
            Free diagnosis pulls you in. Paid fixes do the work. The platform runs it across every
            client. Six tools, built to feed each other.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {LAYERS.map((layer, i) => {
            const Icon = LAYER_ICON[layer.id];
            return (
              <Reveal key={layer.id} delayIndex={i} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-surface-alt text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-sm font-semibold uppercase tracking-wide text-ink">
                    {layer.label}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{layer.blurb}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10">
          <ToolsGrid tools={TOOLS} />
        </div>
      </section>

      {/* Honest methodology as a feature */}
      <Reveal as="section" className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-surface-alt text-brand-700">
          <Info className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            We show the rate, not a fake yes or no
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-stone-600">
            AI answers vary run to run. We sample each prompt several times across every engine and
            report how often you are cited. That honesty is the point: it is why the number is worth
            trusting, and worth acting on.
          </p>
        </div>
      </Reveal>

      {/* Honest social proof placeholder */}
      <Reveal as="section" className="text-center">
        <p className="mx-auto max-w-2xl text-xl font-medium leading-snug text-ink">
          Built by operators who got tired of dashboards that only watch.
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-stone-400">
          Founding customers, coming soon
        </p>
      </Reveal>

      {/* Agency teaser */}
      <Reveal as="section" className="overflow-hidden rounded-lg border border-stone-200 bg-ink text-paper">
        <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-brand-200">For agencies</p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight">
              Add a GEO line to every client retainer. We generate the fixes.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-stone-300">
              White-label tracking, share-of-voice dashboards, and built-in fix execution. The
              tooling is one flat fee, you keep the retainer.
            </p>
          </div>
          <Link
            href="/agencies"
            className="inline-flex shrink-0 items-center gap-2 rounded bg-paper px-5 py-3 font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            See the agency plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
