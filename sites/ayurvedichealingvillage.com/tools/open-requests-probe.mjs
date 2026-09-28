// Read-only: requests still open / failed 12s after load on a route (why prerender never reaches network idle). node tools/open-requests-probe.mjs /hi/all-programs/
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const fs=require("fs"),p=require("path"); const s=p.resolve("../../node_modules/.pnpm"); const h=fs.readdirSync(s).find(d=>d.startsWith("playwright@")); const pw=require(p.join(s,h,"node_modules/playwright"));
const b = await pw.chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 900 }, isMobile: true });
const open = new Map(); const bad = [];
pg.on("request", (r) => open.set(r, Date.now()));
pg.on("requestfinished", (r) => open.delete(r)); pg.on("requestfailed", (r) => { open.delete(r); bad.push("FAILED " + r.url()); });
pg.on("response", (r) => { if (r.status() >= 400) bad.push(r.status() + " " + r.url()); });
await pg.goto("http://localhost:4471" + process.argv[2], { waitUntil: "load", timeout: 60000 }); await pg.waitForTimeout(12000);
console.log(process.argv[2], "still open:", [...open.keys()].map((r) => r.resourceType() + " " + r.url().slice(0, 140)), "\nbad:", bad.slice(0, 5));
await b.close();
