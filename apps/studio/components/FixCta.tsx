'use client';

import { useState } from 'react';
import { IconCheck, IconSpinner, IconWrench } from './icons';

/**
 * "Fix this" conversion block. The fix tools (answer blocks, comparison pages, auto-publish)
 * aren't live yet, so this is an honest interest capture, never a dead link, never an overclaim.
 */
export function FixCta({ scanId, brand }: { scanId: string | null; brand: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('saving');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, scanId: scanId ?? undefined, source: 'fix-waitlist' }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <div id="fix" className="card scroll-mt-6 border-brand-200 bg-brand-50/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-stone-900">
        <IconWrench className="text-brand-700" />
        Want to change these results?
      </h2>
      <p className="mt-1.5 max-w-xl text-sm text-stone-600">
        We&apos;re building the fix layer: the answer blocks, comparison pages, and structured
        content that help {brand} earn citations, generated and published for you. Join the early
        list and we&apos;ll onboard you first. No promises of instant rankings; AI answers move
        month to month.
      </p>

      {state === 'done' ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
          <IconCheck className="h-4 w-4" /> You&apos;re on the list, we&apos;ll be in touch.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            autoComplete="email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="field flex-1"
            aria-label="Email for the fix waitlist"
          />
          <button type="submit" disabled={state === 'saving'} className="btn-primary shrink-0 px-5">
            {state === 'saving' ? <IconSpinner className="h-4 w-4" /> : 'Fix this'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p role="alert" aria-live="assertive" className="mt-2 text-sm text-rose-600">
          Couldn&apos;t save that, please try again.
        </p>
      )}
    </div>
  );
}
