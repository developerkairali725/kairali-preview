import type { PageLead } from "../../kit/types.ts";
import { SectionHead } from "../../sections/head";
import { Paras, Rich } from "../../sections/rich";
import type { SecProps } from "./parts";

/**
 * The opening argument, straight after the proof strip: the heading beside the copy (the kit's 5/7 grid), the first
 * paragraph set larger as the lede. `points` (the concerns or situations the page covers) become a two-column set of
 * ruled items, so a visitor can find their own situation at a glance.
 */
export default function Lead({ lead, v, ui }: { lead: PageLead } & SecProps) {
  const [first, ...rest] = lead.paragraphs;
  return (
    <section className="lp-sec lp-plead" aria-labelledby="lp-plead-h">
      <SectionHead v={v} kicker={ui.kicker.lead} title={lead.heading} id="lp-plead-h" />
      <div className="lp-plead__body">
        {first ? <p className="lp-plead__first"><Rich text={first} /></p> : null}
        <Paras list={rest} className="lp-plead__p" />
        {lead.points?.length ? (
          <ul className="lp-plead__points">{lead.points.map((t) => <li key={t}>{t}</li>)}</ul>
        ) : null}
      </div>
    </section>
  );
}
