// AHV-N03.01 (train E02, 15 Oct 2026): the Sanskrit programme subtitle printed directly after each package H1 now has
// one style per side (desktop 24px, mobile 20px, both margin 10px 0 0). Seventeen views changed only that style
// attribute (n03-sanskrit-subtitle-20261015.json records each exact before/after). Older byte and masked-JSON pins
// call these helpers first, so they keep checking every other byte exactly: the recorded after-style must sit directly
// after the H1 exactly once, and is replaced by the recorded before-style. Views not in the record pass through.
import assert from "node:assert/strict";
import fs from "node:fs";

export const N03 = JSON.parse(fs.readFileSync(new URL("./n03-sanskrit-subtitle-20261015.json", import.meta.url), "utf8"));

const nameOf = (file) => String(file).split("/").pop().replace(/\.json$/, "");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The template with the recorded N03 subtitle style reversed (unchanged for a view N03 did not touch). */
export function reverseN03Template(name, template) {
  const entry = N03.views[nameOf(name)];
  if (!entry) return template;
  const re = new RegExp(`(</h1>\\s*<${entry.element} style=")${esc(entry.after)}(">)`, "g");
  const hits = template.match(re) ?? [];
  assert.equal(hits.length, 1, `${name}: exactly one N03 subtitle style after the H1`);
  return template.replace(re, (_, a, b) => a + entry.before + b);
}

/** A parsed view with the N03 subtitle style reversed. */
export function reverseN03View(name, view) {
  return N03.views[nameOf(name)] ? { ...view, template: reverseN03Template(name, view.template) } : view;
}

/** Raw view-file text (as read from disk) with the N03 subtitle style reversed; re-serialised exactly as stored. */
export function reverseN03File(file, raw) {
  const text = String(raw);
  if (!N03.views[nameOf(file)]) return raw;
  const view = JSON.parse(text);
  const before = JSON.stringify(view.template);
  const after = JSON.stringify(reverseN03Template(file, view.template));
  assert.equal(text.split(before).length - 1, 1, `${file}: template serialised once`);
  return text.replace(before, () => after);
}
