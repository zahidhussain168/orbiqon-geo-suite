'use client';

import { useState } from 'react';
import { IconCheck, IconMail, IconSpinner } from './icons';

export function EmailCapture({ scanId }: { scanId: string | null }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('saving');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, scanId: scanId ?? undefined }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="card flex items-center gap-3 border-emerald-500/30 bg-emerald-500/10 p-5 text-sm">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
          <IconCheck />
        </span>
        Thanks — we&apos;ll email you the full branded report.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold">
        <IconMail className="text-brand-400" />
        Want the full branded report?
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Get the shareable PDF and your full competitor breakdown emailed to you.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="field flex-1"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={state === 'saving'}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white px-5 font-semibold text-ink transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
        >
          {state === 'saving' ? <IconSpinner className="h-5 w-5" /> : 'Email me the report'}
        </button>
      </div>
      {state === 'error' && (
        <p role="alert" aria-live="assertive" className="mt-2 text-sm text-rose-400">
          Couldn&apos;t save that — please try again.
        </p>
      )}
    </form>
  );
}
