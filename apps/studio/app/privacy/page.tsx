import type { Metadata } from 'next';
import { brand } from '@orbiqon/config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${brand.brandName}. Placeholder pending legal review.`,
  alternates: { canonical: '/privacy' },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl">
      <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 font-mono text-xs text-amber-800">
        Placeholder text. Pending legal review before launch. Do not treat as final.
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          {brand.legalEntity} collects the minimum needed to run the tools: the brand and prompts you
          enter to run a check, and an email address only when you choose to receive a report or join
          a waitlist.
        </p>
        <p>
          We do not sell personal data. We use aggregate, anonymized signals to improve the product,
          for example which tools attract the most interest.
        </p>
        <p>
          You can request deletion of your data at any time by contacting us. This document is a
          placeholder and will be replaced with a reviewed policy before public launch.
        </p>
      </div>
    </article>
  );
}
