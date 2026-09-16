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
  // The approved content, its canonicals, the sitemap and the legacy WordPress
  // URLs that hold the rankings ALL use a trailing slash. Next's default is the
  // opposite, so before this line 238 of 252 routes answered 308 and redirected,
  // 228 of 230 canonicals pointed at a URL that redirected away from the
  // indexable one, and 23,403 of 23,669 internal links (98.9%) were a redirect
  // hop. One line aligns served URL, canonical, sitemap, internal link and
  // legacy URL -- and matters most at the DNS flip, when every ranked URL would
  // otherwise land on a redirect.
  trailingSlash: true,
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/social", "@kairali/legal", "@kairali/forms"],
  async headers() {
    // The design package is content-addressed and rewritten wholesale by the
    // importer, never edited in place, so it is safe to cache hard. Before this
    // rule every one of its assets was served Cache-Control: max-age=0 --
    // measured, 105 of 110 subresources revalidated on every page view, and on
    // the homepage 32 images were downloaded TWICE in a single load, because the
    // prerendered snapshot fetches them and then the runtime re-mounts them and
    // the browser cannot reuse what it just fetched. Fonts, the runtime bundle
    // and the view payloads were all in that set.
    const assets = {
      source: "/ahv/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    };
    if (!IS_STAGING) return [assets];
    return [
      assets,
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
