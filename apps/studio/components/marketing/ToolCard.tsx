'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ScanSearch,
  Target,
  Bot,
  Braces,
  FileText,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';
import type { Tool } from '@orbiqon/config';

const ICONS: Record<string, LucideIcon> = {
  amicited: ScanSearch,
  'prompt-gap-finder': Target,
  'crawler-audit': Bot,
  schemaforge: Braces,
  'citation-content-builder': FileText,
  'geo-studio': LayoutDashboard,
};

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const raf = useRef(0);
  const Icon = ICONS[tool.slug] ?? ScanSearch;

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const hover = window.matchMedia?.('(hover: hover)').matches;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      if (!reduce && hover) {
        el.style.transform = `perspective(900px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
      }
    });
  }

  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = '';
  }

  return (
    <Link
      ref={ref}
      href={tool.href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="card spotlight group flex h-full flex-col p-5 [transform-style:preserve-3d]"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded bg-surface-alt text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
        {tool.status === 'live' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> Live
          </span>
        ) : (
          <span className="rounded-full bg-elevated px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-dim">
            Soon
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold text-ink">{tool.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{tool.oneLiner}</p>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
        {tool.status === 'live' ? 'Open the tool' : 'Get on the waitlist'}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
