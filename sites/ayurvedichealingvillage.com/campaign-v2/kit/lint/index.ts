// campaign-v2/kit/lint/index.ts
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { lintLengths } from "./lengths.ts";
import { lintAssets } from "./assets.ts";
import { lintClaims } from "./claims.ts";
import { lintLanguage } from "./language.ts";
import { lintData } from "./data.ts";
import { lintBody } from "./body.ts";
import { lintPricing } from "./pricing.ts";

export type { Issue };
export function lintCampaign(c: CampaignConfig, now: Date = new Date()): { errors: Issue[]; warnings: Issue[] } {
  const all = [...lintLengths(c), ...lintAssets(c, now), ...lintClaims(c), ...lintLanguage(c), ...lintData(now), ...lintBody(c), ...lintPricing(c)];
  return { errors: all.filter((i) => i.level === "error"), warnings: all.filter((i) => i.level === "warning") };
}
