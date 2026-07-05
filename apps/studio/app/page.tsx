import Link from 'next/link';
import { ArrowRight, Sparkles, Search, ListChecks, Trophy, Repeat, Info } from 'lucide-react';
import { TOOLS } from '@orbiqon/config';
import { HeroChecker } from '@/components/marketing/HeroChecker';
import { KineticHeadline } from '@/components/marketing/KineticHeadline';
import { ScrollCue } from '@/components/marketing/ScrollCue';
import { AnswerArtifact } from '@/components/marketing/AnswerArtifact';
import { ScoreMockup, PromptGridMockup, CompetitorMockup } from '@/components/marketing/mockups';
import { ToolsGrid } from '@/components/marketing/ToolsGrid';
import { Reveal, Tilt } from '@/components/motion';

const STEPS = [
  { icon: Search, title: 'Enter your brand', body: 'Your name and category. We write the buyer prompts, or you bring your own.' },
  { icon: Repeat, title: 'We sample the engines', body: 'Each prompt runs several times across ChatGPT, Claude, Perplexity and Gemini, live.' },
  { icon: ListChecks, title: 'Get your score and gaps', body: 'A 0 to 100 rate, who gets named instead, and the prompts where you lose.' },
  { icon: Trophy, title: 'Fix, then re-check', body: 'Ship the content and schema that earn citations, then watch the rate climb.' },
];

function FeatureRow({
  eyebrow,
  title,
  body,
  points,
  visual,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={flip ? 'lg:order-2' : ''}>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-3 text-3xl tracking-tight text-fg sm:text-4xl">{title}</h3>
        <p className="mt-4 max-w-md text-muted">{body}</p>
        <ul className="mt-5 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-high">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal className={`rise-3d ${flip ? 'lg:order-1' : ''}`}>{visual}</Reveal>
    </div>
  );
}

const HERO_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4';

