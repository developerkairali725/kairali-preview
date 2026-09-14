import type { NextConfig } from "next";

// KTAHV LP lane (launches/ktahv-lp-batch — D-LP-LIST). This site dir is the
// factory home of the ayurvedichealingvillage.com rebuild; TONIGHT it ships
// the ten /lp/<campaign> rebuild candidates ONLY (no organic pages yet — the
// full KTAHV rebuild is a separate gated run).
//
// ⚠️ NOTHING FLIPS LIVE FROM HERE. Live Google Ads point at the LEGACY URLs
// on the production WordPress host. No slug, host, redirect or DNS change
// happens without Vikash's written per-URL confirmation (STRATEGY.md §"VIKASH
// MUST CONFIRM"). The legacy→/lp/ mapping below is therefore COMMENTED OUT —
// it is the prepared cutover map, armed only after his word:
//
//   /ayurvedic-treatment-packages.html        → /lp/treatment-packages
//   /panchkarma-treatment.html                → /lp/panchkarma-treatment
//   /weight-loss.html                         → /lp/weight-loss
//   /wellness-resort-kerala.html              → /lp/ayurvedic-hospital-kerala   (banned-word slug retired)
//   /kairali-cleansing-centre.html            → /lp/kairali-cleansing-centre
//   /Ayurveda_Treatment_Neo_S.India_Cities.html → /lp/ayurveda-treatment-south-india
//   /Kairali_Brand_and_Competition_Neo-original.html → /lp/kairali-brand
//   /pain-management.html                     → /lp/pain-management
//   /de/behandlung-in-kerala/                 → /lp/behandlung-in-kerala        (DE)
//   /treatment-in-kerala.html                 → /lp/treatment-in-kerala
// STAGING LOCK (WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001). The English
// candidate lane is a review build. X-Robots-Tag is the authoritative
// no-index control here because the approved design writes its own <head> at
// runtime (the family renderers call applyHead with the source's
// "index, follow"): a response header is the one directive page JavaScript
// cannot overwrite. robots.txt Disallow backs it up. Set AHV_STAGING=0 only
// when the owner takes this to production.
const IS_STAGING = process.env.AHV_STAGING !== "0";

const nextConfig: NextConfig = {
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/social", "@kairali/legal", "@kairali/forms"],
  async headers() {
    if (!IS_STAGING) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, noimageindex" },
        ],
      },
    ];
  },
  // The interim "/" -> /lp/panchkarma-treatment redirect is GONE: the approved
  // English homepage now exists at "/" (app/(english)/page.tsx), which is the
  // replacement its own comment anticipated. The commented legacy -> /lp/
  // cutover map above stays commented; nothing about the live Ads URLs changes.
};

export default nextConfig;
