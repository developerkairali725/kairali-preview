// campaign-v2/data/google-rating.ts — server only.
// Google's rating is never stored: it is read live from the Places API, and only when it is switched on
// (AHV_GOOGLE_REVIEWS_ENABLED=1, AHV_GOOGLE_PLACES_API_KEY, AHV_GOOGLE_PLACE_ID). Otherwise null, and the
// ProofStrip leaves the Google item out entirely.
import { loadGoogleReviews } from "../../lib/google-reviews.ts";

export type GoogleRating = { rating: number; count: number; mapsUri: string };
type Env = Record<string, string | undefined>;

const TIMEOUT_MS = 2500;
// One Places call per server instance every 6 hours, not one per page view. A miss is retried after 5 minutes.
const TTL_MS = 6 * 60 * 60 * 1000;
const MISS_TTL_MS = 5 * 60 * 1000;
let cache: { until: number; value: GoogleRating | null } | undefined;

/** Returns the live Google rating when the Places API answers "ready" with numbers; otherwise null. Never throws. */
export async function getGoogleRating(env: Env = process.env, fetcher: typeof fetch = fetch, now = Date.now()): Promise<GoogleRating | null> {
  if (cache && now < cache.until && env === process.env) return cache.value;
  let value: GoogleRating | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timed: typeof fetch = (input, init) =>
      fetcher(input, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
    const r = await Promise.race([
      loadGoogleReviews({ enabled: env.AHV_GOOGLE_REVIEWS_ENABLED, key: env.AHV_GOOGLE_PLACES_API_KEY, placeId: env.AHV_GOOGLE_PLACE_ID, language: "en" }, timed),
      new Promise<null>((resolve) => { timer = setTimeout(() => resolve(null), TIMEOUT_MS + 250); }),
    ]);
    if (r && r.status === "ready" && typeof r.rating === "number" && typeof r.count === "number" && r.count > 0) {
      value = { rating: r.rating, count: r.count, mapsUri: r.href ?? "" };
    }
  } catch {
    value = null;
  } finally {
    clearTimeout(timer);
  }
  if (env === process.env) cache = { until: now + (value ? TTL_MS : MISS_TTL_MS), value };
  return value;
}
