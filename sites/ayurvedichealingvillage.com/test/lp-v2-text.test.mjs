import { test } from "node:test";
import assert from "node:assert/strict";
import { t, splitAccent } from "../campaign-v2/sections/text.ts";
import { pending } from "../campaign-v2/kit/pending.ts";

test("t() renders pending as a visible bracket placeholder", () => {
  assert.equal(t("Hello"), "Hello");
  assert.equal(t(pending("C2", "fees")), "[C2]");
});
test("splitAccent splits around the accent substring", () => {
  assert.deepEqual(splitAccent("Panchakarma, practiced the way it was meant to be.", "meant to be."), ["Panchakarma, practiced the way it was ", "meant to be.", ""]);
  assert.deepEqual(splitAccent("No accent here"), ["No accent here", "", ""]);
});
