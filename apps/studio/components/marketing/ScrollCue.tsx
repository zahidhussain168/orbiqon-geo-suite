'use client';

import { ArrowDown } from 'lucide-react';

/**
 * QClay-style circular scroll cue: a slowly rotating ring of text around a bouncing arrow.
 * Purely decorative. The rotation pauses under reduced-motion (handled in globals.css).
 */
export function ScrollCue({ className = '' }: { className?: string }) {
  return (
    <div className={`scroll-cue relative grid h-28 w-28 place-items-center ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" className="scroll-cue-ring absolute inset-0 h-full w-full">
        <defs>
          <path id="cue-arc" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-dim text-[9px] font-medium uppercase" style={{ letterSpacing: '0.18em' }}>
          <textPath href="#cue-arc" startOffset="0">
            scroll to see your score • scroll to see your score •
          </textPath>
        </text>
      </svg>
      <span className="scroll-cue-dot grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white">
        <ArrowDown className="h-4 w-4" />
      </span>
    </div>
  );
}
