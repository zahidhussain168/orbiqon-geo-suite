'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Site-wide smooth scroll (the "premium glide"). Uses native scroll under the hood, so the
 * fixed hero video and sticky header keep working. Disabled entirely under reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Coarse-pointer (touch) devices already scroll smoothly; native momentum beats JS there.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    // Handy for anchor-link smooth scrolling and debugging.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
