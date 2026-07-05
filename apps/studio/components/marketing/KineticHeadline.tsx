'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The hero headline, QClay-style: it opens in an elegant serif and morphs into the bold sans as
 * you begin to scroll. It's a single element (no stacked copies, so no ghosting or re-wrap): the
 * text blurs and dims for a moment, the typeface swaps underneath that blur, then it sharpens back
 * into the sans. Driven by a plain scroll listener (reads window.scrollY, which Lenis updates), so
 * it stays in sync with smooth scroll. Reduced-motion renders the final sans headline statically.
 */
const SIZE = 'font-semibold leading-[1.02] tracking-tight text-5xl sm:text-7xl';

function Lines({ serif }: { serif: boolean }) {
  return (
    <>
      When AI answers,
      <br />
      are you{' '}
      {serif ? (
        <em className="italic">cited</em>
      ) : (
        <span className="mark mark-sweep not-italic">cited</span>
      )}
      <br />
      or invisible?
    </>
  );
}

/** Blur/opacity dip that peaks across the ~110-190px "swap zone" so the typeface change is masked. */
function morph(y: number): { blur: number; op: number } {
  if (y <= 0) return { blur: 0, op: 1 };
  if (y < 110) return { blur: 5 * (y / 110), op: 1 - 0.6 * (y / 110) };
  if (y < 190) return { blur: 5, op: 0.4 };
  if (y < 300) return { blur: 5 * (1 - (y - 190) / 110), op: 0.4 + 0.6 * ((y - 190) / 110) };
  return { blur: 0, op: 1 };
}

export function KineticHeadline() {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [sans, setSans] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSans(true);
      return;
    }
    let raf = 0;
    const apply = (y: number) => {
      const el = ref.current;
      if (el) {
        const { blur, op } = morph(y);
        el.style.filter = `blur(${blur.toFixed(2)}px)`;
        el.style.opacity = String(op);
      }
      setSans(y > 150);
    };
    // Lenis virtualizes scroll and doesn't reliably fire native scroll events, so subscribe to its
    // own event when present; fall back to the window scroll for reduced-motion / no-Lenis loads.
    const onWin = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(window.scrollY || 0));
    };
    const onLenis = (e: { animatedScroll?: number; scroll?: number }) =>
      apply(e?.animatedScroll ?? e?.scroll ?? window.scrollY ?? 0);

    window.addEventListener('scroll', onWin, { passive: true });

    let detach: (() => void) | undefined;
    let tries = 0;
    const bindLenis = () => {
      const l = (window as unknown as { __lenis?: { on: Function; off?: Function } }).__lenis;
      if (l?.on) {
        l.on('scroll', onLenis);
        detach = () => l.off?.('scroll', onLenis);
      } else if (tries++ < 30) {
        window.setTimeout(bindLenis, 100);
      }
    };
    bindLenis();
    apply(window.scrollY || 0);

    return () => {
      window.removeEventListener('scroll', onWin);
      detach?.();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h1
      ref={ref}
      className={`mt-5 text-fg ${SIZE} ${sans ? 'font-display' : 'font-serif'}`}
      style={{ willChange: 'filter, opacity' }}
    >
      <Lines serif={!sans} />
    </h1>
  );
}
