import type { NextConfig } from "next";
import redirectMap from "./content/redirects.json";

const nextConfig: NextConfig = {
  // consent + analytics ship TSX source (thin components over plain-JS cores)
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/legal"],
  // Protection map: single-hop 301s for every legacy 2017 Chef Retreat URL
  // (docs/site-briefs/healing-recipes-legacy-mine.md). Kept in content/
  // redirects.json so the test suite can assert completeness.
  async redirects() {
    return redirectMap.redirects.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
