import Image from "next/image";
import type { SectionProps } from "./LandingPage";
import { SectionHead } from "./head";

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
);

// `sizes` per mosaic tile: desktop share of the 12-column grid; on mobile the first tile is full width, the rest half.
const SIZES = [
  "(max-width: 767px) 100vw, 55vw",
  "(max-width: 767px) 50vw, 40vw",
  "(max-width: 767px) 50vw, 40vw",
  "(max-width: 767px) 50vw, 48vw",
  "(max-width: 767px) 50vw, 48vw",
];

/**
 * The village: heading and body, a mosaic of the first five gallery photos, and "View all photos".
 * The button is wired to the Gallery dialog in Task 13 (data-gallery-open); until then it does nothing.
 * All five photos show at every breakpoint (mobile: one wide + a 2×2 grid), so nothing hidden is fetched.
 */
export default function Village({ c, v }: SectionProps) {
  const pool = c.modesty === "gcc" ? c.gallery.filter((g) => g.image.gccSafe) : c.gallery;
  const tiles = pool.slice(0, 5);
  const more = pool.length - tiles.length;
  return (
    <section className="lp-sec lp-vil" aria-labelledby="lp-vil-h">
      <div className="lp-vil__top">
        <SectionHead v={v} section="village" kicker="The village" title={c.village.heading} id="lp-vil-h">
          <p className="lp-vil__body">{c.village.body}</p>
        </SectionHead>
        <button type="button" className="lp-vil__all" data-gallery-open aria-haspopup="dialog"
          data-track="gallery_open" data-track-category="all">
          <GridIcon />View all photos
        </button>
      </div>
      <ul className="lp-vil__mosaic">
        {tiles.map((g, i) => (
          <li key={g.image.id} className="lp-vil__tile">
            <Image className="lp-vil__img" src={g.image.src} alt={g.image.alt} width={g.image.width} height={g.image.height}
              sizes={SIZES[i]} loading="lazy" />
            {i === tiles.length - 1 && more > 0 ? <span className="lp-vil__more lp-panel" aria-hidden="true">+ {more} more</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
