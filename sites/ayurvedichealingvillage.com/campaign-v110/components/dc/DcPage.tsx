import {campaignPresentation, isCampaign, FREE_CONSULTATION} from "../campaign-presentation";
import CampaignIcon from "../CampaignIcon";
import contentReviewCopy from "../../../english-candidate/content-review-copy.json";
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
import { Element, domToReact, htmlToDOM, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import EnquiryForm from "../EnquiryForm";
import PageShell from "../PageShell";
import { ENQUIRY_HREF, PRIMARY_CTA, contact } from "../../lib/site";
import "./dc-staging.css";
import "./dc-overrides.css";
import "./dc-phone.css";
import styles from "./DcPage.module.css";
import VariantSwitch from "./VariantSwitch";
import DcWidgets from "./DcWidgets";
import { layoutCampaign } from "./dc-layout";

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
  // The saved campaign route is the indexed URL when an imported metadata
  // record omitted its canonical. Do not let Next infer a Preview hostname.
  const effectiveCanonical = canonical ?? new URL(m.route, "https://ayurvedichealingvillage.com").href;
  return {
    title,
    description: description ?? undefined,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: { canonical: effectiveCanonical },
    openGraph: {
      title,
      description: description ?? undefined,
      url: effectiveCanonical,
      siteName,
      locale,
      type: "website",
      // Staging's og:image dimensions are not carried over (see OPEN-ITEMS).
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description: description ?? undefined, images: ogImage ? [ogImage] : undefined },
  };
}

function HeroCta({campaign = false}: {campaign?: boolean}) {
  // CTA placement 2: one primary button, phone number as plain text beneath.
  return (
    <div className={styles.heroCta} data-dc-hero-cta="">
      <a id="hero-cta" className="btn btn-primary" href={campaign ? "#campaign-consultation" : ENQUIRY_HREF}>
        {campaign ? FREE_CONSULTATION : PRIMARY_CTA}
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
      if ((!meta.lang || meta.lang === "en") && node.type === "text" && "data" in node) {
        let parent = node.parent, kind = "text";
        while (parent) {
          if (parent instanceof Element && /^h[1-6]$/.test(parent.name)) { kind = parent.name; break; }
          if (parent instanceof Element && parent.name === "a") kind = "link";
          parent = parent.parent;
        }
        const edits = (contentReviewCopy as Record<string, Array<{old: string; new: string; kind: string}>>)[meta.route] ?? [];
        const edit = edits.find(e => e.old === node.data.replace(/\s+/g, " ").trim() && e.kind === kind);
        if (edit) node.data = edit.new;
        return;
      }
      if (!(node instanceof Element)) return;
      // Keep on-site navigation on the environment being reviewed.
      if (node.name === "a" && /^https:\/\/(?:www\.)?ayurvedichealingvillage\.com(?:\/|$)/i.test(node.attribs.href || "")) {
        const href = new URL(node.attribs.href);
        node.attribs.href = href.pathname + href.search + href.hash;
      }
      if (meta.route === "/treatment-in-kerala.html") {
        if (node.attribs["data-campaign-icon"]) return <CampaignIcon name={node.attribs["data-campaign-icon"]} />;
        const icon = node.name === "img" && /AHV-Campaign-(nature|modern|trained|local|strict|inhouse|nopr|nore|organic)\.webp$/.exec(node.attribs.src || "");
        if (icon) return <CampaignIcon name={icon[1]} />;
      }
      const slot = node.attribs["data-slot"];
      if (slot === "hero-cta") return <HeroCta campaign={isCampaign(meta.route)} />;
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
      {domToReact(isCampaign(meta.route) ? campaignPresentation(layoutCampaign(htmlToDOM(html) as DOMNode[]), true) : layoutCampaign(htmlToDOM(html) as DOMNode[]), options)}
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
    <PageShell lang={meta.lang} campaign={isCampaign(meta.route)}>
      {meta.jsonld && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.jsonld) }} />
      )}
      {mobile ? <VariantSwitch mobile={mobile} desktop={desktop} /> : desktop}
      <DcWidgets />
    </PageShell>
  );
}
