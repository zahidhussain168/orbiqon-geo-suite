# DESIGN.md

> The product's whole job is telling you whether AI cited you or not. The design should read like an honest citation record, not a generic SaaS brochure.

## 1. Visual Theme & Atmosphere

**Style**: Citation-record editorial. Indigo-accented, professional, evidence-first.
**Keywords**: precise, evidentiary, confident, quiet, indigo, footnoted, honest
**Tone**: calm authority for a B2B evaluation tool. NOT playful, NOT maximalist, NOT loud
**Feel**: like reading a well-typeset audit report that happens to have one very good highlighter.

**Interaction Tier**: **L1 (精致静态)** (elegant hover states + soft entrance), deliberately *not* L2/L3.
**Why**: the audience is marketers/founders evaluating a tool in a working context, not browsing a portfolio. This session already tried and rejected a WebGL hero globe ("worst design") and a hero stacking five simultaneous effects (flagged in the UX audit as excessive cognitive load for an above-the-fold task that's just "read two lines, fill one field"). A "3 wow-moment" landing-page mandate would repeat that mistake. Confidence here comes from typography, spacing, and real product screenshots, not motion.
**Dependencies**: CSS only. No GSAP, no ScrollTrigger, no Lenis, no WebGL anywhere outside the hero (which is out of scope, see below).

**Hard constraint (do not touch)**: the home hero's fixed background video, its legibility scrim, and the `AnswerArtifact` card sitting over it. Everything in this spec applies to every page and section *except* that one, per explicit instruction.

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds (light) */
  --bg: #FFFFFF;
  --surface: #FFFFFF;
  --surface-alt: #F6F9FC;
  --surface-hover: #F1F4F9;

  /* Borders (light) */
  --border: #E3E8EE;
  --border-hover: #D3DBE5;

  /* Text (light) */
  --text: #0D253D;
  --text-secondary: #5B6B84;   /* audited ~5.4:1 on white */
  --text-tertiary: #647089;    /* audited ~4.97:1 on white */

  /* Accent */
  --accent: #533AFD;
  --accent-hover: #4434D4;
  --bg-rgb: 255, 255, 255;
  --accent-rgb: 83, 58, 253;

  /* Semantic (citation verdicts) */
  --success: #0E9F6E;   /* cited */
  --warning: #B7791F;   /* partial */
  --error: #EA2261;     /* not cited */
}

.dark {
  /* Backgrounds (dark): deliberately DESATURATED, near-neutral charcoal.
     The previous attempt at dark elevation used a moderately saturated
     blue-violet surface fill (rgb(44,48,82)) that competed in chroma with
     the indigo accent and read as muddy/plasticky rather than premium.
     Fix: keep panel fills close to neutral gray; reserve all real chroma
     for --accent. Separation comes from a visible border + soft shadow,
     not from a loudly-tinted fill. */
  --bg: #0A0B1E;
  --surface: #1A1B24;
  --surface-alt: #12131C;
  --surface-hover: #222330;

  --border: #34364A;
  --border-hover: #464A5E;

  --text: #EAEDF8;
  --text-secondary: #96A2BB;   /* audited ~7.6:1 on dark bg */
  --text-tertiary: #7A87A3;    /* audited ~5.4:1 on dark bg */

  --accent: #7C6CFF;
  --accent-hover: #9C8EFF;
  --bg-rgb: 10, 11, 30;
  --accent-rgb: 124, 108, 255;

  --success: #34D399;
  --warning: #E0B04A;
  --error: #FF698C;
}
```

**Color Rules:**
- All colors resolve through these variables; zero raw hex in component code.
- Exactly one chromatic accent (indigo) per surface. Dark-mode panels stay near-neutral so the accent is never competing with the container it sits in.
- Verdict colors (success/warning/error) are never the only signal; always paired with an icon or word ("Cited", "Partial", "Not cited").

## 3. Typography Rules

**Font Stack:**
```css
/* next/font (Geist), already self-hosted, no external @import needed */
font-family: var(--font-geist-sans), 'SF Pro Display', system-ui, sans-serif;
font-family: var(--font-geist-mono), ui-monospace, monospace; /* labels, data, citations */
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Geist Sans | 48-72px (fluid) | 500 | 1.02 | -0.025em |
| Section H2 | Geist Sans | 28-36px | 500 | 1.15 | -0.02em |
| H3 | Geist Sans | 18-20px | 600 | 1.3 | normal |
| Body | Geist Sans | 16px | 400 | 1.6 | normal |
| Label / eyebrow | Geist Mono | 11-12px | 500 | 1.4 | 0.12em, uppercase |
| Mono / data / citation number | Geist Mono | 12-14px | 400 | 1.4 | tabular-nums |

