/**
 * The server snapshot's own styles (lane PERF2, 29 Sep 2026).
 *
 * The prerendered snapshot is the design's compiled DOM, serialised from inside the design root. The
 * view's <helmet> — its font stylesheet and its page <style> (body font Mulish, font-size, line-height
 * 1.7, heading and link rules) and the same block in the shared Chrome Header component — is not in
 * that DOM: the runtime writes it into <head> when it mounts. So until the runtime arrived the phone
 * saw the snapshot in the browser default (Times, line-height normal), and then:
 *   1. ~350 ms later the runtime's helmet restyled the snapshot in place (a visible reflow, and a
 *      LayoutShift of 0.09 on /our-villas/ in the local trace);
 *   2. at the snapshot -> live swap the SAME paragraph, now in Mulish at line-height 1.7, is a new and
 *      larger text node (118,038 vs 69,660 px² on /our-villas/), so Chrome reports a second, later
 *      LCP candidate. Lighthouse's simulated LCP then prices every request the page made before the
 *      swap (runtime chain, fonts, images): the 6-10 s hosted mobile values on the text-LCP routes.
 * Serving the view's own helmet styles with the snapshot makes the first paint the approved design's
 * paint. No approved byte changes: the text is copied from the served view payload at build time and
 * the runtime still writes its own copy exactly as before.
 *
 * Only the pieces that style the first paint are carried: <style> blocks and the site's own local
 * font stylesheet (/ahv/.../fonts/*.css). Titles, metas, canonicals, JSON-LD and third-party font
 * links are the runtime's business and stay there.
 *
 * Pure functions over strings plus one build-time reader; imported by design-view.tsx (server only).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HELMET_RE = /<helmet\b[^>]*>([\s\S]*?)<\/helmet\s*>/gi;
const STYLE_RE = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
const LINK_RE = /<link\b[^>]*>/gi;
const IMPORT_RE = /<dc-import\b[^>]*?\bname="([^"]+)"/gi;
/** A local font stylesheet only: /ahv/fonts/x.css or a locale copy /ahv/l10n/<prefix>/fonts/x.css. */
const LOCAL_FONT_CSS = /^[/]ahv[/](?:l10n[/][a-z-]+[/])?fonts[/][A-Za-z0-9._-]+[.]css$/;

