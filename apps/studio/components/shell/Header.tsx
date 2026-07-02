'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { brand, LAYERS, toolsByLayer } from '@orbiqon/config';

const NAV = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For Agencies', href: '/agencies' },
  { label: 'Blog', href: '/blog' },
];

export function Header() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);

  // Close menus on route change.
  useEffect(() => {
    setToolsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Close the megamenu on outside click / Escape.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setToolsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setToolsOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${brand.brandName} home`}>
          <span className="grid h-8 w-8 place-items-center rounded bg-ink font-mono text-sm font-bold text-paper">
            G
          </span>
          <span className="font-semibold tracking-tight">{brand.shortName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" ref={ref}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((o) => !o)}
              aria-expanded={toolsOpen}
              className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-ink"
            >
              Tools
              <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>
            {toolsOpen && <ToolsMega />}
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/check" className="btn-primary hidden px-4 text-sm sm:inline-flex">
            Check your AI visibility free
          </Link>
          <button
            type="button"
            className="btn-secondary min-h-[40px] px-2 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && <MobileNav />}
    </header>
  );
}

function ToolsMega() {
  return (
    <div className="absolute left-0 top-full mt-2 w-[560px] rounded-lg border border-stone-200 bg-surface p-2 shadow-lift">
      <div className="grid grid-cols-3 gap-1">
        {LAYERS.map((layer) => (
          <div key={layer.id} className="p-2">
            <p className="eyebrow mb-2 px-2">{layer.label}</p>
            <ul className="space-y-0.5">
              {toolsByLayer(layer.id).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={tool.href}
                    className="block rounded px-2 py-1.5 text-sm text-stone-700 transition-colors hover:bg-surface-alt hover:text-ink"
                  >
                    <span className="flex items-center gap-1.5">
                      {tool.name}
                      {tool.status === 'soon' && (
                        <span className="rounded-full bg-stone-100 px-1.5 py-px font-mono text-[10px] uppercase tracking-wide text-stone-500">
                          Soon
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link
        href="/tools"
        className="mt-1 flex items-center justify-between rounded bg-surface-alt px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-stone-100"
      >
        See all tools and the Diagnose, Fix, Manage flow
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function MobileNav() {
  return (
    <div className="border-t border-stone-200 bg-paper px-5 py-4 md:hidden">
      <p className="eyebrow mb-2">Tools</p>
      <ul className="mb-3 space-y-0.5">
        {LAYERS.flatMap((l) => toolsByLayer(l.id)).map((tool) => (
          <li key={tool.slug}>
            <Link href={tool.href} className="flex items-center gap-1.5 rounded px-1 py-2 text-sm text-stone-700">
              {tool.name}
              {tool.status === 'soon' && (
                <span className="rounded-full bg-stone-100 px-1.5 py-px font-mono text-[10px] uppercase text-stone-500">
                  Soon
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="space-y-0.5 border-t border-stone-200 pt-3">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded px-1 py-2 text-sm font-medium text-stone-700">
            {item.label}
          </Link>
        ))}
      </div>
      <Link href="/check" className="btn-primary mt-4 w-full">
        Check your AI visibility free
      </Link>
    </div>
  );
}
