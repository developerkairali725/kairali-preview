// Renders a Batch A page: the staging markup (app/<route>/staging.html,
// produced by scripts/dc_convert.py) inside the shared page shell. Three
// slots in the markup are filled with the approved components:
//   data-slot="hero-cta"      → "Plan my programme" + phone as plain text
//   data-slot="enquiry-form"  → the shared EnquiryForm (WhatsApp hand-off)
// The sticky mobile bar, header, footer, cookie bar and chat slot come from
// PageShell. Staging's layout rules live in dc-staging.css.
//
// Phone layout: staging-pages/<name> (mobile).html when it has been saved
// (staging.mobile.html, switched in at 700px by VariantSwitch). A page without
// one is marked data-phone-layout="derived" and dc-phone.css adapts its desktop
// design to phones (single column, same sections, copy and images).

import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import parse, { Element, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import EnquiryForm from "../EnquiryForm";
import PageShell from "../PageShell";
import { ENQUIRY_HREF, PRIMARY_CTA, contact } from "../../lib/site";
import "./dc-staging.css";
import "./dc-overrides.css";
import "./dc-phone.css";
import styles from "./DcPage.module.css";
import VariantSwitch from "./VariantSwitch";
import DcWidgets from "./DcWidgets";

export type DcMeta = {
  route: string;
  slug: string;
  lang?: string;
  head: {
    title: string;
    description: string | null;
    keywords: string | null;
    canonical: string | null;
    ogImage: string | null;
    locale: string;
    siteName: string;
  };
  jsonld: object | null;
  rootAttrs: Record<string, string>;
  whatsappText: string;
  form: { heading: string | null; intro: string | null };
  /** Phone design (under 700px); every Batch A page has one on staging. */
  rootAttrsMobile?: Record<string, string> | null;
  formMobile?: { heading: string | null; intro: string | null } | null;
};

export function dcMetadata(m: DcMeta): Metadata {
  const { title, description, keywords, canonical, ogImage, locale, siteName } = m.head;
  return {
    title,
    description: description ?? undefined,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description: description ?? undefined,
      url: canonical ?? undefined,
      siteName,
      locale,
      type: "website",
      // Staging's og:image dimensions are not carried over (see OPEN-ITEMS).
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description: description ?? undefined },
  };
}

function HeroCta() {
  // CTA placement 2: one primary button, phone number as plain text beneath.
  return (
    <div className={styles.heroCta} data-dc-hero-cta="">
      <a id="hero-cta" className="btn btn-primary" href={ENQUIRY_HREF}>
        {PRIMARY_CTA}
      </a>
      <p>
        Or call <a href={contact.phone.href}>{contact.phone.display}</a>
      </p>
    </div>
  );
}

function render(
  html: string,
  meta: DcMeta,
  form: DcMeta["form"],
  rootAttrs: Record<string, string>,
  phoneLayout: "staging" | "derived",
) {
  const options: HTMLReactParserOptions = {
    replace(node: DOMNode) {
      if (!(node instanceof Element)) return;
      // Keep on-site navigation on the environment being reviewed.
      if (node.name === "a" && /^https:\/\/(?:www\.)?ayurvedichealingvillage\.com(?:\/|$)/i.test(node.attribs.href || "")) {
        const href = new URL(node.attribs.href);
        node.attribs.href = href.pathname + href.search + href.hash;
      }
      const slot = node.attribs["data-slot"];
      if (slot === "hero-cta") return <HeroCta />;
      if (slot === "enquiry-form")
        return (
          <div className={styles.formSlot}>
            <EnquiryForm
              pagePath={meta.route}
              heading={form.heading}
              intro={form.intro}
              whatsappText={meta.whatsappText}
              headingLevel={2}
            />
          </div>
        );
    },
  };
  return (
    <div id="ahv-design-root" className={styles.root} {...rootAttrs} data-phone-layout={phoneLayout}>
      {parse(html, options)}
    </div>
  );
}

export default function DcPage({ meta, dir }: { meta: DcMeta; dir: string }) {
  const base = path.join(process.cwd(), "campaign-v110", "pages", ...dir.split("/"));
  const mobilePath = path.join(base, "staging.mobile.html");
  const hasMobile = Boolean(meta.rootAttrsMobile) && fs.existsSync(mobilePath);
  const desktop = render(
    fs.readFileSync(path.join(base, "staging.html"), "utf8"),
    meta,
    meta.form,
    meta.rootAttrs,
    hasMobile ? "staging" : "derived",
  );
  const mobile = hasMobile
    ? render(fs.readFileSync(mobilePath, "utf8"), meta, meta.formMobile ?? meta.form, meta.rootAttrsMobile!, "staging")
    : null;
  return (
    <PageShell lang={meta.lang}>
      {meta.jsonld && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.jsonld) }} />
      )}
      {mobile ? <VariantSwitch mobile={mobile} desktop={desktop} /> : desktop}
      <DcWidgets />
    </PageShell>
  );
}
