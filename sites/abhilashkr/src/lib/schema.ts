import { SITE_URL } from "./config";
import type { Locale, PageKey } from "./i18n";

export type BreadcrumbSchemaItem = {
  name: string;
  url: string;
};

type PageSchemaOptions = {
  locale: Locale;
  pageKey: PageKey;
  name: string;
  url: string;
  breadcrumbItems: BreadcrumbSchemaItem[];
  pageType?: "WebPage" | "ProfilePage" | "ContactPage" | "CollectionPage";
};

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const KAIRALI_ORGANIZATION_ID = "https://www.kairali.com/#organization";

const PAGE_TYPES: Partial<Record<PageKey, PageSchemaOptions["pageType"]>> = {
  home: "ProfilePage",
  about: "ProfilePage",
  writing: "CollectionPage",
  media: "CollectionPage",
  recognition: "CollectionPage",
  contact: "ContactPage",
};

function getPersonNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    url: SITE_URL,
    name: "Abhilash Kalathil Ramesh",
    alternateName: [
      "Abhilash K. Ramesh",
      "Abhilash Ramesh",
      "Abilash Ramesh",
      "Abilash K. Ramesh",
    ],
    email: "info@kairali.com",
    image: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#primaryimage`,
      url: `${SITE_URL}/images/abhilash-portrait.png`,
      contentUrl: `${SITE_URL}/images/abhilash-portrait.png`,
      caption: "Abhilash Kalathil Ramesh — Executive Director, Kairali Ayurvedic Group",
    },
    jobTitle: "Executive Director",
    worksFor: { "@id": KAIRALI_ORGANIZATION_ID },
    memberOf: [
      {
        "@type": "Organization",
        name: "AYUSHEXCIL (Ayush Export Promotion Council)",
        url: "https://ayushexcil.in",
      },
      {
        "@type": "Organization",
        name: "Mumbai Angels Network",
        url: "https://www.mumbaiangels.com",
      },
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Florida International University",
      url: "https://www.fiu.edu",
    },
    knowsLanguage: ["Malayalam", "English", "German", "Chinese"],
    sameAs: [
      "https://www.linkedin.com/in/abhilashkramesh-ayurvedicmedicine-ayurvedicherbalproducts/",
    ],
    knowsAbout: [
      "Ayurveda",
      "Ayurvedic medicine",
      "wellness tourism",
      "Ayurvedic pharmaceutical manufacturing",
      "AYUSH export policy",
      "hospitality management",
      "angel investing",
      "family business",
      "AI in business operations",
    ],
    award: [
      "Best Marketing Director India — Haute Grandeur Global Excellence Awards (2026)",
      "Excellence in Wellness Hospitality (India) — PATWA International Travel Awards (2026)",
      "Asia Pacific Entrepreneurship Award (APEA), Most Promising — Enterprise Asia (2016)",
      "Entrepreneurial Excellence for AYUSH Leadership — Indian Salon & Wellness Awards (2015)",
      "40 Under 40 Most Influential — AsiaOne (2017)",
    ],
  };
}

export function getSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getPersonNode(),
      {
        "@type": "Organization",
        "@id": KAIRALI_ORGANIZATION_ID,
        name: "Kairali Ayurvedic Group",
        url: "https://www.kairali.com",
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "Abhilash K. Ramesh",
        alternateName: "Abhilash Kalathil Ramesh",
        inLanguage: ["en", "de", "fr"],
        publisher: { "@id": PERSON_ID },
      },
    ],
  };
}

export function getPageSchema({
  locale,
  pageKey,
  name,
  url,
  breadcrumbItems,
  pageType = PAGE_TYPES[pageKey] ?? "WebPage",
}: PageSchemaOptions) {
  const breadcrumbId = `${url}#breadcrumb`;
  const pageNode: Record<string, unknown> = {
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
  };
  const graph: Record<string, unknown>[] = [pageNode];

  if (breadcrumbItems.length > 1) {
    pageNode.breadcrumb = { "@id": breadcrumbId };
    graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  if (pageKey === "home" || pageKey === "about") {
    pageNode.mainEntity = { "@id": PERSON_ID };
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
