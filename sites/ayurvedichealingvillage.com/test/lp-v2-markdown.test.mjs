import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseMarkdown, renderBlocks } from "../campaign-v2/sections/markdown.ts";

const html = (src) => renderToStaticMarkup(createElement("div", null, ...renderBlocks(parseMarkdown(src), createElement)));

test("## and ### become h2 and h3; other blocks become paragraphs", () => {
  assert.deepEqual(parseMarkdown("## Title\n\n### Sub\n\nFirst line\nsecond line\n\nAnother."), [
    { type: "h2", text: "Title" },
    { type: "h3", text: "Sub" },
    { type: "p", text: "First line second line" },
    { type: "p", text: "Another." },
  ]);
});

test("blank-line runs, CRLF and surrounding space are tolerated", () => {
  assert.deepEqual(parseMarkdown("\r\n\r\n## A \r\n\r\n\r\n  Body  \n"), [{ type: "h2", text: "A" }, { type: "p", text: "Body" }]);
  assert.deepEqual(parseMarkdown(""), []);
});

test("a block of '- ' lines becomes a list; # and #### are not headings", () => {
  assert.deepEqual(parseMarkdown("- one\n- two"), [{ type: "ul", items: ["one", "two"] }]);
  assert.deepEqual(parseMarkdown("# Not h1"), [{ type: "p", text: "# Not h1" }]);
  assert.deepEqual(parseMarkdown("#### Deep"), [{ type: "p", text: "#### Deep" }]);
});

test("renders to the expected elements", () => {
  assert.equal(html("## H\n\n### S\n\nText\n\n- a\n- b"),
    '<div><h2 class="lp-md__h2">H</h2><h3 class="lp-md__h3">S</h3><p class="lp-md__p">Text</p><ul class="lp-md__ul"><li>a</li><li>b</li></ul></div>');
});

test("HTML in the source is escaped, never passed through", () => {
  const out = html('<script>alert(1)</script>\n\n## <img src=x onerror="y">\n\n- <b>bold</b>');
  assert.ok(!out.includes("<script>"));
  assert.ok(!out.includes("<img"));
  assert.ok(!out.includes("<b>"));
  assert.ok(out.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(out.includes("&lt;img src=x onerror=&quot;y&quot;&gt;"));
  assert.ok(out.includes("<li>&lt;b&gt;bold&lt;/b&gt;</li>"));
});

test("a heading followed directly by text in the same block still splits", () => {
  assert.deepEqual(parseMarkdown("## Head\nBody line\n- item"), [
    { type: "h2", text: "Head" }, { type: "p", text: "Body line" }, { type: "ul", items: ["item"] },
  ]);
});
