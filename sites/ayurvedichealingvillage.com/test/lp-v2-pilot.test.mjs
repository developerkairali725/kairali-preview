import { test } from "node:test";
import assert from "node:assert/strict";
import { CAMPAIGNS } from "../campaign-v2/campaigns/index.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { collectPending } from "../campaign-v2/kit/pending.ts";

test("pilot passes lp:check as a preview (no errors)", () => {
  const c = CAMPAIGNS.panchakarma;
  assert.ok(c, "registered");
  assert.deepEqual(lintCampaign(c).errors, []);
  assert.equal(c.production, false);
});
test("pilot pending items are only the known open owner inputs", () => {
  const ids = new Set(collectPending(CAMPAIGNS.panchakarma).map((p) => p.id));
  for (const id of ids) assert.ok(["C2", "C4", "C5", "C8", "C14", "C14b"].includes(id), id);
});
