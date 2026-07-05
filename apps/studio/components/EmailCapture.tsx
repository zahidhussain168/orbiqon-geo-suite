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
        body: JSON.stringify({ email, scanId: scanId ?? undefined, source: 'full-report' }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="card flex items-center gap-3 border-verdict-good/30 bg-verdict-good/10 p-5 text-sm text-muted">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-verdict-good/15 text-verdict-good">
          <IconCheck />
        </span>
        Thanks, the full report is on its way to your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-fg">
        <IconMail className="text-brand-700" />
        Get the full report
      </h3>
      <p className="mt-1 text-sm text-muted">
        Every run, every prompt, full competitor detail, as a shareable report, by email.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="field flex-1"
          aria-label="Email address"
        />
        <button type="submit" disabled={state === 'saving'} className="btn-primary shrink-0 px-5">
          {state === 'saving' ? <IconSpinner className="h-4 w-4" /> : 'Email me the report'}
        </button>
      </div>
      {state === 'error' && (
        <p role="alert" aria-live="assertive" className="mt-2 text-sm text-verdict-low">
          Couldn&apos;t save that, please try again.
        </p>
      )}
    </form>
  );
}
