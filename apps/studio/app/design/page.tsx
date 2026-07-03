import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Theme options',
  robots: { index: false },
};

interface Theme {
  id: number;
  name: string;
  vibe: string;
  pageBg: string;
  panelBg: string;
  panelBorder: string;
  panelShadow?: string;
  panelBackdrop?: boolean;
  text: string;
  muted: string;
  faint: string;
  headline: CSSProperties; // color or gradient-clip
  accentBg: string;
  accentText: string;
  gauge: string;
  gaugeTrack: string;
  cited: string;
  radius: number;
  eyebrowStyle: CSSProperties;
}

const THEMES: Theme[] = [
  {
    id: 1,
    name: 'Aurora',
    vibe: 'Dark glass, gradient glow, high personality (phoniz energy)',
    pageBg:
      'radial-gradient(900px 420px at 15% -10%, rgba(124,58,237,.35), transparent 60%), radial-gradient(700px 400px at 100% 0%, rgba(34,211,238,.22), transparent 55%), #0a0a12',
    panelBg: 'rgba(255,255,255,0.055)',
    panelBorder: '1px solid rgba(255,255,255,0.12)',
    panelShadow: '0 24px 60px -30px rgba(0,0,0,.8)',
    panelBackdrop: true,
    text: '#f4f4ff',
    muted: '#a7a7cf',
    faint: '#7a7aa8',
    headline: {
      background: 'linear-gradient(90deg,#a78bfa,#22d3ee)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    },
    accentBg: 'linear-gradient(90deg,#7c3aed,#4f46e5)',
    accentText: '#ffffff',
    gauge: '#a78bfa',
    gaugeTrack: 'rgba(255,255,255,.12)',
    cited: '#34d399',
    radius: 16,
    eyebrowStyle: { color: '#c4b5fd' },
  },
  {
    id: 2,
    name: 'Solar',
    vibe: 'Bright white, oversized black type, one electric-orange accent (magazine)',
    pageBg: '#ffffff',
    panelBg: '#ffffff',
    panelBorder: '2px solid #111111',
    text: '#0a0a0a',
    muted: '#4a4a4a',
    faint: '#9a9a9a',
    headline: { color: '#0a0a0a', letterSpacing: '-0.03em' },
    accentBg: '#ff5a1f',
    accentText: '#ffffff',
    gauge: '#ff5a1f',
    gaugeTrack: '#eee',
    cited: '#0a0a0a',
    radius: 4,
    eyebrowStyle: { color: '#ff5a1f' },
  },
  {
    id: 3,
    name: 'Aurum',
    vibe: 'Midnight navy, warm gold accent, refined and premium (fintech luxe)',
    pageBg: 'linear-gradient(180deg,#0c1226,#0a0e1c)',
    panelBg: 'rgba(255,255,255,0.03)',
    panelBorder: '1px solid rgba(212,175,55,0.28)',
    panelShadow: '0 20px 50px -28px rgba(0,0,0,.75)',
    text: '#f3efe4',
    muted: '#9aa1b6',
    faint: '#6c7288',
    headline: { color: '#f3efe4', letterSpacing: '-0.02em' },
    accentBg: '#d4af37',
    accentText: '#0a0e1c',
    gauge: '#d4af37',
    gaugeTrack: 'rgba(255,255,255,.1)',
    cited: '#7ad1a8',
    radius: 12,
    eyebrowStyle: { color: '#d4af37', letterSpacing: '.14em' },
  },
  {
    id: 4,
    name: 'Pop',
    vibe: 'Light, colorful, bright violet + pink gradients, rounded and friendly (Framer)',
    pageBg: 'linear-gradient(180deg,#faf8ff,#f2eeff)',
    panelBg: '#ffffff',
    panelBorder: '1px solid #ece7fb',
    panelShadow: '0 18px 40px -24px rgba(124,92,255,.35)',
    text: '#1b1236',
    muted: '#6b6488',
    faint: '#a49dbd',
    headline: {
      background: 'linear-gradient(90deg,#7c5cff,#ff5ca8)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    },
    accentBg: 'linear-gradient(90deg,#7c5cff,#9b5cff)',
    accentText: '#ffffff',
    gauge: '#7c5cff',
    gaugeTrack: '#eee6ff',
    cited: '#22c55e',
    radius: 18,
    eyebrowStyle: { color: '#7c5cff', letterSpacing: '.1em' },
  },
];

const ENGINES = [
  { name: 'ChatGPT', pct: 100 },
  { name: 'Claude', pct: 67 },
  { name: 'Perplexity', pct: 100 },
  { name: 'Gemini', pct: 33 },
];

function Gauge({ theme, score = 74 }: { theme: Theme; score?: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div style={{ position: 'relative', width: 92, height: 92, flexShrink: 0 }}>
      <svg width={92} height={92} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={46} cy={46} r={r} stroke={theme.gaugeTrack} strokeWidth={9} fill="none" />
        <circle
          cx={46}
          cy={46}
          r={r}
          stroke={theme.gauge}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 700,
          fontSize: 26,
          color: theme.text,
        }}
      >
        {score}
      </div>
    </div>
  );
}

