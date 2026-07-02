import type { Metadata } from 'next';
import { ScanForm } from '@/components/ScanForm';

export const metadata: Metadata = {
  title: 'AmICited: are you cited by ChatGPT, Claude, Perplexity and Gemini?',
  description:
    'Free AI visibility check. Enter your brand and a few prompts to see whether the AI engines ' +
    'cite you, who they name instead, and where you rank. Real sampled rates, never a fake yes or no.',
  alternates: { canonical: '/check' },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AmICited',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function CheckPage({
  searchParams,
}: {
  searchParams?: { brand?: string; category?: string };
}) {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <ScanForm initialBrand={searchParams?.brand ?? ''} initialCategory={searchParams?.category ?? ''} />
    </>
  );
}
