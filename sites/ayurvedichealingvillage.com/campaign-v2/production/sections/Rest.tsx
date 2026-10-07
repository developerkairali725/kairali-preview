import Image from "next/image";
import type { ImageRef, PageRest } from "../../kit/types.ts";

/**
 * The quiet band: the kit's Stillness layout (decorative full-bleed photograph, alt="", with the copy on the skin's
 * translucent panel on desktop and below the photograph on phones). The panel is the mandatory text backing over a
 * photograph (sections.css "Text over photos"); it is never removed.
 */
export default function Rest({ r, image }: { r: PageRest; image: ImageRef }) {
  return (
    <section className="lp-still lp-prest" aria-labelledby="lp-prest-h">
      <div className="lp-still__media">
        <Image className="lp-still__img" src={image.src} alt="" width={image.width} height={image.height} sizes="100vw" loading="lazy" />
      </div>
      <div className="lp-still__card lp-panel">
        <h2 id="lp-prest-h" className="lp-h2">{r.heading}</h2>
        {r.paragraphs.map((t, i) => <p key={i} className="lp-still__body">{t}</p>)}
      </div>
    </section>
  );
}
