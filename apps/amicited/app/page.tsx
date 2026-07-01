import { ScanForm } from '@/components/ScanForm';
import { IconSparkles } from '@/components/icons';

const ENGINES = ['ChatGPT', 'Claude', 'Perplexity', 'Gemini'];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="mx-auto max-w-2xl text-center">
        <span className="chip mx-auto mb-5 border-brand/30 bg-brand/10 text-brand-400">
          <IconSparkles className="h-3.5 w-3.5" />
          Free · no signup · unlimited
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          Are you cited by <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">the AIs?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Type your brand and a few prompts. We ask the AI engines, then show whether they cite you,
          who gets named instead, and where you rank.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {ENGINES.map((e) => (
            <span key={e} className="chip">
              {e}
            </span>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-2xl">
        <ScanForm />
      </div>
    </div>
  );
}
