// Read-only: lists every visible fixed/sticky element on a route after a 900px scroll (EF-25 stacking checks).
//   node tools/pinned-bars-probe.mjs "/how-to-reach/@390x844" ...  (local next start on :4471)
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const fs=require("fs"),p=require("path"); const s=p.resolve("../../node_modules/.pnpm"); const h=fs.readdirSync(s).find(d=>d.startsWith("playwright@")); const pw=require(p.join(s,h,"node_modules/playwright"));
const probe = () => [...document.querySelectorAll("body *")].filter((e) => {
  const c = getComputedStyle(e); if (c.position !== "sticky" && c.position !== "fixed") return false;
  const r = e.getBoundingClientRect(); return r.height > 20 && r.width > 100 && r.bottom > 0 && r.top < innerHeight && c.visibility !== "hidden" && c.display !== "none";
}).map((e) => { const r = e.getBoundingClientRect(); return { tag: e.tagName, id: e.id, cls: typeof e.className === "string" ? e.className.slice(0, 60) : "", pos: getComputedStyle(e).position, top: Math.round(r.top), h: Math.round(r.height), style: (e.getAttribute("style") || "").slice(0, 140), attrs: [...e.attributes].map((a) => a.name).filter((n) => n.startsWith("data-")).join(","), text: e.innerText.replace(/\s+/g, " ").slice(0, 100) }; });
const b = await pw.chromium.launch();
for (const spec of process.argv.slice(2)) {
  const [route, vp] = spec.split("@"); const [w, hgt] = vp.split("x");
  const pg = await b.newPage({ viewport: { width: +w, height: +hgt } });
  await pg.goto("http://localhost:4471" + route, { waitUntil: "networkidle" });
  await pg.waitForTimeout(1200); await pg.mouse.wheel(0, 900); await pg.waitForTimeout(800);
  console.log(spec, JSON.stringify(await pg.evaluate(probe), null, 1));
  await pg.close();
}
await b.close();
