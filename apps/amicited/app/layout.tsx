import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const TITLE = 'AmICited — Am I cited by ChatGPT? Free AI visibility check';
const DESCRIPTION =
  'See whether ChatGPT, Claude, Perplexity & Gemini recommend your brand — or your competitors. ' +
  'Real sampled citation rates in about 60 seconds. Free, no signup.';

export const metadata: Metadata = {
  title: { default: TITLE, template: '%s · AmICited' },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'AmICited',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AmICited',
  applicationCategory: 'BusinessApplication',
  description: DESCRIPTION,
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Orbiqon' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-6 sm:px-8">
          <header className="mb-10 flex items-center justify-between">
            <a href="/" className="group flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                Ai
              </span>
              <span className="text-lg font-semibold tracking-tight">AmICited</span>
            </a>
            <span className="hidden text-xs font-medium uppercase tracking-widest text-slate-400 sm:block">
              Orbiqon · GEO Suite
            </span>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-20 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
            AI answers vary run to run. We sample each prompt multiple times and report the rate —
            never a fake yes/no. Nothing here guarantees inclusion in AI answers.
          </footer>
        </div>
      </body>
    </html>
  );
}
