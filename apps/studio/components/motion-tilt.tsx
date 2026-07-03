'use client';

import { useEffect } from 'react';

/**
 * System-wide 3D tilt. Mounted once, it delegates a single pointer listener to every element
 * marked `data-tilt` and rotates it toward the cursor via CSS variables (the transform itself
 * lives in globals `[data-tilt]`). Hover devices only, disabled under reduced motion. No per-card
 * wiring: tag any panel with `data-tilt` and it participates.
 */
export function TiltProvider({ max = 6 }: { max?: number }) {
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return;

    let current: HTMLElement | null = null;
    let raf = 0;

    function reset(el: HTMLElement | null) {
      if (!el) return;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--lift', '0');
    }

    function onMove(e: PointerEvent) {
      const target = e.target as Element | null;
      const el = (target?.closest?.('[data-tilt]') ?? null) as HTMLElement | null;
      if (el !== current) {
        reset(current);
        current = el;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
        el.style.setProperty('--lift', '1');
        el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
      });
    }

    function onLeaveWindow() {
      reset(current);
      current = null;
    }

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeaveWindow);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeaveWindow);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return null;
}
