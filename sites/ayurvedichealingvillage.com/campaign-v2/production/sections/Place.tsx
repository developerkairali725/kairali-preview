import type { CampaignConfig, PagePlace } from "../../kit/types.ts";
import { SectionHead } from "../../sections/head";
import { ArrowIcon } from "../../sections/icons";
import { PageA, Paras } from "../../sections/rich";
import { AllPhotosButton, Mosaic } from "../../sections/Village";

/**
 * The village and its villas: the kit's Village (heading and copy beside "View all photos", then the five-photograph
 * mosaic that opens the full gallery), followed by the villa categories as a ruled row of cards, each linking to its
 * own page. On phones: the heading and copy, the photographs, "View all photos", then the villas.
 */
export default function Place({ c, pl }: { c: CampaignConfig; pl: PagePlace }) {
  return (
    <section className="lp-sec lp-vil lp-pplace" aria-labelledby="lp-pplace-h">
      <div className="lp-vil__top">
        <SectionHead v="A" kicker="The village" title={pl.heading} id="lp-pplace-h">
          <Paras list={pl.paragraphs} className="lp-vil__body" />
        </SectionHead>
        <AllPhotosButton />
      </div>
      <Mosaic c={c} />
      {pl.villas?.length ? (
        <ul className="lp-pplace__villas">
          {pl.villas.map((v) => (
            <li key={v.name} className="lp-pplace__villa">
              <h3 className="lp-pplace__name">{v.name}</h3>
              <p className="lp-pplace__text">{v.body}</p>
              <PageA className="lp-pplace__link" href={v.link.href}><span>{v.link.label}</span><ArrowIcon /></PageA>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
