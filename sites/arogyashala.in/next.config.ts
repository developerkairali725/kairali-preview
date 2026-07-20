import type { NextConfig } from "next";

// Protection map (docs/site-briefs/arogyashala-build-2026-07-16.md): the
// legacy arogyashala.co.in pages all 301 here once the .co.in domain forward
// goes live (forward-farm HOLD lifts when this site serves). Each legacy
// path lands single-hop on the one-pager. The misspelled legacy slug
// "pirvacy-policy" is real — preserved verbatim.
const LEGACY_PATHS = [
  "/default.aspx",
  "/about-us.aspx",
  "/apply-now.aspx",
  "/awards.aspx",
  "/career.aspx",
  "/company-profile.aspx",
  "/contact-us.aspx",
  "/enquire-now.aspx",
  "/free-ayurvedic-consultation.aspx",
  "/our-locations.aspx",
  "/our-products.aspx",
  "/pirvacy-policy.aspx",
  "/sitemap.aspx",
  "/why-arogyashala.aspx",
];

const nextConfig: NextConfig = {
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/legal", "@kairali/social"],
  async redirects() {
    return LEGACY_PATHS.map((source) => ({
      source,
      destination: source === "/pirvacy-policy.aspx" ? "/privacy" : "/",
      permanent: true,
    }));
  },
};

export default nextConfig;
