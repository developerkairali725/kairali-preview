import Image from "next/image";
import type { CampaignConfig, Variant } from "../kit/types.ts";
import type { SectionProps } from "./LandingPage";
import { SectionHead } from "./head";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

// Which artboards show the oil-pour photo: A beside the heading (desktop and mobile), B as a bento tile.
// C's chapter is text only, so its image is not rendered at all (hidden lazy images are still fetched).
const SHOW: Record<Variant, { image: boolean }> = { A: { image: true }, B: { image: true }, C: { image: false }, D: { image: false } };

function Lists({ c }: { c: CampaignConfig }) {
  return (
    <>
      <div className="lp-adm__list">
        <p className="lp-over">Included</p>
        <ul>{c.included.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      {c.chargedSeparately.length ? (
        <div className="lp-adm__list lp-adm__list--sep">
          <p className="lp-over">Charged separately</p>
          <ul>{c.chargedSeparately.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ) : null}
    </>
  );
}

/**
 * The admission: three numbered steps plus what is included and what is charged separately.
 * The lists are open on desktop and folded into a <details> on mobile (per Mobile-Full). The two copies are
 * text only; CSS shows one per breakpoint.
 */
export default function Admission({ c, v }: SectionProps) {
  const photo = SHOW[v].image ? c.gallery.find((g) => g.category === "Therapies")?.image : undefined;
  return (
    <section className="lp-sec lp-adm" aria-labelledby="lp-adm-h">
      <div className="lp-adm__intro">
        <SectionHead v={v} section="admission" kicker="The admission" title={c.admission.heading} id="lp-adm-h" />
        {photo ? (
          <Image className="lp-adm__img" src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
            sizes="(max-width: 767px) 100vw, 36vw" loading="lazy" />
        ) : null}
      </div>
      <ol className="lp-adm__steps">
        {c.admission.steps.map((s, i) => (
          <li key={s.title} className="lp-adm__step">
            <span className="lp-adm__no" aria-hidden="true">{NUMERALS[i] ?? i + 1}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="lp-adm__lists lp-hide-mobile"><Lists c={c} /></div>
      <details className="lp-adm__more lp-hide-desktop">
        <summary>What is included <span className="lp-plus" aria-hidden="true" /></summary>
        <div className="lp-adm__more-body"><Lists c={c} /></div>
      </details>
    </section>
  );
}
