import { organization, person } from "@kairali/schema";
import siteConfig from "../../site.config.json";

export const SITE_URL = `https://${siteConfig.domain}`;
export const SITE_NAME = "Blush Lounge by Sneha";
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const SNEHA_ID = `${SITE_URL}/#sneha`;
export const SCHOOL_ID = `${SITE_URL}/academy#school`;

export const SNEHA_INSTAGRAM_URL = "https://www.instagram.com/blushlounge_sneha/";
export const SCHOOL_INSTAGRAM_URL = "https://www.instagram.com/blushschoolofbeauty/";

export const SERVICE_AREAS = [
  "Delhi",
  "New Delhi",
  "Gurugram",
  "Faridabad",
  "Noida",
  "Ghaziabad",
  "Greater Noida",
];

export const OG_IMAGE_ALT =
  "Cocktail makeup look by Sneha Chowdhary with luminous skin and defined eyes";

export function snehaPerson() {
  return person({
    id: SNEHA_ID,
    name: "Sneha Chowdhary",
    jobTitle: "Beauty, Bridal & SFX Makeup Artist",
    url: `${SITE_URL}/about`,
    sameAs: [SNEHA_INSTAGRAM_URL],
    affiliationId: BUSINESS_ID,
  });
}

export function blushOrganization() {
  return organization({
    id: BUSINESS_ID,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: "+91 88269 21110",
    description:
      "Appointment-only makeup service provided at client venues across Delhi NCR, with destination work in India and internationally by enquiry. There is no walk-in storefront.",
    areaServed: SERVICE_AREAS,
    sameAs: [SNEHA_INSTAGRAM_URL],
  });
}
