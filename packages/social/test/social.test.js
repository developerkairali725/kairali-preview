// @kairali/social — source-contract tests. SocialLinks is a server TSX
// component, so (house pattern: @kairali/chat) it is asserted at source
// level: the verified handle set, the plain-links consent contract, and the
// one-config-file law must never silently drift.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const configSrc = readFileSync(join(SRC_DIR, "config.ts"), "utf8");
const componentSrc = readFileSync(join(SRC_DIR, "SocialLinks.tsx"), "utf8");

/** Parse the { id, …, href } entries out of config.ts — same extraction the
 * repo lint uses, so the tests exercise the real contract surface. */
function parseProfiles(src) {
  const entries = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"/g;
  for (let m; (m = re.exec(src)); ) entries.push({ id: m[1], href: m[2] });
  return entries;
}

const profiles = parseProfiles(configSrc);

test("the canonical KAG set is exactly the four delivered profiles (D-20260720-39)", () => {
  assert.deepEqual(
    profiles.map((p) => p.id),
    ["x", "youtube", "linkedin", "facebook"],
  );
});

test("every href is https and on the expected profile host — never invented", () => {
  const expectedHosts = {
    x: "x.com",
    youtube: "www.youtube.com",
    linkedin: "www.linkedin.com",
    facebook: "www.facebook.com",
  };
  for (const { id, href } of profiles) {
    const url = new URL(href);
    assert.equal(url.protocol, "https:", `${id}: not https`);
    assert.equal(url.hostname, expectedHosts[id], `${id}: unexpected host ${url.hostname}`);
    assert.notEqual(url.pathname, "/", `${id}: bare host, not a profile URL`);
  }
});

test("the canonical handles are the ones shipped (Anupam 20 Jul 2026 true-up)", () => {
  const byId = Object.fromEntries(profiles.map((p) => [p.id, p.href]));
  assert.equal(byId.x, "https://x.com/Kairali_Group");
  assert.equal(byId.youtube, "https://www.youtube.com/@kairaliayurvedagroup");
  assert.equal(byId.linkedin, "https://www.linkedin.com/company/kairali-ayurvedic-group");
  assert.equal(byId.facebook, "https://www.facebook.com/KairaliGroup");
});

test("plain links only: no scripts, embeds, or client JS in the component", () => {
  assert.ok(
    !/^\s*["']use client["']/m.test(componentSrc),
    "must stay a server component (zero client JS)",
  );
  for (const banned of ["<script", "<iframe", "fetch(", "XMLHttpRequest", "navigator."]) {
    assert.ok(!componentSrc.includes(banned), `plain-links contract violated: ${banned}`);
  }
});

test("external-link hygiene: target=_blank always pairs with noopener noreferrer", () => {
  assert.match(componentSrc, /rel="noopener noreferrer"/);
  assert.match(componentSrc, /target="_blank"/);
});

test("one config file: the component itself hardcodes no profile URL", () => {
  assert.ok(!componentSrc.includes("https://"), "URLs live in config.ts ONLY (one-file true-up)");
  assert.ok(componentSrc.includes("SOCIAL_PROFILES.map"), "component must render from the config");
});

test("links carry data-social, and deliberately NOT data-cta (A4 budget)", () => {
  assert.match(componentSrc, /data-social=\{p\.id\}/);
  assert.ok(!componentSrc.includes("data-cta="), "social links are not conversion CTAs");
});
