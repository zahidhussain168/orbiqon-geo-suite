'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

function prefersReduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * One-shot scroll reveal: fades content up when it enters the viewport, then unobserves.
 * Renders visible immediately when motion is reduced or IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  as: As = 'div',
  delayIndex = 0,
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  delayIndex?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (prefersReduced() || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ ['--i' as string]: delayIndex }}
    >
      {children}
    </As>
  );
}

/** Card wrapper that tracks the pointer with a soft radial highlight (rAF-throttled). */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReduced()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    });
  }

  return (
    <div ref={ref} onPointerMove={onMove} className={`card spotlight ${className}`}>
      {children}
    </div>
  );
}

/** Primary CTA that leans slightly toward the cursor (hover devices only), springs back on leave. */
export function MagneticButton({
  children,
  className = '',
  strength = 6,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { strength?: number }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const raf = useRef(0);

  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (prefersReduced() || !window.matchMedia('(hover: hover)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength;
    const dy = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--dx', `${dx}px`);
      el.style.setProperty('--dy', `${dy}px`);
    });
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--dx', '0px');
    el.style.setProperty('--dy', '0px');
  }

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`magnetic ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Splits a heading into word spans that fade up in sequence on load. */
export function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={`word-reveal ${className}`}>
      {words.map((w, i) => (
        <span key={i} style={{ ['--wi' as string]: i }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
