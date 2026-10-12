import { PACKAGE_FACTS } from "../package-facts";
import { PROGRAMME_DESCRIPTIONS } from "../programme-descriptions";
import type { CampaignConfig, PageOffering } from "../../kit/types.ts";
import { SectionHead } from "../../sections/head";
import { ArrowIcon } from "../../sections/icons";
import { PageA, Paras, Rich } from "../../sections/rich";
import { ConsultCta, numeral, type SecProps } from "./parts";

type Of<K extends PageOffering["kind"]> = Extract<PageOffering, { kind: K }>;

function packageFactsFor(c: CampaignConfig) {
  const facts = PACKAGE_FACTS[c.route];
  return facts && c.locales.length === 1 && c.locales[0] === facts.locale ? facts.paragraphs : undefined;
}
function PackageFacts({ c }: { c: CampaignConfig }) {
  const paragraphs = packageFactsFor(c);
  return paragraphs ? <div data-package-facts={c.route}><Paras list={paragraphs} className="lp-poffer__p" /></div> : null;
}


/**
 * What the page offers, set for the shape of its content:
 *   cards — a few programme families or care topics, each a card with its own programme links (2 × 2 on desktop);
 *   row   — named items completing a sentence (the five Panchakarma procedures), one numbered row;
 *   index — many short topics (family: each person's concern), a numbered index of disclosures beside a sticky intro.
 * Every form ends with the consultation CTA. `data-programme-links` marks programme pages for the treatment-packages
 * diagnostics (production/Interactions.tsx), as the old page's programme sections were.
 */
export default function Offering({ c, o, ...p }: { c: CampaignConfig; o: PageOffering } & SecProps) {
  if (o.kind === "cards") return <Cards c={c} o={o} {...p} />;
  if (o.kind === "row") return <Row c={c} o={o} {...p} />;
  return <Index c={c} o={o} {...p} />;
}

/**
 * DEC-PROGRAMME-DESCRIPTIONS: the English routes whose cards link to full programme pages also offer, beside each
 * programme link, "Ask about this programme" — the same #enquiry form and consult tracking as ConsultCta, named for
 * its programme. Exact route and English-only locale: every other route and every locale variant renders unchanged.
 */
const PROGRAMME_ASK_ROUTES: readonly string[] = [
  "/ayurvedic-treatment-packages.html", "/preventive-rejuvenation-detoxification.html",
  "/ayurveda-retreat-kerala.html", "/kairali-cleansing-centre.html",
];

function Cards({ c, o, v, ui, no }: { c: CampaignConfig; o: Of<"cards"> } & SecProps) {
  const ask = PROGRAMME_ASK_ROUTES.includes(c.route) && c.locales.length === 1 && c.locales[0] === "en";
  return (
    <section className="lp-sec lp-poffer lp-poffer--cards" aria-labelledby="lp-poffer-h">
      <div className="lp-poffer__top">
        <SectionHead v={v} no={no} kicker={o.kicker ?? ui.kicker.cards} title={o.heading} id="lp-poffer-h" />
        {o.intro?.length || packageFactsFor(c) ? <div className="lp-poffer__intro"><Paras list={o.intro} className="lp-poffer__p" /><PackageFacts c={c} /></div> : null}
      </div>
      <ol className="lp-poffer__cards" {...(o.programmeLinks ? { "data-programme-links": "" } : {})}>
        {o.cards.map((card, i) => (
          <li key={card.title} className="lp-poffer__card">
            <span className="lp-poffer__no" aria-hidden="true">{numeral(i)}</span>
            <h3 className="lp-poffer__title">{card.title}</h3>
            {card.links?.length ? (
              <ul className="lp-poffer__links">
                {card.links.map((l) => (
                  <li key={l.href}>
                    <PageA className="lp-poffer__link" href={l.href}><span>{l.label}</span><ArrowIcon /></PageA>
                    {ask && PROGRAMME_DESCRIPTIONS[l.href] ? (
                      <div data-programme-description={l.href}>
                        <Paras list={PROGRAMME_DESCRIPTIONS[l.href]} className="lp-poffer__p" />
                      </div>
                    ) : null}
                    {ask ? (
                      <a className="lp-btn lp-btn--line" href="#enquiry" aria-label={`Ask about this programme: ${l.label}`}
                        data-track="cta_click" data-track-cta="consult" data-track-position="section">
                        Ask about this programme
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
            <Paras list={card.paragraphs} className="lp-poffer__p" />
          </li>
        ))}
      </ol>
      <div className="lp-poffer__foot"><ConsultCta c={c} /></div>
    </section>
  );
}

function Row({ c, o, v, ui, no }: { c: CampaignConfig; o: Of<"row"> } & SecProps) {
  return (
    <section className="lp-sec lp-poffer lp-poffer--row" aria-labelledby="lp-poffer-h">
      <div className="lp-poffer__top">
        <SectionHead v={v} no={no} kicker={o.kicker ?? ui.kicker.row} title={o.heading} id="lp-poffer-h" />
        <p className="lp-poffer__lead">{o.lead}</p>
      </div>
      <ol className="lp-poffer__row">
        {o.items.map((t, i) => (
          <li key={t} className="lp-poffer__item">
            <span className="lp-poffer__no" aria-hidden="true">{numeral(i)}</span>
            <span className="lp-poffer__name" lang="sa-Latn">{t}</span>
          </li>
        ))}
      </ol>
      <div className="lp-poffer__text"><Paras list={o.paragraphs} className="lp-poffer__p" /><PackageFacts c={c} /></div>
      <div className="lp-poffer__foot"><ConsultCta c={c} /></div>
    </section>
  );
}

function Index({ c, o, v, ui, no }: { c: CampaignConfig; o: Of<"index"> } & SecProps) {
  return (
    <section className="lp-sec lp-poffer lp-poffer--index" aria-labelledby="lp-poffer-h">
      <div className="lp-poffer__aside">
        <SectionHead v={v} no={no} kicker={o.kicker ?? ui.kicker.index} title={o.heading} id="lp-poffer-h" />
        <Paras list={o.intro} className="lp-poffer__p" />
        <PackageFacts c={c} />
        <ConsultCta c={c} />
      </div>
      <ol className="lp-poffer__index">
        {o.topics.map((t, i) => (
          <li key={t.title}>
            <details className="lp-ptopic">
              <summary className="lp-ptopic__sum">
                <span className="lp-ptopic__no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="lp-ptopic__title">{t.title}</h3>
                <span className="lp-plus" aria-hidden="true" />
              </summary>
              <p className="lp-ptopic__body"><Rich text={t.body} /></p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
