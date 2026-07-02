'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

/** Per-tool waitlist capture. Posts to /api/waitlist, graceful when no DB is configured. */
export function WaitlistForm({ toolSlug, compact = false }: { toolSlug: string; compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('saving');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, toolSlug }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className={`flex items-center gap-2 text-sm font-medium text-verdict-good ${compact ? '' : 'py-1'}`}>
        <Check className="h-4 w-4" /> You are on the list. We will be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        autoComplete="email"
        spellCheck={false}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="field flex-1"
        aria-label={`Join the ${toolSlug} waitlist`}
      />
      <button type="submit" disabled={state === 'saving'} className="btn-primary shrink-0 px-5">
        {state === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Join the waitlist'}
      </button>
      {state === 'error' && (
        <p role="alert" aria-live="assertive" className="text-sm text-verdict-low sm:hidden">
          Could not save that. Please try again.
        </p>
      )}
    </form>
  );
}
