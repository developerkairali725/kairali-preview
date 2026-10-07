import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { measurementForEnvironment } from "../lib/measurement-config.mjs";
const config = JSON.parse(readFileSync(new URL("../analytics.config.json", import.meta.url)));
test("measurement stays off unless explicitly activated for the selected environment", () => {
  for (const env of [{}, {AHV_STAGING:"0"}, {AHV_ANALYTICS:"1"}, {AHV_ANALYTICS_STAGING:"1"}, {AHV_ANALYTICS:"1",AHV_STAGING:"1"}]) assert.equal(measurementForEnvironment(env, config), undefined);
  assert.equal(measurementForEnvironment({AHV_ANALYTICS:"1",AHV_STAGING:"0"},config).environment,"production");
  const staging=measurementForEnvironment({AHV_ANALYTICS:"1",AHV_ANALYTICS_STAGING:"1"},config);
  assert.equal(staging.environment,"staging");
  assert.equal(staging.ga4,config.measurement.ga4.id);
  assert.equal(staging.metaPixel,config.measurement.metaPixel.id);
});

// Evaluate the production config guard so malformed pulled mode values cannot ship.
test("production rejects redacted analytics modes while preserving explicit off and preview", async () => {
  const vm = await import("node:vm");
  const source = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
  const guard = source.match(/if \(process\.env\.VERCEL_ENV === "production" && !\["0", "1"\]\.includes[\s\S]*?\n\}/)[0];
  for (const mode of [undefined, "[SENSITIVE]", "true", ""]) {
    assert.throws(() => vm.runInNewContext(guard, {process:{env:{VERCEL_ENV:"production",AHV_ANALYTICS:mode}}}), /requires explicit AHV_ANALYTICS/);
  }
  for (const mode of ["0", "1"]) assert.doesNotThrow(() => vm.runInNewContext(guard,{process:{env:{VERCEL_ENV:"production",AHV_ANALYTICS:mode}}}));
  assert.doesNotThrow(() => vm.runInNewContext(guard,{process:{env:{VERCEL_ENV:"preview"}}}));
});
