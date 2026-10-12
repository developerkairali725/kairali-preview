import type { Maybe } from "../kit/types.ts";
import { isPending } from "../kit/pending.ts";

export const t = (v: Maybe<string> | undefined): string => (v === undefined ? "" : isPending(v) ? `[${v.id}]` : v);

export function splitAccent(h1: string, accent?: string): [string, string, string] {
  if (!accent) return [h1, "", ""];
  const i = h1.indexOf(accent);
  return i < 0 ? [h1, "", ""] : [h1.slice(0, i), accent, h1.slice(i + accent.length)];
}
