// Owner decision 28 Sep 2026 ("Owner-confirmed closed vacancy — Business Development Manager", deliverable
// OWNER-DECISIONS-LATEST.md): the role is NOT open. The page stays served (no redirect assumed) with an honest closed
// status; the role-specific application form and apply contact are withdrawn; /careers/ no longer lists it; "Apply
// Now" leaves the title. The job-form transport, field names and consent in the views are NOT touched — the form
// is only not rendered while the dataset says applications are closed. There is no JobPosting schema to remove.
// Idempotent; exact-count assertions, all-or-nothing write.
//   node tools/repair-bdm-vacancy-closed.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const ROUTE = "/jobs/business-development-manager/";
const TITLE_OLD = "Apply Now | Ayurveda Retreat Job | Careers | Massage Therapists";
const TITLE_NEW = "Business Development Manager — Vacancy Closed | Careers | Kairali";
const OG_OLD = "\"type\":\"article\",\"title\":\"Business Development Manager ( 5 to 10 Years )\"";
const OG_NEW = "\"type\":\"article\",\"title\":\"Business Development Manager ( 5 to 10 Years ) — vacancy closed\"";
const pending = []; const log = []; let bad = 0;
const fail = (m) => { bad++; console.error("FAIL " + m); };
const edit = (file, fn) => { const before = fs.readFileSync(file, "utf8"); const after = fn(before); if (after !== before) pending.push([file, after]); };
const once = (src, from, to, file) => { const n = src.split(from).length - 1; if (n === 1) { log.push(`${file}: ${from.slice(0, 50)}…`); return src.replace(from, () => to); } if (src.includes(to)) return src; fail(`${file}: expected 1× "${from.slice(0, 60)}", found ${n}`); return src; };

// 1. dataset: closed flags, no apply contact section, honest title
edit("public/ahv/assets/enquiry-family-data.js", (s) => {
  if (!s.includes("\"closed\":true,\"applicationsOpen\":false")) s = once(s, "\"variant\":\"job-detail\",", "\"variant\":\"job-detail\",\"closed\":true,\"applicationsOpen\":false,", "enquiry-family-data.js");
  const i = s.indexOf(",{\"heading\":\"Contact Details\""), j = s.indexOf("],\"applyH2\":", i);
  if (i > -1 && j > i && s.slice(i, j).includes("career@kairali.com")) { s = s.slice(0, i) + s.slice(j); log.push("enquiry-family-data.js: Contact Details (apply channel) section removed"); }
  else if (i > -1) fail("Contact Details section shape changed");
  s = once(s, TITLE_OLD, TITLE_NEW, "enquiry-family-data.js title");
  s = once(s, OG_OLD, OG_NEW, "enquiry-family-data.js og:title");
  return s;
});
// 2. route manifest mirrors the dataset metadata
edit("english-candidate/route-manifest.json", (s) => {
  const m = JSON.parse(s); const r = m.routes.find((x) => x.path === ROUTE);
  if (!r) { fail("route missing from manifest"); return s; }
  if (r.metadata.title === TITLE_OLD) r.metadata.title = TITLE_NEW;
  if (r.metadata.ogTitle === "Business Development Manager ( 5 to 10 Years )") r.metadata.ogTitle += " — vacancy closed";
  return JSON.stringify(m, null, 1) + (s.endsWith("\n") ? "\n" : "");
});
// 3. /careers/: the only listed vacancy is closed — the listing becomes a plain statement
edit("public/ahv/assets/article-family-data.js", (s) => {
  const a = s.indexOf("{\"kind\": \"job\", \"ptr\": \"/sections/9/c/1/c/1\"");
  if (a < 0) { if (!s.includes("No vacancies are open at the moment.")) fail("careers job block not found"); return s; }
  const b = s.indexOf("}}]", a); // job block ends with the "more" object, then the blocks array closes
  if (b < 0 || !s.slice(a, b).includes(ROUTE)) { fail("careers job block shape changed"); return s; }
  const para = "{\"kind\": \"para\", \"ptr\": \"/owner-decision/20260928-bdm-closed\", \"tree\": [{\"k\": \"t\", \"v\": \"No vacancies are open at the moment.\"}], \"text\": \"No vacancies are open at the moment.\"}";
  log.push("article-family-data.js: /careers/ listing → 'No vacancies are open at the moment.'");
  return s.slice(0, a) + para + s.slice(b + 2);
});
// 4. views: the application aside renders only while applications are open; a closed panel of the same shape otherwise
for (const v of ["desktop", "mobile"]) {
  const file = `public/ahv/views/ahv-page-enquiry-${v}.json`;
  edit(file, (raw) => {
    const view = JSON.parse(raw); let t = view.template;
    if (t.includes("data-job-closed=\"true\"")) return raw;
    const a = t.indexOf("<aside aria-labelledby=\"job-apply-h\""), e = t.indexOf("</aside>", a);
    if (a < 0 || e < 0) { fail(`${file}: job aside not found`); return raw; }
    const aside = t.slice(a, e + 8);
    const asideStyle = aside.match(/^<aside aria-labelledby="job-apply-h" style="([^"]*)"/)[1];
    const h2Style = aside.match(/<h2 id="job-apply-h" style="([^"]*)"/)[1];
    const closed = `<sc-if value="{{ J.closed }}" hint-placeholder-val="{{ false }}">\n  <aside aria-labelledby="job-closed-h" data-job-closed="true" style="${asideStyle}">\n    <h2 id="job-closed-h" style="${h2Style}">Vacancy closed</h2>\n    <p role="status" style="margin:0 0 16px;font-size:17px;line-height:1.65">This vacancy is closed and we are not accepting applications for this role. The job description is kept for reference.</p>\n    <p style="margin:0;font-size:17px;line-height:1.65"><a href="https://ayurvedichealingvillage.com/careers/" style="color:#006038;font-weight:700">Careers at Kairali</a></p>\n  </aside>\n</sc-if>`;
    t = t.slice(0, a) + `<sc-if value="{{ J.applicationsOpen }}" hint-placeholder-val="{{ true }}">\n` + aside + `\n</sc-if>\n` + closed + t.slice(e + 8);
    view.template = t; log.push(`${file}: application aside gated on J.applicationsOpen; closed panel added`);
    return JSON.stringify(view, null, 1) + (raw.endsWith("\n") ? "\n" : "");
  });
}
// 5. the site tree (sitemap page, rail) keeps the historical page but says it is closed
edit("english-candidate/site-tree-overrides.json", (s) => {
  const o = JSON.parse(s); if (o.relabels.some((r) => r.path === ROUTE)) return s;
  o.relabels.push({ path: ROUTE, label: "Business Development Manager (vacancy closed)", why: "Owner decision 28 Sep 2026: the vacancy is not open; the page stays accessible with an honest closed status (no redirect assumed)." });
  log.push("site-tree-overrides.json: relabel → '(vacancy closed)'");
  return JSON.stringify(o, null, 1) + (s.endsWith("\n") ? "\n" : "");
});
if (bad) { console.error(`${bad} failure(s) — nothing written`); process.exit(1); }
if (!CHECK) for (const [f, s] of pending) fs.writeFileSync(f, s);
console.log((CHECK ? "[check] " : "") + (log.join("\n") || "already applied"));
