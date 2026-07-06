import type { Metadata } from 'next';
import { LAYERS, toolsByLayer } from '@orbiqon/config';
import { ToolsGrid } from '@/components/marketing/ToolsGrid';
import { SectionFx } from '@/components/marketing/SectionFx';

const LAYER_FX = ['grid', 'dots', 'mesh'] as const;

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
      <header className="relative isolate overflow-hidden max-w-2xl">
        <SectionFx variant="aurora" />
        <p className="eyebrow">The suite</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Diagnose, fix, and manage your AI visibility
        </h1>
        <p className="mt-4 text-lg text-muted">
          Six tools across three layers. The free checks pull you in, the fix tools do the work,
          and the platform runs it across every client.
        </p>
      </header>

      {LAYERS.map((layer, i) => (
        <section key={layer.id} className="relative isolate">
          <SectionFx variant={LAYER_FX[i % LAYER_FX.length]} />
          <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-ink">
              {layer.label}
            </h2>
            <p className="text-sm text-muted">{layer.blurb}</p>
          </div>
          <ToolsGrid tools={toolsByLayer(layer.id)} />
        </section>
      ))}
    </div>
  );
}
