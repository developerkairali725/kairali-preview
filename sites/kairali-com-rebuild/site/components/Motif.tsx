import paths from "@/lib/motif-paths.json";

// Decorative motifs drawn from the official 2026 icon artwork (leaves only, never the lockup).
// Always aria-hidden and non-interactive.
export function Canopy({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`motif ${className}`} style={style} aria-hidden="true">
      <svg viewBox={paths.canopy.viewBox} focusable="false"><g fill="currentColor">{paths.canopy.paths.map((d, i) => <path key={i} d={d} />)}</g></svg>
    </div>
  );
}

export function Leaf({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox={paths.leaf.viewBox} width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={paths.leaf.d} />
    </svg>
  );
}

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <svg viewBox={paths.canopy.viewBox} width="56" height="34" focusable="false"><g fill="currentColor">{paths.canopy.paths.slice(0, 9).map((d, i) => <path key={i} d={d} />)}</g></svg>
    </div>
  );
}