function attr(tag, name) {
  const m = tag.match(new RegExp("\\s" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
  return m ? (m[1] ?? m[2] ?? m[3] ?? "") : null;
}

/** The first-paint styles of one template's <helmet> blocks, in source order. */
export function helmetStyles(template) {
  const fonts = [];
  const styles = [];
  for (const h of String(template || "").matchAll(HELMET_RE)) {
    const inner = h[1];
    for (const l of inner.matchAll(LINK_RE)) {
      const href = attr(l[0], "href");
      const rel = (attr(l[0], "rel") || "").toLowerCase();
      if (rel === "stylesheet" && href && LOCAL_FONT_CSS.test(href) && !fonts.includes(href)) fonts.push(href);
    }
    for (const s of inner.matchAll(STYLE_RE)) {
      const css = s[1].trim();
      // never emit anything that could close the element early or smuggle markup
      if (css && !/<[/]?\s*(style|script)/i.test(css)) styles.push(css);
    }
  }
  return { fonts, styles };
}

/** The component names a template imports, in first-occurrence order. */
export function importedComponents(template) {
  const names = [];
  for (const m of String(template || "").matchAll(IMPORT_RE)) if (!names.includes(m[1])) names.push(m[1]);
  return names;
}

/**
 * The styles that the live runtime writes for the given view, in the order it writes them: the view's
 * helmet first, then each imported component's helmet (the order observed in the live <head>).
 * `readText(url)` returns the text of a served file by URL path, or null.
 */
export function viewFirstPaintStyles(viewTemplate, resources, readText) {
  const out = helmetStyles(viewTemplate);
  for (const name of importedComponents(viewTemplate)) {
    const key = "./" + encodeURIComponent(name).replace(/%2F/gi, "/") + ".dc.html";
    const url = resources && resources[key];
    const text = url ? readText(url) : null;
    if (!text) continue;
    const c = helmetStyles(text);
    for (const f of c.fonts) if (!out.fonts.includes(f)) out.fonts.push(f);
    for (const s of c.styles) out.styles.push(s);
  }
  return out;
}

/** Inline only served local font CSS, rebasing its relative font URLs to the stylesheet directory.
 * Keep the complete @font-face text (all weights, display values and unicode ranges) verbatim otherwise.
 * An unexpected URL or markup falls back to the original stylesheet link. */
export function inlineFontStyles(fonts, readText) {
  return fonts.map((href) => {
    const source = LOCAL_FONT_CSS.test(href) ? readText(href) : null;
    if (!source || /<\/?\s*(?:style|script)/i.test(source) || /[{][{]/.test(source)) return { href, css: null };
    let urls = 0;
    let unsafe = false;
    const base = href.slice(0, href.lastIndexOf("/") + 1);
    const css = source.replace(/url\(\s*(["']?)([^"'()\s]+)\1\s*\)/gi, (match, quote, url) => {
      if (!/^[A-Za-z0-9._-]+\.(?:woff2?|ttf)$/.test(url)) { unsafe = true; return match; }
      urls++;
      return `url(${quote}${base}${url}${quote})`;
    });
    if (unsafe || !urls || (source.match(/url\s*\(/gi) || []).length !== urls) return { href, css: null };
    return { href, css };
  });
}

/**
 * The body-text face of these styles: the family of the first `body{font-family:…}` rule, weight 400,
 * normal style — the face the page's paragraphs (the text LCP element on the text-LCP routes) render in.
 * Resolved against the local font stylesheets' @font-face rules; returns served URLs (at most one per
 * stylesheet), or [] when the family is not one of the local faces.
 */
export function bodyFontFiles(styles, readText, wantedWeight = "400") {
  let family = null;
  for (const css of styles.styles) {
    const m = css.match(/(?:^|[}\s])body\s*[{][^}]*?font-family\s*:\s*([^;}]+)/i);
    if (m) { family = m[1].split(",")[0].trim().replace(/^["']|["']$/g, ""); break; }
  }
  if (!family) return [];
  const out = [];
  for (const href of styles.fonts) {
    const text = readText(href);
    if (!text) continue;
    for (const face of text.matchAll(/@font-face\s*[{]([^}]*)[}]/gi)) {
      const body = face[1];
      const fam = (body.match(/font-family\s*:\s*([^;]+)/i) || [])[1];
      if (!fam || fam.trim().replace(/^["']|["']$/g, "") !== family) continue;
      const style = ((body.match(/font-style\s*:\s*([^;]+)/i) || [])[1] || "normal").trim();
      const weight = ((body.match(/font-weight\s*:\s*([^;]+)/i) || [])[1] || "400").trim();
      if (style !== "normal" || (weight !== wantedWeight && !(wantedWeight === "400" && weight === "normal"))) continue;
      const src = (body.match(/url\(\s*["']?([^"')]+)["']?\s*\)/i) || [])[1];
      if (!src || /^[a-z]+:/i.test(src) || src.startsWith("//")) continue;
      const url = src.startsWith("/") ? src : href.replace(/[^/]*$/, "") + src;
      if (!out.includes(url)) out.push(url);
      break;
    }
  }
  return out;
}

/**
 * The phone hero's video poster, when the snapshot's first screen is a <video poster> (the home views,
 * every locale): the LCP element on those routes is that image, not text, so design-view.tsx does not
 * serve the snapshot's font faces there (they only competed with the poster). Returned only when the
 * poster comes before the first lazy image — first-screen media, not a gallery film further down.
 * Local paths only. (A high-priority preload of the poster was measured and made no difference: the
 * 212 KB file itself is the cost — see lanes/PERF2/NOTES.txt.)
 */
export function firstScreenPoster(snapshotHtml) {
  const html = String(snapshotHtml || "");
  const m = html.match(/<video\b[^>]*\sposter="([^"]+)"/i);
  if (!m) return null;
  const lazy = html.search(/<img\b[^>]*\sloading="lazy"/i);
  if (lazy !== -1 && lazy < m.index) return null;
  const src = m[1].replace(/&amp;/g, "&");
  return /^[/](?![/])[^"'<>\s]+$/.test(src) ? src : null;
}

/**
 * Routes whose phone first screen opens on a preloaded hero BACKGROUND image that is the measured LCP
 * element — the poster case above without a <video>. design-view.tsx skips the snapshot's font faces there
 * too: they only competed with the hero (they arrive with the runtime, as on the poster-led views).
 * An explicit, per-route list, each entry backed by its own saved trace — never inferred, because a
 * text-LCP route needs its body face at first paint (099a5664a).
 * Digestive and Weight each retain their saved image-LCP traces and approved font deferral.
 */
// N12: the saved 2026-10-11 mobile traces identify these two programme background heroes as LCP.
// Monsoon: saved 2026-10-12 trace confirms the phone hero is the only LCP candidate.
const IMAGE_LED_FIRST_SCREEN = new Set(["/karkidaka-chikitsha-or-monsoon-wellness.html", "/digestive-wellness-gut-health-yoga-therapy/", "/weight-loss-programme/", "/offers/", "/treatment-for-bronchial-diseases/", "/holistic-treatment-for-rejuvenation-and-detoxification/", "/treatment-for-hypertension/", "/treatment-for-paralysis/", "/treatment-for-skin-diseases/"]);
export function imageLedFirstScreen(routePath) {
  return IMAGE_LED_FIRST_SCREEN.has(String(routePath || ""));
}

/** Measured text-led finder/hub: preload only the existing heading face alongside the body face. */
export function routeFontPreloads(route, styles, readText, locale = "en") {
  const body = bodyFontFiles(styles, readText);
  if (!["/ayurveda-treatment/", "/mindfulness-retreat/", "/all-programs/", "/ayurveda-training-programme/", "/ananda-lahari-yoga-and-ayurveda-retreat/", "/ashtanga-yoga-and-ayurveda-retreat/"].includes(route)) return body;
  const heading = bodyFontFiles({ ...styles, styles: ['body{font-family:"Marcellus"}'] }, readText);
  const ui = route === "/ayurveda-training-programme/" && locale === "en" ? [...bodyFontFiles(styles, readText, "600"), ...bodyFontFiles(styles, readText, "700")] : [];
  return [...new Set([...body, ...heading, ...ui])];
}

const TEXT_CACHE = new Map();

/**
 * Build-time reader over public/: the served mobile view payload for a route config.
 * @param {{ mobileView: string | null, payloadBase: string, resources?: Record<string, string> }} cfg
 * @param {string} [publicDir]
 * @returns {{ fonts: string[], styles: string[], fontCss: { href: string, css: string | null }[], preloadFonts: string[] } | null}
 */
export function snapshotStylesFor(cfg, publicDir = join(process.cwd(), "public")) {
  const id = cfg && cfg.mobileView;
  if (!id) return null;
  const fileFor = (url) => {
    const rel = decodeURIComponent(String(url).split("?")[0]).replace(/^[/]+/, "");
    return rel.includes("..") ? null : join(publicDir, rel);
  };
  const readText = (url) => {
    const file = fileFor(url);
    if (!file) return null;
    if (!TEXT_CACHE.has(file)) TEXT_CACHE.set(file, existsSync(file) ? readFileSync(file, "utf8") : null);
    return TEXT_CACHE.get(file);
  };
  const payload = readText(cfg.payloadBase + id + ".json");
  if (!payload) return null;
  let view;
  try { view = JSON.parse(payload); } catch { return null; }
  const styles = viewFirstPaintStyles(view.template || "", cfg.resources || {}, readText);
  if (!styles.fonts.length && !styles.styles.length) return null;
  // Only the body face is preloaded (measured: all four upright faces bought nothing on the simulated LCP and
  // cost 0.2-0.9 s under applied throttling, where 157 KB of TTF competed with the styles and the LCP image).
  return { ...styles, fontCss: inlineFontStyles(styles.fonts, readText), preloadFonts: routeFontPreloads(cfg.path, styles, readText, cfg.locale?.code ?? "en").filter((u) => { const f = fileFor(u); return !!f && existsSync(f); }) };
}
