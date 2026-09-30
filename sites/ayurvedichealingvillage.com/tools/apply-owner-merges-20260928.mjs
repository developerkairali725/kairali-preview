// The six owner-approved merges of 28 Sep 2026 (WOPS-AHV-CONTENT-DUPLICATION-AUDIT-20260928-001,
// IMPLEMENTATION-QUEUE.json "approvedMergeDirections"; owner comments override earlier radio choices). Each source
// was compared with its destination before the 301 (served snapshots, main text): the two privacy pages and the
// training-programs page carry no text the destination lacks; /enquiry-form/ renders the SAME contact form
// (data-form="contact", same field names, same programme select, same consent) as /contact-us/ and differs only in
// its intro line; /our-story/'s extra blocks are the shared maps/trust/CTA strips; /things-to-do-in-property/'s
// eight activity paragraphs are already on /things-to-do/ (wording variants), so its children move there.
// Single hop, always: /enquiry-form-old/ (formerly → /enquiry-form/) now goes straight to /contact-us/.
// Query strings survive a Next.js redirect, so /enquiry-form/?programme=treatment lands on
// /contact-us/?programme=treatment and the TF-18 preselect still applies; no form field, endpoint or consent
// changes. Kept distinct on the owner's word: both Prav/Simona retreats, the filtered programme finders, the Vikash
// landing pages, the Kerala activities subpage, AboutUs vs awards. Idempotent; every file written back in its own
// serialisation.   node tools/apply-owner-merges-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const OWNER = "2026-09-28 owner content-duplication decisions (IMPLEMENTATION-QUEUE.json, WOPS-AHV-CONTENT-DUPLICATION-AUDIT-20260928-001)";
// GSC: launches/ayurvedichealingvillage.com/baseline/raw/gsc-ui-export-2026-07-19/Pages.csv (July baseline; re-pull before relying)
const MERGES = [
  ["/privacy-policy/", "/new-privacy-policy/", "AHV-DUP-001/002", 2, 427, "Owner named /new-privacy-policy/ the final privacy document ('merge it with this … 301 these two'). Measured 28 Sep: every line of this page's text is on the destination (identical notice, revision 25 Sep 2026)."],
  ["/privacy-statement/", "/new-privacy-policy/", "AHV-DUP-002/003", 0, 473, "Owner named /new-privacy-policy/ the final privacy document. Measured 28 Sep: the text is identical to the destination apart from the page title."],
  ["/enquiry-form/", "/contact-us/", "AHV-DUP-004", 7, 2726, "Owner kept /contact-us/. Both pages render the same contact form (same fields, programme select, consent and transport); the only difference is the intro line. Query strings are carried by the redirect, so ?programme= preselection still works."],
  ["/ayurveda-training-programs/", "/ayurveda-training-programme/", "AHV-DUP-006", 48, 2983, "Owner kept /ayurveda-training-programme/ (the canonical already pointed there). The destination links every course this page listed; no text is lost. NOTE for the owner: this source had more July clicks (48) than the destination (19); the 301 carries them."],
  ["/our-story/", "/about-us/", "AHV-DUP-008", 0, 106, "Owner merged Our Story into About Us (canonical already pointed there; DUP-046 asks for a separate awards family, not a reversal). The only blocks the destination lacks are the shared maps, trust strip and enquiry prompt carried by many pages."],
  ["/things-to-do-in-property/", "/things-to-do/", "AHV-DUP-011", 1, 349, "Owner kept /things-to-do/. Its in-village section already carries this page's introduction and all eight activity descriptions; the in-village activity pages move under /things-to-do/ in the site tree."],
];
const SOURCES = new Set(MERGES.map((m) => m[0]));
const log = [];
const rw = (file, next, prev) => { if (next !== prev) { log.push("updated " + file); if (!CHECK) fs.writeFileSync(file, next); } };
const jsonSer = (s) => { const D = JSON.parse(s); const f = [(o) => JSON.stringify(o, null, 2) + "\n", (o) => JSON.stringify(o, null, 2), (o) => JSON.stringify(o, null, 1) + "\n", (o) => JSON.stringify(o, null, 1), (o) => JSON.stringify(o)].find((g) => g(D) === s); if (!f) throw new Error("unknown JSON serialisation"); return [D, f]; };

// 1. redirect map
{ const F = "english-candidate/redirect-map.json", s = fs.readFileSync(F, "utf8"); const [M, ser] = jsonSer(s);
  for (const [from, to, id, clicks, impressions, reason] of MERGES) {
    M.redirects[from] = { to, reason, gsc: { clicks, impressions, basis: "July 2026 baseline; re-pull before relying (Search Console property note)" }, ownerApproval: `${OWNER} ${id}` };
  }
  const old = M.redirects["/enquiry-form-old/"];
  if (old && old.to !== "/contact-us/") { old.to = "/contact-us/"; old.reason = "Superseded duplicate of the enquiry form. Single hop straight to /contact-us/ since /enquiry-form/ itself merged there (owner, 28 Sep 2026, AHV-DUP-004)."; }
  for (const [s2, r] of Object.entries(M.redirects)) if (SOURCES.has(r.to)) throw new Error(`chain: ${s2} -> ${r.to}`);
  rw(F, ser(M), s); }

