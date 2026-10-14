// PR429 integration (14 Oct 2026): two approved config changes met on PR429 after each pinned its configs against the
// same pre-PR428 base (8d59c69d6): the third guest films (third-guest-videos-20261014.json, cbb4c9212) and the PR428 staff
// roster / experience facts (already in PR429's base bf3f7ce70). Merging the third films (1aea453ac) made each config-hash
// test fail on the other's change, because each reversed only its own. These helpers reverse the other change exactly, asserting it is present first, so both
// original pin sets keep checking every other config byte.
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";

const json = (name) => JSON.parse(fs.readFileSync(new URL(`./${name}`, import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const monsoonCompatibility = json("staff-monsoon-config-compatibility.json");
const staffExperienceDelta = json("staff-experience-approved-delta.json");

/** The three campaigns that gained an approved third guest film (cbb4c9212): slug -> appended film id. */
export const THIRD_GUEST_FILMS = Object.freeze({ "wellness-kerala": "4x01PtWfNnk", "cleansing-centre": "4x01PtWfNnk", "lp-pain-management": "DcTMckQD3rc" });

/** Remove exactly the appended third card (asserting it is that film) from the three target campaigns. */
export function reverseThirdGuestFilmsConfig(slug, c) {
  const id = THIRD_GUEST_FILMS[slug];
  if (!id) return c;
  const films = c.page.stories.films;
  assert.equal(films.length, 3, `${slug}: two original cards plus the approved third`);
  assert.equal(films[2].href, `https://www.youtube.com/watch?v=${id}`, `${slug}: the appended card is the approved film`);
  films.pop();
  return c;
}

const byLocale = { de: "lp-behandlung-kerala", ru: "lp-treatment-kerala-ru" };
const originalTitles = { de: "Ihr Ayurveda-Arzt", ru: "Ваш аюрведический врач" };

/**
 * The PR428 staff roster / experience changes, reversed exactly as test/lp-v2-locale-physicians.test.mjs does (same
 * fixtures, same order): DE/RU back to the single physician and original heading, each tenure line back to its prior
 * approved text, and the accepted Monsoon compatibility fields back to `before`.
 */
export function reverseStaffRosterConfig(slug, c) {
  const locale = Object.keys(byLocale).find((l) => byLocale[l] === slug);
  if (locale) { c.doctors = c.doctors.filter((d) => d.id === "deepu-john"); c.page.doctors.heading = originalTitles[locale]; }
  for (const doctor of c.doctors) {
    const delta = staffExperienceDelta.sourceDelta["campaign-v2/data/doctors.ts"].find((d) => JSON.parse(d.new.trim().slice(8, -1)) === doctor.tenure);
    assert(delta, doctor.id);
    doctor.tenure = JSON.parse(delta.old.trim().slice(8, -1));
  }
  if (slug === monsoonCompatibility.slug) {
    assert.equal(sha(fs.readFileSync(new URL("./monsoon-2027-approved-delta.json", import.meta.url))), monsoonCompatibility.sourceDeltaFixtureSHA256);
    for (const { path, before, after } of monsoonCompatibility.changes) {
      let obj = c; for (const key of path.slice(0, -1)) obj = obj[key]; const key = path.at(-1);
      assert.deepEqual(obj[key], after, "Exact accepted Monsoon field: " + path.join("."));
      obj[key] = JSON.parse(JSON.stringify(before));
    }
  }
  return c;
}
