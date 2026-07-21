// /about — the KAPPL story (STRATEGY §1 row 11). 1908/1989 framing EXACTLY as
// published; product-pharma register; locked contact only.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "About KAPPL — Ayurvedic Manufacturer | Kairali",
  description:
    "The manufacturing-partnership desk of Kairali Ayurvedic Products — WHO-GMP manufacture at Pollachi. Founded 1989; a family practising Ayurveda since 1908.",
  path: "/about",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/about#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "About", url: `${SITE}/about` },
    ],
  }),
);

export default function About() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="About"
          title="A manufacturing desk with a lineage behind it"
          lede="bulkayurvedaproducts.com is the manufacturing-partnership desk of Kairali Ayurvedic Products Pvt. Ltd. (KAPPL) — the Kairali Ayurvedic Group's WHO-GMP-certified manufacturer at Pollachi, Tamil Nadu."
        />

        <section className="section" aria-labelledby="story-heading">
          <div className="container">
            <div className="prose">
              <h2 id="story-heading">Four generations in Ayurveda — manufacturing since 1948</h2>
              <p>
                The Kairali family has practised Ayurveda since 1908; the group
                was formally founded in 1989. The pharmaceutical arm, KAPPL,
                grew from that practice into a certified production campus —
                the line, in-house laboratories, an in-house herb-extraction
                unit and R&amp;D at one Pollachi address.
              </p>
              <p>
                This desk exists for the builders: brand founders launching an
                Ayurvedic line, established brands adding an India manufacturing
                base, and licence holders who need a certified plant rather than
                their own factory. Four published engagement models cover those
                doors — third party and loan licence, two variants each — and
                every engagement is quoted per project. Certifications are
                carried exactly as KAPPL publishes them: WHO-GMP, ISO, FSSAI.
              </p>
              <p>
                Restocking ready-made oils instead? The group&rsquo;s supply desk
                at bulkayurvedaoils.com quotes the live bulk range. Retail buyers
                are best served by the Kairali store.
              </p>
            </div>
            <div className="cross-desk">
              The wider group:{" "}
              <a href="https://kappl.co.in" rel="noopener" data-cta="corporate-link">KAPPL corporate</a>
              {" · "}
              <a href="https://www.kairali.com" rel="noopener">Kairali Ayurvedic Group</a>
              {" · "}
              <a href="https://www.bulkayurvedaoils.com" rel="noopener" data-cta="cross-desk">Ready-made bulk oils &amp; powders</a>
            </div>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Work with the desk</p>
            <h2 id="start-heading">Start with a project brief</h2>
            <p className="rfq-lede">
              Category, model, scale — a direct quote conversation comes back.
            </p>
            <p style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/start-your-project" data-cta="rfq-open">Start your project</a>
            </p>
            <p className="rfq-fact" style={{ marginTop: 18 }}>
              <strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a>
              &ensp;·&ensp;
              <strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a>
            </p>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="/start-your-project" data-cta="rfq-open">Start your project</a>
      </div>
    </>
  );
}
