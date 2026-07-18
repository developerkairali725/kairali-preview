// /equipment/<category> — the category template (STRATEGY §1/§2).
// Content law: the `mined` blockquote is VERBATIM from the legacy record;
// spec rows are real at category granularity; "— awaiting catalog —" marks
// every gap; placeholder PDP links are unmistakable (D-EQ-CATALOG).
// Schema: Product at honest granularity — NO offers, NO sku (nothing fake
// enters the graph); FAQPage from the real on-page Q&A only.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, faqPage, product, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../../site.config.json";
import { CATEGORIES, CATEGORY_BY_SLUG, PLACEHOLDER_SKUS, SITE_URL } from "../../_lib/catalog";
import { PageHead, RfqBand } from "../../_components/page-chrome";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = CATEGORY_BY_SLUG.get(category);
  if (!c) return {};
  return {
    ...(buildMetadata(siteConfig, {
      title: c.title,
      description: c.description,
      path: `/equipment/${c.slug}`,
      siteName: "Kairali Equipment",
    }) as Metadata),
    keywords: c.keywords,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = CATEGORY_BY_SLUG.get(category);
  if (!c) notFound();

  const url = `${SITE_URL}/equipment/${c.slug}`;
  const jsonLd = graph(
    breadcrumbList({
      id: `${url}#breadcrumb`,
      items: [
        { name: "Home", url: SITE_URL },
        { name: "Equipment", url: `${SITE_URL}/equipment` },
        { name: c.name, url },
      ],
    }),
    product({
      id: `${url}#product`,
      name: c.name,
      url,
      image: `${SITE_URL}${c.img.src}`,
      description: c.description,
      brand: "Kairali",
      // offers OMITTED by law — quote-first, no prices, nothing invented.
    }),
    faqPage({ id: `${url}#faq`, questions: c.faq }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline={`The catalogue · ${c.name}`}
          title={c.h1}
          lede={c.copy}
          trail={[{ name: "Equipment", href: "/equipment" }, { name: c.name }]}
          ctaHref={`/request-a-quote?category=${encodeURIComponent(c.name)}`}
          ctaEvent={`quote-open-${c.slug}`}
        />
        <section className="section container">
          <div className="cat-grid">
            <div>
              <h2>The specification, as the record carries it</h2>
              <table className="spec-table" style={{ marginTop: 16 }}>
                <tbody>
                  {c.specs.map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
              <blockquote className="record-quote">
                <p>&ldquo;{c.mined}&rdquo;</p>
                <cite>Verbatim from the legacy Kairali equipment catalogue</cite>
              </blockquote>
              {c.variants.length > 0 ? (
                <p className="grid-note">
                  Also written: {c.variants.join(" · ")} — the same equipment,
                  spelled the way different Kerala lineages spell it.
                </p>
              ) : null}
            </div>
            <figure className="cat-fig">
              <Image src={c.img.src} alt={c.img.alt} width={520} height={390} sizes="(min-width: 1000px) 40vw, 100vw" />
              <figcaption>
                From the legacy catalogue — a commissioned studio shoot is a
                flagged dependency. No stock, no AI imagery.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section container" aria-label="models">
          <div className="section-head">
            <p className="overline">Models</p>
            <h2>Model-level entries are owner-ordered placeholders</h2>
            <p className="sub">
              The real catalogue (model names, SKUs, prices) has not landed yet.
              These entries show the team exactly what goes where — nothing here
              reads as real data, and the site stays preview-only until every
              placeholder is replaced.
            </p>
          </div>
          <div className="line-grid">
            {PLACEHOLDER_SKUS.map((sku, i) => (
              <article className="line-card" key={sku}>
                <div className="lc-body">
                  <h3>Placeholder Product — {c.name}</h3>
                  <p className="lc-gloss">model entry {i + 1} of 2</p>
                  <div className="ph-meta">
                    <span className="ph-tag">PLACEHOLDER</span>
                    SKU-PLACEHOLDER-00{i + 1} · ₹X,XXX / $X,XXX
                  </div>
                  <table className="spec-table" style={{ marginTop: 10 }}>
                    <tbody>
                      {c.specs.slice(0, 2).map(([k, v]) => (
                        <tr key={k}><td>{k}</td><td>{v}</td></tr>
                      ))}
                      <tr><td>Model detail</td><td>— awaiting catalog —</td></tr>
                    </tbody>
                  </table>
                  <Link className="btn btn-primary lc-cta" href={`/equipment/${c.slug}/${sku}`} data-cta={`pdp-open-${c.slug}`}>
                    View placeholder entry
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section container" aria-label="frequently asked questions">
          <div className="section-head">
            <p className="overline">Procurement FAQ</p>
            <h2>Asked before the quote</h2>
          </div>
          <div className="faq-list">
            {c.faq.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <RfqBand context={`Quoting the ${c.name} line for your project`} event={`quote-open-${c.slug}`} />
      </main>
    </>
  );
}
