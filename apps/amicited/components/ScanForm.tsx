'use client';

import { useMemo, useState } from 'react';
import type { ScanResult } from '@/lib/types';
import { KNOWN_CATEGORIES, suggestPrompts } from '@/lib/prompts';
import { ResultsView } from './ResultsView';
import { ResultsSkeleton } from './ResultsSkeleton';
import { EmailCapture } from './EmailCapture';
import { IconArrowRight, IconSearch, IconSparkles, IconSpinner } from './icons';

export function ScanForm() {
  const [brand, setBrand] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('');
  const [promptsText, setPromptsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const suggestions = useMemo(() => {
    if (!brand.trim() && !category.trim()) return [];
    return suggestPrompts(category, brand);
  }, [brand, category]);

  const currentPrompts = promptsText
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  function addPrompt(p: string) {
    if (currentPrompts.includes(p)) return;
    setPromptsText((prev) => (prev.trim() ? `${prev.trim()}\n${p}` : p));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          website: website || undefined,
          category: category || undefined,
          prompts: currentPrompts.length ? currentPrompts : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Scan failed');
      setResult(data as ScanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="card space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand name" required>
            <input
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Notion"
              className="field"
              aria-label="Brand name"
            />
          </Field>
          <Field label="Website" hint="optional">
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="notion.so"
              className="field"
              aria-label="Website"
            />
          </Field>
        </div>

        <Field label="Category" hint="helps auto-suggest prompts">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="categories"
            placeholder="project management"
            className="field"
            aria-label="Category"
          />
          <datalist id="categories">
            {KNOWN_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field label="Prompts" hint="one per line — or tap a suggestion">
          <textarea
            value={promptsText}
            onChange={(e) => setPromptsText(e.target.value)}
            rows={3}
            placeholder={'best project management tool for startups\ntop Asana alternatives'}
            className="field resize-none"
            aria-label="Prompts to check"
          />
          {suggestions.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {suggestions
                .filter((s) => !currentPrompts.includes(s))
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addPrompt(s)}
                    className="chip hover:border-brand/50 hover:text-white"
                  >
                    <IconSparkles className="h-3.5 w-3.5 text-brand-400" />
                    {s}
                  </button>
                ))}
            </div>
          )}
        </Field>

        <button
          type="submit"
          disabled={loading || !brand.trim()}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-cyan-500 px-4 py-3 font-semibold text-white shadow-glow transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <>
              <IconSpinner className="h-5 w-5" /> Asking the AIs…
            </>
          ) : (
            <>
              <IconSearch className="h-5 w-5" /> Check my visibility
            </>
          )}
        </button>

        {error && (
          <p role="alert" aria-live="assertive" className="text-sm text-rose-400">
            {error}
          </p>
        )}
      </form>

      {loading && <ResultsSkeleton />}

      {result && !loading && (
        <div className="space-y-8">
          <ResultsView result={result} />
          <EmailCapture scanId={result.id} />
          {result.id && (
            <p className="text-center text-xs text-slate-500">
              Shareable link:{' '}
              <a className="inline-flex items-center gap-1 text-brand-400 hover:underline" href={`/results/${result.id}`}>
                /results/{result.id} <IconArrowRight className="h-3 w-3" />
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        {label}
        {required && <span className="text-brand-400">*</span>}
        {hint && <span className="text-slate-600">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}
