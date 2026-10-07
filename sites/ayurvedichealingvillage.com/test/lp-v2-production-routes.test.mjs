// Live ad routes (batch 1 + batch 2): which files serve the URLs, what the production document loads (and what it
// must never load), that the kit design stays confined to these pages, and the merge of the kit with main.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
const read = (p) => fs.readFileSync(P(p), "utf8");
const ROUTES = ["ayurvedic-treatment-packages.html", "panchkarma-treatment.html", "pain-management.html", "family-ayurvedic-retreat-kerala.html"];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const APP_FILES = walk(P("app")).map((f) => path.relative(SITE, f).split(path.sep).join("/"));
/** Source without comments, so a mention in prose never counts as use. */
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
/** Import specifiers of a module. */
const imports = (src) => [...code(src).matchAll(/(?:from|import)\s+"([^"]+)"/g)].map((m) => m[1]);
/** Top-level comma split of a selector list (commas inside :is() / :not() stay). */
function selectors(list) {
  const out = [];
  let depth = 0, cur = "";
  for (const ch of list) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

test("routing: exactly one page serves each URL, from app/(ppc-v2); the old pages are retired, their shared parts kept", () => {
  for (const r of ROUTES) {
    const pages = APP_FILES.filter((f) => new RegExp(`(^|/)${r.replace(/\./g, "\\.")}/page\\.tsx$`).test(f));
    assert.deepEqual(pages, [`app/(ppc-v2)/${r}/page.tsx`], r);
  }
  assert.ok(!fs.existsSync(P("app/(campaign)/ayurvedic-treatment-packages.html/page.tsx")));
  assert.ok(!fs.existsSync(P("app/(campaign)/panchkarma-treatment.html/page.tsx")));
  // Still used by the other campaign pages (_traffic) and by the physician-facts test.
  for (const f of ["EnquiryForm.tsx", "GuestSupport.tsx", "r10.css", "content.ts"]) assert.ok(fs.existsSync(P("app/(campaign)/ayurvedic-treatment-packages.html", f)), f);
  assert.match(read("app/(campaign)/_traffic/TrafficLanding.tsx"), /ayurvedic-treatment-packages\.html\/EnquiryForm/);
  assert.match(read("app/(ppc-v2)/ayurvedic-treatment-packages.html/page.tsx"), /const SLUG = "treatment-packages" as const;/);
  assert.match(read("app/(ppc-v2)/panchkarma-treatment.html/page.tsx"), /const SLUG = "panchakarma" as const;/);
  // Batch 2: the old pages are retired; their content.ts stays (the physician-roster test reads it).
  for (const r of ["pain-management.html", "family-ayurvedic-retreat-kerala.html"]) {
    assert.ok(!fs.existsSync(P(`app/(campaign)/${r}/page.tsx`)), r);
    assert.ok(fs.existsSync(P(`app/(campaign)/${r}/content.ts`)), r);
  }
  assert.match(read("app/(ppc-v2)/pain-management.html/page.tsx"), /const SLUG = "pain-management" as const;/);
  assert.match(read("app/(ppc-v2)/family-ayurvedic-retreat-kerala.html/page.tsx"), /const SLUG = "family-ayurvedic-retreat" as const;/);
});

test("routing: no redirect, rewrite or middleware moves the two URLs; pages stay static", () => {
  const urls = ROUTES.map((r) => `/${r}`);
  // Every redirect next.config.ts builds comes from these files (plus the sitemap list and one offers rule).
  const sources = [
    ...Object.keys(JSON.parse(read("english-candidate/redirect-map.json")).redirects),
    ...["ad-sitelink-redirects", "legacy-english-redirects", "document-redirects"].flatMap((f) => JSON.parse(read(`english-candidate/${f}.json`)).map((r) => r.source)),
  ];
  for (const u of urls) assert.ok(!sources.some((s) => s.replace(/\/$/, "") === u), `${u} is a redirect source`);
  const config = code(read("next.config.ts"));
  for (const r of ROUTES) assert.ok(!config.includes(r), `next.config.ts code mentions ${r}`);
  assert.match(read("next.config.ts"), /Do NOT arm it/); // the old legacy→/lp/ cutover map stays a comment
  assert.match(read("middleware.ts"), /matcher: \["\/de\/:path\*", "\/fr\/:path\*", "\/lp-v2\/:path\*"\]/);
  for (const r of ROUTES) {
    const page = code(read(`app/(ppc-v2)/${r}/page.tsx`));
    assert.doesNotMatch(page, /searchParams|headers\(|cookies\(|force-dynamic|revalidate/);
  }
  assert.ok(fs.existsSync(P("vercel.json")) ? !ROUTES.some((r) => read("vercel.json").includes(r)) : true);
});

test("document: the current production campaign document's consent, measurement, lead receipt and chat, unchanged", () => {
  const doc = read("campaign-v2/production/Document.tsx");
  const old = read("campaign-v110/CampaignDocument.tsx");
  for (const s of [
    "<ConsentScripts />",
    '<Script src="/design/lead-receipt.js" strategy="beforeInteractive" />',
    "measurementForEnvironment(process.env, analyticsConfig)",
    "<SharedConsent measurement={measurement} />",
    "<ChatbaseLoader />",
    'data-ahv-campaign="true"',
  ]) {
    assert.ok(doc.includes(s), `production document lacks ${s}`);
    assert.ok(old.includes(s), `the campaign document no longer has ${s}; re-check parity`);
  }
  assert.match(doc, /<Script src="\/design\/review-chrome\.js" strategy="afterInteractive" \/>/);
  assert.match(doc, /data-lp-surface="production"/);
  assert.match(read("app/(ppc-v2)/layout.tsx"), /<ProductionDocument>\{children\}<\/ProductionDocument>/);
});

test("document: none of the /lp-v2 preview machinery reaches the live routes (no second banner, no kit tags, no Google Fonts fetch)", () => {
  const files = ["campaign-v2/production/Document.tsx", "campaign-v2/production/ProductionPage.tsx", "campaign-v2/production/fonts.ts", "app/(ppc-v2)/layout.tsx"];
  const BANNED_IMPORTS = [/^next\/font\/google$/, /^@kairali\/consent$/, /integrations\/(loader|slots|chat)/, /kit\/consent-region/, /sections\/(Document|Tracking|LandingPage)$/, /interactive\/(MobileBar|AskAnything|LocaleSwitcher)$/];
  for (const f of files) {
    for (const spec of imports(read(f))) for (const re of BANNED_IMPORTS) assert.doesNotMatch(spec, re, `${f} imports ${spec}`);
    assert.doesNotMatch(code(read(f)), /\b(ConsentBanner|loaderSnippet|geoConsentDefaultSnippet)\b/, f);
  }
  assert.match(read("campaign-v2/production/fonts.ts"), /import localFont from "next\/font\/local";/);
  const page = read("campaign-v2/production/ProductionPage.tsx");
  assert.match(page, /surface: "production"/);
  assert.match(page, /className="lp lp-prod" data-variant=\{v\}/);
  assert.match(page, /export const PRODUCTION_VARIANT: Variant = "A";/);
});

test("isolation: the kit design and the production document are loaded only by app/(ppc-v2) (and the staging-only /lp-v2 preview)", () => {
  const importers = (needle) => APP_FILES.filter((f) => /\.(tsx?|css)$/.test(f) && read(f).includes(needle));
  assert.deepEqual(importers("campaign-v2/production").sort(), [
    "app/(ppc-v2)/ayurvedic-treatment-packages.html/page.tsx", "app/(ppc-v2)/family-ayurvedic-retreat-kerala.html/page.tsx",
    "app/(ppc-v2)/layout.tsx", "app/(ppc-v2)/pain-management.html/page.tsx", "app/(ppc-v2)/panchkarma-treatment.html/page.tsx",
  ]);
  assert.deepEqual(importers("sections/sections.css"), []);
  const cssImporters = walk(P("campaign-v2")).map((f) => path.relative(SITE, f).split(path.sep).join("/"))
    .filter((f) => /\.tsx?$/.test(f) && /import "[^"]*(sections\.css|production\.css|base\.css)"/.test(read(f)));
  assert.deepEqual(cssImporters.sort(), ["campaign-v2/production/Document.tsx", "campaign-v2/sections/LandingPage.tsx"]);
  // Every production rule is scoped to the page wrapper or the consent notice.
  const css = read("campaign-v2/production/production.css").replace(/\/\*[\s\S]*?\*\//g, "");
  let rules = 0;
  for (const m of css.matchAll(/(?:^|[{}])\s*([^{}@]+)\{/g)) {
    for (const sel of selectors(m[1])) {
      rules++;
      assert.match(sel, /^(\.lp-prod\b|html\[data-lp-surface="production"\])/, `unscoped selector: ${sel}`);
    }
  }
  assert.ok(rules > 30, `parsed ${rules} selectors`);
});

test("previews: the kit's /lp-v2 lane stays staging-only, and the production configs are not previewable", async () => {
  const { previewsServed, servableCampaign } = await import("../campaign-v2/servable.ts");
  assert.equal(previewsServed({ AHV_STAGING: "0" }), false);
  assert.equal(previewsServed({ AHV_STAGING: "1" }), true);
  assert.match(read("campaign-v2/route.ts"), /if \(!previewsServed\(\)\) notFound\(\);/);
  assert.equal(servableCampaign("treatment-packages"), undefined);
  assert.ok(!imports(read("campaign-v2/campaigns/index.ts")).some((s) => s.includes("production")));
});

test("merge: .gitignore and next.config.ts carry main's lines and the kit's, with no conflict markers", () => {
  const gi = read(".gitignore");
  const cfg = read("next.config.ts");
  for (const f of [gi, cfg]) assert.doesNotMatch(f, /^(<{7}|={7}|>{7})( |$)/m);
  assert.match(gi, /^\/docs\/lp-v2\/screens\/$/m);
  assert.match(gi, /^\/public\/design\/\*\.min\.js$/m);
  assert.match(cfg, /experimental: \{ globalNotFound: true \}/);
  assert.match(cfg, /process\.env\.LP_DIST_DIR \? \{ distDir: process\.env\.LP_DIST_DIR \}/);
  assert.match(cfg, /source: "\/lp-v2\/:path\*"/);
  assert.match(cfg, /\{ key: "Cache-Control", value: "private, no-store" \}/);
  assert.match(cfg, /\{ key: "X-Robots-Tag", value: "noindex, nofollow" \}/);
  assert.match(cfg, /if \(!IS_STAGING\) return \[assets, documents, staticFragments, lpV2\];/);
  assert.match(cfg, /const staticFragments = /); // main's noindex for view fragments
  assert.match(cfg, /AHV production build requires explicit AHV_STAGING=0/); // main's production guard
});

test("chat: the hero's secondary CTA reuses the site's chat choices; the kit's empty chat slot is never wired", () => {
  assert.match(read("campaign-v2/sections/Hero.tsx"), /import AskAnythingButton from "\.\.\/production\/AskAnythingButton";/);
  assert.match(read("campaign-v2/production/AskAnythingButton.tsx"), /openExistingChatChoices\(document\)/);
  const used = ["campaign-v2/production/ProductionPage.tsx", "campaign-v2/production/Document.tsx"].flatMap((f) => imports(read(f)));
  assert.ok(!used.some((s) => /integrations\/(chat|slots)|AskAnything$/.test(s)), used.join(", "));
  assert.ok(used.includes("@kairali/chat"), "Priya (Chatbase) loads through the site's own loader");
});
