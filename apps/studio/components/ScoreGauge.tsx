'use client';

import { useEffect, useState } from 'react';

/**
 * Animated visibility gauge. Sweeps the ring and counts up on mount; renders the final value
 * instantly when the user prefers reduced motion. Verdict is factual, not alarmist.
 */
export function ScoreGauge({ score, size = 176 }: { score: number; size?: number }) {
  const target = Math.max(0, Math.min(100, Math.round(score)));
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const { color, verdict } = scoreVerdict(target);
  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold tabular-nums tracking-tight text-stone-900">
          {display}
        </span>
        <span className="text-xs text-stone-400">/ 100</span>
      </div>
    </div>
  );
}

/** Verdict labels are factual, not alarmist. */
export function scoreVerdict(score: number): { color: string; verdict: string } {
  if (score >= 66) return { color: '#059669', verdict: 'Well cited' };
  if (score >= 33) return { color: '#d97706', verdict: 'Partially visible' };
  return { color: '#e11d48', verdict: 'Mostly invisible to AI' };
}
