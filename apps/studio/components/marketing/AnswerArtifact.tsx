import { Check, X } from 'lucide-react';

/**
 * The hero's signature element: a real AI answer, marked up the way the product marks it.
 * A buyer's question, the model's reply naming brands, the user's brand highlighted where it
 * is cited, and a footnote row of the four engines with who cited and who did not. This is the
 * most characteristic thing in the subject's world, so it opens the page (frontend-design skill).
 */
const ENGINES = [
  { name: 'ChatGPT', cited: true },
  { name: 'Perplexity', cited: true },
  { name: 'Claude', cited: true },
  { name: 'Gemini', cited: false },
];

export function AnswerArtifact() {
  return (
    <figure className="glass rounded-lg p-5 sm:p-6">
      {/* who was asked */}
      <figcaption className="flex items-center justify-between border-b border-hair pb-3">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-dim">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-fg text-[10px] font-bold text-canvas">
            AI
          </span>
          asked live
        </span>
        <span className="font-mono text-xs text-dim">4 engines &middot; 3 samples each</span>
      </figcaption>

      {/* the buyer's question */}
      <p className="mt-4 text-sm font-medium text-muted">
        <span className="font-mono text-xs uppercase tracking-wide text-dim">Prompt</span>
        <br />
        &ldquo;What&rsquo;s the best issue tracker for a fast-moving startup?&rdquo;
      </p>

      {/* the answer, marked up */}
      <p className="mt-4 text-[15px] leading-relaxed text-fg">
        <span className="font-mono text-xs uppercase tracking-wide text-dim">Answer</span>
        <br />
        For a fast-moving startup, the strongest options are{' '}
        <span className="brand-emphasis">Linear</span> for its speed and keyboard-first
        workflow, with <span className="font-medium text-high">Jira</span> and{' '}
        <span className="font-medium text-high">Shortcut</span> as heavier alternatives. Teams that
        want simplicity often reach for <span className="font-medium text-high">Asana</span>.
      </p>

      {/* footnotes: the four engines, honestly */}
      <div className="mt-5 border-t border-hair pt-4">
        <p className="eyebrow mb-2.5">Cited you</p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
          {ENGINES.map((e, i) => (
            <li key={e.name} className="flex items-center gap-1.5 text-sm">
              <sup className="font-mono text-[10px] text-dim">{i + 1}</sup>
              {e.cited ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-brand-700" strokeWidth={2.5} />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0 text-signal" strokeWidth={2.5} />
              )}
              <span className={e.cited ? 'text-fg' : 'text-dim'}>{e.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
