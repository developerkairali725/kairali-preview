/**
 * /portfolio — category-filterable gallery (signed STRATEGY sitemap; matches
 * the approved golden design system). Interim imagery = the screened IG
 * captures per D-BL-INTERIM (see IMAGE_MANIFEST.md) — the hi-res shoot sets
 * swap 1:1, and the destination category joins the filter when
 * destination-labelled frames exist (never invented).
 */
import { buildMetadata } from "@kairali/seo";
import { imageGallery, graph, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { PageHeader, SiteFooter, WHATSAPP_DISPLAY, waUrl, IG_URL } from "../_components/chrome";
import { Gallery, type Work } from "./gallery";
import { OG_IMAGE_ALT, SITE_NAME, SITE_URL, snehaPerson } from "../_lib/structured-data";

export const metadata = buildMetadata(siteConfig, {
  title: "Bridal Makeup Looks & Portfolio | Blush Lounge by Sneha",
  description:
    "Real brides, cocktail glam and editorial work by Sneha Chowdhary — soft glam, minimal bridal and structured looks from Delhi to destination weddings.",
  path: "/portfolio",
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
});

const works: Work[] = [
  { src: "/images/portfolio-bridal.jpg", label: "Bridal", category: "bridal", alt: "Bridal look by Sneha Chowdhary — rose couture, luminous skin and softly defined eyes" },
  { src: "/images/portfolio-minimal-bridal.jpg", label: "Minimal bridal", category: "bridal", alt: "Minimal, effortless bridal glam by Sneha Chowdhary — fresh skin and natural definition" },
  { src: "/images/approach-traditional-bridal.jpg", label: "Traditional bridal", category: "bridal", alt: "Traditional red bridal look by Sneha Chowdhary — classic definition, luminous skin" },
  { src: "/images/hero-cocktail-glam.jpg", label: "Cocktail glam", category: "cocktail-party", alt: "Cocktail-night glamour by Sneha Chowdhary — champagne couture and sculpted structure" },
  { src: "/images/portfolio-soft-glam.jpg", label: "Soft glam", category: "cocktail-party", alt: "Soft glamour look by Sneha Chowdhary — fresh, luminous skin with quiet drama" },
  { src: "/images/portfolio-fresh-glam.jpg", label: "Fresh glam", category: "cocktail-party", alt: "Fresh party glam by Sneha Chowdhary — dewy skin and effortless definition" },
  { src: "/images/portfolio-radiant-glam.jpg", label: "Radiant glam", category: "cocktail-party", alt: "Radiant occasion look by Sneha Chowdhary — luminous skin, soft focus on the eyes" },
  { src: "/images/portfolio-structured-glam.jpg", label: "Structured glam", category: "editorial", alt: "Structured modern glamour by Sneha Chowdhary — sculpted, flawless skin" },
  { src: "/images/portfolio-sculpted-glam.jpg", label: "Sculpted glam", category: "editorial", alt: "Sculpted editorial look by Sneha Chowdhary — precise structure, camera-ready finish" },
  { src: "/images/portfolio-soft-precision.jpg", label: "Soft precision", category: "editorial", alt: "Soft precision look by Sneha Chowdhary — restrained editorial glamour" },
];

const jsonLd = graph(
  snehaPerson(),
  imageGallery({
    id: `${SITE_URL}/portfolio#gallery`,
    name: "Blush Lounge portfolio — makeup by Sneha Chowdhary",
    description: "Bridal, cocktail and editorial makeup looks by Sneha Chowdhary.",
    url: `${SITE_URL}/portfolio`,
    images: works.map((w) => SITE_URL + w.src),
  }),
);

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader current="/portfolio" />

      <section className="section pagehero">
        <p className="eyebrow">Recent work</p>
        <h1 className="display">
          The proof is in the <em>photographs</em>.
        </h1>
        <p className="section-lede">
          Every frame here is a real client — brides, cocktail nights and
          editorial work. If a look speaks to you, tell me which one on
          WhatsApp and we&rsquo;ll start from there.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Gallery works={works} />
        <div className="portfolio__foot">
          <a className="textlink" href={IG_URL} data-cta="ig_profile_click" rel="noopener">
            The full grid lives on Instagram · @blushlounge_sneha
          </a>
        </div>
      </section>

      <section className="close-cta">
        <div className="script-accent" aria-hidden="true">
          your date, your look
        </div>
        <h2 className="display">
          Seen a look you <em>love</em>?
        </h2>
        <p>
          Send me the frame and your date — I&rsquo;ll tell you how we shape it
          around your face, your outfit and your day.
        </p>
        <div className="ctas">
          <a className="btn btn--solid" href={waUrl("Hi Sneha — I saw a look on your portfolio I'd love for my date.")} data-cta="whatsapp_click" rel="noopener">
            WhatsApp Sneha · {WHATSAPP_DISPLAY}
          </a>
          <a className="btn btn--line" href="/contact" data-cta="enquiry_open">
            Send an enquiry
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
