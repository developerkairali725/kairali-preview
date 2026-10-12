import { trainingSnapshotFontCss } from "./training-snapshot-fonts.mjs";
import { reviewedTitleFor } from "./localized-title.mjs";
import { SnapshotStyles, type SnapshotStyleAsset } from './SnapshotStyles';
import { routeStylesFor, routeStyleHref } from "./route-styles.mjs";
import { reviewCopyFor, applyReviewSnapshot, bookingLabelsFor } from "./content-review.mjs";
import { measurementForEnvironment } from "../../../lib/measurement-config.mjs";
import { phoneCriticalMedia, descriptiveAwardLinks, firstCriticalImage, deferHomeSnapshotImages, responsiveVillaImages } from "./critical-media.mjs";
import { formPostSafety } from "./form-post-safety.mjs";
import { snapshotStylesFor, firstScreenPoster, imageLedFirstScreen } from "./snapshot-styles.mjs";
import { newsletterFooters } from "./newsletter-markup.mjs";
import { computedFooterYear } from "./computed-footer-year";
import { routeRobots } from "./robots-policy";
import { SSR_ONLY_HTML_ROUTES, putSsrOnlyHtml } from "./ssr-only-html.mjs";
import { SsrOnlyHtml } from "./ssr-only-html-slot";
/**
 * AHV English candidate — the shared route component.
 *
 * All 252 approved routes render through this ONE server component. It emits:
 *   · the route's boot config (which family view to mount, and for which path);
 *   · the mount point the approved design renders into;
 *   · variant-scoped preloads so the right payload is already in flight;
 *   · a no-JS notice, because the approved design is a client-side runtime.
 *
 * It deliberately adds no markup of its own inside the design root: whatever
 * the page shows is the approved view, unchanged.
 */
import { youtubeNewTabs } from "./youtube-links";
import type { CandidateRoute } from "./registry";
import { BREAKPOINT } from "./registry";
import { BOOT_SCRIPT, DESIGN_ROOT_ID, ROUTE_CONFIG_ID, type BootConfig } from "./boot";
// Next ships this pinned Terser build for its own output minification. Keep
// the boot inline (no extra render-blocking request) but remove its comments
// and unused syntax before React serializes it into HTML and Flight data.
// @ts-expect-error Next's bundled Terser has no public declaration file.
import { minify } from "next/dist/compiled/terser";
import { routeSchema } from "./schema";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { LOCALE_INFO, LOCALE_CODES, localizedPath, canonicalUrl, localeData, t, type LocaleCode } from "./l10n";
import componentMap from "../../../english-candidate/component-map.json";
import analyticsConfig from "../../../analytics.config.json";
import consistencyLock from "../../../english-candidate/consistency-locked-families.json";

/** Families the sitewide consistency layer must not reach (tools/build-consistency-lock.mjs). */
const lockedFamilies = new Set(Object.keys(consistencyLock.families));

/**
 * Server-rendered body (owner ruling D-20260915-03: a blocker before any DNS flip).
 *
 * The approved design is a client-side runtime, so the server response carried a
 * correct <head> and no page text: measured, 254-296 characters per route against
 * 1,200-16,100 rendered. tools/prerender-english.mjs renders each route in a real
 * browser and serialises the design's OWN compiled output; this reads that
 * snapshot at build time and ships it in the HTML.
 *
 * The design is not rebuilt or re-themed. On hydration the boot script replaces
 * the snapshot with the live view exactly as it does today, so what a visitor
 * interacts with is unchanged - the snapshot is what a crawler reads.
 *
 * Missing snapshot is NOT an error: the route simply serves as it does now
 * (client-rendered), so a partial prerender can never break a page.
 */
function snapshotName(routePath: string): string {
  const cleaned = routePath.replace(/^\/+|\/+$/g, "");
  return (cleaned === "" ? "index" : cleaned.replace(/[^a-z0-9._-]+/gi, "_")) + ".html";
}

const PRERENDER_DIR = join(process.cwd(), "english-candidate", "prerender");

function prerenderedBody(routePath: string, locale: LocaleCode = "en"): string {
  try {
    if (locale !== "en") {
      // Localized snapshots: the SAME prerender of the localized runtime
      // (tools/prerender-english.mjs --locale), stored gzip-compressed. A missing
      // snapshot serves client-rendered, exactly like the English lane.
      const gz = join(process.cwd(), "l10n", "prerender", locale, snapshotName(routePath) + ".gz");
      if (!existsSync(gz)) return "";
      return formPostSafety(computedFooterYear(youtubeNewTabs(gunzipSync(readFileSync(gz)).toString("utf8"))));
    }
    return formPostSafety(newsletterFooters(computedFooterYear(youtubeNewTabs(readFileSync(join(PRERENDER_DIR, snapshotName(routePath)), "utf8")))));
  } catch {
    return "";
  }
}

