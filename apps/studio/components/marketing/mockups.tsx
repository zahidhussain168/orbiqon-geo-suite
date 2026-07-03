import { Check, Minus } from 'lucide-react';

/**
 * Realistic, CSS/SVG product mockups for the landing feature rows. No stock screenshots, no
 * heavy images: crisp at any size, cheap at LCP, and honest to what the product actually shows.
 * Each renders inside a small app-window Frame so the sections read as real product, not decoration.
 */

function Frame({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <div className="glass overflow-hidden rounded-lg">
      <div className="flex items-center gap-2 border-b border-hair px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hair-strong" />
        <span className="ml-2 font-mono text-[11px] text-dim">{path}</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> live
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

const SCORE_ENGINES = [
  { name: 'ChatGPT', pct: 67, cited: true },
  { name: 'Perplexity', pct: 100, cited: true },
  { name: 'Claude', pct: 44, cited: true },
  { name: 'Gemini', pct: 0, cited: false },
];

/** The headline result: a 0-100 visibility score, the verdict, and the per-engine rate. */
export function ScoreMockup() {
  const r = 34;
  const c = 2 * Math.PI * r;
  const score = 42;
  const offset = c - (score / 100) * c;
  return (
    <Frame path="amicited / linear">
      <div className="flex items-center gap-5">
        <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90 shrink-0">
          <circle cx="46" cy="46" r={r} stroke="var(--hair)" strokeWidth="9" fill="none" />
          <circle
            cx="46"
            cy="46"
            r={r}
            stroke="var(--accent)"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div>
          <p className="font-display text-4xl font-semibold tabular-nums text-fg">{score}</p>
          <p className="text-sm font-semibold text-brand-700">Partially visible</p>
          <p className="mt-0.5 font-mono text-[11px] text-dim">cited by 3 of 4 engines</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5 border-t border-hair pt-4">
        {SCORE_ENGINES.map((e) => (
          <li key={e.name} className="flex items-center gap-3">
            <span className="w-16 shrink-0 truncate text-xs text-muted">{e.name}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(e.pct, e.cited ? 5 : 2)}%`,
                  background: e.cited ? 'var(--accent)' : 'var(--signal)',
                }}
              />
            </div>
            <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-dim">
              {e.pct}%
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

const PROMPTS = [
  'best issue tracker for startups',
  'Linear vs Jira for small teams',
  'project tools engineers like',
  'lightweight agile software',
];
// cells: 2 = cited every run, 1 = sometimes, 0 = never
const GRID: number[][] = [
  [2, 2, 1, 0],
  [2, 2, 2, 0],
  [1, 2, 0, 0],
  [0, 1, 1, 0],
];
const GRID_ENGINES = ['GPT', 'PPX', 'CLD', 'GEM'];

/** The per-prompt matrix: every buyer question against every engine. */
export function PromptGridMockup() {
  return (
    <Frame path="amicited / prompts">
      <div className="grid grid-cols-[1fr_repeat(4,28px)] items-center gap-x-2 gap-y-1">
        <span className="font-mono text-[10px] uppercase tracking-wide text-dim">Prompt</span>
        {GRID_ENGINES.map((e) => (
          <span key={e} className="text-center font-mono text-[10px] text-dim">
            {e}
          </span>
        ))}
        {PROMPTS.map((p, ri) => (
          <div key={p} className="contents">
            <span className="truncate border-t border-hair py-2 text-xs text-fg" title={p}>
              {p}
            </span>
            {GRID[ri].map((v, ci) => (
              <span
                key={ci}
                className="flex justify-center border-t border-hair py-2"
                aria-label={v === 2 ? 'cited' : v === 1 ? 'sometimes' : 'not cited'}
              >
                {v === 2 ? (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-brand-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : v === 1 ? (
                  <span className="h-2 w-2 rounded-full bg-brand-200" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-dim/50" />
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

const SOV = [
  { name: 'Notion', pct: 78, you: false },
  { name: 'You (Linear)', pct: 46, you: true },
  { name: 'Asana', pct: 41, you: false },
  { name: 'ClickUp', pct: 33, you: false },
];

/** Share of voice: who AI names, and where you rank. */
export function CompetitorMockup() {
  return (
    <Frame path="amicited / rivals">
      <p className="font-mono text-[10px] uppercase tracking-wide text-dim">
        Share of voice &middot; issue tracking
      </p>
      <ul className="mt-4 space-y-3">
        {[...SOV].sort((a, b) => b.pct - a.pct).map((s) => (
          <li key={s.name} className="flex items-center gap-3">
            <span
              className={`w-24 shrink-0 truncate text-xs ${s.you ? 'font-semibold text-fg' : 'text-muted'}`}
            >
              {s.name}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full"
                style={{ width: `${s.pct}%`, background: s.you ? 'var(--accent)' : 'var(--hair-strong)' }}
              />
            </div>
            <span
              className={`w-9 shrink-0 text-right font-mono text-[11px] tabular-nums ${s.you ? 'text-brand-700' : 'text-dim'}`}
            >
              {s.pct}%
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-hair pt-3 text-xs text-muted">
        Notion is named <span className="font-semibold text-fg">1.7&times;</span> more than you. Close
        that gap and you move up the list.
      </p>
    </Frame>
  );
}