// 2. link aliases (runtime boot.ts pass + snapshot repair share this one list)
{ const F = "english-candidate/link-aliases.json", s = fs.readFileSync(F, "utf8"); const [A, ser] = jsonSer(s);
  for (const [from, to] of MERGES) A[from.replace(/\/$/, "")] = to;
  for (const k of Object.keys(A)) { const t = MERGES.find((m) => m[0] === A[k]); if (t) A[k] = t[1]; }
  rw(F, ser(A), s); }

// 3. site tree: drop the sources, re-parent the in-village activity pages, admit the governing privacy document
{ const F = "english-candidate/site-tree-overrides.json", s = fs.readFileSync(F, "utf8"); const [O, ser] = jsonSer(s);
  const why = (id, to) => `Owner-approved 301 consolidation into ${to} on 28 September 2026 (${id}).`;
  for (const [from, to, id] of MERGES) if (!O.drops.some((d) => d.path === from)) O.drops.push({ path: from, why: why(id, to) });
  for (const m of O.moves) if (m.parent === "/things-to-do-in-property/") { m.parent = "/things-to-do/"; m.why += " Re-parented 28 Sep 2026: /things-to-do-in-property/ merged into /things-to-do/ (AHV-DUP-011)."; }
  const kids = O.order["/things-to-do-in-property/"];
  if (kids) { O.order["/things-to-do/"] = [...kids, ...O.order["/things-to-do/"].filter((p) => p !== "/things-to-do-in-property/")]; delete O.order["/things-to-do-in-property/"]; }
  if (O.order["/contact-us/"]) O.order["/contact-us/"] = O.order["/contact-us/"].filter((p) => !SOURCES.has(p));
  if (!O.relabels.some((r) => r.path === "/new-privacy-policy/")) O.relabels.push({ path: "/new-privacy-policy/", label: "Privacy policy", why: "The governing privacy document since 28 Sep 2026 (AHV-DUP-001/002/003); its page title repeats the site name, so the rail and sitemap use the plain name the footer uses." });
  rw(F, ser(O), s); }
{ const F = "tools/build-site-tree.mjs", s = fs.readFileSync(F, "utf8");
  rw(F, s.replace("|search-results|new-privacy-policy|", "|search-results|"), s); }

// 4. footer: one privacy link, to the governing document (the statement is the same page now)
for (const F of ["public/ahv/components/AHV Chrome Footer.dc.html", "public/ahv/views/home-hi-fi-v4.json", "public/ahv/views/home-mobile.json"]) {
  const s = fs.readFileSync(F, "utf8"); let t = s;
  t = t.replace(/<a href=\\?"https:\/\/ayurvedichealingvillage\.com\/privacy-statement\/\\?"[^>]*>Privacy Statement<\/a> <span style=\\?"opacity:\.4\\?">·<\/span> /g, "");
  t = t.replace(/(href=\\?")(?:https:\/\/ayurvedichealingvillage\.com)?\/privacy-policy\//g, "$1/new-privacy-policy/");
  rw(F, t, s);
}

// 5. /things-to-do/: the "In Healing Village" card pointed at the merged page, which is now this page's own section
{ const F = "public/ahv/assets/collection-family-data.js", s = fs.readFileSync(F, "utf8"); const i = s.indexOf("{"), j = s.lastIndexOf("}");
  const D = JSON.parse(s.slice(i, j + 1)); const py = (v) => Array.isArray(v) ? "[" + v.map(py).join(", ") + "]" : v && typeof v === "object" ? "{" + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ": " + py(x)).join(", ") + "}" : JSON.stringify(v);
  const ser = [(o) => JSON.stringify(o), py, (o) => JSON.stringify(o, null, 1), (o) => JSON.stringify(o, null, 2)].find((f) => s.slice(0, i) + f(D) + s.slice(j + 1) === s); if (!ser) throw new Error(F + ": unknown serialisation");
  const r = D.routes.find((x) => x.path === "/things-to-do/");
  for (const c of r.components) {
    const k = (c.blocks || []).findIndex((b) => b.kind === "card" && JSON.stringify(b).includes('"/things-to-do-in-property/"'));
    if (k < 0) continue;
    (r.retiredCardsPrivate = r.retiredCardsPrivate || []).push(c.blocks[k]);
    r.retiredCardsNote = "28 Sep 2026 (AHV-DUP-011): the 'In Healing Village' card linked /things-to-do-in-property/, merged into this page; its content is this page's own first section.";
    c.blocks.splice(k, 1); log.push("/things-to-do/: retired the card linking the merged page");
  }
  rw(F, s.slice(0, i) + ser(D) + s.slice(j + 1), s); }

console.log((CHECK ? "[check] " : "") + (log.join("\n") || "already applied"));
