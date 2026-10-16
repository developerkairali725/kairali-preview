import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { trainingSnapshotFontCss } from "../app/(english)/_families/training-snapshot-fonts.mjs";
const route = "/intensive-ayurveda-training-program-learn-practice-ayurveda/";
const common = '@font-face{font-family:Mulish;src:url(a.common.woff2);unicode-range:U+20-7E;}';
const extra = '@font-face{font-family:Mulish;src:url(a.extra.woff2);unicode-range:U+400-4FF;}';
const css = common + extra;
test("unused extra face is deferred while common face and unrelated CSS remain byte-exact", () => {
 assert.equal(trainingSnapshotFontCss(route, css + "p{color:red}", "<p>Training &amp; Ayurveda</p>"), common + "p{color:red}");
});
test("visible, hidden, attribute and numeric-entity glyphs preserve required extra coverage", () => {
 for (const text of ["Б", '<span hidden>Б</span>', '<span title="Б">A</span>', "&#1041;", "&#x411;"])
  assert.equal(trainingSnapshotFontCss(route, css, text), css);
});
test("unknown entities, unsupported range syntax and unreviewed routes fail conservatively", () => {
 assert.equal(trainingSnapshotFontCss(route, css, "&unknown;"), css);
 for (const malformed of [extra.replace("U+400-4FF", "U+4??"), extra.replace("U+400-4FF", "U+4FF-400")])
  assert.equal(trainingSnapshotFontCss(route, malformed, "A"), malformed);
 assert.equal(trainingSnapshotFontCss("/offers/", css, "A"), css);
 assert.equal(trainingSnapshotFontCss(route, css, ""), css);
});
test("existing German training snapshot needs no extra face; Russian text keeps its original face", () => {
 const fonts = fs.readFileSync("public/ahv/fonts/ahv-33eeac48ab44.css", "utf8");
 const entry = JSON.parse(fs.readFileSync("english-candidate/route-manifest.json", "utf8")).routes.find(row => row.path === route);
 const template = JSON.parse(fs.readFileSync(`public/ahv/l10n/de/views/${entry.mobileView}.json`, "utf8")).template;
 assert(!trainingSnapshotFontCss(route, fonts, template).includes(".extra.woff2"));
 assert(trainingSnapshotFontCss(route, fonts, "Болезни").includes(".extra.woff2"));
});
