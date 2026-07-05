import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.08em] text-brand-700">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
        That page is not cited here
      </h1>
      <p className="mt-3 text-muted">
        The link may be old or the page may have moved. Here is the fastest way back to something
        useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/check" className="btn-primary px-5">
          Check my AI visibility free
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/tools" className="btn-secondary">
          Browse the tools
        </Link>
      </div>
    </div>
  );
}
