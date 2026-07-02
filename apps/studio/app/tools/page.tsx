import type { Metadata } from 'next';
import { LAYERS, toolsByLayer } from '@orbiqon/config';
import { ToolsGrid } from '@/components/marketing/ToolsGrid';

export const metadata: Metadata = {
  title: 'Tools: the full GEO suite',
  description:
    'Every GEO Studio tool, grouped by layer. Diagnose your AI visibility for free, fix it with ' +
    'generated content and schema, and manage it across clients. Real sampled rates, never fake yes or no.',
  alternates: { canonical: '/tools' },
};

export default function ToolsIndexPage() {
  return (
    <div className="space-y-16">
      <header className="max-w-2xl">
        <p className="eyebrow">The suite</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Diagnose, fix, and manage your AI visibility
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Six tools across three layers. The free checks pull you in, the fix tools do the work,
          and the platform runs it across every client.
        </p>
      </header>

      {LAYERS.map((layer) => (
        <section key={layer.id}>
          <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-ink">
              {layer.label}
            </h2>
            <p className="text-sm text-stone-600">{layer.blurb}</p>
          </div>
          <ToolsGrid tools={toolsByLayer(layer.id)} />
        </section>
      ))}
    </div>
  );
}
