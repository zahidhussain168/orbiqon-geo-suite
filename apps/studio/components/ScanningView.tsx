'use client';

import { useEffect, useMemo, useState } from 'react';
import { engineAccent } from '@/lib/engine-meta';
import type { EngineName } from '@orbiqon/query-engine';
import { IconSpinner } from './icons';

const LIVE_ENGINES: { id: EngineName; name: string }[] = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'perplexity', name: 'Perplexity' },
  { id: 'gemini', name: 'Gemini' },
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
  const paces = useMemo(
    () => LIVE_ENGINES.map((_, i) => 2600 + i * 480 + (i % 2) * 340),
    [],
  );
  const [counts, setCounts] = useState<number[]>(() => LIVE_ENGINES.map(() => 0));

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduce) {
      setCounts(LIVE_ENGINES.map(() => totalPerEngine - 1));
      return;
    }
    const ids = paces.map((pace, i) =>
      setInterval(() => {
        setCounts((prev) => {
          const next = [...prev];
          next[i] = Math.min((next[i] ?? 0) + 1, totalPerEngine - 1);
          return next;
        });
      }, pace),
    );
    return () => ids.forEach(clearInterval);
  }, [paces, totalPerEngine]);

  const done = counts.reduce((a, b) => a + b, 0);
  const total = LIVE_ENGINES.length * totalPerEngine;
  const pct = Math.min(96, Math.round(((done + LIVE_ENGINES.length * 0.4) / total) * 100));

  return (
    <div className="mx-auto w-full max-w-lg animate-fade-in py-8">
      <h2 className="text-center text-xl font-semibold tracking-tight text-fg">
        Checking {brand} across {LIVE_ENGINES.length} engines
      </h2>
      <p className="mt-1.5 text-center text-sm text-dim">
        We ask each engine multiple times per prompt and report the rate. This usually takes
        30–60&nbsp;seconds.
      </p>

      <ul className="card mt-6 divide-y divide-hair p-2">
        {LIVE_ENGINES.map((engine, i) => {
          const at = Math.min(counts[i] ?? 0, totalPerEngine - 1);
          const prompt = prompts[at] ?? prompts[0] ?? 'your buyer questions';
          return (
            <li key={engine.id} className="flex items-center gap-3 px-3 py-3">
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold"
                style={{ background: `${engineAccent(engine.id)}1a`, color: engineAccent(engine.id) }}
              >
                {engine.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">{engine.name}</p>
                <p className="truncate text-xs text-dim" title={prompt}>
                  Asking: “{prompt}”
                </p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-dim">
                prompt {at + 1} of {totalPerEngine}
              </span>
              <IconSpinner className="h-4 w-4 shrink-0 text-brand-600" />
            </li>
          );
        })}
      </ul>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-center text-xs text-dim">
        Sampling in progress, counters are estimates while we wait for the engines.
      </p>
    </div>
  );
}
