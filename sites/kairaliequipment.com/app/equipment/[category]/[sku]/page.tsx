// /equipment/<category>/<sku> — the PLACEHOLDER PDP TEMPLATE (D-EQ-CATALOG /
// STRATEGY §1 + §6): 2 placeholder products per category, every value in the
// EXACT placeholder grammar, one clearly-badged placeholder image, quote CTA.
// LAW: noindex (§6.2), EXCLUDED from sitemap.xml, and NO Product schema —
// nothing fake enters the graph. Real SKUs replace these route-for-route.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../../site.config.json";
import { CATEGORIES, CATEGORY_BY_SLUG, PLACEHOLDER_SKUS, SITE_URL } from "../../../_lib/catalog";
import { Crumbs, RfqBand } from "../../../_components/page-chrome";

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) => PLACEHOLDER_SKUS.map((sku) => ({ category: c.slug, sku })));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; sku: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = CATEGORY_BY_SLUG.get(category);
  if (!c) return {};
  return buildMetadata(siteConfig, {
    title: `Placeholder Product — ${c.name}`,
    description:
      "Owner-ordered placeholder product entry — real model data replaces this page when the catalogue lands. Nothing here is a real offer.",
    path: `/equipment/${category}`,
    siteName: "Kairali Equipment",
    index: false, // D-EQ-CATALOG §6.2: placeholder PDPs never enter the index
  }) as Metadata;
}

export default async function PlaceholderPdp({ params }: { params: Promise<{ category: string; sku: string }> }) {
  const { category, sku } = await params;
  const c = CATEGORY_BY_SLUG.get(category);
  if (!c || !(PLACEHOLDER_SKUS as readonly string[]).includes(sku)) notFound();
  const n = sku.endsWith("2") ? "002" : "001";

  return (
    <main>
      <section className="page-head">
        <div className="container">
          <Crumbs
            trail={[
              { name: "Equipment", href: "/equipment" },
              { name: c.name, href: `/equipment/${c.slug}` },
              { name: `SKU-PLACEHOLDER-${n}` },
            ]}
          />
          <p className="overline">Placeholder model entry · {c.name}</p>
          <h1>Placeholder Product — {c.name}</h1>
        </div>
      </section>
      <section className="section container">
        <div className="pdp-shell">
          <figure className="pdp-media">
            <span className="ph-stamp">PLACEHOLDER IMAGE</span>
            <Image src={c.img.src} alt={`Placeholder entry — legacy ${c.name} category photograph`} width={520} height={390} sizes="(min-width: 1000px) 40vw, 100vw" />
          </figure>
          <div>
            <div className="ph-meta">
              <span className="ph-tag">PLACEHOLDER</span>
              SKU-PLACEHOLDER-{n} · ₹X,XXX / $X,XXX
            </div>
            <table className="spec-table" style={{ marginTop: 14 }}>
              <tbody>
                {c.specs.map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td>{v}</td></tr>
                ))}
                <tr><td>Model name</td><td>— awaiting catalog —</td></tr>
                <tr><td>Model options</td><td>— awaiting catalog —</td></tr>
              </tbody>
            </table>
            <p className="pdp-note">
              This is an owner-ordered placeholder entry (preview-only build):
              it shows the team exactly where each real model will live. The SKU
              and price above are explicit placeholders, never real values — the
              real catalogue replaces this page route-for-route, and the site
              cannot go live while any placeholder remains.
            </p>
            <Link
              className="btn btn-primary card-cta"
              href={`/request-a-quote?category=${encodeURIComponent(c.name)}`}
              data-cta={`quote-open-${c.slug}`}
            >
              Request a quote — {c.name}
            </Link>
          </div>
        </div>
      </section>
      <RfqBand context={`Quoting the ${c.name} line for your project`} event={`quote-open-${c.slug}`} />
    </main>
  );
}