function MiniApp({ theme }: { theme: Theme }) {
  return (
    <div style={{ background: theme.pageBg, borderRadius: 20, padding: 20, border: '1px solid rgba(0,0,0,.08)' }}>
      {/* browser chrome */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16, opacity: 0.7 }}>
        <span style={{ width: 10, height: 10, borderRadius: 99, background: theme.faint }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: theme.faint }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: theme.faint }} />
        <span style={{ marginLeft: 8, fontSize: 12, fontFamily: 'var(--font-mono)', color: theme.faint }}>
          geostudio.ai/check
        </span>
      </div>

      <div
        style={{
          background: theme.panelBg,
          border: theme.panelBorder,
          borderRadius: theme.radius,
          boxShadow: theme.panelShadow,
          backdropFilter: theme.panelBackdrop ? 'blur(12px)' : undefined,
          padding: 24,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            margin: 0,
            ...theme.eyebrowStyle,
          }}
        >
          Diagnose. Fix. Manage.
        </p>
        <h2 style={{ margin: '10px 0 0', fontSize: 30, fontWeight: 700, lineHeight: 1.05, ...theme.headline }}>
          Are you cited by AI, or invisible?
        </h2>
        <p style={{ margin: '10px 0 0', fontSize: 14, color: theme.muted, maxWidth: 460 }}>
          See whether ChatGPT, Claude, Perplexity and Gemini recommend your brand. Real sampled rates.
        </p>

        <div style={{ display: 'flex', gap: 22, alignItems: 'center', marginTop: 22, flexWrap: 'wrap' }}>
          <Gauge theme={theme} />
          <div style={{ minWidth: 240, flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: theme.gauge }}>Well cited</p>
            <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 700, color: theme.text }}>Notion</p>
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {ENGINES.map((e) => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 62, fontSize: 12, color: theme.muted }}>{e.name}</span>
                  <span
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 99,
                      background: theme.gaugeTrack,
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{ display: 'block', height: '100%', width: `${e.pct}%`, background: theme.cited }}
                    />
                  </span>
                  <span style={{ width: 34, textAlign: 'right', fontSize: 11, fontFamily: 'var(--font-mono)', color: theme.faint }}>
                    {e.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          style={{
            marginTop: 20,
            border: 'none',
            borderRadius: Math.max(6, theme.radius - 4),
            background: theme.accentBg,
            color: theme.accentText,
            fontWeight: 600,
            fontSize: 14,
            padding: '11px 18px',
            cursor: 'pointer',
          }}
        >
          Check my AI visibility →
        </button>
      </div>
    </div>
  );
}

export default function DesignGalleryPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Pick a direction</h1>
      <p className="mt-2 text-muted">
        Four distinct looks on the real AmICited screen. Tell me the number you want and I will build
        it across the whole Studio.
      </p>

      <div className="mt-10 space-y-14">
        {THEMES.map((theme) => (
          <section key={theme.id}>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-fg">
                Option {theme.id}, {theme.name}
              </h2>
              <p className="text-sm text-muted">{theme.vibe}</p>
            </div>
            <MiniApp theme={theme} />
          </section>
        ))}
      </div>
    </div>
  );
}
