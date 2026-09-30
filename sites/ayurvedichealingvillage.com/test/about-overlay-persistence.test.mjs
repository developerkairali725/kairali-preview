// OWNER-REG-05/07 persistence (parent review 29 Sep 2026): the about-us certificate-viewer scroll-lock repair lives in
// the view logic, and a full re-import rebuilds views from the sealed package. The importer reads overlay files first,
// so english-candidate/package-overlay/AHV Page About Us {Desktop,Mobile}.dc.html carry the repaired logic: this test
// keeps each overlay's logic block identical to the served view's logic, so a re-import cannot restore the old viewer.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const re = /<script\b[^>]*\bdata-dc-script\b[^>]*>([\s\S]*?)<\/script\s*>/i;
for (const v of ["Desktop", "Mobile"]) {
  test(`about-us ${v} overlay carries the served (repaired) viewer logic`, () => {
    const overlay = fs.readFileSync(new URL(`../english-candidate/package-overlay/AHV Page About Us ${v}.dc.html`, import.meta.url), "utf8");
    const served = JSON.parse(fs.readFileSync(new URL(`../public/ahv/views/ahv-page-about-us-${v.toLowerCase()}.json`, import.meta.url), "utf8")).logic;
    const m = re.exec(overlay);
    assert.ok(m, "overlay has a logic block");
    assert.equal(m[1].replace(/<\\\/script/g, "</script"), served, "overlay logic == served logic");
    assert.match(served, /OWNER-REG-07/, "the served logic is the repaired viewer");
  });
}
