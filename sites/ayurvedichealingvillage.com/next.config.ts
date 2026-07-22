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
const nextConfig: NextConfig = {
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/social", "@kairali/legal", "@kairali/forms"],
  async redirects() {
    return [
      // Interim only: the factory site has no organic homepage yet, and the
      // factory spec suite exercises "/" — route it to the golden LP. The
      // KTAHV rebuild replaces this with the real homepage.
      { source: "/", destination: "/lp/panchkarma-treatment", permanent: false },
    ];
  },
};

export default nextConfig;
