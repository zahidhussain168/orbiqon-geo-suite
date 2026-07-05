'use client';

import { useEffect, useState } from 'react';
import type { CompetitorTally, EngineSummary, ScanResult } from '@/lib/types';
import { engineAccent } from '@/lib/engine-meta';
import { ScoreGauge, scoreVerdict } from './ScoreGauge';
import { FixCta } from './FixCta';
import { SpotlightCard } from './motion';
import {
  IconAlert,
  IconCheck,
  IconChevron,
  IconClock,
  IconCopy,
  IconInfo,
  IconLink,
  IconRefresh,
  IconWrench,
  IconX,
} from './icons';

interface Props {
  result: ScanResult;
  onRerun?: () => void;
  onNew?: () => void;
}

/** The money page: score verdict, per-engine breakdown, competitor reveal, honest methodology. */
export function ResultsView({ result, onRerun, onNew }: Props) {
  const ok = result.engines.filter((e) => e.status === 'ok');
  const errored = result.engines.filter((e) => e.status === 'error');
  const stubs = result.engines.filter((e) => e.status === 'not_implemented');

  const [active, setActive] = useState<Set<string>>(new Set(ok.map((e) => e.engine)));
  const [tab, setTab] = useState<'engine' | 'prompt'>('engine');
  const [copied, setCopied] = useState(false);

  const shown = ok.filter((e) => active.has(e.engine));
  const citedEngines = shown.filter((e) => e.citedCount > 0).length;
  const { color, verdict } = scoreVerdict(result.score);

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next.size === 0 ? prev : next; // keep at least one engine on
    });
  }

  async function copySummary() {
    const lines = [
      `AmICited, ${result.brand}: ${result.score}/100 AI visibility (${verdict})`,
      `Cited by ${citedEngines} of ${shown.length} engines across ${result.prompts.length} prompts.`,
      ...shown.map(
        (e) =>
          `• ${e.displayName}: cited in ${e.citedCount} of ${e.sampleCount} runs (${Math.round(e.citationRate * 100)}%)`,
      ),
      `Named instead: ${result.competitors.slice(0, 5).map((c) => c.name).join(', ')}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section className="space-y-5">
      {/* Hero, the screenshot */}
      <SpotlightCard className="animate-fade-up p-6 sm:p-8">
        <div className="flex flex-col items-center gap-7 sm:flex-row sm:gap-10">
          <ScoreGauge score={result.score} />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-lg font-semibold" style={{ color }}>
              {verdict}
            </p>
            <h1 className="mt-0.5 truncate text-3xl font-bold tracking-tight text-fg">
              {result.brand}
            </h1>
            <p className="mt-2.5 text-sm text-muted">
              Cited by <span className="font-semibold text-fg">{citedEngines} of {shown.length}</span>{' '}
              engines across {result.prompts.length} prompt{result.prompts.length === 1 ? '' : 's'},
              sampled {result.meta.samples}× each.
            </p>
            {result.meta.mock && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-verdict-mid/40 bg-verdict-mid/10 px-2.5 py-1 text-xs font-medium text-verdict-mid">
                Demo data, add API keys to run live
              </span>
            )}
            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
              <a href="#fix" className="btn-primary px-5">
                <IconWrench className="h-4 w-4" /> Fix this
              </a>
              <button onClick={copySummary} className="btn-secondary">
                {copied ? (
                  <IconCheck className="h-4 w-4 text-verdict-good" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
                {copied ? 'Copied' : 'Copy summary'}
              </button>
              {onRerun && (
                <button onClick={onRerun} className="btn-secondary">
                  <IconRefresh className="h-4 w-4" /> Re-run
                </button>
              )}
              {onNew && (
                <button onClick={onNew} className="btn-secondary">
                  <IconLink className="h-4 w-4" /> New scan
                </button>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Honest methodology, a feature, not fine print */}
      <div className="flex items-start gap-2.5 rounded-lg border border-hair bg-elevated px-4 py-3 text-sm text-muted">
        <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p>
          <span className="font-medium text-muted">How to read this:</span> AI answers vary run
          to run. We sample each prompt multiple times and report the rate, never a fake yes/no.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {ok.map((e) => {
            const on = active.has(e.engine);
            const accent = engineAccent(e.engine);
            return (
              <button
                key={e.engine}
                onClick={() => toggle(e.engine)}
                className={`chip transition ${on ? 'border-hair bg-surface text-fg shadow-sm' : 'opacity-50'}`}
                aria-pressed={on}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
                {e.displayName}
              </button>
            );
          })}
        </div>
        <div className="inline-flex self-start rounded-lg border border-hair bg-elevated p-0.5 text-xs sm:self-auto">
          {(['engine', 'prompt'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                tab === t ? 'bg-surface text-fg shadow-sm' : 'text-dim hover:text-fg'
              }`}
            >
              {t === 'engine' ? 'By engine' : 'By prompt'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'engine' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {shown.map((e, i) => (
            <div key={e.engine} className="animate-fade-up" style={{ animationDelay: `${i * 45}ms` }}>
              <EngineCard engine={e} brand={result.brand} />
            </div>
          ))}
          {errored.map((e) => (
            <ErrorCard key={e.engine} engine={e} />
          ))}
          {stubs.map((e) => (
            <StubCard key={e.engine} engine={e} />
          ))}
        </div>
      ) : (
        <PromptMatrix result={result} shown={shown} />
      )}

      {/* The gut-punch */}
      {result.competitors.length > 0 && (
        <div className="card animate-fade-up p-6">
          <h2 className="text-lg font-semibold tracking-tight text-fg">
            Who AI named instead of you
          </h2>
          <p className="mt-1 text-sm text-dim">
            Brands the engines recommended across your sampled answers.
          </p>
          <Leaderboard competitors={result.competitors} />
        </div>
      )}

      {/* Conversion: the fix */}
      <FixCta scanId={result.id} brand={result.brand} />

      <MetaLine result={result} />

      {/* Watermark for shared screenshots */}
      <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-dim">
        Checked with
        <span className="inline-flex items-center gap-1 font-semibold text-dim">
          <span className="grid h-4 w-4 place-items-center rounded bg-brand-600 text-[9px] font-bold text-white">
            Ai
          </span>
          AmICited
        </span>
       , free AI visibility check
      </p>
    </section>
  );
}

