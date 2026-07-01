import Link from 'next/link';
import { loadScan } from '@/lib/scan-service';
import { ResultsView } from '@/components/ResultsView';

export const dynamic = 'force-dynamic';

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const result = await loadScan(params.id);

  if (!result) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-semibold">Report not found</h1>
        <p className="text-slate-400">
          This scan isn&apos;t available — it may have expired, or persistence isn&apos;t configured
          on this deployment.
        </p>
        <Link href="/" className="text-brand-400 underline">
          Run a new check →
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <ResultsView result={result} />
      <Link href="/" className="inline-block text-sm text-brand-400 underline">
        Run another check →
      </Link>
    </main>
  );
}
