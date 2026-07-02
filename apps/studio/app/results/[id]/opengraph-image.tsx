import { ImageResponse } from 'next/og';
import { brand } from '@orbiqon/config';
import { loadScan } from '@/lib/scan-service';

export const runtime = 'nodejs';
export const alt = 'AI visibility score';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function verdict(score: number): { label: string; color: string } {
  if (score >= 66) return { label: 'Well cited', color: '#059669' };
  if (score >= 33) return { label: 'Partially visible', color: '#D97706' };
  return { label: 'Mostly invisible to AI', color: '#E11D48' };
}

export default async function ResultOgImage({ params }: { params: { id: string } }) {
  const result = await loadScan(params.id).catch(() => null);
  const score = result?.score ?? 0;
  const label = result ? verdict(score).label : 'AI visibility check';
  const color = result ? verdict(score).color : '#0F766E';
  const heading = result ? result.brand : brand.brandName;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 72,
          background: '#FAF8F4',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: `18px solid ${color}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 120, fontWeight: 700, color: '#14110F', lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ fontSize: 24, color: '#857D75' }}>/ 100</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 26, color, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 64, fontWeight: 600, color: '#14110F', lineHeight: 1.05 }}>
            {heading}
          </div>
          <div style={{ fontSize: 26, color: '#57514B' }}>
            AI visibility, checked with {brand.brandName}. Real sampled rates.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
