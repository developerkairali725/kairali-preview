import type { CampaignConfig, PageStay } from "../../kit/types.ts";
import { SectionHead } from "../../sections/head";
import { Paras } from "../../sections/rich";
import { ConsultCta, type SecProps } from "./parts";

/**
 * What a stay covers and how it is quoted — the enquiry-only quotation of the owner's hidden-pricing rule (no amount,
 * currency or rate download anywhere). The copy on the left; the lists on a panel on the right: what a quotation
 * includes (a drawn check) and what to ask about (a drawn plus, muted). The list headings carry the meaning; the marks
 * only reinforce it.
 */
export default function Stay({ c, st, v, ui, no }: { c: CampaignConfig; st: PageStay } & SecProps) {
  return (
    <section className="lp-sec lp-pstay" aria-labelledby="lp-pstay-h">
      <div className="lp-pstay__intro">
        <SectionHead v={v} no={no} kicker={ui.kicker.stay} title={st.heading} id="lp-pstay-h" />
        <Paras list={st.paragraphs} className="lp-pstay__p" />
      </div>
      <div className="lp-pstay__panel">
        {st.lists.map((l, i) => (
          <div key={i} className={l.extra ? "lp-pstay__group lp-pstay__group--extra" : "lp-pstay__group"}>
            {l.heading ? <h3 className="lp-pstay__h">{l.heading}</h3> : null}
            <ul className="lp-pstay__list">{l.items.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="lp-pstay__after">
        <Paras list={st.after} className="lp-pstay__p" />
        <ConsultCta c={c} />
      </div>
    </section>
  );
}
