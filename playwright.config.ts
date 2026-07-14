/**
 * Playwright config for the FACTORY spec suite (tests/factory/).
 *
 *   SITE=sites/<domain> pnpm exec playwright test tests/factory
 *     → builds nothing itself; expects `pnpm build` done, starts `next start`
 *   SITE=sites/<domain> BASE_URL=<url> pnpm exec playwright test tests/factory
 *     → no local server; runs against the given deployment (preview/staging)
 *
 * The KTAHV WP suite (tests/ktahv-critical-flows.spec.ts) keeps its own
 * BASE_URL contract and is NOT run by this config (testDir scopes to factory).
 *
 * Mobile-first: primary project runs at 375×812 (ENGINEERING_STANDARDS —
 * ~80% of traffic is mobile; touch-target law is a mobile law).
 */
import { defineConfig, devices } from "@playwright/test";

const SITE = process.env.SITE ?? "sites/arogyakendra.com";
const PORT = Number(process.env.PORT ?? 4310);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/factory",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0, // deterministic gate: a flake is a finding, not a retry
  reporter: process.env.CI ? [["list"], ["github"]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile-375",
      // chromium-only fleet (CI installs one browser); iPhone metrics, not engine
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "desktop-1280",
      use: { viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `pnpm --dir ${SITE} exec next start -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
