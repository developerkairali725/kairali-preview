// Protected-staging access for browser checks (HARD GATE 14: never expose a secret).
// The Vercel OIDC token goes ONLY on requests to the staging origin. A context-wide `extraHTTPHeaders` (what these
// tools used before 29 Sep 2026) sends it on every request the page makes — Chatbase, Google, fonts, YouTube.
// Caveat (Playwright route.continue): an overridden header also rides a redirect that request starts, so a
// same-origin URL that redirects off-origin would carry it. The site's redirects are all in-origin paths.
//   import { attachStagingToken } from "./lib/staging-auth.mjs";  await attachStagingToken(contextOrPage, BASE);
export const TOKEN_HEADER = "x-vercel-trusted-oidc-idp-token";
export async function attachStagingToken(target, base) {
  const tok = process.env.VERCEL_OIDC_TOKEN;
  if (!tok || !/^https:/.test(base)) return false;
  const origin = new URL(base).origin;
  await target.route((url) => url.origin === origin, (route) =>
    route.continue({ headers: { ...route.request().headers(), [TOKEN_HEADER]: tok } }));
  return true;
}
