import type { NextConfig } from "next";

// Protection map (launches/kairaliorganic.com/STRATEGY.md §5 — legacy-URL
// fates for the SAME domain; these arm at DNS flip, which is a HUMAN action).
// Every legacy .aspx URL mined 18 Jul 2026 (docs/kappl-inputs/
// kair-pair-brand-mining.md §2) gets a single-hop fate. Section anchors keep
// intent where the golden page has an honest home for it; /products/* slugs
// exist at full build — until then product intent lands on /#the-nine (the
// ledger), which will be re-pointed when those pages ship.
// careers → kairali.com is the STRATEGY's owner-confirmed instinct (§5);
// free-online-consultation folds into enquiry per BRIEF open-Q3's
// recommendation (recommendation carried, question stays open on record).
const LEGACY_MAP: Record<string, string> = {
  "/default.aspx": "/",
  "/about-us.aspx": "/#philosophy",
  "/kairali-ayurvedic-group.aspx": "/#manufacturing",
  "/contact-us.aspx": "/#enquire",
  "/enquire-now.aspx": "/#enquire",
  "/free-online-consultation.aspx": "/#enquire",
  "/career.aspx": "https://www.kairali.com/",
  "/apply-now.aspx": "https://www.kairali.com/",
  "/privacy-policy": "/privacy",
  "/privacy-policy.aspx": "/privacy",
};

const nextConfig: NextConfig = {
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/legal", "@kairali/social"],
  async redirects() {
    return Object.entries(LEGACY_MAP).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