**Typography Rules:**
- Weight floor raised from the prior all-300 system: headings 500-600, body 400. Weight-300 on every surface (the previous system's signature) reads as weak/washed-out once combined with any surface-contrast issue. Raising the floor makes the type read as *confident* rather than merely thin, independent of background.
- **NEVER use**: decorative/script fonts, more than two font families, weight below 400 for body copy.

**Text Decoration:**
- Hero H1 keeps its existing gradient-clip emphasis on one phrase only (already fixed to clear 4.5:1 at every stop, in both themes). This is the one exception to "no gradient text," reserved for the hero which is out of scope anyway.
- Every other heading: solid `--text` color, no gradient, no shadow. Restraint is the point.

## 4. Component Stylings

### Buttons
```css
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 10px 20px;
  border-radius: 9999px;
  background: var(--accent);
  color: #fff;
  font: 500 14px var(--font-geist-sans);
  transition: background-color 0.18s ease, transform 0.18s ease;
}
.btn-primary:hover  { background: var(--accent-hover); }
.btn-primary:active { transform: scale(0.97); }
.btn-primary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn-primary:disabled { opacity: 0.4; pointer-events: none; }

.btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-height: 44px; padding: 10px 20px;
  border-radius: 9999px; border: 1px solid var(--accent);
  background: var(--surface); color: var(--accent);
  font: 500 14px var(--font-geist-sans);
  transition: background-color 0.18s ease;
}
.btn-secondary:hover { background: var(--surface-hover); }
.btn-secondary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn-secondary:disabled { opacity: 0.4; pointer-events: none; }
```

### Cards
```css
.card {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.06); /* light */
  transition: border-color 0.2s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.dark .card {
  box-shadow: 0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 36px -20px rgba(0,0,0,0.55);
}
.card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}
.card:focus-within { outline: 2px solid var(--accent); outline-offset: 2px; }
```

### Navigation
```css
header {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: blur(10px); /* under 14px per performance guardrail */
  border-bottom: 1px solid var(--border);
}
```

### Links
```css
.link {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--accent) 30%, transparent);
  text-underline-offset: 2px;
  transition: text-decoration-color 0.15s ease;
}
.link:hover { text-decoration-color: var(--accent); }
```

### Tags / Badges (citation verdicts)
```css
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 9999px;
  font: 500 11px var(--font-geist-mono); text-transform: uppercase; letter-spacing: 0.08em;
}
.badge-success { background: color-mix(in srgb, var(--success) 12%, var(--surface)); color: var(--success); }
.badge-warning { background: color-mix(in srgb, var(--warning) 12%, var(--surface)); color: var(--warning); }
.badge-error   { background: color-mix(in srgb, var(--error) 12%, var(--surface)); color: var(--error); }
```

## 5. Layout Principles

**Container:**
- Max width: 1152px (`max-w-6xl`)
- Padding: 20px mobile, 32px desktop
- Narrow variant (text-heavy, FAQ/legal): 672px

**Spacing Scale:**
- Section padding: 96px desktop / 64px mobile (vertical)
- Component gap: 32-48px between related blocks
- Card internal padding: 20-32px

**Grid:**
```css
.grid-feature { display: grid; gap: 40px; grid-template-columns: 1fr; }
@media (min-width: 1024px) { .grid-feature { grid-template-columns: 1.05fr 0.95fr; gap: 48px; } }
```

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | no shadow, border only | inline chips, table rows |
| Subtle | `0 1px 3px rgba(0,0,0,.06)` | default cards, light theme |
| Elevated | `0 16px 36px -20px rgba(0,0,0,.55)` + inset highlight | cards, dark theme; hover state of any card |
| Overlay | `0 24px 60px -20px rgba(0,0,0,.35)` | dropdowns, mega-menu, modals |

## 7. Animation & Interaction

**Motion Philosophy**: restrained and fast. Motion confirms something happened; it never performs.
**Tier**: L1 (see section 1 for why L2/L3 are explicitly out of scope here)

### Entrance Animation
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}
.reveal.is-in { animation: fade-up 0.4s cubic-bezier(0.22,0.61,0.36,1) both; }
```
(Already fixed this session: previously ran at 550-700ms, past the "avoid >500ms" guideline; now 400-480ms.)

### Scroll Behavior
IntersectionObserver-driven one-shot reveal only (existing `Reveal` component). No parallax, no pin, no scroll-jacking.

### Hover & Focus States
Every interactive element: a visible `:hover` (color/elevation change) and a visible `:focus-visible` ring (`2px solid var(--accent)`, 2px offset). Never removed without replacement.

### Special Effects
Existing pointer-tilt (`data-tilt`) stays, but scoped to feature-row mockups and grid cards, **not** the hero, and not layered with anything else on the same element (learned from the audit: stacking tilt + glare + gradient + video + grain on one hero card was too much at once).

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```
(Already implemented globally; carried forward unchanged.)

## 8. Do's and Don'ts

### Do
- Keep exactly one chromatic accent (indigo) per surface; everything else near-neutral.
- Raise the type-weight floor (500+ headings, 400 body) so confidence comes from weight, not brightness.
- Use citation/verdict vocabulary (cited / partial / not cited) with icon + color + text, never color alone.
- Keep every touch target 44x44px or larger.
- Keep all motion under 500ms and CSS-only.

### Don'ts
- Don't introduce a second saturated hue anywhere (no magenta/cyan/orange competing with indigo).
- Don't let dark-mode surface fills carry meaningful chroma; desaturate and let borders/shadow do the separation work.
- Don't add GSAP, ScrollTrigger, Lenis, or WebGL outside the (untouched) hero.
- Don't stack more than two simultaneous effects on any single element.
- Don't drop body text below 400 weight or 16px.
- Don't rely on color alone for verdict states.
- Don't remove a focus ring without providing a replacement.
- Don't touch the home hero's video, scrim, or AnswerArtifact card.

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|--------------|
| Desktop | above 1024px | multi-column feature grids, sidebar mega-menu |
| Tablet | 640-1024px | 2-column grids, stacked feature rows |
| Mobile | below 640px | single column, sheet nav, 16px body minimum |

**Touch Targets:** minimum 44x44px, 8px minimum spacing between adjacent targets.
**Collapsing Strategy:** feature rows stack vertically below 1024px; tool/pricing grids go from 3 to 2 to 1 columns.

```css
@media (max-width: 640px) {
  .section { padding-block: 64px; }
  .grid-feature { grid-template-columns: 1fr; }
}
```
