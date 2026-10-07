import Image from "next/image";
import type { PagePathway } from "../../kit/types.ts";
import { SectionHead } from "../../sections/head";
import { Paras, Rich } from "../../sections/rich";
import { numeral } from "./parts";

/**
 * From the first conversation to the stay: two or three numbered steps in the kit's Admission layout (heading and a
 * therapy photograph on the left, the steps on the right; stacked on phones). The kit's Admission lists are not
 * repeated here: what a stay covers is its own section (Stay).
 */
export default function Pathway({ p }: { p: PagePathway }) {
  const im = p.image;
  return (
    <section className="lp-sec lp-adm lp-ppath" aria-labelledby="lp-ppath-h">
      <div className="lp-adm__intro">
        <SectionHead v="A" kicker="How it works" title={p.heading} id="lp-ppath-h" />
        <Paras list={p.intro} className="lp-ppath__p" />
        {im ? (
          <Image className="lp-adm__img" src={im.src} alt={im.alt} width={im.width} height={im.height}
            sizes="(max-width: 767px) 100vw, 36vw" loading="lazy" />
        ) : null}
      </div>
      <ol className="lp-adm__steps">
        {p.steps.map((s, i) => (
          <li key={s.title} className="lp-adm__step">
            <span className="lp-adm__no" aria-hidden="true">{numeral(i)}</span>
            <div>
              <h3>{s.title}</h3>
              <p><Rich text={s.body} /></p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
