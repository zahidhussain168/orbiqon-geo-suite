import type { Tool, ToolLayer } from '@orbiqon/config';

export interface Step {
  n: string;
  title: string;
  body: string;
}

/** Three-step "how it works", keyed by layer so each tool reads true to what it does. */
const STEPS_BY_LAYER: Record<ToolLayer, Step[]> = {
  DIAGNOSE: [
    { n: '01', title: 'Tell it your brand', body: 'Enter your brand and a few buyer prompts, or let it suggest the prompts for your category. No signup.' },
    { n: '02', title: 'We ask the engines', body: 'It queries ChatGPT, Claude, Perplexity and Gemini several times per prompt, so the result is a rate and not a coin flip.' },
    { n: '03', title: 'You get the read', body: 'A clear score, who gets named instead of you, and where you rank. Then a direct path to the fix.' },
  ],
  FIX: [
    { n: '01', title: 'Point it at the page', body: 'Give it a URL or a prompt you want to win. It reads what is there and what is currently cited.' },
    { n: '02', title: 'It generates the fix', body: 'Answer-first blocks, schema, or full pages built in the shape AI engines actually quote. Grounded in evidenced levers, not guesses.' },
    { n: '03', title: 'Review and publish', body: 'You approve the output, then publish or export. Optionally track whether the page starts getting cited.' },
  ],
  MANAGE: [
    { n: '01', title: 'Add your clients', body: 'Each client gets an isolated workspace. Set the prompts and competitors that matter for their category.' },
    { n: '02', title: 'Track and surface gaps', body: 'Scheduled runs across every engine, share-of-voice dashboards, and the winnable gaps ranked for each client.' },
    { n: '03', title: 'Fix and report', body: 'Generate the fixes inside the platform and send branded reports under your own domain and logo.' },
  ],
};

export interface Faq {
  q: string;
  a: string;
}

export function toolSteps(tool: Tool): Step[] {
  return STEPS_BY_LAYER[tool.layer];
}

export function toolFaq(tool: Tool): Faq[] {
  const availability =
    tool.status === 'live'
      ? 'It is live and free to use. Open the tool above, no signup required.'
      : `Planned pricing is ${tool.plannedPrice ?? 'to be announced'}. Join the waitlist and we will onboard you first.`;

  return [
    {
      q: `Does ${tool.name} guarantee AI will cite me?`,
      a: 'No. Nothing here guarantees inclusion, and AI answers move month to month. We report real sampled rates and build the levers that genuinely help. Honesty is the point.',
    },
    {
      q: tool.status === 'live' ? `Is ${tool.name} really free?` : `When does ${tool.name} launch and what will it cost?`,
      a: availability,
    },
    {
      q: 'How is this different from a monitoring dashboard?',
      a: 'Most tools stop at the report. We do the work: generate the content and structure that earns citations, and in the platform, publish it for you.',
    },
  ];
}
