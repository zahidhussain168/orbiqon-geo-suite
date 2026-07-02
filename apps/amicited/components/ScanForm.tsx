'use client';

import { useState } from 'react';
import type { ScanResult } from '@/lib/types';
import { KNOWN_CATEGORIES, suggestPrompts } from '@/lib/prompts';
import { PRESETS, type Preset } from '@/lib/engine-meta';
import { ResultsView } from './ResultsView';
import { ScanningView } from './ScanningView';
import { EmailCapture } from './EmailCapture';
import { IconArrowRight, IconPlus, IconSparkles, IconX } from './icons';

type Phase = 'idle' | 'scanning' | 'results';

const MIN_SCAN_MS = 1200; // keep the progress state readable even when the backend is instant
const MAX_PROMPTS = 5;

export function ScanForm() {
  const [brand, setBrand] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  function applyPreset(p: Preset) {
    setBrand(p.brand);
    setWebsite(p.website);
    setCategory(p.category);
    setPrompts(p.prompts.slice(0, MAX_PROMPTS));
    setResult(null);
    setError(null);
    setPhase('idle');
  }

  function addPrompt(p: string) {
    const v = p.trim();
    if (!v || prompts.includes(v)) return;
    setPrompts((prev) => [...prev, v].slice(0, MAX_PROMPTS));
    setDraft('');
  }

  function suggestForMe() {
    const fresh = suggestPrompts(category, brand).filter((s) => !prompts.includes(s));
    setPrompts((prev) => [...prev, ...fresh].slice(0, MAX_PROMPTS));
  }

  async function run() {
    if (!brand.trim() || !prompts.length) return;
    setError(null);
    setResult(null);
    setPhase('scanning');
    const started = Date.now();
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          website: website || undefined,
          category: category || undefined,
          prompts,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Scan failed');
      const wait = Math.max(0, MIN_SCAN_MS - (Date.now() - started));
      if (wait) await new Promise((r) => setTimeout(r, wait));
      setResult(data as ScanResult);
      setPhase('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong — please try again.');
      setPhase('idle');
    }
  }

  if (phase === 'scanning') {
    return <ScanningView brand={brand} prompts={prompts} />;
  }

  if (phase === 'results' && result) {
    return (
      <div className="space-y-8">
        <ResultsView result={result} onRerun={run} onNew={() => setPhase('idle')} />
        <EmailCapture scanId={result.id} />
        {result.id && (
          <p className="text-center text-xs text-slate-500">
            Shareable link:{' '}
            <a
              className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline"
              href={`/results/${result.id}`}
            >
              /results/{result.id} <IconArrowRight className="h-3 w-3" />
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Hero — the form is the product */}
      <section className="text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.75rem] sm:leading-[1.1]">
          Is AI recommending you —{' '}
          <span className="text-brand-700">or your competitors?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Check whether ChatGPT, Claude, Perplexity &amp; Gemini cite your brand. About 60 seconds.
          Free, no signup.
        </p>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="card space-y-5 p-5 sm:p-7"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand name" required>
            <input
              className="field"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Linear"
              autoComplete="organization"
              name="brand"
              aria-label="Brand name"
            />
          </Field>
          <Field label="Website" hint="optional">
            <input
              className="field"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g. linear.app"
              inputMode="url"
              spellCheck={false}
              name="website"
              aria-label="Website"
            />
          </Field>
        </div>

        <Field label="Category" hint="helps us suggest the right prompts">
          <input
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="categories"
            placeholder="e.g. issue tracking"
            name="category"
            aria-label="Category"
          />
          <datalist id="categories">
            {KNOWN_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field label={`Prompts to check (up to ${MAX_PROMPTS})`} hint="what a buyer would ask an AI">
          {prompts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => setPrompts((prev) => prev.filter((x) => x !== p))}
                    className="text-brand-700/60 hover:text-brand-800"
                    aria-label={`Remove prompt: ${p}`}
                  >
                    <IconX className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <input
              className="field"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addPrompt(draft);
                }
              }}
              placeholder="e.g. best issue tracker for startups…"
              aria-label="Add a prompt"
              disabled={prompts.length >= MAX_PROMPTS}
            />
            <button
              type="button"
              onClick={() => addPrompt(draft)}
              className="btn-secondary w-[42px] shrink-0 px-0"
              aria-label="Add prompt"
              disabled={prompts.length >= MAX_PROMPTS || !draft.trim()}
            >
              <IconPlus />
            </button>
          </div>

          {prompts.length < MAX_PROMPTS && (
            <button type="button" onClick={suggestForMe} className="btn-secondary mt-2.5">
              <IconSparkles className="h-4 w-4 text-brand-600" />
              Suggest prompts for me
            </button>
          )}
        </Field>

        <button type="submit" disabled={!brand.trim() || !prompts.length} className="btn-primary w-full">
          Check my AI visibility
          <IconArrowRight className="h-4 w-4" />
        </button>

        {error && (
          <p role="alert" aria-live="assertive" className="text-sm text-rose-600">
            {error}
          </p>
        )}
      </form>

      {/* Trust strip */}
      <p className="text-center text-xs text-slate-500">
        No signup · No credit card · Results in ~60s · Real sampled rates, not fake yes/no answers
      </p>

      {/* Quiet examples row */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        <span>Try an example:</span>
        {PRESETS.map((p) => (
          <button
            key={p.brand}
            type="button"
            onClick={() => applyPreset(p)}
            className="font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-brand-700"
          >
            {p.brand}
          </button>
        ))}
      </div>
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
      <span className="flex flex-wrap items-baseline gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-brand-700">*</span>}
        {hint && <span className="text-xs font-normal text-slate-400">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}
