# DESIGN.md

> Make the score believable at a glance and shareable in a screenshot — credibility through restraint, not spectacle.

_AmICited — free AI-visibility checker (Tool 1 of the Orbiqon GEO Suite). Next.js 14 App Router + Tailwind._

## 1. Visual Theme & Atmosphere

**Style**: Minimal Pure / Editorial Light (SaaS)
**Keywords**: clean, data-forward, trustworthy, calm, precise, spacious, factual
**Tone**: a serious analytics instrument — NOT a gradient-heavy AI-startup template, NOT alarmist, NOT playful
**Feel**: like reading a well-set lab report — white space does the talking, one teal accent points the eye, big honest numbers carry the weight.

**Interaction Tier**: **L2 (流畅交互, restrained)** — entrance fades, scroll reveals, magnetic CTA, spotlight cards. Deliberately **not L3**: no WebGL, no scroll-jacking/Lenis, nothing that delays first paint or reads as gimmicky. For a credibility tool, jank or flash costs trust.
**Dependencies**: CSS + a tiny IntersectionObserver hook. No GSAP, no Lenis.

## 2. Color Palette & Roles

Single source of truth: CSS variables in `:root` (mapped into Tailwind via the `brand`/semantic tokens). Teal accent = the Orbiqon GEO family.

```css
:root {
  /* Backgrounds */
  --bg: #ffffff;                 /* page background */
  --surface: #ffffff;            /* cards / containers */
  --surface-alt: #f8fafc;        /* alt sections, inset panels (slate-50) */
  --surface-hover: #f1f5f9;      /* hovered surface (slate-100) */

  /* Borders */
  --border: #e2e8f0;             /* default border (slate-200) */
  --border-hover: #cbd5e1;       /* hover border (slate-300) */

  /* Text */
  --text: #0f172a;               /* headings, key numbers (slate-900) */
  --text-secondary: #475569;     /* body, descriptions (slate-600) */
  --text-tertiary: #94a3b8;      /* labels, meta (slate-400) */

  /* Accent — teal */
  --accent: #0d9488;             /* CTA, links, active (teal-600) */
  --accent-hover: #0f766e;       /* teal-700 */
  --accent-soft: #f0fdfa;        /* teal-50 tint fills */
  --accent-border: #99f6e4;      /* teal-200 */

  /* RGB variants for rgba() */
  --bg-rgb: 255, 255, 255;
  --accent-rgb: 13, 148, 136;
  --text-rgb: 15, 23, 42;

  /* Semantic (verdict + status) */
  --success: #059669;            /* well cited / cited */
  --warning: #d97706;            /* partially visible */
  --error: #e11d48;              /* mostly invisible / not cited */
}
```

**Color Rules:**
- Every color resolves to a variable above (or the Tailwind token mapped to it). No ad-hoc hex in components.
- One accent per section. Teal is for action/among-us; verdict colors (success/warn/error) are for the score only — never decorative.
- Color is never the only signal: pair every status color with an icon + text (Cited ✓ / Not cited ✕).
- Engine brand hues (ChatGPT green, Claude sienna, etc.) are data-encoding dots only, never fills/text.

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
/* loaded via next/font (Inter), exposed as --font-sans */
```

One family (Inter). Confidence comes from weight + size + `tabular-nums`, not a second face.

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Inter | 2rem → 2.75rem (clamp) | 700 | 1.1 | -0.02em |
| Section H2 | Inter | 1.125rem | 600 | 1.3 | -0.01em |
| H3 / card title | Inter | 0.95rem | 600 | 1.4 | — |
| Body | Inter | 1rem (16px) | 400 | 1.6 | — |
| Label / eyebrow | Inter | 0.75rem | 500 | 1.4 | 0.04em |
| Score number | Inter | 3rem | 700 | 1 | -0.02em · `tabular-nums` |
| Data / counts | Inter | inherit | 600 | — | `tabular-nums` |

**Typography Rules:**
- Headings weight ≥ 600; body 400; numbers that compare/animate use `font-variant-numeric: tabular-nums`.
- Mobile inputs ≥ 16px (prevents iOS auto-zoom).
- **NEVER use**: decorative/script fonts, a second display face, all-caps body, justified text.

**Text Decoration** (per decision table, Minimal restraint):
- Hero H1: **no gradient, no shadow.** One keyword span in solid `--accent` for emphasis ("…or your competitors?"). That's the only tinted text.
- Section H2 / body: no gradient, no shadow, ever.

## 4. Component Stylings

### Buttons
```css
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  min-height: 44px; padding: .625rem 1rem; border-radius: .5rem;
  background: var(--accent); color: #fff; font-weight: 600;
  transition: background-color .18s ease, transform .18s ease, box-shadow .18s ease;
}
.btn-primary:hover  { background: var(--accent-hover); }
.btn-primary:active { transform: translateY(1px); }
.btn-primary:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
.btn-primary:disabled { opacity: .5; pointer-events: none; }

