import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveSiteAppRoot } from "../lib/site-app-root.mjs";

function fixture(t, appRoot) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "factory app-root-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const site = join(root, "sites", "example.com");
  mkdirSync(join(site, "site"), { recursive: true });
  writeFileSync(join(site, "package.json"), "{}");
  writeFileSync(join(site, "site", "package.json"), "{}");
  const configure = (value) => writeFileSync(join(site, "site.config.json"), JSON.stringify(
    value === undefined ? { domain: "example.com" } : { domain: "example.com", appRoot: value },
  ));
  configure(appRoot);
  return { root, site, configure, get: () => resolveSiteAppRoot("sites/example.com", { root }) };
}

test("ordinary fleet sites keep their root; nested apps resolve inside the same identity", (t) => {
  const f = fixture(t);
  assert.equal(f.get(), f.site);
  f.configure(".");
  assert.equal(f.get(), f.site);
  f.configure("site");
  assert.equal(f.get(), join(f.site, "site"));
});

test("invalid appRoot values and sibling/absolute paths fail instead of falling back", (t) => {
  const f = fixture(t);
  for (const value of [null, 3, {}, "", "..", "../other.com", "site/../../other.com", "/tmp", "site\\child", "site//child", "./site"]) {
    f.configure(value);
    assert.throws(f.get, /appRoot/, JSON.stringify(value));
  }
  f.configure("missing");
  assert.throws(f.get, /does not exist/);
  mkdirSync(join(f.site, "empty"));
  f.configure("empty");
  assert.throws(f.get, /package.json/);
  writeFileSync(join(f.site, "file"), "not a directory");
  f.configure("file");
  assert.throws(f.get, /directory/);
});

test("symlink escapes cannot cause one site's matrix row to test another app", (t) => {
  const f = fixture(t, "escaped");
  const sibling = join(f.root, "sites", "other.com");
  mkdirSync(sibling);
  writeFileSync(join(sibling, "package.json"), "{}");
  symlinkSync(sibling, join(f.site, "escaped"), "dir");
  assert.throws(f.get, /inside this site/);
  symlinkSync(f.site, join(f.root, "sites", "alias.com"), "dir");
  assert.throws(() => resolveSiteAppRoot("sites/alias.com", { root: f.root }), /symlink/);
});

test("SITE identity itself cannot escape the fleet sites directory", (t) => {
  const f = fixture(t);
  for (const value of ["../example.com", "/sites/example.com", "sites/../example.com", "sites/example.com/site", "sites/example.com;false"]) {
    assert.throws(() => resolveSiteAppRoot(value, { root: f.root }), /Invalid fleet site path/);
  }
});