export default function HomePage() {
  return (
    <div>
      {/* Hero, over a fixed background video. -mt cancels main's top padding so the video
          starts right under the sticky header. A light scrim keeps the light-theme text and
          cards legible over whatever frame the video is on. */}
      <div className="relative -mt-10 sm:-mt-14">
        <video
          className="fixed left-0 top-0 z-0 h-screen w-full object-cover"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        <span className="hero-scrim" aria-hidden />
        <section className="hero-cards bleed relative z-[2] px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid items-start gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-11">
              <div>
                <span className="chip border-brand-200 text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" /> Diagnose. Fix. Manage.
                </span>
                <KineticHeadline />
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                  See whether ChatGPT, Claude, Perplexity and Gemini recommend your brand, who they
                  name instead, and where you rank. Real sampled rates, never a fake yes or no.
                </p>
                <div className="mt-6 max-w-lg">
                  <HeroChecker />
                </div>
              </div>
              <Reveal className="relative">
                <AnswerArtifact />
              </Reveal>
            </div>
          </div>
          <ScrollCue className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:grid" />
        </section>
      </div>

      {/* Everything below sits on an opaque full-bleed curtain so the fixed video
          only shows through the hero above. */}
      <div className="curtain space-y-24 pt-24 sm:space-y-32 sm:pt-32">
      {/* Social proof stat band */}
      <Reveal as="section" className="border-y border-hair py-14 text-center">
        <p className="mx-auto max-w-3xl text-2xl font-normal leading-snug tracking-tight text-fg sm:text-[2rem] sm:leading-[1.2]">
          Millions of buyers now ask AI to recommend a tool before they ever open Google.{' '}
          <span className="brand-emphasis">If it doesn&rsquo;t name you, you&rsquo;re not in the room.</span>
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-dim">
          Checked live across ChatGPT &middot; Claude &middot; Perplexity &middot; Gemini
        </p>
      </Reveal>

      {/* Feature rows: product-led, alternating */}
      <section className="space-y-24 sm:space-y-28">
        <FeatureRow
          eyebrow="The score"
          title="One number you can actually trust"
          body="We sample every prompt several times per engine and report how often you are cited, not a one-shot yes or no that changes on the next run."
          points={[
            'A transparent 0 to 100 visibility score',
            'Per-engine citation rate, sampled live',
            'A verdict you can screenshot and share',
          ]}
          visual={
            <Tilt>
              <ScoreMockup />
            </Tilt>
          }
        />
        <FeatureRow
          flip
          eyebrow="Every prompt"
          title="See exactly which questions you lose"
          body="A matrix of the buyer questions that matter against all four engines, so you know where you win every run, where you flicker, and where you never show up."
          points={[
            'Buyer prompts written for your category',
            'Cited, sometimes, or never, per engine',
            'The exact prompts to go fix first',
          ]}
          visual={
            <Tilt>
              <PromptGridMockup />
            </Tilt>
          }
        />
      </section>

      {/* The rivals: a full-width stacked panel, deliberately not another split row
          (the third consecutive left-right split reads as templated) */}
      <Reveal as="section" className="card overflow-hidden">
        <div className="grid gap-8 p-8 sm:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow">The rivals</p>
            <h3 className="mt-3 text-3xl tracking-tight text-fg sm:text-4xl">
              Know who AI names instead of you
            </h3>
            <p className="mt-4 max-w-md text-muted">
              Every competitor the engines recommend in your place, ranked by how often they appear,
              so your share of voice stops being a black box.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-3">
            {[
              'Share of voice across your category',
              'The gap between you and the leader',
              'Who to overtake, and by how much',
            ].map((p) => (
              <p key={p} className="flex items-start gap-2.5 text-sm text-high">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                {p}
              </p>
            ))}
          </div>
          <Tilt>
            <CompetitorMockup />
          </Tilt>
        </div>
      </Reveal>

      {/* How it works, numbered */}
      <section>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-3xl tracking-tight text-fg sm:text-4xl">
            From blank box to a real read in about a minute
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delayIndex={i} className="relative">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-dim">0{i + 1}</span>
                <span className="h-px flex-1 bg-hair" />
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-hair bg-surface text-brand-700">
                  <s.icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <h3 className="mt-4 text-base text-fg">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The suite */}
      <section>
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl tracking-tight text-fg sm:text-4xl">
            One free check, then the tools to actually fix it
          </h2>
          <p className="mt-3 text-muted">
            AmICited is the free front door. The rest of the suite writes the content, schema and
            structure that earn the citations back. Six tools, built to feed each other.
          </p>
        </Reveal>
        <div className="mt-10">
          <ToolsGrid tools={TOOLS} />
        </div>
      </section>

      {/* Methodology: the honesty that makes the number worth trusting */}
      <Reveal as="section" className="card overflow-hidden">
        <div className="grid gap-8 p-8 sm:grid-cols-[1.1fr_0.9fr] sm:p-12">
          <div>
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-hair bg-surface-alt text-brand-700">
              <Info className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-2xl tracking-tight text-fg sm:text-3xl">
              We report the <span className="brand-emphasis">rate</span>, not a fake yes or no
            </h2>
            <p className="mt-3 max-w-md text-muted">
              AI answers change run to run. Ask once and you get luck. We ask several times per engine
              and report how often you are actually cited. That honesty is the whole point: it is why
              the number is worth trusting, and worth acting on.
            </p>
          </div>
          {/* a small honest visualization of sampling to a rate */}
          <div className="flex flex-col justify-center gap-3 rounded-lg border border-hair bg-surface-alt/60 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wide text-dim">
              &ldquo;best issue tracker for startups&rdquo; &middot; ChatGPT
            </p>
            <div className="flex gap-2">
              {['cited', 'cited', 'missing', 'cited', 'cited'].map((s, i) => (
                <span
                  key={i}
                  className={`flex h-8 flex-1 items-center justify-center rounded font-mono text-[10px] ${
                    s === 'cited'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-surface text-dim ring-1 ring-inset ring-hair'
                  }`}
                >
                  {s === 'cited' ? '✓' : '·'}
                </span>
              ))}
            </div>
            <p className="text-sm text-high">
              Cited in <span className="font-semibold text-brand-700">4 of 5</span> samples ={' '}
              <span className="font-mono font-normal text-fg">80%</span> rate
            </p>
          </div>
        </div>
      </Reveal>

      {/* Trust / positioning band */}
      <Reveal as="section" className="text-center">
        <p className="mx-auto max-w-2xl text-xl font-medium leading-snug text-fg sm:text-2xl">
          Built by operators who got tired of dashboards that only watch. This one tells you what is
          wrong, then hands you the fix.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-dim">
          Founding customers, onboarding now
        </p>
      </Reveal>

      {/* Final CTA */}
      <Reveal as="section" className="relative overflow-hidden rounded-lg border border-hair bg-surface-alt/70">
        <div className="dotgrid relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="max-w-xl text-3xl tracking-tight text-fg sm:text-4xl">
              Find out if AI recommends you. Free, in about a minute.
            </h2>
            <p className="mt-2 max-w-lg text-muted">No signup, no credit card. Just your brand name.</p>
          </div>
          <Link href="/check" className="btn-primary shrink-0 px-6 text-base">
            Check my AI visibility free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
      </div>
    </div>
  );
}
