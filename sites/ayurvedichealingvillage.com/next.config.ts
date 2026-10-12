import type { NextConfig } from "next";
import { captureConfigEnabled } from "./app/(english)/_families/capture-runtime.mjs";
import documentRedirects from "./english-candidate/document-redirects.json";
import legacyEnglishRedirects from "./english-candidate/legacy-english-redirects.json";
import adSitelinks from "./english-candidate/ad-sitelink-redirects.json";
import ppcThanksRedirects from "./english-candidate/ppc-thanks-redirects.json";
import l10nRoutes from "./l10n/routes.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
//
// SUPERSEDED (29 Sep 2026, SEO lane D-14): these legacy .html pages are now served 200 as indexable organic pages
// and several rank (e.g. /panchkarma-treatment.html ~499 clicks per redirect-map.json). Arming this map would 301
// ranking pages into noindex /lp/ pages. Do NOT arm it: route ads to /lp/ by changing the ad's final URL (Vikash,
// per URL), never by redirecting the ranking page (BUILD DECISION MATRIX rule 2).
// STAGING LOCK (WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001). The English
// candidate lane is a review build. X-Robots-Tag is the authoritative
// no-index control here because the approved design writes its own <head> at
// runtime (the family renderers call applyHead with the source's
// "index, follow"): a response header is the one directive page JavaScript
// cannot overwrite. robots.txt Disallow backs it up. Set AHV_STAGING=0 only
// when the owner takes this to production.
// Production builds must never silently consume a redacted `vercel pull`
// placeholder or an absent staging flag. Preview remains closed by default.
if (process.env.VERCEL_ENV === "production" && process.env.AHV_STAGING !== "0") {
  throw new Error("AHV production build requires explicit AHV_STAGING=0; verify the non-secret flag before building.");
}
const IS_STAGING = process.env.AHV_STAGING !== "0";
// Redacted local mode flags must not silently disable approved measurement.
if (process.env.VERCEL_ENV === "production" && !["0", "1"].includes(process.env.AHV_ANALYTICS || "")) {
  throw new Error("AHV production build requires explicit AHV_ANALYTICS=0 or 1; verify the approved non-secret mode before building.");
}

// Submitted WordPress sitemap URLs, read from the current public WP index on
// 30 Sep 2026. Keep the old submissions alive through one 301 to the new
// canonical sitemap; GSC/Bing can then be resubmitted and monitored.
const LEGACY_SITEMAPS = [
  "/sitemap_index.xml", "/sitemap.xml.gz", "/wp-sitemap.xml",
  "/wp-sitemap-posts-page-1.xml", "/de/wp-sitemap-posts-page-1.xml", "/fr/wp-sitemap-posts-page-1.xml",
  "/wp-sitemap-posts-offers-1.xml", "/fr/wp-sitemap-posts-offers-1.xml",
  "/wp-sitemap-posts-faqs-1.xml",
  "/wp-sitemap-posts-villas-1.xml", "/de/wp-sitemap-posts-villas-1.xml", "/fr/wp-sitemap-posts-villas-1.xml",
  "/wp-sitemap-posts-programs-1.xml", "/de/wp-sitemap-posts-programs-1.xml", "/fr/wp-sitemap-posts-programs-1.xml",
  "/wp-sitemap-posts-awsm_job_openings-1.xml",
];

/**
 * PROTECTION MAP — the twelve legacy URLs the owner ruled 301 on 2026-09-19
 * ("make all these pages 301"). The map itself, with a reason and the measured
 * Search Console figures per URL, is english-candidate/redirect-map.json; this
 * only turns it into routes so the fate lives in ONE place and the reasons
 * travel with it.
 *
 * 301 explicitly rather than `permanent: true`, which emits 308. Google treats
 * the two the same, but the owner asked for 301 and substituting a different
 * status code is not the agent's call.
 *
 * Every source measures zero clicks and every target is an existing approved
 * route, so nothing that ranks is being moved into a thin page (CLAUDE.md
 * BUILD DECISION MATRIX rule 2). test/redirect-map.test.mjs asserts the map's
 * integrity per URL — sources real, targets real, no chains, single hop.
 */
interface RedirectRule {
  to: string;
  reason: string;
  gsc: { clicks: number | null; impressions: number | null };
}
interface RedirectMap {
  statusCode: number;
  redirects: Record<string, RedirectRule>;
}
const REDIRECT_MAP = JSON.parse(
  readFileSync(join(process.cwd(), "english-candidate/redirect-map.json"), "utf8"),
) as RedirectMap;

