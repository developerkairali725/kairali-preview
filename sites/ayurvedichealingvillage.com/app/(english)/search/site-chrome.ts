import { newsletterFooters } from "../_families/newsletter-markup.mjs";
import { localizeFallbackChrome, searchLanguageHref } from "./search-language";
import { computedFooterYear } from "../_families/computed-footer-year";
import { youtubeNewTabs } from "../_families/youtube-links";
import { readFileSync, existsSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { LOCALE_CODES, LOCALE_INFO, localizedPath, translate, type LocaleCode } from "../_families/l10n";
import { join } from "node:path";

/**
 * The site's own header and footer for pages that run WITHOUT the design runtime
 * (today: /search/). Design QA 2026-09-23 (docs/reports/2026-09-23-ahv-faq-search-design-qa.md)
 * failed the results page for shipping a hand-rolled strip in place of the sitewide
 * header — no Villas / Yoga & Training / Offers / About Us, no EN/DE/FR, no Book Your
 * Stay, no burger on phones.
 *
 * Rather than re-implement the component, this reads the markup the design itself
 * rendered: every prerendered snapshot (english-candidate/prerender/<route>.html,
 * tools/prerender-english.mjs) carries the desktop header and footer hidden
 * (display:none — the snapshot is taken at phone width) next to the narrow header,
 * its menu panel and the narrow footer. The four blocks are lifted verbatim from a
 * stable route's snapshot, the inline display:none on the desktop pair is dropped
 * and a 700px media query (the design's own breakpoint) chooses the pair to show.
 * The burger and the close button get the two-line toggle the runtime would give
 * them; the search buttons keep aria-controls="ahv-search-dialog", which
 * public/design/search.js already hooks on every page. chrome.js still adds the ©
 * line and WhatsApp to the footer here, exactly as on the design pages.
 *
 * Nothing here is authored: a re-import that changes the chrome changes this page
 * with it on the next prerender. If the snapshot ever lacks a block the page falls
 * back to a plain logo strip and the build log says so — never a silent blank.
 */
const SNAPSHOT = "english-candidate/prerender/about-us.html";
const BREAK = 700;

type Chrome = { header: string; footer: string; css: string; script: string };
const cache = new Map<string, Chrome>();

const VOID = new Set(["br", "img", "hr", "meta", "link", "input", "source", "path", "circle", "rect", "line", "polyline", "polygon", "use", "wbr"]);
function elementEnd(t: string, at: number): number {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
  re.lastIndex = at;
  let depth = 0, m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const [full, close, tag, attrs] = m;
    if (VOID.has(tag.toLowerCase()) || /\/\s*$/.test(attrs)) { if (m.index === at) return at + full.length; continue; }
    if (close) { depth -= 1; if (depth === 0) return m.index + full.length; } else depth += 1;
  }
  return -1;
}
function block(t: string, tag: string, nth: number): string | null {
  let from = 0;
  for (let i = 0; i <= nth; i++) {
    const at = t.indexOf(`<${tag}`, from);
    if (at < 0) return null;
    const end = elementEnd(t, at);
    if (end < 0) return null;
    if (i === nth) return t.slice(at, end);
    from = end;
  }
  return null;
}
/** the element that follows `afterHtml` in the document (the narrow header's menu panel) */
function nextElement(t: string, afterHtml: string): string | null {
  const i = t.indexOf(afterHtml);
  if (i < 0) return null;
  const at = t.indexOf("<div", i + afterHtml.length);
  if (at < 0) return null;
  const end = elementEnd(t, at);
  return end < 0 ? null : t.slice(at, end);
}
const show = (html: string, cls: string, display: string) =>
  html.replace(/^(<[a-z]+)([^>]*?)style="display: none;\s*/, `$1 class="${cls}"$2style="display: ${display}; `).replace(/^(<[a-z]+)(?![^>]*class=")/, `$1 class="${cls}"`);

/**
 * Locale lane (25 Sep 2026): the chrome comes from that locale's own about-us
 * snapshot (l10n/prerender/<locale>/about-us.html.gz), so labels are the
 * localized ones; selectors are structural because aria-labels are translated;
 * the snapshot's language switcher is re-pointed at THIS page's equivalents.
 */
export function siteChrome(locale: LocaleCode = "en", enPath?: string, query = ""): Chrome {
  const base = chromeFor(locale);
  if (!enPath) return base;
  const relink = (html: string) => html.replace(/<a\b[^>]*data-ahv-lang-option="([^"]+)"[^>]*>/g, (tag, code) => {
    if (!LOCALE_CODES.includes(code as LocaleCode)) return tag;
    const href = enPath === "/search/" ? searchLanguageHref(code, query) : localizedPath(enPath, code as LocaleCode);
    if (!href) return tag;
    let linked = tag.replace(/\bhref="[^"]*"/, `href="${href}"`);
    if (enPath === "/search/") {
      linked = linked.replace(/\saria-current="[^"]*"/g, "");
      if (code === locale) linked = linked.replace(/>$/, ' aria-current="page">');
    }
    return linked;
  });
  return { ...base, header: relink(base.header), footer: relink(base.footer) };
}
function chromeFor(locale: LocaleCode): Chrome {
  const hit = cache.get(locale);
  if (hit) return hit;
  let cached: Chrome | null = null;
  let t = "";
  let englishFallback = false;
  try {
    if (locale === "en") t = newsletterFooters(computedFooterYear(youtubeNewTabs(readFileSync(join(process.cwd(), SNAPSHOT), "utf8"))));
    else {
      const gz = join(process.cwd(), "l10n", "prerender", locale, "about-us.html.gz");
      englishFallback = !existsSync(gz);
      t = englishFallback ? newsletterFooters(computedFooterYear(youtubeNewTabs(readFileSync(join(process.cwd(), SNAPSHOT), "utf8"))))
        : computedFooterYear(youtubeNewTabs(gunzipSync(readFileSync(gz)).toString("utf8")));
    }
  } catch { t = ""; }
  let deskHeader = block(t, "header", 0), narrowHeader = block(t, "header", 1);
  let panel = narrowHeader ? nextElement(t, narrowHeader) : null;
  let deskFooter = block(t, "footer", 0), narrowFooter = block(t, "footer", 1);
  if (englishFallback) {
    const localize = (html: string | null) => html && localizeFallbackChrome(
      html, locale, LOCALE_INFO[locale].name,
      (path) => localizedPath(path, locale),
      (text) => translate(locale, text),
    );
    deskHeader = localize(deskHeader);
    narrowHeader = localize(narrowHeader);
    panel = localize(panel);
    deskFooter = localize(deskFooter);
    narrowFooter = localize(narrowFooter);
  }
  const ok = deskHeader && narrowHeader && panel && deskFooter && narrowFooter && /<nav\b/.test(deskHeader) && /aria-expanded=/.test(narrowHeader) && /<button\b/.test(panel);
  if (!ok) {
    console.error(`[search/site-chrome] snapshot ${SNAPSHOT} lacks a chrome block — plain strip used (header:${!!deskHeader}/${!!narrowHeader} panel:${!!panel} footer:${!!deskFooter}/${!!narrowFooter})`);
    cached = { header: `<header class="ahv-sc-plain"><a href="/"><img src="/ahv/assets/img/kairali-colorful-logo.webp" alt="Kairali — The Ayurvedic Healing Village" width="290" height="68" style="height:40px;width:auto;display:block"></a></header>`, footer: "", css: ".ahv-sc-plain{display:flex;align-items:center;min-height:72px;padding:0 3%;border-bottom:1px solid color-mix(in srgb, var(--bronze-400) 18%, var(--ivory))}", script: "" };
    cache.set(locale, cached);
    return cached;
  }
  const header =
    show(deskHeader as string, "ahv-sc-desk", "flex") +
    `<div class="ahv-sc-narrow" style="position:relative">` + show(narrowHeader as string, "ahv-sc-narrow-h", "flex") + (panel as string).replace(/^(<div)/, `$1 data-ahv-sc-panel="1"`) + `</div>`;
  const footer = show(deskFooter as string, "ahv-sc-desk", "block") + show(narrowFooter as string, "ahv-sc-narrow", "flex");
  // The extracted markup does not include the design runtime's anchor reset.
  // Ship the shared header rule with SSR chrome, including the mobile menu.
  // Keep article/breadcrumb link underlines and keyboard focus styling intact.
  const css = `header.ahv-sc-desk a,header.ahv-sc-narrow-h a,[data-ahv-sc-panel] a,footer.ahv-sc-desk a,footer.ahv-sc-narrow a{text-decoration:none}@media (min-width:${BREAK}px){.ahv-sc-narrow{display:none!important}}@media (max-width:${BREAK - 0.02}px){.ahv-sc-desk{display:none!important}}`;
  // Structural selectors (labels are translated in the locale lane): the burger
  // is the narrow header's aria-expanded button, close is the panel's first button.
  // The snapshot's language switcher is static markup, so it is wired here too.
  const script = `(function(){var p=document.querySelector('[data-ahv-sc-panel]');var b=document.querySelector('.ahv-sc-narrow-h button[aria-expanded]:not(.ahv-lang-btn)');var c=p?p.querySelector('button:not(.ahv-lang-btn)'):null;function set(o){if(!p)return;p.style.display=o?'flex':'none';if(b)b.setAttribute('aria-expanded',o?'true':'false');}if(b)b.addEventListener('click',function(){set(p.style.display==='none');});if(c)c.addEventListener('click',function(){set(false);});document.querySelectorAll('.ahv-lang').forEach(function(w){var bt=w.querySelector('.ahv-lang-btn'),l=w.querySelector('.ahv-lang-list');if(!bt||!l)return;function sh(o,f){l.hidden=!o;bt.setAttribute('aria-expanded',o?'true':'false');if(o){var a=l.querySelector('a[aria-current]')||l.querySelector('a');if(a)a.focus();}else if(f)bt.focus();}bt.addEventListener('click',function(e){e.stopPropagation();sh(l.hidden);});w.addEventListener('keydown',function(e){if(e.key==='Escape'&&!l.hidden){e.preventDefault();sh(false,true);}});document.addEventListener('click',function(e){if(!w.contains(e.target))sh(false);});});document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});})();`;
  cached = { header, footer, css, script };
  cache.set(locale, cached);
  return cached;
}
