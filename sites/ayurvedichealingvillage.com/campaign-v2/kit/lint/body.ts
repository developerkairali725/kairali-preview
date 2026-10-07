// campaign-v2/kit/lint/body.ts — the preserved source body (production pages only).
// The owner's source-preservation rule (>=95% of the useful source copy, no 1200-word longForm cap) replaces
// the kit's long-form caps for a page that carries `body`. This lint checks the rule is recorded and the body is
// well formed; the retention itself is measured against the live page by test/lp-v2-production-content.test.mjs.
import type { BodyBlock, CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });

/** Same-site path or https URL; never javascript:, data:, protocol-relative or bare hosts. */
export function safeHref(href: unknown): boolean {
  return typeof href === "string" && (/^\/(?![\/\\])\S*$/.test(href) || /^https:\/\/[^\s/]+(\/\S*)?$/.test(href) || /^#[A-Za-z][\w-]*$/.test(href));
}
/** In-page anchors the site's consent runtime measures (consent-runtime.ts measurementUrlSafe). */
export const MEASURED_HASHES = /^#(?:enquiry|main|contact|section-[0-8]|written-testimonials|press)$/;
const YOUTUBE = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=[\w-]{11}|youtu\.be\/[\w-]{11})/;

/** Every href in the body, with its path. Pure. */
export function bodyLinks(c: CampaignConfig): { path: string; href: string; text: string }[] {
  const out: { path: string; href: string; text: string }[] = [];
  const visit = (b: BodyBlock, path: string) => {
    if ((b.type === "h2" || b.type === "h3" || b.type === "p") && b.inline) {
      b.inline.forEach((r, k) => { if (r.type === "link") out.push({ path: `${path}.inline[${k}]`, href: r.href, text: r.text }); });
    } else if (b.type === "programme") out.push({ path, href: b.href, text: b.label });
    else if (b.type === "videoLink") out.push({ path, href: b.href, text: b.label });
    else if (b.type === "link") out.push({ path, href: b.href, text: b.text });
  };
  c.body?.sections.forEach((s, i) => s.blocks.forEach((b, j) => visit(b, `body.sections[${i}].blocks[${j}]`)));
  c.body?.closing.forEach((b, j) => visit(b, `body.closing[${j}]`));
  return out;
}

export function lintBody(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  if (!c.body) return out;
  const p = c.sourcePreservation;
  if (!p || p.approvedBy !== "owner" || !(p.minRetention >= 0.95) || !p.rule?.trim() || !p.date?.trim()) {
    out.push(err("body.preservation", "sourcePreservation", "a preserved body needs the owner's preservation rule (approvedBy owner, date, rule, minRetention >= 0.95)"));
  }
  if (!c.body.sections.length) out.push(err("body.empty", "body.sections", "no sections"));
  const ids = new Set<string>();
  c.body.sections.forEach((s, i) => {
    if (!/^[a-z][\w-]*$/i.test(s.sourceSection)) out.push(err("body.section", `body.sections[${i}]`, `bad sourceSection "${s.sourceSection}"`));
    if (ids.has(s.sourceSection)) out.push(err("body.section", `body.sections[${i}]`, `duplicate sourceSection "${s.sourceSection}"`));
    ids.add(s.sourceSection);
    if (!s.blocks.length) out.push(err("body.section", `body.sections[${i}]`, "no blocks"));
    s.blocks.forEach((b, j) => {
      const path = `body.sections[${i}].blocks[${j}]`;
      if (b.type === "table" && b.rows.some((r) => r.length !== b.headers.length)) out.push(err("body.table", path, "every row needs one cell per header"));
      if (b.type === "image" && !b.alt?.trim()) out.push(err("body.image", path, "image needs alt text"));
      if (b.type === "image" && !/^\/(?![\/\\])/.test(b.src)) out.push(err("body.image", path, "image must be a same-site path"));
      if (b.type === "videoLink" && !YOUTUBE.test(b.href)) out.push(err("body.video", path, `not a YouTube watch link: ${b.href}`));
      if (b.type === "quote" && !b.attribution?.trim()) out.push(err("body.quote", path, "a quote keeps its named attribution"));
    });
  });
  for (const { path, href } of bodyLinks(c)) {
    if (!safeHref(href)) out.push(err("body.href", path, `unsafe or malformed link: ${href}`));
    else if (href.startsWith("#") && !MEASURED_HASHES.test(href)) out.push(err("body.hash", path, `in-page anchor ${href} is not measured by the consent runtime; use #enquiry or a #section-N id`));
  }
  return out;
}
