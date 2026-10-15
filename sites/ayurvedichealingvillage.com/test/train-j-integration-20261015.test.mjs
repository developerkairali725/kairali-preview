// Train J integration (15 Oct 2026): batches J1, J2 and J3 merged on the Train I head 00e944e44. Checks that the shared
// file's integrated bytes peel exactly to each batch's recorded after-bytes, that the whole-Train-J peel reaches the Train I
// head for every batch file, and that no third state is accepted (fixtures/train-j-integration-20261015.*).
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { TRAIN_J1 } from "./fixtures/train-j1-20261015.mjs";
import { TRAIN_J2 } from "./fixtures/train-j2-20261015.mjs";
import { TRAIN_J3 } from "./fixtures/train-j3-20261015.mjs";
import { TRAIN_J_INTEGRATION, peelTrainJ2OverJ1, peelTrainJ1UnderJ2, peelTrainJSource } from "./fixtures/train-j-integration-20261015.mjs";
import { peelTrainNTail } from "./fixtures/train-n-integration-20261015.mjs";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const BASE = "00e944e4440c4b1710bffc29cc7c2bea8b385fdc";
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const atBase = (p) => {
  try { return execFileSync("git", ["show", `${BASE}:sites/ayurvedichealingvillage.com/${p}`], { cwd: SITE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 27 }); } catch { return null; }
};

test("the shared files are exactly the files more than one Train J batch recorded", () => {
  const batches = [TRAIN_J1, TRAIN_J2, TRAIN_J3].map((t) => new Set(Object.keys(t.files)));
  const shared = [...new Set(batches.flatMap((s) => [...s]))].filter((p) => batches.filter((s) => s.has(p)).length > 1).sort();
  assert.deepEqual(Object.keys(TRAIN_J_INTEGRATION.files).sort(), shared);
  assert.equal(TRAIN_J_INTEGRATION.base, BASE);
});

test("integrated bytes peel exactly to each batch's after-bytes; any other state passes through or fails", () => {
  for (const [p, e] of Object.entries(TRAIN_J_INTEGRATION.files)) {
    const now = read(p);
    assert.equal(sha(now), e.integratedSHA256, `${p}: current bytes are the integrated bytes`);
    assert.equal(e.j1AfterSHA256, TRAIN_J1.files[p].afterSHA256, p);
    assert.equal(e.j2AfterSHA256, TRAIN_J2.files[p].afterSHA256, p);
    assert.equal(e.headSHA256, TRAIN_J1.files[p].beforeSHA256, p);
    assert.equal(e.headSHA256, TRAIN_J2.files[p].beforeSHA256, p);
    const j1 = peelTrainJ2OverJ1(p, now), j2 = peelTrainJ1UnderJ2(p, now);
    assert.equal(sha(j1), e.j1AfterSHA256, `${p}: Train J2 removed gives the Train J1 bytes`);
    assert.equal(sha(j2), e.j2AfterSHA256, `${p}: Train J1 removed gives the Train J2 bytes`);
    assert.equal(peelTrainJ2OverJ1(p, j1), j1, `${p}: J1 bytes pass through`);
    assert.equal(peelTrainJ1UnderJ2(p, j2), j2, `${p}: J2 bytes pass through`);
    assert.equal(peelTrainJ2OverJ1(p, now + " "), now + " ", `${p}: a third state is not integrated bytes`);
    const head = peelTrainJSource(p, now);
    assert.equal(sha(head), e.headSHA256, `${p}: the whole Train J peel gives the Train I head`);
    const base = atBase(p);
    if (base !== null) assert.equal(sha(base), e.headSHA256, `${p}: headSHA256 is git ${BASE.slice(0, 9)}`);
  }
});

test("search-index: the integration only composes the two batches' recorded edits (Baoli entry gone, two past-retreat cards)", () => {
  const p = "public/ahv/search-index.json";
  const idx = JSON.parse(read(p));
  assert.ok(!idx.pages.some((x) => x.route === "/the-baoli-special-deal/"));
  const e = TRAIN_J_INTEGRATION.files[p];
  for (const r of e.j2OverJ1.slice(1)) assert.ok(TRAIN_J2.files[p].replacements.some((q) => q.before === r.before && q.after === r.after), r.row);
  assert.deepEqual(e.j1UnderJ2, [TRAIN_J1.files[p].replacements.at(-1)]);
  execFileSync(process.execPath, ["tools/build-search-index.mjs", "--check", "--allow-expired"], { cwd: SITE, stdio: "pipe" });
});

test("every Train J batch file peels to the Train I head through the whole-Train-J hook", () => {
  for (const t of [TRAIN_J1, TRAIN_J2, TRAIN_J3])
    for (const [p, e] of Object.entries(t.files)) {
      if (!fs.existsSync(new URL(`../${p}`, import.meta.url))) continue;
      assert.equal(sha(peelTrainJSource(p, peelTrainNTail(p, read(p)))), e.beforeSHA256, `${t.train ?? ""} ${p}`);
    }
});
