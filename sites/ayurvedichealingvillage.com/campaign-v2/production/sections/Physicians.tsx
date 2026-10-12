import type { CSSProperties } from "react";
import Image from "next/image";
import type { CampaignConfig, DoctorRef, PageDoctors } from "../../kit/types.ts";
import { isPending } from "../../kit/pending.ts";
import { SectionHead } from "../../sections/head";
import { doctorMeta } from "../../sections/Doctors";
import { t } from "../../sections/text.ts";
import { UI, type ProductionUi } from "../ui.ts";
import type { SecProps } from "./parts";

/** "Speaks Malayalam, English, Hindi and Tamil": the reviewed copy's own wording of the registry languages. */
export function speaks(d: DoctorRef, ui: ProductionUi = UI.en): string {
  const local = ui.doctorFacts[d.id]?.languages;
  if (local) return ui.doctors.speaks(local);
  if (isPending(d.languages)) return t(d.languages);
  const l = d.languages;
  return l.length ? ui.doctors.speaks(l) : "";
}

/**
 * The page's one doctors section — the route's current consented physicians, once, with their own portrait — placed
 * directly before the enquiry form: the doctors a visitor can consult, then the form that starts that consultation.
 * Desktop: one row of five 4:5 portraits (three across on tablets); phones: a ruled list with the portrait beside the
 * text. A route presenting one physician (the German and Russian routes, as their reviewed copy does) shows a single
 * wide card instead. Each portrait is positioned and enlarged per doctor (DoctorRef.frame) so faces read at a similar
 * size. Every fact comes from data/doctors.ts (the German / Russian wording of the same facts from production/ui.ts);
 * years in practice are never derived.
 */
export default function Physicians({ c, d, v, ui, no }: { c: CampaignConfig; d: PageDoctors } & SecProps) {
  if (!c.doctors.length) return null;
  const one = c.doctors.length === 1;
  return (
    <section className={one ? "lp-sec lp-pdocs lp-pdocs--one" : "lp-sec lp-pdocs"} aria-labelledby="lp-pdocs-h">
      <SectionHead v={v} no={no} kicker={ui.kicker.doctors} title={d.heading} id="lp-pdocs-h">
        <p className="lp-pdocs__intro">{d.intro}</p>
      </SectionHead>
      <ul className="lp-pdocs__list">
        {c.doctors.map((doc) => <Card key={doc.id} d={doc} ui={ui} one={one} />)}
      </ul>
    </section>
  );
}

function Card({ d, ui, one }: { d: DoctorRef; ui: ProductionUi; one: boolean }) {
  const f = d.frame ?? { position: "50% 18%", origin: "50% 18%", zoom: 1 };
  // Rendered widths (production.css): phones 112px; 768–1199px three across (~30vw); from 1200px five across (~18vw);
  // a single card's portrait is ~320px. An enlarged portrait needs that many more source pixels.
  const z = Math.max(1, f.zoom);
  const sizes = one
    ? `(max-width: 767px) ${Math.ceil(112 * z)}px, ${Math.ceil(320 * z)}px`
    : `(max-width: 767px) ${Math.ceil(112 * z)}px, (max-width: 1199px) ${Math.ceil(30 * z)}vw, ${Math.ceil(18 * z)}vw`;
  const frame = { "--pdoc-pos": f.position, "--pdoc-origin": f.origin, "--pdoc-zoom": String(z) } as CSSProperties;
  const local = ui.doctorFacts[d.id];
  const role = local?.role ? [local.role, t(d.qualification)].filter(Boolean).join(" · ") : doctorMeta(d);
  const tenure = local?.tenure ?? d.tenure;
  const focus = local?.focus ?? d.focus;
  const langs = speaks(d, ui);
  return (
    <li className="lp-pdoc">
      <div className="lp-pdoc__frame" style={frame}>
        <Image className="lp-pdoc__img" src={d.photo.src} alt="" width={d.photo.width} height={d.photo.height} sizes={sizes} loading="lazy" />
      </div>
      <div className="lp-pdoc__text">
        <h3 className="lp-pdoc__name">{d.name}</h3>
        <p className="lp-pdoc__role">{role}</p>
        {tenure ? <p className="lp-pdoc__line">{tenure}</p> : null}
        {focus ? <p className="lp-pdoc__line">{ui.doctors.focus}: {focus}</p> : null}
        {langs ? <p className="lp-pdoc__line">{langs}</p> : null}
      </div>
    </li>
  );
}
