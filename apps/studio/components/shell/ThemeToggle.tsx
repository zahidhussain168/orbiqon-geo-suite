'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Light/dark toggle. The saved choice is applied before paint by an inline script in the layout,
 * so this only reflects and updates it. Persists to localStorage; defaults to light.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.theme = next ? 'dark' : 'light';
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`grid h-10 w-10 place-items-center rounded-full border border-hair text-muted transition-colors hover:border-hair-strong hover:text-fg ${className}`}
    >
      {/* Avoid an icon mismatch before mount by rendering a stable default. */}
      {mounted && dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </button>
  );
}
