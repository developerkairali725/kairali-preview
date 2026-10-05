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
