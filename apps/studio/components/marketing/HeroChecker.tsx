'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/motion';

/** The checker input is the hero. Submitting takes you to /check with your brand prefilled. */
export function HeroChecker() {
  const router = useRouter();
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim()) return;
    const params = new URLSearchParams({ brand: brand.trim() });
    if (category.trim()) params.set('category', category.trim());
    router.push(`/check?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="card p-4 sm:p-5">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Brand name</span>
          <input
            className="field"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Your brand, e.g. Linear"
            aria-label="Brand name"
            autoComplete="organization"
          />
        </label>
        <label className="block">
          <span className="sr-only">Category (optional)</span>
          <input
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category, e.g. issue tracking (optional)"
            aria-label="Category (optional)"
          />
        </label>
      </div>
      <MagneticButton type="submit" disabled={!brand.trim()} className="btn-primary mt-2 w-full">
        Check my AI visibility free
        <ArrowRight className="h-4 w-4" />
      </MagneticButton>
      <p className="mt-2.5 text-center font-mono text-[11px] text-dim">
        No signup. No credit card. Results in about 60 seconds.
      </p>
    </form>
  );
}