/** Explicit activation remains consent-gated; staging needs its own switch. */
function measurementForBuild(): BootConfig["measurement"] {
  return measurementForEnvironment(process.env, analyticsConfig);
}

const PAYLOAD_BASE = "/ahv/views/";
const SUPPORT_SRC = "/ahv/support.js";
/** The package's own accepted preview layer, carried over unchanged. */
const PREVIEW_SRC = "/ahv/preview/portable-preview.js";

export function buildBootConfig(route: CandidateRoute, locale: LocaleCode = "en"): BootConfig {
  const info = LOCALE_INFO[locale];
  const reviewedLocaleTitle = reviewedTitleFor(route.path, locale, localeData(locale)?.meta[route.path]?.title);
  const base = locale === "en" ? "" : `/ahv/l10n/${info.prefix}`;
  const resources = Object.fromEntries(
    Object.entries(componentMap.resources as Record<string, string>).map(([k, v]) => [k, locale === "en" ? v : v.replace(/^\/ahv\//, `${base}/`)]),
  );
  return {
    // `path` stays the ENGLISH route: it binds the design's record (datasets are
    // keyed by the English path) and scopes route-specific styling. The URL the
    // visitor sees is locale.path.
    path: route.path,
    contentReviewCopy: reviewCopyFor(route.path, locale),
    reviewedLocaleTitle,
    reviewedLocaleCanonical: (reviewedLocaleTitle || (route.path === "/karkidaka-chikitsha-or-monsoon-wellness.html" && locale !== "en")) ? canonicalUrl(route.path, locale) : undefined,
    bookingCopy: bookingLabelsFor(locale),
    robots: routeRobots(route),
    desktopView: route.desktopView,
    mobileView: route.mobileView,
    breakpoint: BREAKPOINT,
    payloadBase: locale === "en" ? PAYLOAD_BASE : `${base}/views/`,
    supportSrc: SUPPORT_SRC,
    previewSrc: PREVIEW_SRC,
    resources,
    measurement: measurementForBuild(),
    locale: {
      code: locale,
      lang: info.htmlLang,
      dir: info.dir,
      path: localizedPath(route.path, locale) ?? route.path,
      options: LOCALE_CODES.map((c) => ({ code: c, name: LOCALE_INFO[c].name, lang: LOCALE_INFO[c].htmlLang, href: localizedPath(route.path, c) })).filter((o) => o.href) as Array<{ code: string; name: string; lang: string; href: string }>,
      ui: { language: t(locale, "Language"), choose: t(locale, "Choose language"), current: t(locale, "Current language") },
      privacyHref: localizedPath("/new-privacy-policy/", locale) ?? "/new-privacy-policy/",
    },
  };
}

const compactBoot = minify(BOOT_SCRIPT, { compress: true, mangle: true }).then((result: { code?: string }) => {
  if (!result.code) throw new Error("AHV boot minification produced no script");
  return result.code;
});

export async function DesignView({ route, locale = "en" }: { route: CandidateRoute; locale?: LocaleCode }) {
  const bootScript = await compactBoot;
  // Served once, read once: the snapshot body and the "held" state that keeps
  // a desktop viewport from painting it (see the layout's third style rule).
  const body = responsiveVillaImages(phoneCriticalMedia(applyReviewSnapshot(prerenderedBody(route.path, locale), route.path, locale), route.path));
  const snapshot = applyReviewSnapshot(descriptiveAwardLinks(route.path === "/" || route.path === "/photo-gallery/" ? deferHomeSnapshotImages(body) : body, route.path), route.path, locale);
  const cfg = buildBootConfig(route, locale);
  // The view family, as a styling scope. Template-level corrections live in
  // public/design/<family>.css and key on this, so a rule written for one
  // family can never reach another — the owner-built homepage, package,
  // finder and course templates are each their own family.
  const family = (route.desktopView ?? route.mobileView ?? "")
    .replace(/^ahv-page-/, "")
    .replace(/-(desktop|mobile)$/, "")
    // a generated per-route copy of a family ("<family>--<variant>", e.g. the Air India partner page's copy of the
    // campaign-retreat views, tools/build-partner-air-india.mjs) keeps its family's styling scope
    .replace(/--[a-z0-9-]+$/, "");
  // The sitewide consistency layer (public/design/consistency.css + .js,
  // 22 Sep 2026) keys on data-ahv-consistency="1". It is emitted for every
  // family EXCEPT the locked ones — the homepage and the package pages
  // (D-20260921-14, the gold standard of D-20260922-13), the finder hubs and
  // the course family. The lock list is derived from the served views by
  // tools/build-consistency-lock.mjs, never hand-typed; a family absent from
  // the list gets the layer, so a new family is consistent by default.
  const consistency = lockedFamilies.has(family.replace(/^ahv-template-/, "")) ? undefined : "1";
  const narrowMedia = `(max-width: ${BREAKPOINT - 1}px)`;
  const wideMedia = `(min-width: ${BREAKPOINT}px)`;
  // The mobile view's own helmet styles, served with the snapshot so its first paint is the approved
  // design's (lane PERF2, snapshot-styles.mjs). Phone-width only: the desktop never paints the snapshot.
  const firstPaint = snapshot ? snapshotStylesFor(cfg) : null;
  // Where the snapshot opens on a <video poster> (the home views, every locale) that poster is the LCP
  // element, not text, and the snapshot's font stylesheet and faces only competed with it — measured +0.8-0.9 s
  // simulated / +1.2 s throttled LCP. There the faces keep arriving with the runtime, as before. The same holds
  // for the listed routes whose first screen is a hero background image (imageLedFirstScreen).
  const snapshotFaces = firstPaint && !firstScreenPoster(snapshot) && !imageLedFirstScreen(route.path) ? firstPaint : null;
  const snapshotAssets: SnapshotStyleAsset[] = [
    ...(snapshotFaces?.fontCss.map(({ href, css }) => css
      ? { key: `font:${href}`, kind: 'style' as const, css: trainingSnapshotFontCss(route.path, css, snapshot) }
      : { key: `font:${href}`, kind: 'link' as const, href }) ?? []),
    ...(firstPaint?.styles.map((css, i) => ({ key: `view:${i}`, kind: 'style' as const, css, media: narrowMedia })) ?? []),
  ];

  const rootAttrs = {
    id: DESIGN_ROOT_ID,
    role: route.path === "/" ? "main" : undefined,
    "data-ahv-route": route.path,
    "data-ahv-locale": locale === "en" ? undefined : locale,
    "data-ahv-family": family || undefined,
    "data-ahv-consistency": consistency,
    "data-ahv-snapshot-state": snapshot ? "held" : undefined,
    // Pairs the deferred-background rule in site-document.tsx with the boot script below that reveals
    // them: only a root this boot runs in may hold its inline backgrounds back (native views that
    // reuse the id carry no boot, so they are never matched).
    "data-ahv-bg-defer": "",
  };
  // Contact and Weight performance repair: snapshot and boot markup ship in the HTML
  // only, not a second time in the Flight data. Same markup, same attributes, same order.
  const serverHtmlOnly = SSR_ONLY_HTML_ROUTES.has(route.path);
  const slot = `${locale}:${route.path}`;

  return (
    <>
      {/* Structured data. The live site emits this on every page and the
          rebuild emitted none — the flip would have dropped the Organization
          entity, breadcrumb rich results and the sitelinks searchbox sitewide.
          Server-rendered, so a crawler that runs no JavaScript still reads it.
          Every value comes from the route's own manifest metadata and the
          generated share image; see _families/schema.ts for what is
          deliberately NOT copied from live. '<' is escaped as in the native
          views (D-20): a catalogue string containing "</script>" can then
          never close the block early. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonForScript(routeSchema(route, locale)) }}
      />
      {firstCriticalImage(snapshot, route.path) ? <link rel="preload" as="image" fetchPriority="high" href={firstCriticalImage(snapshot, route.path)!} media={narrowMedia} /> : null}
      {/* Get the right family payload in flight before the boot script runs.
          Media-scoped so a phone never downloads the desktop view. */}
      {route.mobileView ? (
        <link
          rel="preload"
          as="fetch"
          crossOrigin="anonymous"
          media={narrowMedia}
          href={`${cfg.payloadBase}${route.mobileView}.json`}
        />
      ) : null}
      {route.desktopView ? (
        <link
          rel="preload"
          as="fetch"
          crossOrigin="anonymous"
          media={wideMedia}
          href={`${cfg.payloadBase}${route.desktopView}.json`}
        />
      ) : null}
      <link rel="preload" as="script" href={SUPPORT_SRC} />
      <link rel="preload" as="script" href={PREVIEW_SRC} />
      <link rel="preload" as="style" href="/ahv/preview/english-responsive-override.css" />

      {/* The snapshot's first-paint styles (snapshot-styles.mjs): the view's local font stylesheet and its
          helmet <style> blocks, copied from the served payload at build time. The runtime still writes
          its own copies into <head>; React retires these after hydration when boot marks the snapshot retired.
          The body-text face (the paragraphs' face: the LCP element on the text-LCP routes) is preloaded (React
          hoists a preload <link> into <head>) so the first paint can already be in it: a first paint in the
          fallback face broke lines differently and the live copy of the LCP paragraph came out larger — a
          second, later LCP candidate. Phone-width only: the desktop never paints the snapshot. */}
      {routeStyleHref(route.path) ? <link data-ahv-route-styles="" rel="stylesheet" href={routeStyleHref(route.path)!} /> : <style data-ahv-route-styles="" dangerouslySetInnerHTML={{ __html: routeStylesFor(route.path) }} />}
      {snapshotFaces
        ? snapshotFaces.preloadFonts.map((href) => (
            <link key={href} rel="preload" as="font" type={href.endsWith(".woff2") ? "font/woff2" : "font/ttf"} crossOrigin="anonymous" href={href} media={narrowMedia} />
          ))
        : null}
      <SnapshotStyles key={`${locale}:${route.path}`} assets={snapshotAssets} />
      {route.path === "/all-programs/" ? <style data-ahv-finder-skip-link="" dangerouslySetInnerHTML={{ __html: `#ahv-design-root[data-ahv-route="/all-programs/"] .scp0:not(:focus){left:0!important;top:0!important;width:1px!important;height:1px!important;padding:0!important;overflow:hidden!important;clip-path:inset(50%)!important;white-space:nowrap!important}` }} /> : null}
      {/* The existing finder toggle collapses these rows. Match that first paint and reserve its 44px button + 14px margins. */}
      {route.path === "/ayurvedic-treatments/" ? <style data-ahv-finder-first-paint="" dangerouslySetInnerHTML={{ __html: `@media(scripting:enabled){#ahv-design-root[data-ahv-route="/ayurvedic-treatments/"] nav[data-ahv-finder-search]:not([data-ahv-fh-open]) [role="group"]{display:none!important}#ahv-design-root[data-ahv-route="/ayurvedic-treatments/"] nav[data-ahv-finder-search]:not(:has(+ .ahv-fh-filterbar))::after{content:"";display:block;height:58px}}` }} /> : null}


      {/* dangerouslySetInnerHTML with an empty string is load-bearing, not
          decoration: it tells React this subtree is not its own, so React
          neither hydrates nor reconciles what the boot script mounts here.
          Without it, hydration threw 418 and React's recovery render wiped
          the approved design off the page. */}
      {route.path === "/" ? <style dangerouslySetInnerHTML={{ __html: `#ahv-design-root .sc-host > div[data-dc-tpl="31"] > section[data-dc-tpl]:not(:first-of-type){content-visibility:auto;contain-intrinsic-size:auto 1000px}` }} /> : null}
      {serverHtmlOnly ? (
        <SsrOnlyHtml as="div" slot={putSsrOnlyHtml(`${slot}:snapshot`, snapshot)} attrs={rootAttrs} />
      ) : (
        <div {...rootAttrs} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: snapshot }} />
      )}

      <noscript>
        <p style={{ font: "17px/1.6 system-ui, sans-serif", margin: "40px auto", maxWidth: "62ch", padding: "0 20px" }}>
          {t(locale, "This page renders the approved Kairali design with JavaScript. Please enable JavaScript, or contact us at info@kairali.com.")}
        </p>
      </noscript>

      <script
        id={ROUTE_CONFIG_ID}
        type="application/json"
        // Config only — no markup. JSON.stringify output is escaped for a
        // <script> text node below.
        dangerouslySetInnerHTML={{ __html: jsonForScript(cfg) }}
      />
      {serverHtmlOnly ? (
        <SsrOnlyHtml as="script" slot={putSsrOnlyHtml(`${slot}:boot`, bootScript)} />
      ) : (
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      )}
    </>
  );
}

/**
 * Make a JSON string safe inside a <script type="application/json"> text node.
 * Only "<" matters: it is what could close the element early (</script). The
 * block is read with textContent and JSON.parse, never evaluated as JS, so the
 * JS line separators need no escaping here.
 */
function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
