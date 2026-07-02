import type { MDXComponents } from 'mdx/types';

/** Styles MDX blog content to match the design system. Required by @next/mdx in App Router. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl" {...props} />
    ),
    h2: (props) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-ink" {...props} />
    ),
    h3: (props) => <h3 className="mt-8 text-lg font-semibold text-ink" {...props} />,
    p: (props) => <p className="mt-4 text-base leading-relaxed text-stone-700" {...props} />,
    ul: (props) => <ul className="mt-4 list-disc space-y-1.5 pl-5 text-stone-700" {...props} />,
    ol: (props) => <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-stone-700" {...props} />,
    li: (props) => <li className="leading-relaxed" {...props} />,
    a: (props) => <a className="link" {...props} />,
    strong: (props) => <strong className="font-semibold text-ink" {...props} />,
    code: (props) => (
      <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm text-ink" {...props} />
    ),
    blockquote: (props) => (
      <blockquote className="mt-6 border-l-2 border-brand-200 pl-4 text-stone-600" {...props} />
    ),
    ...components,
  };
}
