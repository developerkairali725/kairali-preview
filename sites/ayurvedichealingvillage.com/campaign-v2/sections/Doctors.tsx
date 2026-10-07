import Image from "next/image";
import type { DoctorRef, Maybe } from "../kit/types.ts";
import type { SectionProps } from "./LandingPage";
import { isPending } from "../kit/pending.ts";
import { t } from "./text.ts";
import { SectionHead } from "./head";

// Pending facts render as their [id] placeholder (C4) so review catches them.
const show = <T,>(v: Maybe<T>, fmt: (x: T) => string): string => (isPending(v) ? t(v) : fmt(v));

/** Role · qualification, plus years in practice only when a source states them (never derived, never 0). */
export function doctorMeta(d: DoctorRef): string {
  const parts = [t(d.role), t(d.qualification)];
  if (d.yearsInPractice !== undefined) parts.push(`${show(d.yearsInPractice, String)} years in practice`);
  return parts.filter(Boolean).join(" · ");
}

/** The languages line, worded as the approved source words it ("Speaks Malayalam, English"). */
export function doctorLanguages(d: DoctorRef): string {
  return isPending(d.languages) ? t(d.languages) : d.languages.length ? `Speaks ${d.languages.join(", ")}` : "";
}

// `sizes` per variant, matching the rendered widths in sections.css ("Doctors"): phones up to 360px (stacked),
// 240px beside the text on 480–999, then ~30vw desktop columns; D's desktop portrait is 200px from 1360px up.
const SIZES = {
  default: "(max-width: 479px) 360px, (max-width: 999px) 240px, 30vw",
  D: "(max-width: 479px) 360px, (max-width: 999px) 240px, (min-width: 1360px) 200px, 30vw",
};

/**
 * Doctors: three cards on desktop; on phones, stacked cards with the portrait at full card width (up to 360px),
 * name and role below it (no side-scroll, no carousel). The portrait is the trust signal for the free
 * consultation, so it is a 4:5 head-and-torso crop large enough to recognise the doctor (Task 19).
 * One <Image> per doctor, lazy (never the LCP); CSS sizes it per breakpoint. alt="" because the name is the h3.
 * Tenure and focus lines are the approved source's own words; absent facts are simply not shown.
 */
export default function Doctors({ c, v }: SectionProps) {
  if (!c.doctors.length) return null;
  return (
    <section className="lp-sec lp-docs" aria-labelledby="lp-docs-h">
      <div className="lp-docs__top">
        <SectionHead v={v} section="doctors" kicker="Your doctors" title="Qualified Ayurvedic doctors lead every admission." id="lp-docs-h" />
        <a className="lp-btn lp-btn--primary lp-docs__cta" href="#enquiry"
          data-track="cta_click" data-track-cta="consult" data-track-position="section">{c.cta?.primary ?? "Get free doctor consultation"}</a>
      </div>
      <ul className="lp-docs__list">
        {c.doctors.map((d) => {
          const langs = doctorLanguages(d);
          return (
            <li key={d.id} className="lp-doc">
              <Image className="lp-doc__img" src={d.photo.src} alt="" width={d.photo.width} height={d.photo.height}
                sizes={v === "D" ? SIZES.D : SIZES.default} loading="lazy" />
              <div className="lp-doc__text">
                <h3 className="lp-doc__name">{d.name}</h3>
                <p className="lp-doc__meta">{doctorMeta(d)}</p>
                {d.tenure ? <p className="lp-doc__tenure">{d.tenure}</p> : null}
                {d.focus ? <p className="lp-doc__focus">{d.focus}</p> : null}
                {langs ? <p className="lp-doc__lang">{langs}</p> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="lp-docs__note">Doctor availability is confirmed when you enquire.</p>
    </section>
  );
}
