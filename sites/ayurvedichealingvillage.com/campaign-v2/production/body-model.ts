// Pure helpers for the preserved source body (production/Body.tsx). No React here, so node --test can check
// exactly what the renderer will put on the page.
//
// Erasable TypeScript only.

import type { BodyBlock, BodyInline } from "../kit/types.ts";

/** One rendered piece of an inline run list: a text run or a link, plus whether a space precedes it. */
export type InlinePiece = { run: BodyInline; spaceBefore: boolean };

const NO_SPACE_AFTER = /[\s(\[“‘"'/-]$/;
const NO_SPACE_BEFORE = /^[\s.,;:!?)\]”’"'/-]/;

/**
 * Adjacent runs are separate source tokens ("NABH accredited" + "Ayurvedic hospital"): one space joins them,
 * except next to whitespace or punctuation that never takes one. The joined text equals the block's `text`.
 */
export function inlinePieces(runs: readonly BodyInline[]): InlinePiece[] {
  return runs.map((run, i) => {
    if (i === 0) return { run, spaceBefore: false };
    const prev = runs[i - 1].text;
    return { run, spaceBefore: !!prev && !!run.text && !NO_SPACE_AFTER.test(prev) && !NO_SPACE_BEFORE.test(run.text) };
  });
}

/** The visible text of runs, joined as rendered. Pure. */
export function inlineText(runs: readonly BodyInline[]): string {
  return inlinePieces(runs).map((p) => (p.spaceBefore ? " " : "") + p.run.text).join("");
}

/** A testimonial line: a paragraph set in quotation marks (“…”). Its next h3 is the named attribution. */
export function isQuotedParagraph(b: BodyBlock): boolean {
  return b.type === "p" && /^[“"]/.test(b.text.trim()) && /[”"]$/.test(b.text.trim());
}

/** Blocks as rendered: consecutive programme links become one list, consecutive images one gallery. */
export type RenderUnit =
  | { kind: "block"; block: BodyBlock; attribution: boolean }
  | { kind: "programmes"; items: Extract<BodyBlock, { type: "programme" }>[] }
  | { kind: "images"; items: Extract<BodyBlock, { type: "image" }>[] };

export function renderUnits(blocks: readonly BodyBlock[]): RenderUnit[] {
  const out: RenderUnit[] = [];
  blocks.forEach((b, i) => {
    const last = out[out.length - 1];
    if (b.type === "programme") {
      if (last?.kind === "programmes") last.items.push(b);
      else out.push({ kind: "programmes", items: [b] });
      return;
    }
    if (b.type === "image") {
      if (last?.kind === "images") last.items.push(b);
      else out.push({ kind: "images", items: [b] });
      return;
    }
    // An h3 straight after a quoted paragraph names its author: grouped with it visually, never re-worded.
    out.push({ kind: "block", block: b, attribution: b.type === "h3" && i > 0 && isQuotedParagraph(blocks[i - 1]) });
  });
  return out;
}

/** Every visible string a block renders (inline runs win over `text`), for the coverage and claim checks. */
export function renderedTexts(b: BodyBlock): string[] {
  switch (b.type) {
    case "h2": case "h3": case "p": return [b.inline ? inlineText(b.inline) : b.text];
    case "quote": return [b.text, b.attribution];
    case "list": return [...b.items];
    case "table": return [...b.headers, ...b.rows.flat()];
    case "programme": return [b.label, ...(b.sanskrit ? [b.sanskrit] : [])];
    case "videoLink": return [b.label];
    case "image": return b.caption ? [b.caption] : [];
    case "link": return [b.text];
  }
}

/** The intrinsic box of a body image: the source's own size when recorded, else the 3:2 box the old page used. */
export function imageBox(b: Extract<BodyBlock, { type: "image" }>): { width: number; height: number } {
  return b.sourceWidth && b.sourceHeight ? { width: b.sourceWidth, height: b.sourceHeight } : { width: 1200, height: 800 };
}

export const isExternal = (href: string): boolean => /^https:\/\//.test(href);
