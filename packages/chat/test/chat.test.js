// @kairali/chat — source-contract tests. The loader is a "use client" TSX
// component (browser-only), so like the consent/analytics thin components it
// is asserted at source level: the locked bot ID, the interaction-gated load,
// and the consent-ordering contract must never silently drift.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "ChatbaseLoader.tsx");
const src = readFileSync(SRC, "utf8");

test("bot ID is the interim Priya bot (DECISIONS.md 2026-07-13 18:51 IST) — never invented", () => {
  assert.match(src, /CHATBASE_PRIYA_BOT_ID = "rpNt_uRW6W8EDiTf6AvYJ"/);
});

test("load is interaction-gated with the 6s idle fallback (LCP budget)", () => {
  for (const ev of ["pointerdown", "keydown", "scroll", "touchstart"]) {
    assert.ok(src.includes(`"${ev}"`), `missing interaction event ${ev}`);
  }
  assert.match(src, /setTimeout\(load, 6000\)/);
});

test("embed script is deferred and points at the official Chatbase host only", () => {
  assert.match(src, /s\.src = "https:\/\/www\.chatbase\.co\/embed\.min\.js"/);
  assert.match(src, /s\.defer = true/);
  const hosts = src.match(/https:\/\/[a-z0-9.-]+/gi) ?? [];
  for (const h of hosts) assert.equal(h, "https://www.chatbase.co", `unexpected host ${h}`);
});

test("consent ordering contract is documented in the component itself", () => {
  assert.match(src, /denied-before-loaders/);
});
