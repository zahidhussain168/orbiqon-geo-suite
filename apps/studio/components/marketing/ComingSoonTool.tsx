import { Check } from 'lucide-react';
import { LAYERS, type Tool } from '@orbiqon/config';
import { WaitlistForm } from './WaitlistForm';

/** The single reused coming-soon block: layer chip, planned price, 3 capabilities, waitlist. */
export function ComingSoonTool({ tool }: { tool: Tool }) {
  const layer = LAYERS.find((l) => l.id === tool.layer);
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">
          Part of the {layer?.label} layer
        </span>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-stone-500">
          Coming soon
        </span>
        {tool.plannedPrice && (
          <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 font-mono text-[11px] font-medium text-brand-700">
            {tool.plannedPrice}
          </span>
        )}
      </div>

      <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
        Be first when {tool.name} ships
      </h2>
      <p className="mt-1.5 max-w-xl text-sm text-stone-600">{tool.oneLiner}</p>

      <ul className="mt-5 space-y-2">
        {tool.capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-2 text-sm text-stone-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
            {cap}
          </li>
        ))}
      </ul>

      <div className="mt-6 max-w-md">
        <WaitlistForm toolSlug={tool.slug} />
        <p className="mt-2 text-xs text-stone-500">
          One email when it launches. Which tool gets the most signups tells us what to build next.
        </p>
      </div>
    </div>
  );
}
