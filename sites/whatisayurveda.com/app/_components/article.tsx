// Article template — renders one content Page with full E-E-A-T furniture:
// breadcrumbs, dual byline (author + Dr. Deepu John reviewer), answer capsules,
// question-form sections, sibling links, a non-promotional pathway module,
// FAQ, citations, and MedicalWebPage/Person/FAQPage/Breadcrumb JSON-LD.
import Link from "next/link";
import {
  graph,
  medicalWebPage,
  article as articleSchema,
  physician,
  person,
  kairaliOrganization,
  faqPage,
  breadcrumbList,
  serializeJsonLd,
} from "@kairali/schema";
import { Markdown } from "../lib/render";
import { EMAIL, WHATSAPP_URL } from "./chrome";
import type { Page } from "../lib/content";
import { MEDICAL_REVIEW } from "../lib/medical-review";

const SITE = "https://whatisayurveda.com";
const REVIEWED = "2026-07-14"; // build date; real review cadence tracked in editorial policy
const REVIEWER_ID = `${SITE}/about#${MEDICAL_REVIEW.current.anchor}`;
const AUTHOR_ID = `${SITE}/about#editorial-team`;
const ORG_ID = `${SITE}/#organization`;

/** Where a page routes intent, non-promotionally (§7 of the niche brief). */
const PATHWAYS: Record<string, { overline: string; body: string; href: string; cta: string }> = {
  KTAHV: {
    overline: "Where this is practised",
    body: "Panchakarma and classical Ayurvedic treatment programmes are carried out under physician supervision at Kairali — The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala.",
    href: "https://www.ayurvedichealingvillage.com",
    cta: "Visit the Healing Village",
  },
  KAPPL: {
    overline: "Where these are made",
    body: "Kairali manufactures its classical formulations at its own WHO-GMP-certified pharmacy, so the herbs described here are prepared to a documented quality standard.",
    href: "https://www.kairaliproducts.com",
    cta: "See Kairali's products",
  },
  "Villa Raag": {
    overline: "A place to rest",
    body: "Villa Raag in Agonda, South Goa is Kairali's boutique wellness villa — an unhurried setting for the lifestyle side of Ayurveda.",
    href: "https://villaraag.com",
    cta: "Visit Villa Raag",
  },
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Article({ page }: { page: Page }) {
  const crumbs = page.breadcrumb?.length
    ? page.breadcrumb
    : [{ name: "Home", url: "/" }, { name: page.h1 ?? page.title, url: page.slug }];

  const jsonLd = graph(
    kairaliOrganization({ id: ORG_ID, url: SITE }),
    page.clinical
      ? medicalWebPage({
          id: `${SITE}${page.slug}#page`,
          name: page.title,
          url: `${SITE}${page.slug}`,
          lastReviewed: REVIEWED,
          reviewedById: REVIEWER_ID,
          inLanguage: "en",
        })
      : articleSchema({
          id: `${SITE}${page.slug}#page`,
          headline: page.title,
          url: `${SITE}${page.slug}`,
          authorId: AUTHOR_ID,
          datePublished: REVIEWED,
          dateModified: REVIEWED,
          inLanguage: "en",
          publisherId: ORG_ID,
        }),
    physician({
      id: REVIEWER_ID,
      name: MEDICAL_REVIEW.current.name,
      jobTitle: `${MEDICAL_REVIEW.current.title} (${MEDICAL_REVIEW.current.credentials})`,
      medicalSpecialty: "https://schema.org/PublicHealth",
      affiliationId: ORG_ID,
    }),
    person({ id: AUTHOR_ID, name: "The Kairali Editorial Team", affiliationId: ORG_ID }),
    breadcrumbList({
      id: `${SITE}${page.slug}#breadcrumb`,
      items: crumbs.map((c) => ({ name: c.name, url: `${SITE}${c.url}` })),
    }),
    ...(page.faqs?.length
      ? [faqPage({ id: `${SITE}${page.slug}#faq`, questions: page.faqs.map((f) => ({ question: f.q, answer: f.a })) })]
      : []),
  );

  const pathway = page.routesTo?.map((k) => PATHWAYS[k]).find(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <nav className="breadcrumbs container" aria-label="Breadcrumb">
        <ol>
          {crumbs.map((c, i) => (
            <li key={c.url}>
              {i < crumbs.length - 1 ? <Link href={c.url}>{c.name}</Link> : <span>{c.name}</span>}
            </li>
          ))}
        </ol>
      </nav>

      <article className="article">
        <div className="container reading">
          <h1>{page.h1 ?? page.title}</h1>

          <div className="byline">
            <span>By <span style={{ color: "var(--forest-700)", fontWeight: 700 }}>the Kairali Editorial Team</span></span>
            <span className="review-badge"><CheckIcon /> Medically reviewed by {MEDICAL_REVIEW.current.name} ({MEDICAL_REVIEW.current.credentials})</span>
            <span>Reviewed {new Date(REVIEWED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>

          <div className="capsule lead">{page.answerCapsule}</div>

          <div className="prose">
            {page.sections.map((s, i) => (
              <section key={i}>
                <h2 id={`s-${i}`}>{s.h2}</h2>
                {s.capsule ? <div className="capsule">{s.capsule}</div> : null}
                <Markdown text={s.body} />
              </section>
            ))}
          </div>

          {pathway ? (
            <aside className="pathway">
              <p className="overline">{pathway.overline}</p>
              <p>{pathway.body}</p>
              <a className="btn btn-secondary" href={pathway.href} data-cta="pathway_click" rel="noopener">
                {pathway.cta} &rarr;
              </a>
            </aside>
          ) : null}

          {page.faqs?.length ? (
            <section style={{ marginTop: 40 }}>
              <h2>Common questions</h2>
              {page.faqs.map((f, i) => (
                <div className="faq-item" key={i}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>
          ) : null}

          {page.citations?.length ? (
            <section className="citations">
              <h2>References</h2>
              <ol>
                {page.citations
                  .slice()
                  .sort((a, b) => a.n - b.n)
                  .map((c) => (
                    <li key={c.n}>
                      {c.url ? <a href={c.url} rel="nofollow noopener" target="_blank">{c.text}</a> : c.text}
                    </li>
                  ))}
              </ol>
            </section>
          ) : null}
        </div>
      </article>

      <div className="sticky-cta" aria-label="Ask a question">
        <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">Ask a doctor on WhatsApp</a>
      </div>
    </>
  );
}
