const ITEMS = [
  'ChatGPT',
  'Claude',
  'Perplexity',
  'Gemini',
  'Google AI Overviews',
  'sampled, not guessed',
  'real rates',
  'competitor reveal',
];

/** Infinite marquee of the engines we check and what we report. CSS only, reduced-motion safe. */
export function EngineMarquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee border-y border-stone-200 py-4">
      <div className="marquee-track gap-10">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-mono text-sm uppercase tracking-[0.06em] text-stone-500">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-brand-600" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
