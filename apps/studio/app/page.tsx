import Image from 'next/image';
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
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <span className="orb orb-teal left-[-6%] top-[-12%] h-72 w-72" />
          <span className="orb orb-cyan right-[2%] top-[8%] h-80 w-80" />
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="chip border-brand-200 bg-brand-50 text-brand-700">
              <Sparkles className="h-3.5 w-3.5" /> Diagnose. Fix. Manage.
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl">
              Find out if AI recommends you.{' '}
              <span className="gradient-text">Then fix it.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
              See whether ChatGPT, Claude, Perplexity and Gemini cite your brand, who they name
              instead, and where you rank. Real sampled rates, never a fake yes or no.
            </p>
            <div className="mt-7 max-w-lg">
              <HeroChecker />
            </div>
          </div>
          <Reveal className="relative">
            <span className="orb orb-teal -right-6 top-10 -z-10 h-64 w-64 opacity-40" />
            <DashboardMockup />
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <EngineMarquee />

      {/* Stats band */}
      <section className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {[
          { to: 4, suffix: '', label: 'AI engines checked live' },
          { to: 5, suffix: '', label: 'Samples per prompt, max' },
          { to: 6, suffix: '', label: 'Tools across the suite' },
          { to: 0, suffix: '', label: 'Fake yes or no answers' },
        ].map((s, i) => (
          <Reveal key={s.label} delayIndex={i}>
            <StatCounter to={s.to} suffix={s.suffix} label={s.label} />
          </Reveal>
        ))}
      </section>

      {/* Thesis band */}
      <Reveal as="section" className="border-y border-stone-200 py-14 text-center">
        <p className="mx-auto max-w-3xl text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
          Most tools only monitor your AI visibility. We diagnose, then fix, then manage.{' '}
          <span className="gradient-text">We do the work.</span>
        </p>
      </Reveal>

      {/* Three layers + tools */}
      <section>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The suite</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
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
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-brand-50 text-brand-700">
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

      {/* Product preview with real imagery */}
      <section>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">See it in action</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A real read, in about a minute
          </h2>
          <p className="mt-3 text-stone-600">
            Enter a brand, watch the engines answer, and get a score you can screenshot and share.
          </p>
        </Reveal>
        <Reveal className="relative mx-auto mt-10 max-w-4xl">
          <span className="orb orb-cyan left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 opacity-40" />
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-surface shadow-lift">
            <div className="flex items-center gap-1.5 border-b border-stone-200 bg-surface-alt px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
              <span className="ml-3 font-mono text-xs text-stone-400">geostudio.ai/check</span>
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src="/img/tech-grid.jpg"
                alt="Abstract data grid representing AI visibility analysis"
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-tr from-brand-800/50 via-ink/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-xs">
                <DashboardMockup />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Methodology */}
      <Reveal as="section" className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-brand-50 text-brand-700">
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

      {/* Social proof placeholder */}
      <Reveal as="section" className="text-center">
        <p className="mx-auto max-w-2xl text-xl font-medium leading-snug text-ink">
          Built by operators who got tired of dashboards that only watch.
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-stone-400">
          Founding customers, coming soon
        </p>
      </Reveal>

      {/* Agency band with imagery */}
      <Reveal as="section" className="relative overflow-hidden rounded-lg border border-stone-200 text-paper">
        <Image
          src="/img/abstract-teal.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1100px"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/70 to-brand-800/60" />
        <div className="relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-brand-200">For agencies</p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Add a GEO line to every client retainer. We generate the fixes.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-stone-200">
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
