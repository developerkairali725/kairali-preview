/**
 * Human review queue, regenerated from CURRENT accepted outputs:
 *  · blocked units (a worker refused to translate without a clinical/legal
 *    decision) with an authority trace: which routes render the text, whether the
 *    route is an alias, and where the existing clinical audit already flagged it;
 *  · banned-register warnings recomputed with the current language-aware matcher
 *    (warnings stored at harvest time may predate the Unicode-boundary fix).
 * Blocked units fail the release gate until the owner / Dr. Deepu John rule.
 *   node tools/l10n/review-queue.mjs → <evidence>/CLINICAL-REVIEW-QUEUE.json
 */
import fs from "node:fs";
import path from "node:path";
import { rel } from "./sources-lite.mjs";
import { WORK } from "./jobs-const.mjs";
import { BANNED } from "./validate.mjs";
const S = new Map(JSON.parse(fs.readFileSync(rel("l10n/source/units.json"), "utf8")).units.map((u) => [u.id, u]));
const MAN = JSON.parse(fs.readFileSync(rel("english-candidate/route-manifest.json"), "utf8")).routes;
const AUDITS = ["../../docs/reports/2026-09-23-ahv-package-faq-audit.md", "../../docs/content/ahv-package-faq-deepu-review-2026-09-24.md"].map((p) => ({ p, lines: fs.existsSync(rel(p)) ? fs.readFileSync(rel(p), "utf8").split("\n") : [] }));
const plain = (s) => s.replace(/\[\[[A-Z]+_\d+\]\]/g, "").replace(/\s+/g, " ").trim();
function trace(u) {
  const views = u.files.filter((f) => f.includes("/views/")).map((f) => path.basename(f, ".json"));
  const routes = MAN.filter((r) => views.includes(r.desktopView) || views.includes(r.mobileView)).map((r) => {
    const c = r.metadata?.canonical ? new URL(r.metadata.canonical).pathname : r.path;
    return c !== r.path ? `${r.path} (alias → ${c})` : r.path;
  });
  const probe = plain(u.source).slice(0, 38);
  const refs = [];
  for (const a of AUDITS) a.lines.forEach((l, i) => { if (probe && l.includes(probe.slice(0, 30))) refs.push(`${a.p.replace("../../", "")}:${i + 1}`); });
  return { routes, auditRefs: refs.slice(0, 4) };
}
const q = new Map();
for (const loc of fs.readdirSync(rel("l10n/output"))) for (const f of fs.readdirSync(rel(`l10n/output/${loc}`))) {
  for (const u of JSON.parse(fs.readFileSync(rel(`l10n/output/${loc}/${f}`), "utf8")).units) {
    const bad = u.status === "translated" && BANNED[loc] && BANNED[loc].test(u.text) ? u.text.match(BANNED[loc])[0] : null;
    if (u.status !== "blocked" && !bad) continue;
    const src = S.get(u.id);
    const e = q.get(u.id) || { id: u.id, source: src?.source, sourceHash: src?.sourceHash, blocked: {}, bannedTermWarnings: {} };
    if (u.status === "blocked") e.blocked[loc] = (u.issues || [])[0] || "";
    if (bad) e.bannedTermWarnings[loc] = { match: bad, sourceHasTerm: /\b(spa|resort|holiday|luxur\w*|cure|journey|guests?)\b/i.test(src?.source || "") };
    q.set(u.id, e);
  }
}
const items = [...q.values()];
for (const it of items) if (Object.keys(it.blocked).length) Object.assign(it, trace(S.get(it.id)), {
  authorityStatus: "No approved replacement found. The claim is already listed for Dr. Deepu John in the clinical audit (auditRefs) with SUGGESTED wording only; his 25 Sep reply (Gmail 1a0d8161285e0b95) is scoped to the addiction referral FAQ. Not rewritten, not translated.",
  decisionNeeded: "Owner / Dr. Deepu John: approve replacement English wording (then re-extract; only these units retranslate), or rule that the existing English may be translated faithfully, or exclude the affected route(s) from the locales.",
});
items.sort((a, b) => Object.keys(b.blocked).length - Object.keys(a.blocked).length);
const out = {
  generated: new Date().toISOString(),
  blockedUniqueSources: items.filter((i) => Object.keys(i.blocked).length).length,
  blockedLocaleEntries: items.reduce((n, i) => n + Object.keys(i.blocked).length, 0),
  warningUnits: items.filter((i) => Object.keys(i.bannedTermWarnings).length).length,
  note: "Blocked units fail the release gate. Banned-term warnings are review items, not medical findings (proper names/award titles allowed; 'sourceHasTerm' = the English source itself uses the word).",
  items,
};
fs.writeFileSync(path.join(WORK, "..", "CLINICAL-REVIEW-QUEUE.json"), JSON.stringify(out, null, 1));
console.log({ blockedUniqueSources: out.blockedUniqueSources, blockedLocaleEntries: out.blockedLocaleEntries, warningUnits: out.warningUnits });
