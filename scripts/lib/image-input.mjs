/**
 * image-input.mjs — --image support for the two external auditors
 * (scripts/audit-gpt.mjs · scripts/audit-perplexity.mjs).
 *
 * WHY. D-20260718-12 (Abilash, 18 Jul 2026 ~18:05 IST): before content starts
 * on ANY site/LP, the proposed design is reviewed by ChatGPT AND Perplexity —
 * and they must SEE the reference/mockup IMAGE, not a text description of it.
 * A design critique of a paragraph describing a design is the auditor auditing
 * our prose, not the design; this module is what puts the pixels in front of
 * them.
 *
 * REQUEST SHAPE, verified against both providers' current docs (18 Jul 2026):
 * OpenAI chat completions and the Perplexity Sonar API (sonar-pro supports
 * image attachments) accept the SAME OpenAI-style content part —
 *   { type: "image_url", image_url: { url: "data:image/png;base64,…" } }
 * with the image base64-embedded as a data URI. Sources:
 * docs.perplexity.ai/guides/image-attachments (+ /docs/sonar/media) and
 * developers.openai.com/api/docs/guides/images-vision.
 *
 * HONESTY RULES built in (HARD GATE 6 spirit — never feed the auditors a lie):
 *   - PNG/JPG only, decided by extension AND confirmed by magic bytes — a
 *     mislabelled file is refused, not silently sent;
 *   - a missing or empty image is refused BEFORE any tokens are burned — an
 *     empty image reviews nothing;
 *   - no images ⇒ buildUserContent returns the plain brief STRING, so a
 *     text-only run's request body is byte-identical to what it was before
 *     this module existed.
 *
 * HOUSE STYLE: plain ESM + JSDoc, no dependencies.
 */

import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

/** Accepted extensions → MIME. PNG/JPG per D-20260718-12's mockup formats. */
export const IMAGE_MIMES = Object.freeze({
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
});

/** File-signature (magic-byte) prefixes per MIME — extension claims are verified, never trusted. */
export const IMAGE_MAGIC = Object.freeze({
  "image/png": Object.freeze([0x89, 0x50, 0x4e, 0x47]), // \x89PNG
  "image/jpeg": Object.freeze([0xff, 0xd8, 0xff]),
});

/**
 * @typedef {{ path: string, mime: string, bytes: number, base64: string, dataUri: string }} ImagePart
 */

/**
 * Read and validate --image files, returning base64 data-URI parts.
 * Throws (rather than warns) on any unusable image so the run fails BEFORE the
 * API call — the same fail-early stance as parseEmitRequest().
 *
 * @param {string[]} paths as given on the CLI (relative paths resolve against cwd)
 * @returns {ImagePart[]}
 */
export function loadImageParts(paths = []) {
  return paths.map((p) => {
    const ext = extname(p).toLowerCase();
    const mime = IMAGE_MIMES[ext];
    if (!mime) {
      throw new Error(`--image ${p}: only PNG/JPG mockups are accepted (${Object.keys(IMAGE_MIMES).join("/")}), got "${ext || "no extension"}"`);
    }
    if (!existsSync(p)) throw new Error(`--image ${p}: file does not exist`);
    const buf = readFileSync(p);
    if (buf.length === 0) throw new Error(`--image ${p}: file is empty (0 bytes) — an empty image reviews nothing`);
    const magic = IMAGE_MAGIC[mime];
    if (!magic.every((b, i) => buf[i] === b)) {
      throw new Error(`--image ${p}: content does not match ${mime} (magic-byte check failed) — extension and file content disagree; never send a mislabelled artifact to an auditor`);
    }
    const base64 = buf.toString("base64");
    return { path: p, mime, bytes: buf.length, base64, dataUri: `data:${mime};base64,${base64}` };
  });
}

/**
 * Build the user-message `content` for an OpenAI-compatible chat/completions
 * request. No images ⇒ the plain brief string (text-only behaviour unchanged).
 * With images ⇒ content parts: the text brief first, then one image_url part
 * per image, in the order given — the shape BOTH providers accept (see header).
 *
 * @param {string} brief the buildBrief() output
 * @param {ImagePart[]} imageParts loadImageParts() output
 * @returns {string | Array<{type:string}>}
 */
export function buildUserContent(brief, imageParts = []) {
  if (imageParts.length === 0) return brief;
  return [
    { type: "text", text: brief },
    ...imageParts.map((p) => ({ type: "image_url", image_url: { url: p.dataUri } })),
  ];
}

/** One honest, non-secret log line per attached image (path + mime + size — never the bytes). */
export function describeImages(imageParts) {
  return imageParts.map((p) => `${p.path} (${p.mime}, ${p.bytes} bytes)`).join(", ");
}
