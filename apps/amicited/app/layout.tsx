import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AmICited — are you cited by the AIs?',
  description:
    'Free check: type your brand + a few prompts and see whether ChatGPT, Claude, Perplexity, ' +
    'and Gemini cite you — who gets named instead, and where you rank.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <div className="pointer-events-none fixed inset-0 -z-10 bg-glow" aria-hidden />
        <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-6 sm:px-8">
          <header className="mb-10 flex items-center justify-between">
            <a href="/" className="group flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-cyan-400 font-display text-sm font-bold text-white shadow-glow">
                Ai
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                AmICited
              </span>
            </a>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-widest text-slate-400">
              Orbiqon · GEO Suite
            </span>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-20 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
            Citation is reported as a rate from multiple samples — never a fake yes/no. AI answers
            swing over time; nothing here guarantees inclusion.
          </footer>
        </div>
      </body>
    </html>
  );
}
