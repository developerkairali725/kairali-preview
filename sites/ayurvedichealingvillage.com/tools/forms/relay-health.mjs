#!/usr/bin/env node
/**
 * Activation check for the AHV form relay (bridge/form-relay/RUNBOOK.md step 6).
 * Sends ONE signed `health` request and prints the relay's readiness report —
 * table/column names only, never data. Reads AHV_FORM_RELAY_URL,
 * AHV_FORM_RELAY_SECRET and AHV_FORM_RELAY_KEY_ID from the environment of the
 * person running it; prints no secret. Exit 0 only when the relay answers,
 * its signature verifies and it reports ready.
 *
 *   AHV_FORM_RELAY_URL=... AHV_FORM_RELAY_SECRET=... node tools/forms/relay-health.mjs
 */
import { relayCall, relayConfigProblem } from '../../lib/form-relay.ts';

const problem = relayConfigProblem();
if (problem) {
  console.error(`relay not configured in this shell: ${problem}`);
  process.exit(2);
}
try {
  const report = await relayCall('health', undefined);
  console.log(JSON.stringify({ ready: report.ready, protocol: report.protocol, tables: report.tables }, null, 2));
  process.exit(report.ready === true ? 0 : 1);
} catch (error) {
  console.error(`relay health failed: ${error && error.code ? error.code : 'unknown'}`);
  process.exit(1);
}
