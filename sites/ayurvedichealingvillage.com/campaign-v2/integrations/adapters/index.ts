import type { Adapter } from "./shared.ts";
import { ga4 } from "./ga4.ts";
import { googleAds } from "./googleAds.ts";
import { meta } from "./meta.ts";
import { clarity } from "./clarity.ts";
import { bing } from "./bing.ts";
import { linkedin } from "./linkedin.ts";
import { tiktok } from "./tiktok.ts";

/** Every adapter, in fan-out order. A new tool = a new file here + a slot in slots.ts. */
export const ADAPTERS: readonly Adapter[] = [ga4, googleAds, meta, clarity, bing, linkedin, tiktok];
