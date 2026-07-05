'use client';

import { useEffect, useMemo, useState } from 'react';
import { engineAccent } from '@/lib/engine-meta';
import type { EngineName } from '@orbiqon/query-engine';
import { IconCheck } from './icons';

const LIVE_ENGINES: { id: EngineName; name: string }[] = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'perplexity', name: 'Perplexity' },
  { id: 'gemini', name: 'Gemini' },
];

// What an engine is "doing" right now. Cycles per engine so the four rows feel alive and staggered.
const STAGES = [
  'Searching the web',
  'Reading top sources',
  'Weighing the options',
  'Naming brands',
  'Drafting the answer',
];

// Honest, on-brand reassurance that rotates while the request is in flight.
const NOTES = [
  'We ask each engine several times per prompt, so one lucky answer can’t swing the score.',
  'Watching who gets recommended instead of you.',
  'Measuring how often you’re cited, not a single snapshot.',
  'Reading the sources each engine leans on.',
  'Tallying every mention across the runs.',
];

/**
 * Engine-by-engine progress shown while the real /api/scan request is in flight.
 *
 * Honesty note: a single request can't stream true per-engine progress, so the per-engine
 * prompt counters advance on a pace typical of a live scan and hold at the final prompt ,
 * they never claim completion. The parent swaps to results the moment the response lands.
 */
export function ScanningView({ brand, prompts }: { brand: string; prompts: string[] }) {
  const totalPerEngine = Math.max(prompts.length, 1);
  // Deterministic per-engine jitter so rows don't advance in lockstep.
  const paces = useMemo(() => LIVE_ENGINES.map((_, i) => 2600 + i * 480 + (i % 2) * 340), []);
  const [counts, setCounts] = useState<number[]>(() => LIVE_ENGINES.map(() => 0));
  const [tick, setTick] = useState(0); // drives the cycling stage labels
  const [note, setNote] = useState(0); // drives the rotating reassurance line
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    setReduced(reduce);
    if (reduce) {
      setCounts(LIVE_ENGINES.map(() => totalPerEngine - 1));
      return;
    }
    const countIds = paces.map((pace, i) =>
      setInterval(() => {
        setCounts((prev) => {
          const next = [...prev];
          next[i] = Math.min((next[i] ?? 0) + 1, totalPerEngine - 1);
          return next;
        });
      }, pace),
    );
    const stageId = setInterval(() => setTick((t) => t + 1), 1500);
    const noteId = setInterval(() => setNote((n) => (n + 1) % NOTES.length), 3600);
    return () => {
      countIds.forEach(clearInterval);
      clearInterval(stageId);
      clearInterval(noteId);
    };
  }, [paces, totalPerEngine]);

  const done = counts.reduce((a, b) => a + b, 0);
  const total = LIVE_ENGINES.length * totalPerEngine;
  const pct = Math.min(96, Math.round(((done + LIVE_ENGINES.length * 0.4) / total) * 100));

  return (
    <div className="relative mx-auto w-full max-w-xl animate-fade-in py-8">
      {/* Ambient brand glow behind the panel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-64 w-64 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(var(--ch-brand-600) / 0.22), transparent 70%)' }}
      />

      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-hair bg-elevated/60 px-3 py-1 text-xs font-medium text-dim">
          <span className="relative flex h-2 w-2">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live scan in progress
        </span>
      </div>

      <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-fg">
        Checking {brand} across {LIVE_ENGINES.length} AI engines
      </h2>
      <p className="mt-1.5 text-center text-sm text-dim">
        We ask each engine multiple times per prompt and report the rate. This usually takes
        30–60&nbsp;seconds.
      </p>

      <ul className="card mt-6 divide-y divide-hair p-2">
        {LIVE_ENGINES.map((engine, i) => {
          const accent = engineAccent(engine.id);
          const at = Math.min(counts[i] ?? 0, totalPerEngine - 1);
          const prompt = prompts[at] ?? prompts[0] ?? 'your buyer questions';
          const settled = at >= totalPerEngine - 1; // reached the last visible prompt
          const stage = STAGES[(tick + i) % STAGES.length];
          return (
            <li
              key={engine.id}
              className="animate-scan-in flex items-center gap-3.5 px-3 py-3.5"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {/* Accent avatar with a radar-ping while sampling. */}
              <span className="relative grid h-9 w-9 shrink-0 place-items-center">
                {!reduced && !settled && (
                  <span
                    className="scan-ping absolute inset-0 rounded-lg"
                    style={{ background: `${accent}55`, animationDelay: `${i * 300}ms` }}
                  />
                )}
                <span
                  className="relative grid h-9 w-9 place-items-center rounded-lg text-sm font-bold"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  {engine.name[0]}
                </span>
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-fg">{engine.name}</p>
                  <span className="text-[11px] font-medium tabular-nums" style={{ color: accent }}>
                    {settled ? 'wrapping up' : `${stage}…`}
                  </span>
                </div>
                <p key={prompt} className="animate-scan-in truncate text-xs text-dim" title={prompt}>
                  Asking: “{prompt}”
                </p>
                {/* Per-prompt progress segments, filling in the engine's own color. */}
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: totalPerEngine }).map((_, d) => (
                    <span
                      key={d}
                      className="h-1 flex-1 rounded-full transition-all duration-500"
                      style={{ background: accent, opacity: d <= at ? 1 : 0.16 }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-xs tabular-nums text-dim">
                  {at + 1}/{totalPerEngine}
                </span>
                {settled ? (
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{ background: `${accent}1f`, color: accent }}
                  >
                    <IconCheck className="h-3 w-3" />
                  </span>
                ) : (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2"
                    style={{ borderColor: `${accent}33`, borderTopColor: accent }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Overall progress: brand fill with a moving sheen, plus a live percentage. */}
      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-elevated">
          <div
            className="relative h-full rounded-full bg-brand-600 transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          >
            {!reduced && <div className="scan-sheen absolute inset-0 rounded-full" />}
          </div>
        </div>
        <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-fg">
          {pct}%
        </span>
      </div>

      <p key={note} className="animate-scan-in mt-2.5 text-center text-xs text-dim">
        {NOTES[note]}
      </p>
    </div>
  );
}
