// arogyakendra.com integrity gate — pins the canonical-count fix (17 Jul
// 2026). This site is LIVE: its hero lede, trust tile and llms.txt carried a
// stale network count against the canonical figures (KAC site ruling,
// PROJECT_CONTEXT §12). Every count now renders from @kairali/facts. The
// negative scan delegates to the REAL scanner (scripts/banned-string-lint.mjs
// scanText: comment-stripping, probe-verified, shared LOCKED_COUNT_PATTERNS)
// — one stripper, one list, one law. The constants' VALUES are pinned once,
// in packages/facts/test.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { scanText } from "../../../scripts/banned-string-lint.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");
const page = readFileSync(join(site, "app/page.tsx"), "utf8");
const llms = readFileSync(join(site, "app/llms.txt/route.ts"), "utf8");

test("no network count is typed anywhere in shipped source (stale or canonical)", () => {
  for (const [name, src] of [["app/page.tsx", page], ["app/llms.txt/route.ts", llms]]) {
    const hits = scanText(src, { file: name, kind: "code" })
      .filter((f) => f.rule === "hardcoded-centres-count" && f.severity === "error");
    assert.deepEqual(hits, [], `${name} types a network count:\n${JSON.stringify(hits, null, 2)}`);
  }
});

test("hero lede and trust tile render the count from @kairali/facts", () => {
  assert.match(page, /from\s+"@kairali\/facts"/, "page imports the facts package");
  assert.match(page, /\{COUNTRIES_PHRASE\}/, "hero lede renders the constant");
  assert.match(page, /\{COUNTRIES_PHRASE_TITLE\}/, "trust tile renders the title-case constant");
  assert.match(page, /\{CENTRES_COUNT\}/, "the centre count renders the computed number");
});

test("llms.txt (the surface AI answers quote) renders the canonical network line", () => {
  assert.match(llms, /from\s+"@kairali\/facts"/);
  assert.match(llms, /CENTRES_NETWORK_LINE/, "both the facts list and the KAC link note carry the canonical line");
});
