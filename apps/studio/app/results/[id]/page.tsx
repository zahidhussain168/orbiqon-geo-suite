import type { Metadata } from 'next';
import Link from 'next/link';
import { loadScan } from '@/lib/scan-service';
import { ResultsView } from '@/components/ResultsView';
import { EmailCapture } from '@/components/EmailCapture';
import { scoreVerdict } from '@/components/ScoreGauge';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

/** Per-scan metadata so shared report links unfurl with the brand + score. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await loadScan(params.id);
  if (!result) return { title: 'Report not found' };
  const { verdict } = scoreVerdict(result.score);
  const title = `${result.brand}: ${result.score}/100 AI visibility, ${verdict}`;
  const description =
    `How often ChatGPT, Claude, Perplexity & Gemini cite ${result.brand}, and who they name ` +
    'instead. Real sampled rates, checked free with AmICited.';
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ResultsPage({ params }: Props) {
  const result = await loadScan(params.id);

  if (!result) {
    return (
      <main className="mx-auto max-w-lg space-y-4 py-12 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-fg">Report not found</h1>
        <p className="text-muted">
          This scan isn&apos;t available, it may have expired, or persistence isn&apos;t configured
          on this deployment.
        </p>
        <Link href="/" className="btn-primary mx-auto inline-flex w-auto px-5">
          Run a new check
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <ResultsView result={result} />
      <EmailCapture scanId={result.id} />
      <p className="text-center">
        <Link
          href="/"
          className="text-sm font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-800"
        >
          Run another check →
        </Link>
      </p>
    </main>
  );
}
