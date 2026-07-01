'use client';

import { useEffect, useState } from 'react';

/**
 * Animated circular visibility gauge. Sweeps the ring and counts the number up on mount, honoring
 * prefers-reduced-motion (renders the final value instantly when motion is reduced).
 */
export function ScoreGauge({ score, size = 168 }: { score: number; size?: number }) {
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

  const { stroke: color, label } = tier(target);
  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
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
        <span className="font-display text-5xl font-bold tabular-nums text-white">{display}</span>
        <span className="text-xs text-slate-500">/ 100</span>
        <span className="mt-1 text-xs font-medium" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function tier(score: number): { stroke: string; label: string } {
  if (score >= 66) return { stroke: '#34d399', label: 'Strong visibility' };
  if (score >= 33) return { stroke: '#fbbf24', label: 'Patchy visibility' };
  return { stroke: '#fb7185', label: 'Low visibility' };
}