.btn-secondary {
  min-height: 38px; padding: .5rem .875rem; border-radius: .5rem;
  background: var(--surface); color: var(--text-secondary);
  border: 1px solid var(--border); font-weight: 500; font-size: .875rem;
  transition: border-color .18s ease, color .18s ease;
}
.btn-secondary:hover { border-color: var(--border-hover); color: var(--text); }
.btn-secondary:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
.btn-secondary:disabled { opacity: .5; pointer-events: none; }
```

### Cards
```css
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: .75rem; box-shadow: var(--shadow-subtle);
}
/* Spotlight variant — pointer-tracked radial highlight (rAF-throttled) */
.card--spotlight { position: relative; transition: border-color .2s ease, box-shadow .2s ease; }
.card--spotlight::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; opacity: 0;
  transition: opacity .25s ease; pointer-events: none;
  background: radial-gradient(240px circle at var(--mx) var(--my), rgba(var(--accent-rgb), .08), transparent 60%);
}
.card--spotlight:hover { border-color: var(--border-hover); box-shadow: var(--shadow-elevated); }
.card--spotlight:hover::before { opacity: 1; }
```

### Navigation (header)
```css
/* Static top bar — logo + suite tag. No sticky nav (single-scroll tool). */
.header { display: flex; align-items: center; justify-content: space-between; }
.header a:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
```

### Links
```css
.link { color: var(--accent); font-weight: 500; text-decoration: none;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat;
  transition: background-size .2s ease, color .2s ease; }
.link:hover { color: var(--accent-hover); background-size: 100% 1px; }
```

### Tags / Badges
```css
.chip { display: inline-flex; align-items: center; gap: .375rem;
  border: 1px solid var(--border); background: var(--surface-alt);
  color: var(--text-secondary); border-radius: 9999px; padding: .25rem .75rem; font-size: .75rem; }
