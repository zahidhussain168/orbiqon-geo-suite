import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { brand } from '@orbiqon/config';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';
import { TiltProvider } from '@/components/motion-tilt';
import './globals.css';

const sans = GeistSans;
const mono = GeistMono;

const TITLE = `${brand.brandName}: are you cited by ChatGPT, Claude, Perplexity and Gemini?`;

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: TITLE, template: `%s · ${brand.brandName}` },
  description: brand.description,
  applicationName: brand.brandName,
  openGraph: {
    title: TITLE,
    description: brand.description,
    siteName: brand.brandName,
    type: 'website',
    url: brand.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: brand.description,
    site: brand.socials.twitterHandle,
  },
};

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: brand.brandName,
  url: brand.url,
  description: brand.description,
  sameAs: [brand.socials.twitter, brand.socials.linkedin, brand.socials.github],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script
          // Apply the saved theme before paint to avoid a flash. Default is light.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <TiltProvider />
        <Header />
        <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
