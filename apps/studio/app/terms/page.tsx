import type { Metadata } from 'next';
import { brand } from '@orbiqon/config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${brand.brandName}. Placeholder pending legal review.`,
  alternates: { canonical: '/terms' },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl">
      <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 font-mono text-xs text-amber-800">
        Placeholder text. Pending legal review before launch. Do not treat as final.
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          By using {brand.brandName} you agree to use the tools lawfully and not to abuse the free
          checks. The free tools are provided as is, without warranty.
        </p>
        <p>
          We report sampled rates and never guarantee inclusion in AI answers. AI systems change
          frequently and results will vary over time.
        </p>
        <p>
          Paid tiers, when available, will be governed by a separate order form. This document is a
          placeholder and will be replaced with reviewed terms before public launch.
        </p>
      </div>
    </article>
  );
}
