import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SENTRY_DSN, readSentryDsn, sentryInitOptions } from "../src/sentry.js";

test("default DSN is a valid publishable Sentry DSN", () => {
  assert.equal(readSentryDsn({}), DEFAULT_SENTRY_DSN);
  assert.match(DEFAULT_SENTRY_DSN, /@o\d+\.ingest\..*sentry\.io\/\d+$/);
});

test("per-site env overrides the default; malformed DSN throws", () => {
  const custom = "https://abc123@o999.ingest.us.sentry.io/555";
  assert.equal(readSentryDsn({ NEXT_PUBLIC_SENTRY_DSN: custom }), custom);
  assert.throws(() => readSentryDsn({ NEXT_PUBLIC_SENTRY_DSN: "not-a-dsn" }), /not a valid Sentry DSN/);
});

test("init options: no PII, dev disabled, site tag, prod enabled", () => {
  const dev = sentryInitOptions({ NODE_ENV: "development" }, { site: "arogyakendra.com" });
  assert.equal(dev.sendDefaultPii, false);
  assert.equal(dev.enabled, false, "silent in local dev");
  assert.deepEqual(dev.initialScope.tags, { site: "arogyakendra.com" });

  const prod = sentryInitOptions({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_SHA: "abc" });
  assert.equal(prod.enabled, true);
  assert.equal(prod.environment, "production");
  assert.equal(prod.release, "abc");
  assert.equal(prod.tracesSampleRate, 0, "perf opt-in only");
});
