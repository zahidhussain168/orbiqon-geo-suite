import type { CompetitorTally, EngineSummary, ScanResult } from '@/lib/types';
import { ScoreGauge } from './ScoreGauge';
import { IconCheck, IconClock, IconTrophy, IconX } from './icons';

/** Pure presentational results view — shared by the live scan (client) and /results (server). */
export function ResultsView({ result }: { result: ScanResult }) {
  const citedEngines = result.engines.filter((e) => e.status === 'ok' && e.citedCount > 0).length;
  const liveEngines = result.engines.filter((e) => e.status === 'ok').length;

  return (
    <section className="space-y-6">
      {/* Hero: gauge + headline stats */}
      <div className="card animate-fade-up p-6 sm:p-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
          <ScoreGauge score={result.score} />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-slate-500">Visibility score for</p>
            <h1 className="truncate font-display text-3xl font-bold">{result.brand}</h1>
            <p className="mt-3 text-sm text-slate-400">
              Cited by{' '}
              <span className="font-semibold text-white">
                {citedEngines} of {liveEngines}
              </span>{' '}
              engines, across {result.prompts.length} prompt
              {result.prompts.length === 1 ? '' : 's'} sampled {result.meta.samples}× each.
            </p>
            {result.meta.mock && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                Mock data — add API keys to run live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Per engine */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          By engine
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.engines.map((e, i) => (
            <div key={e.engine} className="animate-fade-up" style={{ animationDelay: `${i * 45}ms` }}>
              <EngineCard engine={e} brand={result.brand} />
            </div>
          ))}
        </div>
      </div>

      {/* Competitor reveal */}
      {result.competitors.length > 0 && (
        <div
          className="card animate-fade-up p-6"
          style={{ animationDelay: `${result.engines.length * 45}ms` }}
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <IconTrophy className="text-amber-400" />
            Who got named instead
          </h2>
          <Leaderboard competitors={result.competitors} />
        </div>
      )}

      <MetaLine result={result} />
    </section>
  );
}

function EngineCard({ engine, brand }: { engine: EngineSummary; brand: string }) {
  if (engine.status === 'not_implemented') {
    return (
      <div className="card h-full p-4 opacity-70">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <Monogram name={engine.displayName} muted />
            {engine.displayName}
          </span>
          <span className="chip">
            <IconClock className="h-3.5 w-3.5" /> coming soon
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-500">Headless-scraping surface — not live yet.</p>
      </div>
    );
  }

  const pct = Math.round(engine.citationRate * 100);
  const cited = engine.citedCount > 0;

  return (
    <div className="card h-full p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <Monogram name={engine.displayName} />
          {engine.displayName}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            cited
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'bg-rose-500/15 text-rose-300'
          }`}
        >
          {cited ? <IconCheck className="h-3.5 w-3.5" /> : <IconX className="h-3.5 w-3.5" />}
          {cited ? 'Cited' : 'Not cited'}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-300">
        <span className="font-semibold tabular-nums text-white">
          {engine.citedCount}/{engine.sampleCount}
        </span>{' '}
        runs named {brand}
        {engine.bestPosition != null && (
          <>
            {' '}
            · best rank <span className="tabular-nums text-white">#{engine.bestPosition}</span>
          </>
        )}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${
              cited ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
            style={{ width: `${Math.max(pct, cited ? 6 : 0)}%` }}
          />
        </div>
        <span className="w-9 text-right text-xs font-medium tabular-nums text-slate-400">{pct}%</span>
      </div>

      {engine.kind === 'mock' && (
        <p className="mt-2 text-[11px] uppercase tracking-wide text-amber-500/70">mock</p>
      )}
    </div>
  );
}

function Leaderboard({ competitors }: { competitors: CompetitorTally[] }) {
  const max = Math.max(...competitors.map((c) => c.count), 1);
  return (
    <ul className="mt-4 space-y-2.5">
      {competitors.map((c, i) => (
        <li key={c.name} className="flex items-center gap-3">
          <span className="w-5 text-right text-xs font-semibold tabular-nums text-slate-500">
            {i + 1}
          </span>
          <span className="w-32 shrink-0 truncate text-sm text-slate-200" title={c.name}>
            {c.name}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-cyan-400"
              style={{ width: `${(c.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs tabular-nums text-slate-400">{c.count}</span>
        </li>
      ))}
    </ul>
  );
}

function Monogram({ name, muted }: { name: string; muted?: boolean }) {
  return (
    <span
      className={`grid h-6 w-6 place-items-center rounded-md text-[11px] font-bold ${
        muted ? 'bg-white/5 text-slate-500' : 'bg-white/10 text-slate-200'
      }`}
    >
      {name.charAt(0)}
    </span>
  );
}

function MetaLine({ result }: { result: ScanResult }) {
  return (
    <p className="text-center text-xs text-slate-500">
      {result.meta.liveCalls} live calls · {result.meta.cachedCalls} cached
      {result.meta.cappedCalls > 0 && ` · ${result.meta.cappedCalls} skipped (cost cap)`}
      {result.meta.droppedPrompts > 0 && ` · ${result.meta.droppedPrompts} prompts dropped (cap)`}
    </p>
  );
}
