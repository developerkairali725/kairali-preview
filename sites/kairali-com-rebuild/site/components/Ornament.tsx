import type { CSSProperties } from "react";

// Premium v4 ornaments (design source: kairali-premium-v4/theme.css + artboards, approved 19 Oct 2026).
// Every SVG is inline, decorative (aria-hidden) and coloured through CSS (currentColor) — no literals here.

/** Hairline-and-diamond ornament between sections. `narrow` centres a 220px version. */
export function Orn({ narrow = false, className = "" }: { narrow?: boolean; className?: string }) {
  return (
    <div className={`orn${narrow ? " narrow" : ""} ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1" focusable="false">
        <path d="M13 2l11 11-11 11L2 13z" /><path d="M13 7l6 6-6 6-6-6z" /><circle cx="13" cy="13" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

/** Gold hairline fading at both ends. */
export function Hairline({ style }: { style?: CSSProperties }) {
  return <div className="hairline" style={style} aria-hidden="true" />;
}

/** Faint oversized serif section numeral. */
export function Num({ n, light = false, style }: { n: string; light?: boolean; style?: CSSProperties }) {
  return <span className={`num${light ? " light" : ""}`} style={style} aria-hidden="true">{n}</span>;
}

/** Mandala line-art for dark sections (and faint bronze on ivory bands). */
export function Mandala({ className = "", style, full = true }: { className?: string; style?: CSSProperties; full?: boolean }) {
  return (
    <div className={`mandala ${className}`.trim()} style={style} aria-hidden="true">
      <svg viewBox="0 0 520 520" fill="none" stroke="currentColor" strokeWidth="1" focusable="false">
        <circle cx="260" cy="260" r="248" /><circle cx="260" cy="260" r="196" /><circle cx="260" cy="260" r="120" />
        <path d="M260 12c60 80 60 416 0 496M260 12c-60 80-60 416 0 496M12 260c80-60 416-60 496 0M12 260c80 60 416 60 496 0" />
        {full && <path d="M85 85c120 20 230 130 350 350M435 85c-120 20-230 130-350 350" />}
      </svg>
    </div>
  );
}

/** Leaf-spray corner line-art. */
export function LeafSpray({ flip = false, style }: { flip?: boolean; style?: CSSProperties }) {
  return (
    <div className={`leafspray${flip ? " flip" : ""}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 220 220" fill="none" stroke="currentColor" strokeWidth="1" focusable="false">
        <path d="M210 10C180 100 100 180 10 210" />
        <path d="M160 70c-20 30-10 60-40 80M160 70c-30 10-60 0-80 40M110 120c-15 25-5 50-30 70M110 120c-25 5-50-5-70 30M185 35c-15 20-5 45-25 60M185 35c-20 5-45-5-60 25" />
      </svg>
    </div>
  );
}

/** Small arrow used by editorial index rows. */
export function ArrowGlyph() {
  return (
    <svg viewBox="0 0 22 12" aria-hidden="true" focusable="false"><path d="M0 6h20M15 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
  );
}
