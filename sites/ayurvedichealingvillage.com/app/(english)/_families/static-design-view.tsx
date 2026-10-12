import { putSsrOnlyHtml } from "./ssr-only-html.mjs";
import { SsrOnlyHtml } from "./ssr-only-html-slot";
import { STATIC_BOOT } from './static-design-boot.mjs';
import { routeStylesFor, routeStyleHref } from "./route-styles.mjs";
import { applyReviewSnapshot } from "./content-review.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { phoneCriticalMedia, descriptiveAwardLinks, firstCriticalImage } from "./critical-media.mjs";
import { formPostSafety } from "./form-post-safety.mjs";
import { newsletterFooters } from "./newsletter-markup.mjs";
import { computedFooterYear } from "./computed-footer-year";
import { youtubeNewTabs } from "./youtube-links";
import { snapshotStylesFor } from "./snapshot-styles.mjs";
import { routeSchema } from "./schema";
import { buildBootConfig } from "./design-view";
import type { CandidateRoute } from "./registry";
import consistencyLock from "../../../english-candidate/consistency-locked-families.json";

// The compiled approved views are captured at both view widths during the
// build. The mobile document remains the crawlable, no-JS HTML. Wide screens
// fetch their static HTML fragment instead of making phones download a second
// full document. Neither variant loads the design runtime or a second React root.
function snapshot(routePath: string, desktop = false): string {
  const name = routePath === "/" ? "index" : routePath.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9._-]+/gi, "_");
  const source = readFileSync(desktop
    ? join(process.cwd(), "public/ahv/static", `${name}.html`)
    : join(process.cwd(), "english-candidate/prerender", `${name}.html`), "utf8");
  let safe = formPostSafety(newsletterFooters(computedFooterYear(youtubeNewTabs(source))));
  if (routePath === "/" && !desktop) {
    let imageIndex = 0;
    safe = safe.replace(/<img\b[^>]*>/g, (tag: string) => {
      if (imageIndex++ < 2) return tag; // Header logo and first-screen hero.
      return tag.replace(/\s+(?:loading|fetchpriority)="[^"]*"/g, "")
        .replace("<img", '<img loading="lazy"');
    });
    // Closed-menu captures omit the conditional panel. Preserve the approved
    // mobile navigation so the lightweight menu handler has a panel to open.
    const payload = JSON.parse(readFileSync(join(process.cwd(), "public/ahv/views/home-mobile.json"), "utf8"));
    const panel = String(payload.template).match(/<sc-if value="\{\{ menuOpen \}\}"[^>]*>([\s\S]*?)<\/sc-if>/)?.[1];
    if (!panel) throw new Error("AHV mobile menu missing from approved view");
    safe += panel.replace('<div style="position:fixed;', '<div data-ahv-drawer="" style="display:none;position:fixed;')
      .replace('display:flex;flex-direction:column;padding:20px', 'flex-direction:column;padding:20px')
      .replace(/\s+onClick="[^"]*"/g, "")
      .replace('aria-label="Close"', 'aria-label="Close menu"')
      .replace(/https:\/\/ayurvedichealingvillage\.com\//g, "/");
  }
  if (routePath === "/") {
    safe = safe.replace(/<footer\b[\s\S]*?<\/footer>/g, (footer: string) => footer.replace(/(<a\b[^>]*href=")[^"]*("[^>]*>\s*Reviews\s*<\/a>)/g, "$1/read-feedback/$2"));
    safe = safe.replace(/aria-label="Choose language — Current language: English"/g, 'aria-label="EN — Choose language — Current language: English"');
  }
  return applyReviewSnapshot(descriptiveAwardLinks(desktop ? safe : phoneCriticalMedia(safe), routePath), routePath);
}

function tariffRows(viewId: string | null): Record<string, string[][]> | undefined {
  if (!viewId) return undefined;
  const payload = JSON.parse(readFileSync(join(process.cwd(), "public/ahv/views", `${viewId}.json`), "utf8"));
  const match = String(payload.logic || "").match(/const tableData = (\{[^\n]+?\});/);
  if (!match) throw new Error(`AHV static tariff data missing from ${viewId}`);
  const rows = JSON.parse(match[1]) as Record<string, string[][]>;
  if (!["INR", "USD", "EURO"].every((key) => rows[key]?.length === 4)) throw new Error(`AHV static tariff data invalid in ${viewId}`);
  return rows;
}

function homeStaticData(viewId: string | null) {
  if (!viewId) return undefined;
  const payload = JSON.parse(readFileSync(join(process.cwd(), "public/ahv/views", `${viewId}.json`), "utf8"));
  const logic = String(payload.logic || "");
  const source = `${logic}\n;const __component = new Component(); __component.props = {}; globalThis.__homeStatic = { values: __component.renderVals(), rates: HOME_RATES };`;
  const sandbox = { DCLogic: class {} };
  runInNewContext(source, sandbox, { timeout: 1000 });
  const data = (sandbox as { __homeStatic?: { values: Record<string, any>; rates: Record<string, any> } }).__homeStatic;
  if (!data?.values?.newsItems?.length || !data?.values?.galItems?.length) throw new Error("AHV homepage interaction data missing");
  return {
    rates: data.rates,
    news: data.values.newsItems.map(({ title, body, cta, href, img, alt }: any) => ({ title, body, cta, href, img, alt })),
    galleryCategories: data.values.galItems.map(({ cat }: any) => cat),
    galleryPhotos: data.values.galItems.map(({ src, caption, alt, kind }: any) => ({ src, caption, alt, kind })),
    programmeCounts: data.values.groups.map((group: any) => group.items.length),
  };
}


function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function StaticDesignView({ route }: { route: CandidateRoute }) {
  const homeBoot = route.path === "/"
    ? JSON.parse(readFileSync(join(process.cwd(), "public/design/static-design-boot.json"), "utf8")).src as string
    : null;
  const mobile = snapshot(route.path);
  const desktop = snapshot(route.path, true);
  const cfg = buildBootConfig(route);
  const family = (route.desktopView ?? route.mobileView ?? "").replace(/^ahv-page-/, "").replace(/-(desktop|mobile)$/, "").replace(/--[a-z0-9-]+$/, "");
  const consistency = Object.hasOwn(consistencyLock.families, family.replace(/^ahv-template-/, "")) ? undefined : "1";
  const staticDesktopPath = `/ahv/static/${route.path === "/" ? "index" : route.path.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9._-]+/gi, "_")}.html`;
  const deferFonts = route.path === "/" || route.path === "/panchakarma-therapy/" || route.path === "/contact-us/";
  const staticConfig = {
    breakpoint: cfg.breakpoint,
    locale: cfg.locale,
    contentReviewCopy: cfg.contentReviewCopy,
    measurement: cfg.measurement,
    staticDesktopPath,
    deferFonts,
    staticHome: route.path === "/" ? homeStaticData(route.mobileView ?? null) : undefined,
    staticTariffs: route.path === "/panchakarma-therapy/" ? tariffRows(route.mobileView) : undefined,
  };
  const narrow = `(max-width: ${cfg.breakpoint - 1}px)`;
  const wide = `(min-width: ${cfg.breakpoint}px)`;
  const deferredSectionLayout = route.path === "/"
    ? `#ahv-design-root .sc-host > div[data-dc-tpl="31"] > section[data-dc-tpl]:not(:first-of-type){content-visibility:auto;contain-intrinsic-size:auto 1000px}`
    : route.path === "/panchakarma-therapy/"
      ? `#ahv-design-root .sc-host main#main-content > section[data-dc-tpl]:not(:first-of-type){content-visibility:auto;contain-intrinsic-size:auto 1000px}`
      : "";
  const serverOnlySnapshot = ["/", "/contact-us/", "/all-programs/"].includes(route.path);
  const phoneImage = route.path === "/all-programs/" ? null : firstCriticalImage(mobile);
  const wideImage = route.path === "/all-programs/" ? null : firstCriticalImage(desktop);
  const phonePaint = snapshotStylesFor(cfg);
  const widePaint = snapshotStylesFor({ ...cfg, mobileView: cfg.desktopView });
  const fontCss = [...(phonePaint?.fontCss || []), ...(widePaint?.fontCss || [])].filter((value, index, all) =>
    all.findIndex((item) => item.href === value.href) === index,
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(routeSchema(route, "en")) }} />
      {phoneImage ? <link rel="preload" as="image" fetchPriority="high" media={narrow} href={phoneImage} /> : null}
      {wideImage ? <link rel="preload" as="image" fetchPriority="high" media={wide} href={wideImage} /> : null}
      {routeStyleHref(route.path) ? <link data-ahv-route-styles="" rel="stylesheet" href={routeStyleHref(route.path)!} /> : <style data-ahv-route-styles="" dangerouslySetInnerHTML={{ __html: routeStylesFor(route.path) }} />}
      {phonePaint?.preloadFonts.map((href) => (
        <link key={href} rel="preload" as="font" type={href.endsWith(".woff2") ? "font/woff2" : "font/ttf"} crossOrigin="anonymous" href={href} media={deferFonts ? "print" : narrow} data-ahv-deferred-font={deferFonts ? "" : undefined} data-ahv-font-media={deferFonts ? narrow : undefined} />
      ))}
      <link rel="preload" as="fetch" crossOrigin="anonymous" media={wide} href={staticDesktopPath} />
      {fontCss.map(({ href, css }) => css
        ? <style key={href} media={deferFonts ? "print" : undefined} data-ahv-deferred-font={deferFonts ? "" : undefined} data-ahv-font-media={deferFonts ? "all" : undefined} dangerouslySetInnerHTML={{ __html: css }} />
        : <link key={href} rel="stylesheet" href={href} media={deferFonts ? "print" : undefined} data-ahv-deferred-font={deferFonts ? "" : undefined} data-ahv-font-media={deferFonts ? "all" : undefined} />)}
      {phonePaint?.styles.map((css, index) => <style key={`phone-${index}`} media={narrow} dangerouslySetInnerHTML={{ __html: css }} />)}
      {widePaint?.styles.map((css, index) => <style key={`wide-${index}`} media={wide} dangerouslySetInnerHTML={{ __html: css }} />)}
      <style dangerouslySetInnerHTML={{ __html: `#ahv-design-root .kReveal{opacity:1!important;transform:none!important}@media ${wide}{#ahv-design-root[data-ahv-static-pending]{visibility:hidden;min-height:100vh}}` }} />
      {deferredSectionLayout ? <style dangerouslySetInnerHTML={{ __html: deferredSectionLayout }} /> : null}
      {serverOnlySnapshot ? <SsrOnlyHtml as="div" slot={putSsrOnlyHtml(`static:${route.path}:snapshot`, mobile)} attrs={{ id: "ahv-design-root", role: route.path === "/" ? "main" : undefined, "data-ahv-route": route.path, "data-ahv-family": family || undefined, "data-ahv-consistency": consistency, "data-ahv-bg-defer": "", "data-ahv-static-pending": "" }} /> : (
      <div id="ahv-design-root" role={route.path === "/" ? "main" : undefined} data-ahv-route={route.path} data-ahv-family={family || undefined} data-ahv-consistency={consistency} data-ahv-bg-defer="" data-ahv-static-pending=""
        suppressHydrationWarning dangerouslySetInnerHTML={{ __html: mobile }} />
      )}
      <script id="ahv-static-design-config" type="application/json" dangerouslySetInnerHTML={{ __html: safeJson(staticConfig) }} />
      {homeBoot ? <script src={homeBoot} defer /> : serverOnlySnapshot ? <SsrOnlyHtml as="script" slot={putSsrOnlyHtml(route.path === "/contact-us/" ? "static:contact:boot" : `static:${route.path}:boot`, STATIC_BOOT)} /> : <script dangerouslySetInnerHTML={{ __html: STATIC_BOOT }} />}
    </>
  );
}
