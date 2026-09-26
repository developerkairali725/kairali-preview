/** Read-only: the first (hero) image a route's own dataset record carries — src, alt, width, height. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
export function routeHero(SITE, route) {
  const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));
  const r = manifest.routes.find((x) => x.path === route);
  if (!r || !r.dataset) return null;
  const w = {}; vm.runInNewContext(fs.readFileSync(path.join(SITE, "public/ahv", r.dataset), "utf8"), { window: w, document: {}, location: {} }, { timeout: 5000 });
  const D = Object.values(w)[0];
  const recs = D.routes || D.records || [];
  const rec = recs.find((x) => x.path === route);
  if (!rec) return null;
  let hit = null;
  const walk = (o) => { if (hit || !o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(walk); return; } if (typeof o.src === "string" && /\.(webp|jpe?g|png)$/i.test(o.src) && !/lotus|logo|icon/i.test(o.src)) { hit = { src: o.src, alt: o.alt ?? "", width: o.width ?? null, height: o.height ?? null }; return; } for (const k of Object.keys(o)) walk(o[k]); };
  walk(rec.heroImg || rec.heroImage || rec.hero || rec.components || rec);
  return hit;
}
