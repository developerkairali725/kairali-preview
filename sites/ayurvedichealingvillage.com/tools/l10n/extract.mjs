/**
 * AHV localization — extract the English source units.
 *   node tools/l10n/extract.mjs            → l10n/source/units.json + coverage
 * Every included view, dataset script and chrome component is parsed; the route
 * manifest supplies the head metadata. Output is deterministic (sorted).
 * A round-trip check applies an identity translation and re-parses every
 * logic/script part, so a unit boundary that would break the code fails here.
 */
import fs from "node:fs";
import { sha256, unitId, applyUnits, leafSources, jsUnits, isNonEnglishSource } from "./lib.mjs";
import { rel, sourceFiles, parseFile, includedRoutes } from "./sources.mjs";

const units = new Map(); // source -> {id, source, sourceHash, roles:Set, files:Set, n}
const add = (source, role, file) => {
  let u = units.get(source);
  if (!u) units.set(source, (u = { id: unitId(source), source, sourceHash: sha256(source), roles: new Set(), files: new Set(), n: 0, order: units.size }));
  u.roles.add(role);
  u.files.add(file);
  u.n++;
};

const files = sourceFiles();
const coverage = [];
const errors = [];
for (const file of [...files.components, ...files.views, ...files.scripts]) {
  const text = fs.readFileSync(rel(file), "utf8");
  const parsed = parseFile(file, text);
  let count = 0;
  for (const part of parsed.parts) {
    if (part.error) errors.push({ file, field: part.field, error: part.error });
    for (const leaf of leafSources(part.units)) { add(leaf.source, leaf.kind, file); count++; }
    // round trip: marker translation must keep JS parseable
    if (part.field === "logic" || file.endsWith(".js")) {
      const out = applyUnits(part.text, part.units, (s) => "⟦" + s + "⟧");
      const r = jsUnits(out);
      if (r.error) errors.push({ file, field: part.field, roundTrip: r.error });
    }
  }
  coverage.push({ file, sha256: sha256(text), units: count, status: count ? "covered" : "technical-only" });
}

// sitewide runtime scripts, rail data, JSON data, UI strings, native pages
{
  const X = await import("./extras.mjs");
  for (const f of X.RUNTIME_SCRIPTS) {
    const file = "public/design/" + f, text = fs.readFileSync(rel(file), "utf8");
    const us = leafSources(X.runtimeScriptUnits(file, text));
    for (const l of us) add(l.source, "runtime:" + l.kind, file);
    coverage.push({ file, sha256: sha256(text), units: us.length, status: "covered (curated allowlist)" });
  }
  {
    const file = "public/design/section-nav.data.js", text = fs.readFileSync(rel(file), "utf8");
    const us = jsUnits(text).units.filter((u) => /(^|\.)label$/.test(u.key || ""));
    for (const l of us) add(l.source, "rail:" + l.kind, file);
    coverage.push({ file, sha256: sha256(text), units: us.length, status: "covered" });
  }
  for (const spec of X.JSON_SOURCES) {
    const text = fs.readFileSync(rel(spec.file), "utf8");
    const us = X.jsonUnits(JSON.parse(text), spec);
    for (const u of us) add(u.source, u.kind, spec.file);
    coverage.push({ file: spec.file, sha256: sha256(text), units: us.length, status: "covered (key whitelist)" });
  }
  for (const u of X.uiStrings()) add(u.source, "ui", "l10n/source/ui-strings.json");
  for (const file of X.NATIVE_TSX) {
    const text = fs.readFileSync(rel(file), "utf8");
    const us = X.tsxUnits(text);
    for (const u of us) add(u.source, u.kind, file);
    coverage.push({ file, sha256: sha256(text), units: us.length, status: "covered (native page)" });
  }
}

// head metadata from the manifest (title/description/og) — one unit per string
const META_FIELDS = ["title", "description", "ogTitle", "ogDescription"];
for (const r of includedRoutes()) {
  for (const f of META_FIELDS) {
    const v = r.metadata?.[f];
    if (v && /\p{L}/u.test(v) && !isNonEnglishSource(v)) add(v.replace(/\s+/g, " ").trim(), "seo." + f, "english-candidate/route-manifest.json");
  }
}

const out = [...units.values()].sort((a, b) => a.order - b.order).map((u) => ({
  id: u.id, order: u.order, source: u.source, sourceHash: u.sourceHash, roles: [...u.roles].sort(), files: [...u.files].sort().slice(0, 6), fileCount: u.files.size, occurrences: u.n,
}));
fs.mkdirSync(rel("l10n/source"), { recursive: true });
const setHash = sha256(out.map((u) => u.sourceHash).join("\n"));
fs.writeFileSync(rel("l10n/source/units.json"), JSON.stringify({ sourceSetHash: setHash, count: out.length, units: out }, null, 1) + "\n");
fs.writeFileSync(rel("l10n/source/coverage.json"), JSON.stringify({ sourceSetHash: setHash, files: coverage, errors }, null, 1) + "\n");
const chars = out.reduce((a, u) => a + u.source.length, 0);
console.log(JSON.stringify({ units: out.length, chars, files: coverage.length, errors: errors.length, setHash }, null, 1));
if (errors.length) console.log(errors.slice(0, 10));
