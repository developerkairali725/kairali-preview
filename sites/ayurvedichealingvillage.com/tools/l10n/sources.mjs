/**
 * AHV localization — the source inventory: which files carry translatable text
 * for the included (non-campaign) routes, and how each is parsed.
 * Shared by extract.mjs (English → units) and build.mjs (units → locale files).
 */
import fs from "node:fs";
import path from "node:path";
import { htmlUnits, jsUnits } from "./lib.mjs";

export const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " ")), "../..");
export const rel = (...p) => path.join(SITE, ...p);
export const readJson = (p) => JSON.parse(fs.readFileSync(rel(p), "utf8"));

export const scope = () => readJson("l10n/scope.json");
export const manifest = () => readJson("english-candidate/route-manifest.json");

/** Included routes: every manifest route minus owner-excluded campaign routes and deferred ones. */
export function includedRoutes() {
  const sc = scope();
  const excluded = new Set(sc.excluded.map((e) => e.path));
  return manifest().routes.filter((r) => !excluded.has(r.path));
}

const viewFile = (id) => `public/ahv/views/${id}.json`;

/** Views + dataset scripts + chrome used by included routes. */
export function sourceFiles() {
  const views = new Set();
  for (const r of includedRoutes()) {
    if (r.desktopView) views.add(r.desktopView);
    if (r.mobileView) views.add(r.mobileView);
  }
  const scripts = new Set();
  for (const v of views) {
    const p = rel(viewFile(v));
    if (!fs.existsSync(p)) continue;
    for (const s of JSON.parse(fs.readFileSync(p, "utf8")).scripts || []) scripts.add(s);
  }
  const components = fs.readdirSync(rel("public/ahv/components")).filter((f) => f.endsWith(".dc.html")).map((f) => `public/ahv/components/${f}`);
  return {
    views: [...views].sort().map(viewFile),
    scripts: [...scripts].sort().map((s) => "public" + s),
    components,
  };
}

/**
 * Parse one source file into located parts. Each part = {field, text, units}.
 * A view JSON has two translatable fields (template, logic); a script is JS; a
 * component is HTML (its <script> blocks, if any, are JS).
 */
export function parseFile(file, text) {
  if (file.startsWith("public/ahv/views/")) {
    const v = JSON.parse(text);
    const parts = [{ field: "template", text: v.template, units: htmlUnits(v.template) }];
    if (v.logic && v.logic.trim()) {
      const r = jsUnits(v.logic);
      parts.push({ field: "logic", text: v.logic, units: r.units, error: r.error });
    }
    return { kind: "view", json: v, parts };
  }
  if (file.endsWith(".js")) {
    const r = jsUnits(text);
    return { kind: "script", parts: [{ field: null, text, units: r.units, error: r.error }] };
  }
  return { kind: "html", parts: [{ field: null, text, units: htmlUnits(text) }] };
}
