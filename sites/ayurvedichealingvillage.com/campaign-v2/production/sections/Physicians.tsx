import type { CSSProperties } from "react";
import Image from "next/image";
import type { CampaignConfig, DoctorRef, PageDoctors } from "../../kit/types.ts";
import { isPending } from "../../kit/pending.ts";
import { SectionHead } from "../../sections/head";
import { doctorMeta } from "../../sections/Doctors";
import { t } from "../../sections/text.ts";

/** "Speaks Malayalam, English, Hindi and Tamil": the reviewed copy's own wording of the registry languages. */
export function speaks(d: DoctorRef): string {
  if (isPending(d.languages)) return t(d.languages);
  const l = d.languages;
  if (!l.length) return "";
  return `Speaks ${l.length === 1 ? l[0] : `${l.slice(0, -1).join(", ")} and ${l[l.length - 1]}`}`;
}

/**
 * The page's one doctors section — every current consented physician, once, with their own portrait — placed
 * directly before the enquiry form: the doctors a visitor can consult, then the form that starts that consultation.
 * Desktop: one row of five 4:5 portraits (three across on tablets); phones: a ruled list with the portrait beside the
 * text. Each portrait is positioned and enlarged per doctor (DoctorRef.frame) so faces read at a similar size.
 * Every fact comes from data/doctors.ts; years in practice are never derived.
 */
export default function Physicians({ c, d }: { c: CampaignConfig; d: PageDoctors }) {
  if (!c.doctors.length) return null;
  return (
    <section className="lp-sec lp-pdocs" aria-labelledby="lp-pdocs-h">
      <SectionHead v="A" kicker="Your doctors" title={d.heading} id="lp-pdocs-h">
        <p className="lp-pdocs__intro">{d.intro}</p>
      </SectionHead>
      <ul className="lp-pdocs__list">
        {c.doctors.map((doc) => <Card key={doc.id} d={doc} />)}
      </ul>
    </section>
  );
}

function Card({ d }: { d: DoctorRef }) {
  const f = d.frame ?? { position: "50% 18%", origin: "50% 18%", zoom: 1 };
  // Rendered widths (production.css): phones 112px; 768–1199px three across (~30vw); from 1200px five across (~18vw).
  // An enlarged portrait needs that many more source pixels.
  const z = Math.max(1, f.zoom);
  const sizes = `(max-width: 767px) ${Math.ceil(112 * z)}px, (max-width: 1199px) ${Math.ceil(30 * z)}vw, ${Math.ceil(18 * z)}vw`;
  const frame = { "--pdoc-pos": f.position, "--pdoc-origin": f.origin, "--pdoc-zoom": String(z) } as CSSProperties;
  const langs = speaks(d);
  return (
    <li className="lp-pdoc">
      <div className="lp-pdoc__frame" style={frame}>
        <Image className="lp-pdoc__img" src={d.photo.src} alt="" width={d.photo.width} height={d.photo.height} sizes={sizes} loading="lazy" />
      </div>
      <div className="lp-pdoc__text">
        <h3 className="lp-pdoc__name">{d.name}</h3>
        <p className="lp-pdoc__role">{doctorMeta(d)}</p>
        {d.tenure ? <p className="lp-pdoc__line">{d.tenure}</p> : null}
        {d.focus ? <p className="lp-pdoc__line">Focus: {d.focus}</p> : null}
        {langs ? <p className="lp-pdoc__line">{langs}</p> : null}
      </div>
    </li>
  );
}
