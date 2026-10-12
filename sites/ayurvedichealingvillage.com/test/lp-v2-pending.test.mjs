import { test } from "node:test";
import assert from "node:assert/strict";
import { pending, isPending, collectPending } from "../campaign-v2/kit/pending.ts";

test("pending() creates a marker isPending() recognises", () => {
  const p = pending("C2", "fees from tariff");
  assert.equal(isPending(p), true);
  assert.equal(isPending("text"), false);
  assert.equal(isPending(null), false);
});

test("collectPending() finds markers deep in objects and arrays with JSON-ish paths", () => {
  const cfg = { a: "x", fees: pending("C2", "fees"), faq: [{ q: "q", a: pending("C14b", "length") }] };
  assert.deepEqual(collectPending(cfg), [
    { path: "$.fees", id: "C2", note: "fees" },
    { path: "$.faq[0].a", id: "C14b", note: "length" },
  ]);
});
