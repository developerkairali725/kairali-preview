// EF-25 route coverage matrix (26 Sep 2026): reads the fh-probe batch outputs and states, per route,
// the family, the renderer and whether the ONE-compact-header contract held — or why the route is a
// deliberate exception. Read-only; writes a markdown + JSON matrix next to the batches.
//   node tools/ef25-coverage-matrix.mjs --dir <ef25-coverage folder>
import fs from "node:fs";
import path from "node:path";

const arg = (k) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : null; };
const dir = arg("dir");
const nav = JSON.parse(fs.readFileSync("english-candidate/section-nav.json", "utf8"));
const REDIRECTS = JSON.parse(fs.readFileSync("english-candidate/redirect-map.json", "utf8")).redirects;
const NATIVE = new Set(["/sightseeing/", "/video-gallery/", "/read-feedback/", "/givefeedback/", "/search/"]);
const rows = fs.readdirSync(dir).filter((f) => /^batch-\d+\.json$/.test(f)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));

const byRoute = new Map();
for (const r of rows) { if (!byRoute.has(r.route)) byRoute.set(r.route, []); byRoute.get(r.route).push(r); }

function check(r, fam) {
  const d = r.default || {}, o = r.open || {}, e = r.afterEscape || {};
  const bad = [];
  if (r.status !== 200) bad.push("status " + r.status);
  if ((r.errors || []).length) bad.push("errors: " + r.errors.join(" | ").slice(0, 120));
  if (fam) {
    if (d.familyMode !== fam) bad.push("familyMode " + d.familyMode);
    if ((d.fhButtons || []).length !== 1) bad.push("visible family buttons " + JSON.stringify(d.fhButtons));
    if (d.primaryVisible) bad.push("primary nav visible");
    if (d.railVisible) bad.push("rail visible");
    if (d.ctaBarVisible) bad.push("bottom CTA bar visible");
    if ((d.bars || []).length > 1) bad.push("stacked bars " + JSON.stringify(d.bars));
    if (d.coveredPct > 12) bad.push("covers " + d.coveredPct + "%");
    if (!o.current) bad.push("panel: no current page marked");
    if (!(o.familyLinks > 0) || !(o.mainLinks > 0)) bad.push("panel links " + o.familyLinks + "/" + o.mainLinks);
    if (o.expanded !== "true") bad.push("aria-expanded " + o.expanded);
    if (!e.panelHidden || !e.focusOnButton) bad.push("escape/focus return failed");
  } else if (d.familyMode) bad.push("non-family route took family mode " + d.familyMode);
  return bad;
}

const out = [];
for (const [route, rs] of [...byRoute].sort((a, b) => a[0].localeCompare(b[0]))) {
  // a 301 in the protection map lands on its target, so the target's family is what the probe saw
  const to = REDIRECTS[route] ? REDIRECTS[route].to : null;
  const f = nav.family[to || route];
  const fam = f ? f.section : null;
  const reason = to ? `301 → ${to}` + (fam ? "" : " (not a family page — keeps the global header)") : fam ? null : (nav.routes && nav.routes[route] ? "listed in the tree outside a family" : "not a family page (campaign / utility / outside the site tree) — keeps the global header");
  const per = rs.map((r) => ({ vp: r.vp, covered: (r.default || {}).coveredPct, bars: (r.default || {}).bars, fail: check(r, fam) }));
  out.push({ route, family: fam, label: fam ? nav.sections[fam].label : null, renderer: to ? "redirect" : NATIVE.has(route) ? "native" : "design view", exception: reason, viewports: per, pass: per.every((p) => !p.fail.length) });
}
const fails = out.filter((r) => !r.pass);
const fams = {};
for (const r of out) { const k = r.family || "(exception)"; fams[k] = fams[k] || { routes: 0, pass: 0 }; fams[k].routes++; if (r.pass) fams[k].pass++; }
fs.writeFileSync(path.join(dir, "matrix.json"), JSON.stringify({ generated: new Date().toISOString(), routes: out.length, fails: fails.length, families: fams, rows: out }, null, 1));
const md = [
  "# EF-25 family-header route coverage matrix",
  "",
  `Generated ${new Date().toISOString()} from ${rows.length} probe rows (tools/fh-probe.mjs → tools/ef25-coverage-matrix.mjs). Viewports: ${[...new Set(rows.map((r) => r.vp))].join(", ")}. Measured after scrolling 900px; "covered" = share of the viewport occupied by fixed/sticky bars.`,
  "",
  `**${out.length} routes · ${out.length - fails.length} pass · ${fails.length} fail**`,
  "",
  "| Family | Routes | Pass |", "|---|---:|---:|",
  ...Object.entries(fams).map(([k, v]) => `| ${k === "(exception)" ? "(no family — recorded exception)" : k + " — " + nav.sections[k].label} | ${v.routes} | ${v.pass} |`),
  "",
  "| Route | Family | Renderer | Covered % (per viewport) | Result |", "|---|---|---|---|---|",
  ...out.map((r) => `| \`${r.route}\` | ${r.family || "—"} | ${r.renderer} | ${r.viewports.map((p) => p.vp + ": " + p.covered).join(" · ")} | ${r.pass ? (r.exception ? "PASS (exception: " + r.exception + ")" : "PASS") : "FAIL — " + r.viewports.filter((p) => p.fail.length).map((p) => p.vp + ": " + p.fail.join("; ")).join(" / ")} |`),
  "",
];
fs.writeFileSync(path.join(dir, "MATRIX.md"), md.join("\n"));
console.log(JSON.stringify({ routes: out.length, fails: fails.length, families: fams }));
for (const f of fails) console.log("FAIL", f.route, JSON.stringify(f.viewports.map((p) => p.fail)));
