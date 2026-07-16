/**
 * @kairali/schema — typed JSON-LD builders (Checklist A8).
 *
 * One builder per template the fleet uses: Organization (+ entity subtypes
 * MedicalClinic / LocalBusiness / Product), WebSite, BreadcrumbList, FAQPage,
 * Person, Article, MedicalWebPage. Every builder strips undefined values so
 * a missing optional fact is ABSENT from the graph, never null/"" — rule 6:
 * no invented facts, gaps stay visible.
 *
 * Locked facts (email, founding year, slogan) come from
 * @kairali/compliance/rules — single source of truth, grep-verifiable.
 */

import { LOCKED_FACTS } from "@kairali/compliance/rules";

/** Remove undefined/null/empty-array values so gaps never serialize. */
function clean(obj) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

/**
 * Serialize a JSON-LD node/graph for a <script type="application/ld+json">.
 * Escapes "<" so page HTML can never be broken/injected via string fields.
 */
export function serializeJsonLd(node) {
  return JSON.stringify(node).replace(/</g, "\\u003c");
}

/** Wrap nodes in a single @graph document (one script tag per page). */
export function graph(...nodes) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Organization node. For the group itself prefer kairaliOrganization().
 * @param {{id?:string,name:string,url:string,email?:string,logo?:string,
 *          foundingDate?:string,slogan?:string,sameAs?:string[],parentId?:string}} o
 */
export function organization(o) {
  return clean({
    "@type": "Organization",
    "@id": o.id,
    name: o.name,
    url: o.url,
    email: o.email,
    logo: o.logo,
    foundingDate: o.foundingDate,
    description: o.description,
    slogan: o.slogan,
    sameAs: o.sameAs,
    parentOrganization: o.parentId ? { "@id": o.parentId } : undefined,
  });
}

/**
 * The Kairali Ayurvedic Group organization with the locked facts prefilled
 * (PROJECT_CONTEXT §3). Overrides may ADD fields, never change the locks.
 */
export function kairaliOrganization({ id, url, sameAs, logo } = {}) {
  return organization({
    id,
    name: "Kairali Ayurvedic Group",
    url: url ?? "https://www.kairali.com",
    email: LOCKED_FACTS.contactEmail,
    // PR #65 / D-1908 ruling (16 Jul 2026): the GROUP was founded 1989;
    // 1908 is the family lineage ONLY and must never attach to the Group.
    // The lineage lives in `description` with the licensed phrasing.
    foundingDate: "1989",
    description:
      "Founded in 1989 by K. V. Ramesh and Gita Ramesh — a family practising Ayurveda since 1908.",
    slogan: "health through ayurveda",
    sameAs,
    logo,
  });
}

/** @param {{id?:string,name:string,url:string,publisherId?:string,inLanguage?:string|string[]}} w */
export function webSite(w) {
  return clean({
    "@type": "WebSite",
    "@id": w.id,
    name: w.name,
    url: w.url,
    publisher: w.publisherId ? { "@id": w.publisherId } : undefined,
    inLanguage: w.inLanguage,
  });
}

/**
 * BreadcrumbList from ordered {name, url} items (first = Home).
 * @param {{id?:string, items: Array<{name:string,url:string}>}} b
 */
export function breadcrumbList(b) {
  return clean({
    "@type": "BreadcrumbList",
    "@id": b.id,
    itemListElement: b.items.map((item, i) =>
      clean({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url }),
    ),
  });
}

/** FAQPage where real Q&A exists on the page (never fabricate Q&A). */
export function faqPage({ id, questions }) {
  return clean({
    "@type": "FAQPage",
    "@id": id,
    mainEntity: questions.map((q) =>
      clean({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      }),
    ),
  });
}

/** Person for bylines (E-E-A-T: Gita Ramesh, physicians). */
export function person(p) {
  return clean({
    "@type": "Person",
    "@id": p.id,
    name: p.name,
    jobTitle: p.jobTitle,
    url: p.url,
    sameAs: p.sameAs,
    affiliation: p.affiliationId ? { "@id": p.affiliationId } : undefined,
  });
}

/** Physician (KTAHV doctor pages / MedicalWebPage reviewedBy). */
export function physician(p) {
  return { ...person(p), "@type": "Physician", medicalSpecialty: p.medicalSpecialty };
}

