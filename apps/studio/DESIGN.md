# DESIGN.md

> Adopted from getdesign.md/linear.app. The Linear design language: quiet, precise, indigo on layered near-black.

## 1. Theme
Dark, high-craft product UI. Layered near-black surfaces, hairline borders, one indigo accent, medium-weight UI type, restrained motion. No stock imagery. Confidence through spacing and typography, not decoration.

## 2. Color
```
--canvas:   #08090A   /* page */
--surface:  #141516   /* cards */
--elevated: #1C1D1F   /* insets, hover */
--hair:     #23252A   /* borders */
--hair-strong: #34343A
--fg:    #F7F8F8       /* primary text */
--high:  #D0D6E0       /* high-emphasis secondary */
--muted: #8A8F98       /* body, labels */
--dim:   #62666D       /* meta */
--accent:      #5E6AD2 /* indigo: buttons, links, focus */
--accent-light:#828FFF /* hover / bright */
--accent-press:#4C56B8
/* Verdict, score only */
good #3FB950  mid #E2A336  low #EB5757
```
Rules: every color resolves to a token. One accent, indigo. Color is never the only signal.

## 3. Typography
`Inter` (UI and body) + `JetBrains Mono` (data, eyebrows, code), self-hosted via next/font.
Scale: hero clamp 3rem to 4.5rem 600 tracking -0.02em; h2 1.5 to 2.25rem 600; h3 1rem 600; body 1rem 400; UI 14px 500; label 11 to 12px 500 mono uppercase tracking 0.14em; numbers tabular-nums. Medium (500) is the default UI weight, the Linear signature.

## 4. Components
- Buttons: indigo fill, white label, 8px radius, subtle inset top highlight, hover lightens to #828FFF. Secondary: hairline border on surface.
- Cards: 12px radius, 1px hair border, surface bg, faint inset highlight shadow.
- Inputs: elevated bg, hair border, focus to indigo border plus ring. Mobile 16px.
- Chips and badges: pill, hairline, mono label.

## 5. Layout and spacing
8pt rhythm. Max width 72rem for wide, 42rem for text. Generous section spacing.

## 6. Elevation
Flat by default. Cards use one soft shadow plus a 1px inset top highlight. Modals and the megamenu use a deeper lift shadow. No heavy drop shadows.

## 7. Motion
Subtle and fast: 150 to 250ms, ease-out. Scroll reveals (fade and rise), a single hero glow, one animated gradient keyword, count-up on the score gauge. CSS driven, reduced-motion safe, no motion library on the critical path.

## 8. Do and Don't
Do: one indigo accent, hairline structure, medium weight, tabular numerals, real product UI. Report sampled rates, never a fake yes or no.
Don't: no stock photos, no gradient soup, no color-only status, no heavy shadows, no em dashes, no overclaiming.

## 9. Responsive
Mobile first. Desktop over 1024px gets multi-column grids and the sidebar megamenu; mobile stacks with a sheet nav. No horizontal overflow, touch targets at least 40px.