// ── cards ────────────────────────────────────────────────────────────────────

function EngineCard({ engine, brand }: { engine: EngineSummary; brand: string }) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(engine.citationRate * 100);
  const cited = engine.citedCount > 0;
  const accent = engineAccent(engine.engine);
  const examples = engine.examples ?? [];
  const sources = citedDomains(engine.citations);

  return (
    <SpotlightCard className="h-full p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium text-fg">
          <span
            className="grid h-6 w-6 place-items-center rounded-md text-[11px] font-bold"
            style={{ background: `${accent}1a`, color: accent }}
          >
            {engine.displayName[0]}
          </span>
          {engine.displayName}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            cited ? 'bg-verdict-good/10 text-verdict-good' : 'bg-verdict-low/10 text-verdict-low'
          }`}
        >
          {cited ? <IconCheck className="h-3.5 w-3.5" /> : <IconX className="h-3.5 w-3.5" />}
          {cited ? 'Cited' : 'Not cited'}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted">
        Cited in{' '}
        <span className="font-semibold tabular-nums text-fg">
          {engine.citedCount} of {engine.sampleCount}
        </span>{' '}
        runs
        {engine.bestPosition != null && (
          <>
            {' '}
            · best position <span className="font-semibold tabular-nums text-fg">#{engine.bestPosition}</span>
          </>
        )}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${
              cited ? 'bg-verdict-good-graphic' : 'bg-verdict-low-graphic'
            }`}
            style={{ width: `${Math.max(pct, cited ? 6 : 0)}%` }}
          />
        </div>
        <span className="w-9 text-right text-xs font-medium tabular-nums text-dim">{pct}%</span>
      </div>

      {sources.length > 0 && (
        <p className="mt-3 truncate text-xs text-dim">
          Sources:{' '}
          {sources.map((s, i) => (
            <span key={s.domain}>
              {i > 0 && ' · '}
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-muted underline decoration-hair underline-offset-2 hover:text-brand-700"
              >
                {s.domain}
              </a>
            </span>
          ))}
        </p>
      )}

      {examples.length > 0 && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-dim hover:text-fg"
          >
            <IconChevron className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            {open ? 'Hide' : 'Show'} sample answers
          </button>
          {open && (
            <div className="mt-2 space-y-2 border-t border-hair pt-3">
              {examples.map((s, i) => (
                <div key={i} className="rounded-lg bg-elevated p-2.5 text-xs">
                  <p className="mb-1 text-dim">“{s.prompt}”</p>
                  <p className="leading-relaxed text-muted">{highlight(s.text, brand)}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {engine.kind === 'mock' && (
        <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-verdict-mid/80">
          demo data
        </p>
      )}
    </SpotlightCard>
  );
}

/** An engine that failed mid-scan degrades gracefully, never renders as a fake "Not cited". */
function ErrorCard({ engine }: { engine: EngineSummary }) {
  return (
    <div className="card h-full border-dashed p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium text-muted">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-elevated text-[11px] font-bold text-dim">
            {engine.displayName[0]}
          </span>
          {engine.displayName}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-verdict-mid/10 px-2.5 py-0.5 text-xs font-medium text-verdict-mid">
          <IconAlert className="h-3.5 w-3.5" /> Unreachable
        </span>
      </div>
      <p className="mt-3 text-sm text-dim">
        Couldn&apos;t reach {engine.displayName}, excluded from the score. Re-run to try again.
      </p>
    </div>
  );
}

function StubCard({ engine }: { engine: EngineSummary }) {
  return (
    <div className="card h-full p-4 opacity-75">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium text-muted">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-elevated text-[11px] font-bold text-dim">
            {engine.displayName[0]}
          </span>
          {engine.displayName}
        </span>
        <span className="chip">
          <IconClock className="h-3.5 w-3.5" /> coming soon
        </span>
      </div>
      <p className="mt-3 text-xs text-dim">
        This surface needs browser-based checking, it&apos;s on the roadmap.
      </p>
    </div>
  );
}

function PromptMatrix({ result, shown }: { result: ScanResult; shown: EngineSummary[] }) {
  return (
    <div className="card animate-fade-up overflow-x-auto p-4">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="text-left text-xs text-dim">
            <th className="pb-2 pr-3 font-medium">Prompt</th>
            {shown.map((e) => (
              <th key={e.engine} className="px-2 pb-2 text-center font-medium">
                <span className="inline-flex items-center gap-1 text-dim">
                  <span className="h-2 w-2 rounded-full" style={{ background: engineAccent(e.engine) }} />
                  {e.displayName}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.prompts.map((prompt) => (
            <tr key={prompt} className="border-t border-hair">
              <td className="max-w-[240px] truncate py-2.5 pr-3 text-muted" title={prompt}>
                {prompt}
              </td>
              {shown.map((e) => {
                const cell = (e.perPrompt ?? []).find((c) => c.prompt === prompt);
                return (
                  <td key={e.engine} className="px-2 py-2.5 text-center">
                    {cell?.cited ? (
                      <span className="inline-flex items-center gap-1 text-verdict-good">
                        <IconCheck className="h-3.5 w-3.5" />
                        {cell.bestPosition != null && (
                          <span className="text-xs tabular-nums text-dim">#{cell.bestPosition}</span>
                        )}
                      </span>
                    ) : (
                      <IconX className="mx-auto h-3.5 w-3.5 text-verdict-low/60" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-dim">
        ✓ = named in at least one sample for that prompt · #n = best position achieved
      </p>
    </div>
  );
}

function Leaderboard({ competitors }: { competitors: CompetitorTally[] }) {
  const max = Math.max(...competitors.map((c) => c.count), 1);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 60);
    return () => clearTimeout(t);
  }, []);
  return (
    <ul className="mt-4 space-y-2.5">
      {competitors.map((c, i) => (
        <li key={c.name} className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-dim">
            {i + 1}
          </span>
          <span
            className={`w-28 shrink-0 truncate text-sm ${i === 0 ? 'font-semibold text-fg' : 'text-muted'}`}
            title={c.name}
          >
            {c.name}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${i === 0 ? 'bg-brand-600' : 'bg-brand-600/60'}`}
              style={{ width: grown ? `${(c.count / max) * 100}%` : '0%' }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-dim">
            {c.count}×
          </span>
        </li>
      ))}
    </ul>
  );
}

function MetaLine({ result }: { result: ScanResult }) {
  return (
    <p className="text-center text-xs text-dim">
      {result.meta.liveCalls} live calls · {result.meta.cachedCalls} cached
      {result.meta.cappedCalls > 0 && ` · ${result.meta.cappedCalls} skipped (cost cap)`}
      {result.meta.droppedPrompts > 0 && ` · ${result.meta.droppedPrompts} prompts dropped (cap)`}
    </p>
  );
}

/** First few distinct cited domains, keeping a representative URL for each. */
function citedDomains(urls: string[]): { domain: string; url: string }[] {
  const seen = new Set<string>();
  const out: { domain: string; url: string }[] = [];
  for (const url of urls) {
    try {
      const domain = new URL(url).hostname.replace(/^www\./, '');
      if (!domain || seen.has(domain)) continue;
      seen.add(domain);
      out.push({ domain, url });
    } catch {
      /* skip malformed URLs */
    }
    if (out.length >= 3) break;
  }
  return out;
}

/** Wrap brand occurrences in a highlight mark (case-insensitive). */
function highlight(text: string, brand: string) {
  if (!brand.trim()) return text;
  const parts = text.split(new RegExp(`(${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === brand.toLowerCase() ? (
      <mark key={i} className="rounded bg-brand-100 px-0.5 font-medium text-brand-800">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
