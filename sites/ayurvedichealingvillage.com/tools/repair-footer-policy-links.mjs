#!/usr/bin/env node
/**
 * AHV — the payment policy gets a footer link.
 *
 * OWNER RULING, 2026-09-21. Q-AHV-POLICY-PLACEMENT measured that
 * `/payment-policy-compliance/` and `/new-privacy-policy/` are the only 2 of 9
 * policy pages with no footer link while both sit in the sitemap — a policy
 * page that is submitted to Google and linked from nowhere is the worst of
 * both. He ruled: add them.
 *
 * ONLY ONE IS ADDED, and the other half of the ruling is reported back instead.
 * The footer already carries TWO privacy links — "Privacy Policy"
 * (/privacy-policy/, 1,252 words) and "Privacy Statement" (/privacy-statement/,
 * 1,911 words) — and `/new-privacy-policy/` is a THIRD privacy document of
 * 1,474 words whose <title> is byte-identical to /privacy-policy/'s. A third
 * link in that row would have to be labelled something like "New Privacy
 * Policy", which reads as unfinished on a hospital's footer and still would not
 * tell a visitor which one governs. That is a which-document-is-canonical
 * question, not a missing link, so it goes back to the owner rather than being
 * papered over. Recorded in QUESTIONS.md under Q-AHV-POLICY-PLACEMENT.
 *
 * WHY A TOOL AND NOT AN EDIT: tools/import-english-candidate.mjs rewrites
 * public/ahv/ wholesale on every run, so a hand-edited chrome file is erased by
 * the next import. Idempotent and re-runnable, like the other repair-*.mjs.
 *
 *   node tools/repair-footer-policy-links.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const FOOTER = join(SITE, "public/ahv/components/AHV Chrome Footer.dc.html");
const HOST = "https://ayurvedichealingvillage.com";
const STYLE = "color:rgba(247,244,234,.7);display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px";

/** Added after this link, so Payment sits beside Cancellation & Refund. */
const AFTER = `${HOST}/cancellation-and-refund-policy/`;
const ADD = { href: `${HOST}/payment-policy-compliance/`, label: "Payment Policy" };

const src = readFileSync(FOOTER, "utf8");

if (src.includes(ADD.href)) {
  console.log("already applied — the footer already links the payment policy");
  process.exit(0);
}

// Find the whole <a> that wraps the cancellation link, whatever its exact text.
const re = new RegExp(`<a href="${AFTER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>[\\s\\S]*?<\\/a>`);
const m = re.exec(src);
if (!m) {
  console.error("FAIL — the cancellation-and-refund link is not in the footer; the row moved. Re-derive the anchor rather than guessing.");
  process.exit(1);
}

const sep = ' <span style="opacity:.4">·</span> ';
const link = `<a href="${ADD.href}" style="${STYLE}">${ADD.label}</a>`;
const out = src.replace(m[0], `${m[0]}${sep}${link}`);

if ((out.match(/payment-policy-compliance/g) || []).length !== 1) {
  console.error("FAIL — expected exactly one payment-policy link after the edit.");
  process.exit(1);
}
if (!DRY) writeFileSync(FOOTER, out);

console.log(`${DRY ? "[dry] " : ""}footer: added "${ADD.label}" -> ${ADD.href}`);
console.log(`  placed after: Cancellation & Refund`);
console.log(`  44px target + the row's own colour token preserved`);
console.log(`\nNOT ADDED, reported instead: /new-privacy-policy/. The row already carries two`);
console.log(`  privacy links, and that page's <title> is identical to /privacy-policy/'s. Which of`);
console.log(`  the three privacy documents governs is the owner's call — Q-AHV-POLICY-PLACEMENT.`);
