import { test } from "node:test";
import assert from "node:assert/strict";
import { lintText } from "../src/lint.js";

const errs = (f) => f.filter((x) => x.severity === "error");
const rules = (f) => new Set(f.map((x) => x.rule));

test("clinical lock fires on KTAHV for banned EN words", () => {
  const f = lintText("Enjoy a luxury spa holiday at our resort.", { entity: "ktahv" });
  const found = errs(f).map((x) => x.message);
  assert.ok(found.some((m) => m.includes('"spa"')));
  assert.ok(found.some((m) => m.includes('"resort"')));
  assert.ok(found.some((m) => m.includes('"luxury"')));
  assert.ok(found.some((m) => m.includes('"holiday"')));
});

test("clinical lock covers PROJECT_CONTEXT additions (getaway, escape, journey, guests)", () => {
  const f = lintText("A wellness journey and getaway escape for our guests.", { entity: "ktahv" });
  const msgs = errs(f).map((x) => x.message).join(" ");
  for (const w of ["journey", "getaway", "escape", "guests"]) assert.ok(msgs.includes(`"${w}"`), w);
});

test("clinical lock does NOT cross-apply to Villa Raag or KAPPL", () => {
  const raag = lintText("A luxury resort escape in Goa.", { entity: "raag" });
  assert.equal(errs(raag).filter((x) => x.rule.startsWith("clinical-lock")).length, 0);
  const kappl = lintText("Spa equipment for professional use.", { entity: "kappl" });
  assert.equal(errs(kappl).filter((x) => x.rule.startsWith("clinical-lock")).length, 0);
});

// REWRITTEN 16 Jul 2026. The previous version asserted that "kur" and "cure"
// must fire — i.e. it encoded the bug. Both auditors failed the old lists:
// they were TRANSLATIONS of the English ban, which made both readers worse —
// the patient saw a hospital avoiding normal hospital words, while the GST
// officer still found resort vocabulary the list never covered.
// The principle now: ban what a RESORT says that a HOSPITAL never would.
// This is not weakening a gate to make it pass — the gate got stronger (18
// words/language, up from 10 DE and 17 FR, now catching Wellness/Kurort/
// Pauschale/bien-être/forfait, which the old list missed entirely).
test("DE/FR: RESORT vocabulary fires on KTAHV", () => {
  const f = lintText(
    "Ein Luxus Urlaub im Wellnesshotel, Pauschale im Kurort.\nDes vacances de luxe, une escapade bien-être, forfait détente.",
    { entity: "ktahv" },
  );
  const msgs = errs(f).map((x) => x.message).join(" ").toLowerCase();
  for (const w of ["urlaub", "luxus", "wellnesshotel", "pauschale", "kurort", "vacances", "luxe", "escapade", "bien-être", "forfait"]) {
    assert.ok(msgs.includes(`"${w}"`), `resort word must fire: ${w}`);
  }
});

// The other half of the same rule, and the reason the old list was self-defeating:
// blocking correct clinical language pushes writers toward vaguer, less medical
// prose — which is the OPPOSITE of what the GST argument needs.
test("DE/FR: CLINICAL language must NOT fire (it is the tax argument)", () => {
  const f = lintText(
    "Kur und Rehabilitation: stationäre Aufnahme und Behandlung durch den Arzt.\nSéjour hospitalier, durée de séjour, cure de sevrage, prise en charge du patient.",
    { entity: "ktahv" },
  );
  const msgs = errs(f).map((x) => x.message).join(" ").toLowerCase();
  // "Kur" is a REGULATED German rehab concept inside statutory healthcare
  // (14 sources); the spa risk lives in "Kurort", which IS banned above.
  // French "séjour" is standard hospital register — "séjour hospitalier",
  // "durée de séjour".
  for (const w of ["kur", "séjour", "rehabilitation", "behandlung"]) {
    assert.ok(!msgs.includes(`"${w}"`), `clinical word must NOT be blocked: ${w}`);
  }
  // NOTE — "cure" is deliberately NOT asserted here. The CLINICAL LOCK no
  // longer bans it (correct: French "cure de sevrage" = a course of treatment,
  // a false friend of English "cure"). But it is still caught by the CURE-CLAIMS
  // rule — a separate, ratified, no-disease-cure-promises floor with real
  // regulatory weight (India's DMR Act et al). That rule firing on legitimate
  // French clinical text is a REAL false positive, logged in QUESTIONS.md for
  // the native-speaker/legal review. It is NOT ours to weaken unilaterally:
  // the clinical lock is a tax-register rule; cure-claims is a medical-claims
  // rule. Two rules, two reasons, two reviewers.
});

