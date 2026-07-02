'use client';

import { useEffect, useRef, useState } from 'react';

/** Counts up when scrolled into view. Reserves its box so the count-up causes no layout shift. */
export function StatCounter({
  to,
  suffix = '',
  prefix = '',
  label,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduce) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const start = performance.now();
          const dur = 1100;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <div ref={ref}>
      <p className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-ink sm:text-5xl">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
