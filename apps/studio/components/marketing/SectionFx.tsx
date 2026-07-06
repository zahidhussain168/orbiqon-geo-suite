/**
 * Futuristic section backdrop. Renders a low-opacity texture layer (data grid, drifting aurora,
 * scan beam, node dots, or a grid+aurora mesh) behind a section's content. The parent must be
 * `relative isolate` so the -z-10 layer sits above the page background but under the content.
 */
export function SectionFx({
  variant = 'grid',
  className = '',
}: {
  variant?: 'grid' | 'aurora' | 'mesh' | 'scan' | 'dots';
  className?: string;
}) {
  return <div aria-hidden className={`section-fx section-fx-${variant} ${className}`} />;
}

/** Targeting-frame corner brackets for card sections. */
export function HudCorners() {
  return (
    <>
      <span aria-hidden className="hud-corner hud-tl" />
      <span aria-hidden className="hud-corner hud-tr" />
      <span aria-hidden className="hud-corner hud-bl" />
      <span aria-hidden className="hud-corner hud-br" />
    </>
  );
}
