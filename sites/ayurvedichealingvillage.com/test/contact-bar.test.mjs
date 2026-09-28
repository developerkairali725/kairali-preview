// OWNER-REG-02 guard (owner, 28 Sep 2026: "apply the homepage bottom call/enquire/free-consult contact bar
// consistently across pages; check responsive overlap and accessibility"). ONE shared bar (public/design/chrome.js
// ctaBar + chrome.css #ahv-cta-bar) replaces every template copy. This test keeps it the homepage's bar — same
// labels, order and destinations — keeps its words on existing translation units (no new strings for the locale
// lane), keeps every template copy classified so no page shows two bars, and keeps the layout contract
// (phone widths only, safe area, page clearance, focus ring, offsets for the chat controls and the cookie notice).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { unitId } from "../tools/l10n/lib.mjs";
import { runtimeScriptUnits } from "../tools/l10n/extras.mjs";
const CHROME_CSS_TEXT = () => fs.readFileSync(new URL("../public/design/chrome.css", import.meta.url), "utf8");

const CHROME_JS = fs.readFileSync("public/design/chrome.js", "utf8");
const CHROME_CSS = fs.readFileSync("public/design/chrome.css", "utf8");
const FH_JS = fs.readFileSync("public/design/family-header.js", "utf8");
const FH_CSS = fs.readFileSync("public/design/family-header.css", "utf8");
const ALIASES = JSON.parse(fs.readFileSync("english-candidate/link-aliases.json", "utf8"));
const view = (v) => JSON.parse(fs.readFileSync(`public/ahv/views/${v}.json`, "utf8")).template;

const barHtml = (() => {
  const m = CHROME_JS.match(/var CTA_BAR = ("(?:[^"\\]|\\.)*");/);
  assert.ok(m, "chrome.js declares the bar markup as ONE string literal (CTA_BAR)");
  return JSON.parse(m[1]);
})();
const anchors = (html) => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
  attrs: m[1], href: (m[1].match(/\bhref="([^"]*)"/) || [])[1], text: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
}));
// the page link as boot.ts localizeLink serves it: this site's origin dropped, legacy spellings through link-aliases.json
const served = (href) => {
  if (/^(tel|mailto):/.test(href)) return href;
  const p = href.replace(/^https?:\/\/(www\.)?ayurvedichealingvillage\.com/, "");
  return ALIASES[p.replace(/\/$/, "")] || p;
};
// the element that starts at `start` (an opening tag), balanced over div/nav/section/aside
function element(html, start) {
  const re = /<(\/?)(div|nav|section|aside)\b[^>]*>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, re.lastIndex);
  }
  return html.slice(start);
}
function homeBar() {
  const t = view("home-mobile");
  const i = t.search(/<div[^>]*style="position:sticky;bottom:0[^"]*"/);
  assert.ok(i > -1, "the homepage phone view has its bottom bar");
  // chrome.css hides the templates' icon-only WhatsApp launcher (a[aria-label="WhatsApp us"]); #ahv-contact-controls
  // carries WhatsApp on every page, so the homepage's VISIBLE bar is the three text actions
  return anchors(element(t, i)).filter((a) => a.text);
}

test("the shared bar is the homepage bar: labels, order and served destinations", () => {
  const home = homeBar().map((a) => [served(a.href), a.text]);
  assert.deepEqual(home.map((h) => h[1]), ["Call", "Enquire", "Free Consult"], "homepage bar labels (source of truth)");
  const bar = anchors(barHtml).map((a) => [a.href, a.text]);
  assert.deepEqual(bar, home);
  assert.equal(bar[0][0], "tel:+91 9555 156 156", "the hospital phone as the homepage links it");
});

