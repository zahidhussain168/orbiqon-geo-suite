import type { Tool } from '@orbiqon/config';
import { ToolCard } from './ToolCard';
import { Reveal } from '@/components/motion';

/**
 * Staggered tool cards. CSS scroll-driven reveal (IntersectionObserver), no motion library,
 * so the marketing pages ship no animation JS in the critical path. Reduced-motion safe.
 */
export function ToolsGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, i) => (
        <Reveal key={tool.slug} delayIndex={i % 3} className="h-full">
          <ToolCard tool={tool} index={i} />
        </Reveal>
      ))}
    </div>
  );
}
