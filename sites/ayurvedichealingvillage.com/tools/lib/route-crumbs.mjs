/**
 * Owner-authorised breadcrumb of every served route — the ONE parent/child source
 * the site tree (tools/build-site-tree.mjs) is built from. Read from the dataset
 * record (`crumbs` / `breadcrumb`) or, for view-owned routes, the view's own
 * breadcrumb nav. Templated breadcrumbs ({{ }}) are skipped (their dataset wins).
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function loadDataset(file) {
  const w = {};
  vm.runInNewContext(fs.readFileSync(file, "utf8"), { window: w, document: {}, location: {} }, { timeout: 5000 });
  return Object.values(w)[0];
}
export const decode = (s) => String(s).replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
export const relPath = (p) => String(p).replace(/^https?:\/\/(www\.)?ayurvedichealingvillage\.com/, "");

export function routeCrumbs(SITE, manifest) {
  const ASSETS = path.join(SITE, "public/ahv/assets"), VIEWS = path.join(SITE, "public/ahv/views");
  const crumbs = new Map(), records = new Map();
  for (const file of fs.readdirSync(ASSETS).filter((f) => /-data\.js$/.test(f))) {
    let D; try { D = loadDataset(path.join(ASSETS, file)); } catch { continue; }
    const recs = D && (D.routes || D.records);
    if (!Array.isArray(recs)) continue;
    for (const R of recs) {
      if (!R || !R.path) continue;
      if (!records.has(R.path)) records.set(R.path, R);
      const c = Array.isArray(R.crumbs) ? R.crumbs : Array.isArray(R.breadcrumb) ? R.breadcrumb : null;
      if (c && c.length >= 2 && !crumbs.has(R.path)) crumbs.set(R.path, c.map((x) => ({ path: relPath(x.path), label: decode(x.label) })));
    }
  }
  for (const r of manifest.routes) {
    if (crumbs.has(r.path) || !r.desktopView) continue;
    const f = path.join(VIEWS, r.desktopView + ".json");
    if (!fs.existsSync(f)) continue;
    const T = JSON.parse(fs.readFileSync(f, "utf8")).template;
    const b = T.match(/<nav aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/);
    if (!b) continue;
    const links = [...b[1].matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((x) => ({ path: relPath(x[1]), label: decode(x[2]) }));
    const cur = (b[1].match(/aria-current="page"[^>]*>([^<]+)</) || [])[1];
    if (!links.length || !cur || links.some((l) => /\{\{/.test(l.path + l.label)) || /\{\{/.test(cur)) continue;
    crumbs.set(r.path, [...links, { path: r.path, label: decode(cur) }]);
  }
  return { crumbs, records };
}
