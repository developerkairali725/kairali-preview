import Image from "next/image";
import type { SectionProps } from "./LandingPage";

/**
 * The sensual band: a decorative full-bleed photo (alt="") with the heading and body.
 * A: text card over the image on desktop, stacked under it on mobile. C: the heading set over the image.
 * Desktop text over the photo is always backed: a translucent panel (A/B/D) or a directional scrim (C), both
 * from the skin's --lp-scrim tokens. Never remove it per campaign.
 */
export default function Stillness({ c, v }: SectionProps) {
  const im = c.stillness.image;
  return (
    <section className="lp-still" aria-labelledby="lp-still-h">
      <div className="lp-still__media">
        <Image className="lp-still__img" src={im.src} alt="" width={im.width} height={im.height} sizes="100vw" loading="lazy" />
      </div>
      <div className={v === "C" ? "lp-still__card lp-scrim" : "lp-still__card lp-panel"}>
        <p className="lp-over lp-kicker">After therapy</p>
        <h2 id="lp-still-h" className="lp-h2">{c.stillness.heading}</h2>
        <p className="lp-still__body">{c.stillness.body}</p>
      </div>
    </section>
  );
}
