import { ImageResponse } from 'next/og';
import { brand } from '@orbiqon/config';

export const runtime = 'edge';
export const alt = 'GEO Studio: are you cited by ChatGPT, Claude, Perplexity and Gemini?';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FAF8F4',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              background: '#14110F',
              color: '#FAF8F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: '#14110F' }}>{brand.brandName}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 62, fontWeight: 600, color: '#14110F', lineHeight: 1.05 }}>
            Find out if AI recommends you. Then fix it.
          </div>
          <div style={{ fontSize: 30, color: '#57514B' }}>
            ChatGPT, Claude, Perplexity and Gemini. Real sampled rates.
          </div>
        </div>

        <div style={{ fontSize: 24, color: '#0F766E', fontWeight: 600 }}>
          Diagnose. Fix. Manage. We do the work.
        </div>
      </div>
    ),
    size,
  );
}