.badge-cited     { background: #ecfdf5; color: var(--success); }  /* + ✓ icon */
.badge-not-cited { background: #fff1f2; color: var(--error); }    /* + ✕ icon */
.badge-warn      { background: #fffbeb; color: var(--warning); }  /* + ⚠ icon */
```

### Inputs
```css
.field { width: 100%; border: 1px solid var(--border-hover); border-radius: .5rem;
  padding: .625rem .875rem; font-size: 16px; background: var(--surface); color: var(--text);
  transition: border-color .18s ease, box-shadow .18s ease; }
.field::placeholder { color: var(--text-tertiary); }
.field:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(var(--accent-rgb), .12); }
```

## 5. Layout Principles

**Container:**
- Max width: 64rem (`max-w-5xl`) for results; 42rem (`max-w-2xl`) for the landing form + text.
- Padding: 1.25rem mobile → 2rem desktop.

**Spacing Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 80px. Section gap 1.25–2rem; card padding 1–2rem.

**Grid:**
```css
.engine-grid { display: grid; gap: .75rem; grid-template-columns: 1fr; }
@media (min-width: 640px) { .engine-grid { grid-template-columns: 1fr 1fr; } }
```

## 6. Depth & Elevation

Layered, low-contrast shadows tinted toward the page (never heavy drop shadows).

```css
:root {
  --shadow-subtle:  0 1px 2px 0 rgb(15 23 42 / .04), 0 4px 16px -8px rgb(15 23 42 / .08);
  --shadow-elevated:0 1px 2px 0 rgb(15 23 42 / .05), 0 8px 24px -12px rgb(15 23 42 / .14);
}
```

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | border only | chips, inputs, matrix table |
| Subtle | `--shadow-subtle` | all resting cards |
| Elevated | `--shadow-elevated` | card hover (spotlight), the score hero |

## 7. Animation & Interaction

**Motion Philosophy**: motion clarifies cause/effect, never decorates. `opacity` + `transform` only. Every effect has a reduced-motion path. Nothing blocks or delays first paint.
**Tier**: L2 (restrained).

### Dependencies
CSS + one `useReveal` IntersectionObserver hook. No external libraries.

### Signature moments (the L2 set, brand-appropriate)
1. **Hero backdrop** — static dot-grid + one soft teal radial "aurora", pure CSS, no animation loop (Minimal archetype: DotGrid/Grainient). Ambient, not moving.
2. **Hero H1 word reveal** — words fade-up staggered on load (restrained SplitText). ~40ms stagger.
3. **ScrollReveal** — sections + cards fade-up as they enter viewport (IntersectionObserver, once).
4. **Score count-up** — the 0–100 gauge sweeps + counts (comprehension: shows it's computed).
5. **Magnet CTA** — primary buttons translate ≤6px toward the cursor (hover devices only), spring-back on leave.
6. **Spotlight cards** — engine/score cards track a soft radial under the pointer (rAF-throttled `--mx/--my`).

### Entrance Animation
```css
@keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.reveal { opacity: 0; }
.reveal.is-in { animation: fade-up .5s cubic-bezier(.22,.61,.36,1) both; }
.reveal[data-delay] { animation-delay: calc(var(--i, 0) * 45ms); }
```

### Scroll Behavior
```js
// useReveal(): add .is-in when the element enters; unobserve after (one-shot).
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
```

### Hover & Focus States
- Buttons/links/cards: see §4 (all have hover + `:focus-visible`).
- Magnet: `transform: translate(var(--dx), var(--dy))`, `transition: transform .18s ease` on leave.

### Special Effects
- Spotlight: `pointermove` → rAF → set `--mx/--my` on the card; clear on leave.
- Magnet: `pointermove` within button rect → set `--dx/--dy` (capped at 6px).

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
  .reveal { opacity: 1 !important; }        /* show immediately */
}
/* JS: skip count-up, magnet, spotlight when matchMedia('(prefers-reduced-motion: reduce)') matches */
```

## 8. Do's and Don'ts

### Do
- Lead with the number and the verdict — the score hero is the screenshot.
- Keep one teal accent; let white space separate sections.
- Pair every status color with an icon + label.
- Report citation as a **rate from N samples**; keep the methodology note always visible.
- Keep motion CSS-first, one-shot, and reduced-motion safe.
- Design empty / loading / error / unreachable-engine states explicitly.

### Don't
- ❌ No gradient or drop-shadow on headings (breaks the restraint).
- ❌ No WebGL, no scroll-jacking/Lenis, no custom global cursor.
- ❌ No `filter: blur()` on moving elements; `backdrop-filter` ≤ 14px if ever.
- ❌ No emoji in UI chrome — SVG icons only (letter monograms for engines until licensed logos).
- ❌ No color-only status; never render a failed engine as a fake "Not cited 0%".
- ❌ No overclaiming copy ("guarantee", "get cited instantly").
- ❌ No hardcoded hex in components — go through the tokens.
- ❌ No layout shift: reserve gauge/skeleton space; explicit dimensions.
- ❌ No motion that delays first paint or runs an idle render loop.

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1024px | 2-col engine grid; score hero row (gauge + text side by side) |
| Tablet | 640–1024px | 2-col grid; container padding 2rem |
| Mobile | < 640px | 1-col; gauge stacks above text; prompt-matrix scrolls horizontally in its card; buttons wrap |

**Touch Targets:** ≥ 44×44px (primary buttons `min-height:44px`; icon buttons padded).
**Collapsing Strategy:** hero H1 clamps 2rem→2.75rem; suite tag hidden < 640px; action buttons wrap; matrix table gets `overflow-x:auto` (never breaks page width).

```css
@media (max-width: 640px) {
  .score-hero { flex-direction: column; text-align: center; }
  .matrix-wrap { overflow-x: auto; }
}
```

---

_Motion effects are hand-rolled (CSS + IntersectionObserver), inspired by the Minimal/Editorial-Light patterns in reactbits/vue-bits — no runtime dependency added._
