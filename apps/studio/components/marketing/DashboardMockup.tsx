/**
 * The hero product visual: a glassy, floating mock of an AmICited result. Built with CSS/SVG
 * (no stock screenshot, no heavy image) so it stays crisp and costs nothing at LCP.
 */
const ENGINES = [
  { name: 'ChatGPT', pct: 67, cited: true },
  { name: 'Claude', pct: 44, cited: true },
  { name: 'Perplexity', pct: 100, cited: true },
  { name: 'Gemini', pct: 0, cited: false },
];
const COMPETITORS = [
  { name: 'Notion', pct: 90 },
  { name: 'Asana', pct: 72 },
];

export function DashboardMockup() {
  const r = 34;
  const c = 2 * Math.PI * r;
  const score = 42;
  const offset = c - (score / 100) * c;

  return (
    <div className="glass float relative rounded-lg p-5" aria-hidden>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-dim">amicited / check</span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-verdict-mid">
          <span className="h-1.5 w-1.5 rounded-full bg-verdict-mid-graphic" /> live
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90 shrink-0">
          <circle cx="44" cy="44" r={r} stroke="rgba(255,255,255,0.10)" strokeWidth="9" fill="none" />
          <circle
            cx="44"
            cy="44"
            r={r}
            stroke="#E2A336"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div>
          <p className="font-mono text-3xl font-semibold tabular-nums text-ink">{score}</p>
          <p className="text-xs font-medium text-verdict-mid">Partially visible</p>
          <p className="mt-0.5 font-mono text-[11px] text-dim">cited by 3 of 4 engines</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 border-t border-hair/70 pt-4">
        {ENGINES.map((e, i) => (
          <li key={e.name} className="flex items-center gap-2.5">
            <span className="w-16 shrink-0 truncate text-xs text-muted">{e.name}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hair/70">
              <div
                className="h-full rounded-full motion-safe:animate-[sov-grow_0.9s_cubic-bezier(0.22,0.61,0.36,1)_both]"
                style={{
                  ['--sov' as string]: `${Math.max(e.pct, e.cited ? 6 : 0)}%`,
                  width: `${Math.max(e.pct, e.cited ? 6 : 0)}%`,
                  animationDelay: `${i * 80}ms`,
                  background: e.cited ? '#3FB950' : '#EB5757',
                }}
              />
            </div>
            <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-dim">
              {e.pct}%
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded border border-hair/70 bg-surface/[0.04] p-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-dim">named instead</p>
        <ul className="mt-2 space-y-1.5">
          {COMPETITORS.map((cm) => (
            <li key={cm.name} className="flex items-center gap-2.5">
              <span className="w-14 shrink-0 text-xs text-muted">{cm.name}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hair/70">
                <div className="h-full rounded-full bg-brand-600" style={{ width: `${cm.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
