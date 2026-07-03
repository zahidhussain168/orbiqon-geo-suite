const ROWS: { name: string; pct: number; you?: boolean }[] = [
  { name: 'Notion', pct: 72 },
  { name: 'Asana', pct: 61 },
  { name: 'ClickUp', pct: 44 },
  { name: 'You', pct: 18, you: true },
];

/**
 * The restrained live data element beside the hero: a sample share-of-voice panel.
 * CSS-only bar growth (no JS). Labeled "Sample" so it is never mistaken for real data.
 */
export function SovPeek() {
  return (
    <div className="card p-5 sm:p-6" aria-hidden>
      <div className="flex items-center justify-between">
        <p className="eyebrow">Sample result</p>
        <span className="font-mono text-[11px] text-dim">4 engines, sampled</span>
      </div>
      <p className="mt-2 text-sm font-medium text-ink">
        Who AI names for <span className="font-mono text-brand-700">best issue tracker for teams</span>
      </p>
      <ul className="mt-4 space-y-2.5">
        {ROWS.map((r, i) => (
          <li key={r.name} className="flex items-center gap-3">
            <span
              className={`w-16 shrink-0 truncate text-sm ${r.you ? 'font-semibold text-ink' : 'text-muted'}`}
            >
              {r.name}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full motion-safe:animate-[sov-grow_0.9s_cubic-bezier(0.22,0.61,0.36,1)_both]"
                style={{
                  ['--sov' as string]: `${r.pct}%`,
                  width: `${r.pct}%`,
                  animationDelay: `${i * 90}ms`,
                  background: r.you ? '#5E6AD2' : '#3A3A42',
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-dim">
              {r.pct}%
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-hair pt-3 text-xs text-dim">
        Rates from repeated samples, not a single yes or no.
      </p>
    </div>
  );
}
