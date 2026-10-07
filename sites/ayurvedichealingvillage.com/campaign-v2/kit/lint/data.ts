// campaign-v2/kit/lint/data.ts
// data.stale: the proof registries (campaign-v2/data/*.ts) hold numbers copied by hand from the live site.
// Warn before they go stale so nobody ships an old rating or a superseded award.
import type { Issue } from "./lengths.ts";
import { TRIPADVISOR, startOf } from "../../data/ratings.ts";
import { FEATURED_AWARDS, type Award } from "../../data/awards.ts";

export const RATINGS_MAX_AGE_DAYS = 120;
export const AWARDS_MAX_AGE_DAYS = 180;
const MESSAGE = "Re-verify ratings/awards from https://ayurvedichealingvillage.com/ and update campaign-v2/data/*.ts";
const DAY = 24 * 60 * 60 * 1000;
const ageDays = (date: string, now: Date) => Math.floor((now.getTime() - startOf(date).getTime()) / DAY);

export function lintData(now: Date, ratings: { asOf: string } = TRIPADVISOR, awards: readonly Award[] = FEATURED_AWARDS): Issue[] {
  const out: Issue[] = [];
  const r = ageDays(ratings.asOf, now);
  if (r > RATINGS_MAX_AGE_DAYS) out.push({ level: "warning", rule: "data.stale", path: "data/ratings.ts TRIPADVISOR.asOf", message: `${ratings.asOf} is ${r} days old. ${MESSAGE}` });
  for (const a of awards) {
    const d = ageDays(a.verifiedOn, now);
    if (d > AWARDS_MAX_AGE_DAYS) out.push({ level: "warning", rule: "data.stale", path: `data/awards.ts ${a.id}.verifiedOn`, message: `${a.verifiedOn} is ${d} days old. ${MESSAGE}` });
  }
  return out;
}
