#!/usr/bin/env node
/**
 * AHV — /enquiry-form/ served in the designed contact layout (owner, 23 Sep
 * 2026: "enquiry-form — you never fixed this, it was supposed to be in a family
 * but it still looks … incomplete").
 *
 * The enquiry family has three designed variants; /enquiry-form/ was bound to
 * the "legacy-enquiry" one, which prints the captured WordPress page as a
 * flat run of paragraphs ("Six ways … How / Opens … Recommended") above a bare
 * form. /contact-us/ is the SAME content designed properly: router cards,
 * channel cards, the short message form, Priya, visit details, the founder's
 * word, FAQ.
 *
 * This rebinds /enquiry-form/ to the "contact" variant using /contact-us/'s
 * designed sections as its payload and the enquiry page's OWN identity:
 * its path, slug, metadata, breadcrumb, H1 ("Enquire Now") and the lede its
 * legacy body already carries. No new copy. Locked facts only (they are the
 * contact record's). Idempotent (marked enquiryAsContact).
 *
 *   node tools/repair-enquiry-form.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(SITE, "public/ahv/assets/enquiry-family-data.js");
const DRY = process.argv.includes("--dry");

const w = {};
vm.runInNewContext(fs.readFileSync(FILE, "utf8"), { window: w });
const D = Object.values(w)[0];
const contact = D.routes.find((r) => r.path === "/contact-us/");
const i = D.routes.findIndex((r) => r.path === "/enquiry-form/");
if (!contact || i < 0) throw new Error("records missing");
const legacy = D.routes[i];
if (legacy.enquiryAsContact) { console.log("as-is  /enquiry-form/"); process.exit(0); }

// the page's own words, read from its legacy body (never typed here)
const text = JSON.stringify(legacy);
const lede = (text.match(/"(Whether you have a quick question[^"]*?)"/) || [])[1] || null;
const eyebrow = (text.match(/"(Patient Enquiry[^"]{0,40})"/) || [])[1] || "Patient enquiry";
const h1 = legacy.h1 || "Enquire Now";

const R = JSON.parse(JSON.stringify(contact));
R.path = legacy.path; R.slug = legacy.slug; R.variant = "contact";
R.metadata = legacy.metadata; R.breadcrumb = legacy.breadcrumb; R.breadcrumbSchemaExpected = legacy.breadcrumbSchemaExpected;
R.sourceSha256 = legacy.sourceSha256; R.capturedHTMLSha256 = legacy.capturedHTMLSha256; R.governance = legacy.governance;
R.h1 = h1; R.eyebrow = eyebrow;
if (lede) R.sub = lede;
R.hero = legacy.hero || contact.hero; R.heroImage = legacy.heroImage || contact.heroImage; R.lotus = legacy.lotus ?? contact.lotus;
R.legacyRecord = { variant: legacy.variant, note: "the legacy-enquiry payload this route served before 23 Sep 2026, kept for provenance", body: legacy.body, enquiry: legacy.enquiry, sourceTrail: legacy.sourceTrail };
R.enquiryAsContact = { generated: new Date().toISOString(), from: "/contact-us/", by: "tools/repair-enquiry-form.mjs", lede: !!lede, eyebrow };
D.routes[i] = R;

const src = fs.readFileSync(FILE, "utf8");
const start = src.indexOf("{", src.indexOf("= {")), end = src.lastIndexOf("}") + 1;
if (!DRY) fs.writeFileSync(FILE, src.slice(0, start) + JSON.stringify(D) + src.slice(end));
console.log(`${DRY ? "[dry] " : "fixed  "}/enquiry-form/: contact variant · h1 "${h1}" · eyebrow "${eyebrow}" · lede ${lede ? "from its own body" : "(contact's)"}`);