/** @param {{id?:string,headline:string,url:string,authorId?:string,author?:object,datePublished?:string,dateModified?:string,image?:string,inLanguage?:string,publisherId?:string}} a */
export function article(a) {
  return clean({
    "@type": "Article",
    "@id": a.id,
    headline: a.headline,
    url: a.url,
    author: a.authorId ? { "@id": a.authorId } : a.author,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    image: a.image,
    inLanguage: a.inLanguage,
    publisher: a.publisherId ? { "@id": a.publisherId } : undefined,
  });
}

/**
 * MedicalWebPage condition template (KTAHV migration method: doctor-bylined
 * condition pages). CONTENT RULE: pages using this REQUIRE the Dr. Deepu John
 * sign-off lane before staging→production (CLAUDE.md hard gate 7).
 */
export function medicalWebPage(m) {
  return clean({
    "@type": "MedicalWebPage",
    "@id": m.id,
    name: m.name,
    url: m.url,
    about: m.condition ? clean({ "@type": "MedicalCondition", name: m.condition }) : undefined,
    lastReviewed: m.lastReviewed,
    reviewedBy: m.reviewedById ? { "@id": m.reviewedById } : m.reviewedBy,
    inLanguage: m.inLanguage,
  });
}

/** MedicalClinic for KTAHV (NABH-accredited hospital-retreat). */
export function medicalClinic(c) {
  return clean({
    "@type": "MedicalClinic",
    "@id": c.id,
    name: c.name,
    url: c.url,
    email: c.email,
    telephone: c.telephone,
    address: c.address ? clean({ "@type": "PostalAddress", ...c.address }) : undefined,
    medicalSpecialty: c.medicalSpecialty,
    parentOrganization: c.parentId ? { "@id": c.parentId } : undefined,
  });
}

/** LocalBusiness (centres, Villa Raag). */
export function localBusiness(b) {
  return clean({
    "@type": b.type ?? "LocalBusiness",
    "@id": b.id,
    name: b.name,
    url: b.url,
    email: b.email,
    telephone: b.telephone,
    address: b.address ? clean({ "@type": "PostalAddress", ...b.address }) : undefined,
    parentOrganization: b.parentId ? { "@id": b.parentId } : undefined,
  });
}

/**
 * Product (Wave-1 microsites; commerce fields point at Shopify — checkout is
 * NEVER built here, Factory rule).
 */
export function product(p) {
  return clean({
    "@type": "Product",
    "@id": p.id,
    name: p.name,
    url: p.url,
    image: p.image,
    description: p.description,
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    offers: p.offer
      ? clean({
          "@type": "Offer",
          url: p.offer.url, // the Shopify PDP
          price: p.offer.price,
          priceCurrency: p.offer.priceCurrency,
          availability: p.offer.availability,
        })
      : undefined,
  });
}

/**
 * Book (healing.recipes book-plate pages). Offers carry seller + URL only —
 * NO price: list prices go stale, and rule 6 says a stale fact is a wrong
 * fact. The buy CLICK is the KPI, not the quote.
 * @param {{id?:string,name:string,alternateName?:string,url?:string,image?:string,
 *          authorId?:string,isbn?:string,numberOfPages?:number,datePublished?:string,
 *          publisherName?:string,inLanguage?:string,award?:string,bookFormat?:"Hardcover"|"Paperback"|"EBook",
 *          offers?:Array<{url:string,sellerName?:string}>}} b
 */
export function book(b) {
  return clean({
    "@type": "Book",
    "@id": b.id,
    name: b.name,
    alternateName: b.alternateName,
    url: b.url,
    image: b.image,
    author: b.authorId ? { "@id": b.authorId } : undefined,
    isbn: b.isbn,
    numberOfPages: b.numberOfPages,
    datePublished: b.datePublished,
    publisher: b.publisherName
      ? { "@type": "Organization", name: b.publisherName }
      : undefined,
    inLanguage: b.inLanguage,
    award: b.award,
    bookFormat: b.bookFormat ? `https://schema.org/${b.bookFormat}` : undefined,
    offers:
      b.offers && b.offers.length
        ? b.offers.map((o) =>
            clean({
              "@type": "Offer",
              url: o.url,
              seller: o.sellerName
                ? { "@type": "Organization", name: o.sellerName }
                : undefined,
            }),
          )
        : undefined,
  });
}
