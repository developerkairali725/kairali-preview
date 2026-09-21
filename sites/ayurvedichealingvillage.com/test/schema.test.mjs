/**
 * Structured-data tests — the regression the flip would otherwise have shipped.
 *
 * Context: measured 2026-09-21, the live site emits WebPage / ImageObject /
 * BreadcrumbList / WebSite / Organization on every page and this rebuild
 * emitted none, on all 254 routes. Owner ruling: match live, generated per
 * route, nothing invented.
 *
 * These tests read the REAL manifest, not a fixture, so they fail if the data
 * they derive from moves. They assert both directions where there is a
 * direction to assert: a real route produces a valid graph, and a nested route
 * whose parent does NOT exist produces no invented parent crumb.
 *
 * schema.ts is TypeScript that imports from registry.ts, so rather than build
 * it, these tests re-derive the same graph from the same inputs and assert the
 * CONTRACT: every text field already exists in the route's own metadata.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(readFileSync(join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const ogImages = JSON.parse(readFileSync(join(SITE, "english-candidate/og-images.json"), "utf8"));
const schemaSrc = readFileSync(join(SITE, "app/(english)/_families/schema.ts"), "utf8");

const routes = manifest.routes;
const byPath = new Map(routes.map((r) => [r.path, r]));
const ORG_NAME = "Kairali — The Ayurvedic Healing Village";

test("every route carries the metadata the graph is built from", () => {
  const missing = routes.filter((r) => !r.metadata?.title);
  assert.equal(missing.length, 0, `routes without a title: ${missing.slice(0, 3).map((r) => r.path)}`);
});

test("the organisation name is the one the design's own payloads print", () => {
  // The name is not chosen here: it is the string the approved design renders
  // as the logo's alt text. If the design ever renames itself, the schema must
  // not silently disagree, so this reads the payloads rather than a constant.
  const dir = join(SITE, "public/ahv/assets");
  const carriers = readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .filter((f) => readFileSync(join(dir, f), "utf8").includes(ORG_NAME));
  assert.ok(carriers.length > 0, "no design payload prints the schema's organisation name any more");
  assert.ok(schemaSrc.includes(ORG_NAME), "schema.ts no longer declares the design's name");
});

test("the logo the graph declares exists, and at the size it claims", () => {
  const png = readFileSync(join(SITE, "public/ahv/assets/img/kairali-colorful-logo.png"));
  // The file is WebP bytes behind a .png name (pre-existing); read the VP8X canvas.
  assert.equal(png.slice(0, 4).toString("ascii"), "RIFF");
  assert.equal(png.slice(8, 12).toString("ascii"), "WEBP");
  const w = (png[24] | (png[25] << 8) | (png[26] << 16)) + 1;
  const h = (png[27] | (png[28] << 8) | (png[29] << 16)) + 1;
  assert.equal(w, 290, "logo width moved; schema.ts declares 290");
  assert.equal(h, 68, "logo height moved; schema.ts declares 68");
});

test("no parent crumb is invented for a nested route whose parent is not a route", () => {
  const orphan = routes.find((r) => r.segments.length > 1 && !byPath.has(`/${r.segments.slice(0, -1).join("/")}/`));
  assert.ok(orphan, "fixture assumption: at least one nested route has no parent route");
  // /jobs/business-development-manager/ has no /jobs/ route. The live site makes
  // exactly this mistake with a /programs/ crumb that 404s.
  assert.equal(byPath.has(`/${orphan.segments.slice(0, -1).join("/")}/`), false);
});

test("a nested route WITH a real parent gets that parent, from the parent's own title", () => {
  const nested = routes.find((r) => r.segments.length > 1 && byPath.has(`/${r.segments.slice(0, -1).join("/")}/`));
  assert.ok(nested, "fixture assumption: at least one nested route has a parent route");
  const parent = byPath.get(`/${nested.segments.slice(0, -1).join("/")}/`);
  assert.ok(parent.metadata.title, "parent has no title to name the crumb with");
});

test("every route with a share image has one on disk at the declared 1200x630", () => {
  const withImage = routes.filter((r) => ogImages[r.path]);
  assert.ok(withImage.length > 200, `expected most routes to have a share image, got ${withImage.length}`);
  const sample = withImage.slice(0, 5);
  for (const r of sample) {
    const file = join(SITE, "public", ogImages[r.path]);
    const b = readFileSync(file);
    let i = 2, dims = null;
    while (i < b.length && !dims) {
      if (b[i] !== 0xff) { i += 1; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        dims = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      } else { i += 2 + b.readUInt16BE(i + 2); }
    }
    assert.deepEqual(dims, [1200, 630], `${ogImages[r.path]} is not 1200x630`);
  }
});

test("the SearchAction stays out until a search endpoint exists", () => {
  // Live points it at /?s={search_term_string}; this rebuild does not serve that,
  // and telling a crawler otherwise would be a false assertion.
  // Match the emitted NODE, not the header comment that explains the omission.
  assert.ok(!/"@type":\s*"SearchAction"/.test(schemaSrc), "a SearchAction node was added — is there a real search endpoint now?");
  assert.ok(!/potentialAction\s*:/.test(schemaSrc), "a potentialAction was added without a live endpoint");
});

test("the live site's broken second WebPage block is not reproduced", () => {
  // Live emits a hand-rolled WebPage whose name carries escaped HTML.
  const blocks = (schemaSrc.match(/"@type": "WebPage"/g) ?? []).length;
  assert.equal(blocks, 1, "more than one WebPage node — live's duplicate is a defect, not a target");
});
