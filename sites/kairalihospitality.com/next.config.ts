import type { NextConfig } from "next";

// Protection map (docs/site-briefs/kairalihospitality-build-2026-07-16.md):
// every legacy .aspx page banked in content-mined/kairalihospitality.com/
// gets a single-hop 301. Section anchors keep intent where the one-pager has
// an honest home for it; everything else lands on /. The franchise page goes
// to the CANONICAL franchise domain (ayurvedafranchise.com per DECISIONS
// Decision #4 — kairalifranchise.com itself is only a 301 into it, so
// pointing there would create a two-hop chain; ayurvedafranchise.com
// verified serving 200 on 16 Jul 2026).
const LEGACY_MAP: Record<string, string> = {
  "/home.aspx": "/",
  "/default.aspx": "/",
  "/about-us.aspx": "/",
  "/brief-on-kairali.aspx": "/",
  "/founders-message.aspx": "/",
  "/awards.aspx": "/",
  "/ayurvedic-destination.aspx": "/#properties",
  "/ayurvedic-healing-village.aspx": "/#healing-village",
  "/accommodation-tariffs.aspx": "/#healing-village",
  "/ayurvedic-franchise.aspx": "https://ayurvedafranchise.com/",
  "/contact-us.aspx": "/#enquire",
  "/enquiry-now.aspx": "/#enquire",
  "/careers.aspx": "/",
  "/apply-now.aspx": "/",
  "/faqs.aspx": "/",
  "/download-center.aspx": "/",
};

// Live-but-unmined legacy URLs observed in the 2026-07-16 audit + sitewide
// nav (not banked as HTML, still deserve fates — cheap insurance).
const OBSERVED_EXTRA: Record<string, string> = {
  "/privacy-policy.aspx": "/privacy",
  "/terms-of-use.aspx": "/terms",
  "/sitemap.aspx": "/",
  "/free-online-consultation.aspx": "/#enquire",
  "/give-feedback.aspx": "/#enquire",
  "/read-feedback.aspx": "/",
  "/newsletter.aspx": "/",
  "/virtual-tour.aspx": "/",
  "/meet-the-directors.aspx": "/",
  "/social-responsibility.aspx": "/",
  "/photo-gallery.aspx": "/",
  "/video-gallery.aspx": "/",
  "/wellness-destination.aspx": "/#properties",
};

const nextConfig: NextConfig = {
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/legal", "@kairali/social"],
  async redirects() {
    return Object.entries({ ...LEGACY_MAP, ...OBSERVED_EXTRA }).map(
      ([source, destination]) => ({ source, destination, permanent: true }),
    );
  },
};

export default nextConfig;