test("banned filler fires on ALL entities", () => {
  for (const entity of ["ktahv", "raag", "kappl", "group"]) {
    const f = lintText("A bespoke, curated and world-class experience nestled in Goa.", { entity });
    const msgs = errs(f).map((x) => x.message).join(" ");
    for (const w of ["bespoke", "curated", "world-class", "nestled"]) assert.ok(msgs.includes(`"${w}"`), `${entity}:${w}`);
  }
});

test("word boundaries: no false positives inside other words", () => {
  // "curated" must not trigger "cure"; "unique" must not fire on "uniquely-keyed" hyphenation guard
  const f = lintText("The escapement mechanism and resorting of data.", { entity: "ktahv" });
  const msgs = errs(f).map((x) => x.message).join(" ");
  assert.ok(!msgs.includes('"escape"'));
  assert.ok(!msgs.includes('"resort"'));
});

test("cure claims blocked on every entity", () => {
  const f = lintText("This oil cures arthritis. Guaranteed results. A miracle remedy.", { entity: "kappl" });
  assert.ok(errs(f).filter((x) => x.rule === "cure-claims").length >= 3);
});

test("locked facts: known-bad number flagged in any formatting", () => {
  for (const s of ["+91 92898 38777", "9289838777", "+91-92898-38777"]) {
    const f = lintText(`WhatsApp us: ${s}`, { entity: "group" });
    assert.equal(errs(f).filter((x) => x.rule === "locked-facts").length, 1, s);
  }
  const ok = lintText("WhatsApp: +91 92898 38797", { entity: "group" });
  assert.equal(errs(ok).length, 0);
});

test("locked facts: non-canonical kairali.com emails flagged", () => {
  const f = lintText("Write to sales@kairali.com or info@kairali.com", { entity: "group" });
  const facts = errs(f).filter((x) => x.rule === "locked-facts");
  assert.equal(facts.length, 1);
  assert.ok(facts[0].message.includes("sales@kairali.com"));
});

test("headings: no exclamation, no emoji", () => {
  const f = lintText("# Book Now!\n\n## Panchakarma 🌿", { entity: "ktahv" });
  assert.equal(errs(f).filter((x) => x.rule === "brand-voice").length, 2);
});

test("frontmatter entity override applies clinical lock per page", () => {
  const page = `---\ntitle: KTAHV on kairali.com\nentity: ktahv\n---\nA luxury resort stay.`;
  const f = lintText(page, { entity: "group" });
  assert.ok(errs(f).some((x) => x.rule === "clinical-lock"));
});

test("compliance-allow suppresses one word on one line, reported as info", () => {
  const f = lintText("Spa equipment catalogue <!-- compliance-allow: spa -->", { entity: "ktahv" });
  assert.equal(errs(f).filter((x) => x.message.includes('"spa"')).length, 0);
  assert.ok(f.some((x) => x.severity === "info" && x.message.includes('"spa"')));
});

test("code files get warnings, not errors", () => {
  const f = lintText('const label = "unique luxury";', { entity: "ktahv", asCode: true });
  assert.equal(errs(f).length, 0);
  assert.ok(f.filter((x) => x.severity === "warning").length >= 2);
});

test("personal entity gets banned-filler too (Abilash ruling 13 Jul 2026)", () => {
  const filler = lintText("Curated speeches and unique talks.", { entity: "personal" });
  assert.ok(errs(filler).filter((x) => x.rule === "banned-filler").length >= 2);
  const cure = lintText("This talk cures boredom. Call +91 92898 38777.", { entity: "personal" });
  assert.ok(errs(cure).some((x) => x.rule === "cure-claims"));
  assert.ok(errs(cure).some((x) => x.rule === "locked-facts"));
});
