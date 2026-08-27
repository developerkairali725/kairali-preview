import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { breadcrumbList, graph, itemList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { Breadcrumbs } from "../_components/breadcrumbs";
import { PageHeader, SiteFooter } from "../_components/chrome";
import { OG_IMAGE_ALT, SITE_NAME, SITE_URL } from "../_lib/structured-data";
const ARTICLE_PATH = "/journal/makeup-colour-correction-guide";
const ARTICLE_URL = `${SITE_URL}${ARTICLE_PATH}`;

export const metadata = buildMetadata(siteConfig, {
  title: "Makeup Journal & Bridal Beauty Notes | Blush Lounge",
  description:
    "Practical makeup notes from Sneha Chowdhary on colour, bridal preparation and camera-ready finishes — written for real faces and real occasions.",
  path: "/journal",
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
});

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/journal#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Journal", url: `${SITE_URL}/journal` },
    ],
  }),
  itemList({
    id: `${SITE_URL}/journal#articles`,
    name: "Blush Lounge makeup journal",
    items: [{ name: "A simple guide to makeup colour correction", url: ARTICLE_URL }],
  }),
);

export default function JournalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader current="/journal" />

      <main>
        <section className="section pagehero journal-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Journal" }]} />
          <p className="eyebrow">The Blush Journal</p>
          <h1 className="display">
            Technique, colour and the details that make makeup feel <em>effortless</em>.
          </h1>
          <p className="section-lede">
            A small, useful collection of notes from Sneha&rsquo;s working kit —
            edited for today, grounded in real faces, and free of trend-chasing filler.
          </p>
        </section>

        <section className="section journal-list" aria-labelledby="journal-latest">
          <p className="eyebrow">Latest note</p>
          <h2 id="journal-latest" className="display">
            Start with the colour beneath the foundation.
          </h2>

          <a className="journal-card" href={ARTICLE_PATH}>
            <span className="journal-card__media">
              <Image
                src="/images/portfolio-soft-precision.jpg"
                alt="A precision makeup look by Sneha Chowdhary"
                width={506}
                height={900}
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </span>
            <span className="journal-card__copy">
              <span className="journal-card__meta">Makeup technique · 7 minute read</span>
              <strong>A simple guide to makeup colour correction</strong>
              <span>
                What peach, orange, green and lavender correctors actually do,
                how to place them, and why the cleanest result usually begins with less product.
              </span>
              <span className="textlink">Read the guide</span>
            </span>
          </a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
