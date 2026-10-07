// campaign-v2/kit/rich.ts — RichText (kit/types.ts): plain copy in which "[label](href)" marks a link. Nothing else
// is interpreted: no emphasis, no HTML, no autolinks. Every string ends up as a React text child, which React
// escapes. Pure, erasable TypeScript (node --test imports it).

import type { RichText } from "./types.ts";

export type RichRun = { type: "text"; text: string } | { type: "link"; text: string; href: string };

const LINK = /\[([^[\]]+)\]\(([^()\s]+)\)/g;

/** The runs of a RichText, in order. Text outside "[label](href)" is kept exactly as written. */
export function richRuns(src: RichText): RichRun[] {
  const out: RichRun[] = [];
  let at = 0;
  for (const m of src.matchAll(LINK)) {
    const i = m.index ?? 0;
    if (i > at) out.push({ type: "text", text: src.slice(at, i) });
    out.push({ type: "link", text: m[1], href: m[2] });
    at = i + m[0].length;
  }
  if (at < src.length) out.push({ type: "text", text: src.slice(at) });
  return out;
}

/** What a reader sees: the link labels in place of their markup. */
export function richText(src: RichText): string {
  return richRuns(src).map((r) => r.text).join("");
}

/** The links of a RichText, in order. */
export function richLinks(src: RichText): { text: string; href: string }[] {
  return richRuns(src).flatMap((r) => (r.type === "link" ? [{ text: r.text, href: r.href }] : []));
}
