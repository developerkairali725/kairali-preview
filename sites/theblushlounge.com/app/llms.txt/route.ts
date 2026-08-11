import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

const SITE_URL = `https://${siteConfig.domain}`;

const body = buildLlmsTxt(siteConfig, {
  name: "Blush Lounge — Makeup by Sneha",
  summary:
    "Official website of Sneha Chowdhary, a Delhi-based beauty, bridal and SFX makeup artist serving Delhi and destination clients.",
  facts: [
    "Artist: Sneha Chowdhary.",
    "Services: bridal, engagement and cocktail, party and occasion, editorial and SFX, and grooming for men.",
    "Service area: Shivalik, New Delhi, Delhi and destination clients worldwide.",
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
