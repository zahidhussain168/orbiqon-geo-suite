import Link from 'next/link';
import { ArrowRight, Gauge, Wrench, LayoutDashboard, Info, Sparkles } from 'lucide-react';
import { TOOLS, LAYERS } from '@orbiqon/config';
import { HeroChecker } from '@/components/marketing/HeroChecker';
import { DashboardMockup } from '@/components/marketing/DashboardMockup';
import { EngineMarquee } from '@/components/marketing/EngineMarquee';
import { StatCounter } from '@/components/marketing/StatCounter';
import { ToolsGrid } from '@/components/marketing/ToolsGrid';
import { Reveal } from '@/components/motion';

const LAYER_ICON = { DIAGNOSE: Gauge, FIX: Wrench, MANAGE: LayoutDashboard } as const;

export default function HomePage() {
  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero */}
      <section className="relative pt-4">
        <span className="glow left-1/2 top-[-140px] h-[420px] w-[620px] -translate-x-1/2" />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="chip border-brand-200 text-brand-700">
              <Sparkles className="h-3.5 w-3.5" /> Diagnose. Fix. Manage.
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-fg sm:text-7xl">
              Are you cited by AI, <span className="gradient-text">or invisible?</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              See whether ChatGPT, Claude, Perplexity and Gemini recommend your brand, who they name
              instead, and where you rank. Real sampled rates, never a fake yes or no.
            </p>
            <div className="mt-8 max-w-lg">
              <HeroChecker />
            </div>
          </div>
          <Reveal className="relative">
            <span className="glow -right-8 top-6 h-72 w-72" />
            <div className="dotgrid rounded-lg border border-hair p-4 sm:p-6">
              <div className="float">
                <DashboardMockup />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <EngineMarquee />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {[
          { to: 4, label: 'AI engines checked live' },
          { to: 5, label: 'Samples per prompt, max' },
          { to: 6, label: 'Tools across the suite' },
          { to: 0, label: 'Fake yes or no answers' },
        ].map((s, i) => (
          <Reveal key={s.label} delayIndex={i}>
            <StatCounter to={s.to} label={s.label} />
          </Reveal>
        ))}
      </section>

      {/* Thesis */}
      <Reveal as="section" className="border-y border-hair py-16 text-center">
        <p className="mx-auto max-w-3xl text-2xl font-medium leading-snug tracking-tight text-fg sm:text-4xl">
          Most tools only monitor your AI visibility. We diagnose, then fix, then manage.{' '}
          <span className="gradient-text">We do the work.</span>
        </p>
      </Reveal>

      {/* Three layers + tools */}
      <section>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The suite</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Three layers, one workflow
          </h2>
          <p className="mt-3 text-muted">
            Free diagnosis pulls you in. Paid fixes do the work. The platform runs it across every
            client. Six tools, built to feed each other.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {LAYERS.map((layer, i) => {
            const Icon = LAYER_ICON[layer.id];
            return (
              <Reveal key={layer.id} delayIndex={i} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-hair bg-surface text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-sm font-semibold uppercase tracking-wide text-fg">
                    {layer.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">{layer.blurb}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10">
          <ToolsGrid tools={TOOLS} />
        </div>
      </section>

      {/* See it in action, crafted panel, no stock photo */}
      <section>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">See it in action</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            A real read, in about a minute
          </h2>
          <p className="mt-3 text-muted">
            Enter a brand, watch the engines answer, and get a score you can screenshot and share.
          </p>
        </Reveal>
        <Reveal className="relative mx-auto mt-10 max-w-4xl">
          <span className="glow left-1/2 top-0 h-72 w-[520px] -translate-x-1/2" />
          <div className="overflow-hidden rounded-lg border border-hair bg-surface shadow-lift">
            <div className="flex items-center gap-1.5 border-b border-hair px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
              <span className="ml-3 font-mono text-xs text-dim">geostudio.ai/check</span>
            </div>
            <div className="dotgrid grid gap-6 p-6 sm:grid-cols-[1fr_320px] sm:p-10">
              <div className="flex flex-col justify-center">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-dim">Linear</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">
                  Cited by 3 of 4 engines
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  Perplexity names you every run, Gemini never does. Notion and Asana get named
                  instead. That gap is the fix.
                </p>
                <Link href="/check" className="btn-primary mt-5 w-fit px-5">
                  Run your own check
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="float">
                <DashboardMockup />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Methodology */}
      <Reveal as="section" className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded border border-hair bg-surface text-brand-700">
          <Info className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-fg">
            We show the rate, not a fake yes or no
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
            AI answers vary run to run. We sample each prompt several times across every engine and
            report how often you are cited. That honesty is the point: it is why the number is worth
            trusting, and worth acting on.
          </p>
        </div>
      </Reveal>

      {/* Social proof placeholder */}
      <Reveal as="section" className="text-center">
        <p className="mx-auto max-w-2xl text-xl font-medium leading-snug text-fg">
          Built by operators who got tired of dashboards that only watch.
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-dim">
          Founding customers, coming soon
        </p>
      </Reveal>

      {/* Agency band, crafted dark, no stock photo */}
      <Reveal as="section" className="relative overflow-hidden rounded-lg border border-hair">
        <span className="glow -left-10 top-0 h-72 w-96 opacity-60" />
        <span className="glow -right-10 bottom-[-60px] h-72 w-96 opacity-40" />
        <div className="dotgrid relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-700">For agencies</p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Add a GEO line to every client retainer. We generate the fixes.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              White-label tracking, share-of-voice dashboards, and built-in fix execution. The
              tooling is one flat fee, you keep the retainer.
            </p>
          </div>
          <Link href="/agencies" className="btn-primary shrink-0 px-5">
            See the agency plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
