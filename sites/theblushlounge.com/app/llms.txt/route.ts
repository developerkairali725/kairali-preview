import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import { SERVICE_AREAS, SITE_NAME } from "../_lib/structured-data";

const SITE_URL = `https://${siteConfig.domain}`;

const body = buildLlmsTxt(siteConfig, {
  name: SITE_NAME,
  summary:
    "Official website of Sneha Chowdhary, a Delhi-based beauty, bridal, editorial and SFX makeup artist serving clients across Delhi NCR, with destination work by enquiry.",
  facts: [
    `Exact business name: ${SITE_NAME}.`,
    "Artist: Sneha Chowdhary.",
    "Services: bridal, engagement and cocktail, party and occasion, editorial and SFX, and grooming for men.",
    `Service areas: ${SERVICE_AREAS.join(", ")}.`,
    "Operating model: client-venue service with no walk-in storefront; home trials happen only when arranged directly with Sneha.",
    "Destination work in India and internationally is available by enquiry.",
    "Confirmed enquiry channel: WhatsApp or phone +91 88269 21110.",
    "Confirmed Instagram profiles: @blushlounge_sneha and @blushschoolofbeauty.",
    "Dates, availability and quotes are confirmed directly with Sneha; the website does not publish prices or opening hours.",
  ],
  sections: [
    {
      title: "Official pages",
      links: [
        { title: "Home", url: SITE_URL, note: "Official overview and contact route" },
        { title: "Portfolio", url: `${SITE_URL}/portfolio`, note: "Selected bridal and beauty work" },
        { title: "Services", url: `${SITE_URL}/services`, note: "Makeup services and booking process" },
        { title: "Blush School of Beauty", url: `${SITE_URL}/academy`, note: "Courses and masterclasses" },
        { title: "About Sneha", url: `${SITE_URL}/about`, note: "Artist profile and experience" },
        { title: "Contact", url: `${SITE_URL}/contact`, note: "Confirmed WhatsApp and Instagram channels" },
        { title: "Journal", url: `${SITE_URL}/journal`, note: "Makeup technique and bridal beauty notes" },
        {
          title: "Makeup colour correction guide",
          url: `${SITE_URL}/journal/makeup-colour-correction-guide`,
          note: "Sneha's current guide to targeted colour correction",
        },
      ],
    },
    {
      title: "Website policies",
      links: [
        { title: "Privacy notice", url: `${SITE_URL}/privacy`, note: "Controller and consent disclosures" },
        { title: "Cookie policy", url: `${SITE_URL}/cookie-policy`, note: "Essential storage and optional analytics cookies" },
      ],
    },
  ],
});

export const dynamic = "force-static";

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
