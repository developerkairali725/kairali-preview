// The site's one Organization/Hospital entity for the live ad routes' JSON-LD (tracker rows AHV-WB.017/041/069/093/
// 159 organization-schema and the Hospital part of AHV-WB.017/041/069/093/159/204 hospital-schema, 14 Oct 2026).
// A lightweight copy of the English graph's node (app/(english)/_families/schema.ts, "@type": ["Organization",
// "Hospital"]): the same @id, name, url, NAP and logo, so both graphs describe one entity. Nothing is added: no
// MedicalClinic (an open clinical/schema decision), no rating, founding date or sameAs. The parity test
// (lp-v2-production-content.test.mjs) fails if this drifts from schema.ts.
//
// Erasable TypeScript only (node --test imports this file).

import { SITE_ORIGIN, type ProductionSlug } from "./bindings.ts";

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
const LOGO_ID = `${SITE_ORIGIN}/#/schema/logo/image/`;
const ORG_NAME = "Kairali — The Ayurvedic Healing Village";
const LOGO_URL = `${SITE_ORIGIN}/ahv/assets/img/kairali-colorful-logo.png`;

/** The routes the tracker rows name; the entity is not added to any other live ad route. */
export const ORGANIZATION_ROUTES: ReadonlySet<ProductionSlug> = new Set<ProductionSlug>([
  "treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat", "ayurveda-retreat", "cleansing-centre",
]);

export function organizationNode(inLanguage: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Hospital"],
    "@id": ORGANIZATION_ID,
    name: ORG_NAME,
    url: `${SITE_ORIGIN}/`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "III/73 Palayamkadu, P.O. Olassery, Kodumbu",
      addressLocality: "Palakkad",
      addressRegion: "Kerala",
      postalCode: "678551",
      addressCountry: "IN",
    },
    telephone: "+91 9555 156 156",
    email: "info@kairali.com",
    logo: {
      "@type": "ImageObject",
      inLanguage,
      "@id": LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 290,
      height: 68,
      caption: ORG_NAME,
    },
    image: { "@id": LOGO_ID },
  };
}