test("the bar's words are existing translation units with an accepted translation in every locale (no new strings)", () => {
  const units = runtimeScriptUnits("public/design/chrome.js", CHROME_JS)
    .flatMap((u) => (u.composite ? u.composite : [u]))
    .map((c) => c.source);
  const expected = ["[[OPEN_1]]Call[[CLOSE_1]] [[OPEN_2]]Enquire[[CLOSE_2]] [[OPEN_3]]Free Consult[[CLOSE_3]]", "Quick actions"];
  const SRC = JSON.parse(fs.readFileSync("l10n/source/units.json", "utf8"));
  const byId = new Map(SRC.units.map((u) => [u.id, u]));
  const locales = Object.keys(JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"))).filter((l) => l !== "en");
  const ids = new Map(expected.map((s) => [unitId(s), s]));
  for (const [id, s] of ids) {
    assert.ok(units.includes(s), `chrome.js yields the unit ${JSON.stringify(s)}`);
    assert.ok(byId.get(id), `${JSON.stringify(s)} is already in the frozen English source set (l10n/source/units.json)`);
  }
  for (const loc of locales) {
    const ok = new Set();
    const dir = `l10n/output/${loc}`;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
      for (const u of JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8")).units) {
        if (ids.has(u.id) && u.sourceHash === byId.get(u.id).sourceHash && u.status === "translated" && u.text) ok.add(u.id);
      }
    }
    for (const [id, s] of ids) assert.ok(ok.has(id), `${loc}: accepted translation for ${JSON.stringify(s)}`);
  }
});

test("every template bottom bar is classified — replaced by the shared bar, or unpinned in place", () => {
  const m = CHROME_JS.match(/function ctaBarKind\(style, links, tel\) \{[\s\S]*?\n {2}\}/);
  assert.ok(m, "chrome.js ctaBarKind found");
  const kind = new Function(m[0] + "\nreturn ctaBarKind;")();
  const seen = {};
  for (const f of fs.readdirSync("public/ahv/views").filter((x) => x.endsWith(".json"))) {
    const t = JSON.parse(fs.readFileSync(`public/ahv/views/${f}`, "utf8")).template || "";
    for (const s of t.matchAll(/<(div|nav|aside|section)\b[^>]*\bstyle="([^"]*)"/g)) {
      const style = s[2];
      if (!/position:\s*(fixed|sticky)/.test(style) || !/(^|;)\s*bottom:\s*0(px)?\s*(;|$)/.test(style)) continue;
      const el = element(t, s.index);
      const a = anchors(el);
      const k = kind(style, a.length, a.some((x) => /^tel:/.test(x.href || "")));
      (seen[k] = seen[k] || new Set()).add(f.replace(/\.json$/, ""));
      if (a.some((x) => /^tel:/.test(x.href || ""))) assert.ok(k, `${f}: a bottom bar with the phone link must never stay pinned beside the shared bar`);
    }
  }
  assert.ok(seen.replace && seen.replace.has("home-mobile"), "the homepage's own copy is replaced by the shared one");
  assert.ok(seen.replace.size >= 40, `the phone templates' bars are replaced (${seen.replace.size})`);
  assert.deepEqual([...(seen.unpin || [])], ["ahv-page-how-to-reach-mobile"], "only the directions strip stays in place, unpinned");
  assert.ok(!seen[""], `no pinned bottom bar is left untouched: ${[...(seen[""] || [])].join(", ")}`);
  // a full-height layer (a drawer or overlay pinned top and bottom) is never taken for a bar
  assert.equal(kind("position:fixed;top:0;bottom:0;left:0;width:80%", 12, true), "");
  assert.equal(kind("position:fixed;inset:0;bottom:0", 12, true), "");
});

