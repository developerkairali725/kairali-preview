// Train N (15 Oct 2026): the live article-outline wrapper must reach a fixed point. On /new-to-yoga/ the reviewed
// correction (h3 -> h2) and the Train J refinement (h2 -> h3) cover the same five headings; re-running the pair on a
// later mutation delivery retagged them twice, and every replacement queued another delivery, so the page's main
// thread never went idle (found by the Train N locale recapture: /new-to-yoga/ and /hi/new-to-yoga/ hung).
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { repairArticleContactHeading } from "../app/(english)/_families/article-contact-heading.mjs";
import { repairArticleOutline } from "../app/(english)/_families/article-heading-outline.mjs";

const MARK = "data-ahv-outline-from";
function dom(nodesSpec) {
  const children = [];
  let replacements = 0;
  const doc = { createElement: (tag) => element(tag, []) };
  function element(tag, attributes) {
    return { tagName: tag.toUpperCase(), ownerDocument: doc, kids: [], attributes,
      hasAttribute(name) { return this.attributes.some((a) => a.name === name); },
      setAttribute(name, value) { const f = this.attributes.find((a) => a.name === name); if (f) f.value = value; else this.attributes.push({ name, value }); },
      getAttribute(name) { return this.attributes.find((a) => a.name === name)?.value ?? null; },
      get firstChild() { return this.kids[0] || null; },
      appendChild(child) { if (child.parent) child.parent.kids.splice(child.parent.kids.indexOf(child), 1); child.parent = this; this.kids.push(child); },
      replaceWith(next) { replacements++; children[children.indexOf(this)] = next; } };
  }
  for (const [tag, pointer] of nodesSpec) {
    const node = element(tag, [{ name: "data-source-pointer", value: "/sections/3/c/3/c/" + pointer }]);
    node.appendChild({ text: "child" });
    children.push(node);
  }
  const matches = (node, selector) => selector.split(",").some((part) => {
    const s = /^(h[1-6]|p)(?:\[data-source-pointer="([^"]+)"\])?$/.exec(part);
    assert.ok(s, "unexpected selector " + part);
    return node.tagName === s[1].toUpperCase() && (!s[2] || node.getAttribute("data-source-pointer") === s[2]);
  });
  return { children, count: () => replacements, state: () => children.map((n) => n.tagName + (n.getAttribute(MARK) || "")).join(" "),
    root: { querySelectorAll: (selector) => children.filter((n) => matches(n, selector)) } };
}

test("Train N: the live outline wrapper is a fixed point (a repeated delivery replaces nothing) on every corrected route", () => {
  const run = vm.runInNewContext("(" + repairArticleOutline.toString() + ")");
  const contact = vm.runInNewContext("(" + repairArticleContactHeading.toString() + ")");
  const routes = ["/ayurveda-treatment/", "/why-get-training-in-ayurveda/", "/why-pick-a-yoga-or-yoga-retreat/", "/meditation/", "/new-to-ayurveda/", "/new-to-yoga/", "/yoga-retreats-for-everyone/", "/ayurveda-workshop/", "/what-is-yoga/", "/yoga-classes-practical/", "/yoga-classes-theory/"];
  for (const route of routes) {
    const rule = repairArticleContactHeading(null, route);
    const spec = new Map((rule[2] || []).map((n) => [n, rule[0]]));
    for (const [from, , pointers] of repairArticleOutline(null, route) || []) for (const n of pointers) if (!spec.has(n)) spec.set(n, from);
    const d = dom([...spec].sort((a, b) => a[0] - b[0]).map(([n, tag]) => [tag, n]));
    run(d.root, route, contact);
    const first = d.state(), afterFirst = d.count();
    assert.ok(afterFirst > 0, route + ": the first delivery applies the reviewed corrections");
    run(d.root, route, contact);
    assert.equal(d.count(), afterFirst, route + ": a repeated delivery must not replace any element");
    assert.equal(d.state(), first, route);
  }
});

test("Train N: /new-to-yoga/ ends with the five refined items as marked H3 and the other corrected items as H2", () => {
  const run = vm.runInNewContext("(" + repairArticleOutline.toString() + ")");
  const contact = vm.runInNewContext("(" + repairArticleContactHeading.toString() + ")");
  const d = dom([2, 6, 12, 16, 20, 24, 28, 32, 36, 40].map((n) => ["h3", n]));
  run(d.root, "/new-to-yoga/", contact);
  assert.equal(d.state(), "H2h3 H2h3 H2h3 H3h3 H3h3 H3h3 H3h3 H3h3 H2h3 H2h3");
});