const nextConfig: NextConfig = {
  // This app has multiple root layouts; unmatched URLs need their own document.
  experimental: { globalNotFound: true, inlineCss: true },
  // `pnpm lp:perf` builds into its own directory (LP_DIST_DIR) so it never collides with a running dev server's .next.
  ...(process.env.LP_DIST_DIR ? { distDir: process.env.LP_DIST_DIR } : {}),
  // Keep dependency tracing inside this monorepo on Windows and macOS.
  outputFileTracingRoot: join(process.cwd(), "../.."),
  // Static media is served from Vercel's static output, not read by page functions.
  // Keep JSON/JS datasets and SSR snapshots in the trace for dynamic rendering.
  outputFileTracingExcludes: {
    "/*": [
      "./public/**/*.{webp,png,jpg,jpeg,gif,svg,ico,avif,mp4,webm,pdf,woff,woff2,ttf,otf}",
      "./public/ahv/l10n/*/views/!(ahv-page-faqs-and-downloads-desktop).json",
    ],
  },
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
  async rewrites() { return [
    // The home runtime still requests this legacy logo path. Serve its
    // packaged same-dimension SVG after Vercel takes the public hostname.
    { source: "/wp-content/uploads/2024/11/logo_color-da22eb.svg", destination: "/ahv/assets/img/logo_color-da22eb.svg" },
  ]; },
  async headers() {
    // The payload URLs are stable across deployments; they are not content-addressed.
    // Revalidate with ETags so returning visitors receive updated views and consent UI.
    const assets = {
      source: "/ahv/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
    };
    const documents = { source: "/documents/:path*.pdf", headers: [{ key: "Content-Type", value: "application/pdf" }, { key: "Cache-Control", value: "public, max-age=86400" }] };
    // These are desktop-only view fragments fetched by indexable pages. They
    // must never become separate search results or compete with the canonicals.
    const staticFragments = {
      source: "/ahv/static/:path*.html",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
    };
    // Campaign v2 preview variants are per-visitor (geo + language): never cache shared, never index.
    const lpV2 = {
      source: "/lp-v2/:path*",
      headers: [
        { key: "Cache-Control", value: "private, no-store" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    };
    if (!IS_STAGING) return [assets, documents, staticFragments, lpV2];
    return [
      assets, documents, staticFragments, lpV2,
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, noimageindex" },
        ],
      },
    ];
  },
  async redirects() {
    // The twelve routes of 2026-09-19 carry the trailing slash the whole site is
    // normalised to (trailingSlash: true above), so the served URL and the
    // redirect source are the same string and no request pays two hops.
    //
    // The two `legacy: true` entries of 2026-09-20 are .html files, not
    // directories, and trailingSlash leaves an extension alone - so they are
    // also a single hop, just by the other rule. They are ad-landing URLs that
    // were never in the manifest: unlisted in the sitemap and linked from no
    // page on the live site, which is why nothing surfaced them until now.
    return [...LEGACY_SITEMAPS.map((source) => ({source,destination:"/sitemap.xml",statusCode:301})), ...Object.entries(REDIRECT_MAP.redirects).map(([source, rule]) => ({
      source,
      destination: rule.to,
      statusCode: REDIRECT_MAP.statusCode,
    })), ...[...adSitelinks, ...legacyEnglishRedirects, ...documentRedirects].map(rule => ({ source:rule.source, destination:rule.destination, statusCode:301 })),
    // The retired paid-landing confirmation (owner request, 8 Oct 2026): each of the
    // 13 released /ppc-thanks/ locale paths gets one 301 to the same locale's /thanks/.
    // Next carries the incoming query string through unchanged. lead-receipt.js
    // accepts a receipt still addressed to the old path on its new page.
    ...ppcThanksRedirects.map(rule => ({ source:rule.source, destination:rule.destination, statusCode:301 as const })),
    // Legacy German/French/Russian URLs of the WordPress site that the locale
    // lane does not serve in place (l10n/routes.json, generated from the verified
    // l10n/legacy-map.json): one 301 hop each. Case-only variants are NOT here -
    // custom-route matching is case-insensitive, so they would match the served
    // lowercase page and loop; middleware.ts lower-cases those instead.
    ...Object.entries((l10nRoutes as unknown as { redirects: Record<string, { to: string }> }).redirects)
      .filter(([source, rule]) => source.toLowerCase() !== rule.to.toLowerCase())
      .map(([source, rule]) => ({ source, destination: rule.to, statusCode: 301 as const }))];
  },
  // The interim "/" -> /lp/panchkarma-treatment redirect is GONE: the approved
  // English homepage now exists at "/" (app/(english)/page.tsx), which is the
  // replacement its own comment anticipated. The commented legacy -> /lp/
  // cutover map above stays commented; nothing about the live Ads URLs changes.
};

export default function config(phase: string): NextConfig {
  // Reject capture before build/start/export, even if NODE_ENV was inherited
  // as development. Next supplies this phase independently of NODE_ENV.
  captureConfigEnabled(phase);
  return nextConfig;
}