test("layout contract: phone widths only, safe area, page clearance, focus ring, offsets; one bar on family pages too", () => {
  const BP = Number(fs.readFileSync("app/(english)/_families/registry.ts", "utf8").match(/export const BREAKPOINT = (\d+)/)[1]);
  const i = CHROME_CSS.indexOf("OWNER-REG-02");
  assert.ok(i > -1, "chrome.css carries the bar block");
  const block = CHROME_CSS.slice(i, CHROME_CSS.indexOf("@media print", i));
  assert.match(block, /\[data-ahv-cta-bar\] \{ display:none !important; \}/, "template copies hidden sitewide");
  assert.match(block, /#ahv-cta-bar \{ display:none; \}/, "hidden by default (wide views: the homepage shows no bar there)");
  const media = block.match(/@media \(max-width:(\d+)px\) \{([\s\S]*)\}\s*$/);
  assert.ok(media && Number(media[1]) === BP - 1, `shown below the view breakpoint (${BP}px), where the homepage serves its bar`);
  const inner = media[2];
  assert.match(inner, /#ahv-cta-bar \{[^}]*position:fixed;left:0;right:0;bottom:0;[^}]*padding-bottom:env\(safe-area-inset-bottom,0px\)/, "pinned to the bottom edge above the home indicator");
  assert.match(inner, /#ahv-cta-bar \{[^}]*z-index:55;/, "the homepage bar's layer: under menus, dialogs and the cookie notice");
  assert.match(inner, /#ahv-cta-bar a \{[^}]*min-height:52px;/, "52px tap targets");
  assert.match(inner, /#ahv-cta-bar a:focus-visible \{ outline:3px solid/, "visible keyboard focus ring");
  // body is viewport-high (support.js html,body{height:100%}) — body padding would add no scroll room
  assert.match(inner, /html\[data-ahv-cta-bar-on\] body::after \{ content:"";display:block;height:calc\(var\(--ahv-cta-bar-h[^)]*\)\)\) \+ 78px\);/, "the page ends above the bar and the chat controls (footer reachable)");
  assert.ok(!/html\[data-ahv-cta-bar-on\] body \{ padding-bottom/.test(inner), "no body padding (ineffective on a viewport-high body)");
  assert.match(inner, /html\[data-ahv-cta-bar-on\] #ahv-contact-controls \{ bottom:calc\(var\(--ahv-cta-bar-h[^}]*\+ 24px\)/, "WhatsApp / chat controls above the bar");
  assert.match(inner, /html\[data-ahv-cta-bar-on\] #ahv-consent, html\[data-ahv-cta-bar-on\] \[data-ahv-cta-notice\] \{ bottom:calc\(var\(--ahv-cta-bar-h[^}]*\+ 22px\) !important; \}/, "cookie notice above the bar");
  // family pages: the old "no bottom bar" rule is gone, and the family header never tags the shared bar
  assert.ok(!/html\[data-ahv-fh\] \[data-ahv-cta-bar\]\s*\{/.test(FH_CSS), "family-header.css no longer carries its own hide rule");
  assert.match(FH_JS, /if \(tels\[i\]\.closest\("#ahv-cta-bar"\)\) continue;/, "family-header.js skips the shared bar");
  assert.ok(!/data-ahv-cta-bar/.test(barHtml), "the shared bar is never marked as a template copy");
  // one bar per page, built once, outside the design root (a re-render of the design never duplicates it)
  assert.match(CHROME_JS, /var html = document\.documentElement, bar = document\.getElementById\("ahv-cta-bar"\);\s*if \(!bar\) \{/);
  assert.match(CHROME_JS, /document\.body\.appendChild\(bar\);/);
  // OWNER-REG-02 covers ALL pages incl. the /lp/ lane (owner 28 Sep 2026; the earlier LP exclusion was not an owner
  // exception): the bar shows there, the LP's own pinned WhatsApp strip steps aside (one pinned bar), and "Enquire"
  // goes to the landing page's own consultation form
  assert.doesNotMatch(CHROME_JS, /if \(document\.body\.classList\.contains\("lp-page"\)\) return;/);
  assert.match(CHROME_JS, /var isLp = document\.body\.classList\.contains\("lp-page"\)/);
  assert.match(CHROME_JS, /isLp && a\.classList\.contains\("ahv-cta-enquire"\)/);
  assert.match(CHROME_CSS_TEXT(), /html\[data-ahv-cta-bar-on\] \.lp-sticky \{ display:none !important; \}/);
  // locale route mapping through the locale path table, like every other shared control
  assert.match(CHROME_JS, /var lp = window\.AHV_LOCAL_PATHS/);
});
