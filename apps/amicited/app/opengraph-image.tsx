import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AmICited — free AI visibility check';
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
          background: '#ffffff',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: '#0d9488',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Ai
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#0f172a' }}>AmICited</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
            Is AI recommending you — or your competitors?
          </div>
          <div style={{ fontSize: 30, color: '#475569' }}>
            Free check across ChatGPT, Claude, Perplexity &amp; Gemini
          </div>
        </div>

        <div style={{ fontSize: 24, color: '#0d9488', fontWeight: 600 }}>
          Real sampled rates — never a fake yes/no
        </div>
      </div>
    ),
    size,
  );
}
