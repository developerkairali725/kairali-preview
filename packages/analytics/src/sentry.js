/**
 * @kairali/analytics/sentry — error-monitoring config (Ship Gate B13).
 *
 * The DSN is a PUBLISHABLE client key (like a GA4 id) — it identifies the
 * project for ingest, grants no read/admin access, and ships to the browser
 * by design. It is therefore safe to commit as a default, overridable per
 * site via NEXT_PUBLIC_SENTRY_DSN. This is NOT a secret (auth tokens for
 * source-map upload ARE — those stay in CI env, never here).
 *
 * Sentry is error tracking, not analytics: it does NOT set advertising or
 * analytics cookies, so it is NOT gated behind Consent Mode v2 (it may run
 * before consent — capturing a crash is not tracking a user). It respects
 * `sendDefaultPii: false` so no PII leaves the browser.
 *
 * Wiring per site (Next.js): create sentry.client.config.ts +
 * sentry.server.config.ts that call sentryInit(), and wrap next.config with
 * withSentryConfig for source maps (auth token from CI env SENTRY_AUTH_TOKEN).
 */

// Shared org project DSN (kairali-ayurvedic-group / kairali-factory,
// created 2026-07-14). Publishable — safe to commit. Per-site projects can
// override with NEXT_PUBLIC_SENTRY_DSN when finer-grained alerting is wanted.
export const DEFAULT_SENTRY_DSN =
  "https://f930c3b86b6d216b981229b8ac13f98b@o4511733378908160.ingest.us.sentry.io/4511733393588224";

/** Resolve the DSN: per-site env override, else the shared default. */
export function readSentryDsn(env = {}) {
  const dsn = env.NEXT_PUBLIC_SENTRY_DSN?.trim() || DEFAULT_SENTRY_DSN;
  if (!/^https:\/\/[0-9a-f]+@o\d+\.ingest\.[a-z.]*sentry\.io\/\d+$/.test(dsn)) {
    throw new Error(`sentry: DSN "${dsn}" is not a valid Sentry DSN`);
  }
  return dsn;
}

/**
 * Sentry.init options for a site. `environment` and `release` come from the
 * platform (Vercel sets VERCEL_ENV / VERCEL_GIT_COMMIT_SHA). Low default
 * trace sample rate — errors are the point; performance is opt-in per site.
 *
 * @param {object} env  process.env
 * @param {{site?: string}} [opts]
 */
export function sentryInitOptions(env = {}, { site } = {}) {
  return {
    dsn: readSentryDsn(env),
    environment: env.VERCEL_ENV || env.NODE_ENV || "development",
    release: env.VERCEL_GIT_COMMIT_SHA || undefined,
    tracesSampleRate: Number(env.NEXT_PUBLIC_SENTRY_TRACES_RATE || 0),
    sendDefaultPii: false, // no PII to Sentry (DPDP/GDPR posture)
    // Tag every event with the originating site so one project serves the
    // whole fleet with filterable alerts (per-site projects can come later).
    initialScope: site ? { tags: { site } } : undefined,
    // Don't spam the dashboard from local dev.
    enabled: (env.VERCEL_ENV || env.NODE_ENV) !== "development",
  };
}
