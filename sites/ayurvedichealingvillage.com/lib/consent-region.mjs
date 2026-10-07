import { promptForCountry, REGION_POLICY_VERSION } from '../public/consent/regions.mjs';
export { EUROPE_PROMPT_COUNTRIES, promptForCountry } from '../public/consent/regions.mjs';
export function regionPresentation(headers, environment = {}) {
  const strict = { version: REGION_POLICY_VERSION, prompt: 'automatic' };
  // A custom hostname may be behind Cloudflare. Its country headers and a
  // proxy's source IP cannot attest the visitor's country. No header-presence
  // trust, IP forwarding, IP logging, or external geolocation service.
  const host = headers.get('host');
  const deployment = environment.VERCEL_URL;
  if (environment.VERCEL !== '1' || !deployment || !/^[a-z0-9-]+\.vercel\.app$/.test(deployment) || host !== deployment) return strict;
  if (headers.get('x-forwarded-host') !== host || !headers.get('x-vercel-id')) return strict;
  for (const name of ['cf-ray', 'cf-ipcountry', 'cf-connecting-ip', 'true-client-ip', 'forwarded', 'via']) {
    if (headers.has(name)) return strict;
  }
  return { version: REGION_POLICY_VERSION, prompt: promptForCountry(headers.get('x-vercel-ip-country')) };
}
export function regionResponse(headers, environment) {
  // No country/IP in the response, cookies, HTML, storage or application logs.
  return Response.json(regionPresentation(headers, environment), { headers: {
    'Cache-Control': 'private, no-store, max-age=0',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  } });
}
