#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const ROOT = resolve("sites");
const FONT_ASSET_ROOT = resolve("packages/ui/fonts/assets");
const FONT_SOURCES = resolve("packages/ui/fonts/SOURCES.md");
const SOURCE_EXTENSIONS = new Set([".css", ".html", ".js", ".jsx", ".mjs", ".scss", ".ts", ".tsx"]);
const GENERATED_DIRECTORIES = new Set([".next", "coverage", "dist", "node_modules", "out"]);
const FORBIDDEN = [
  { label: "next/font/google", pattern: /next\/font\/google/ },
  { label: "Google Fonts stylesheet", pattern: /fonts\.googleapis\.com/i },
  { label: "Google Fonts asset", pattern: /fonts\.gstatic\.com/i },
];
const LOCAL_BUILD_SHIMS = new Map([
  [
    "sites/kairalicenters.com/app/layout.tsx",
    {
      packageJson: "sites/kairalicenters.com/package.json",
      buildCommand: "node scripts/build-with-local-fonts.mjs",
      wrapper: "sites/kairalicenters.com/scripts/build-with-local-fonts.mjs",
      responses: "sites/kairalicenters.com/local-font-responses.cjs",
      assets: ["kurale-400.woff2", "asap-latin.woff2", "lato-300.woff2", "lato-400.woff2", "lato-700.woff2"],
    },
  ],
]);

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !GENERATED_DIRECTORIES.has(entry.name)) {
      yield* walk(path);
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name))) {
      yield path;
    }
  }
}

const violations = [];

for await (const file of walk(ROOT)) {
  const content = await readFile(file, "utf8");
  const repoPath = relative(process.cwd(), file);
  for (const { label, pattern } of FORBIDDEN) {
    if (pattern.test(content)) {
      if (label === "next/font/google" && LOCAL_BUILD_SHIMS.has(repoPath)) continue;
      violations.push(`${repoPath}: ${label}`);
    }
  }
}

for (const [source, shim] of LOCAL_BUILD_SHIMS) {
  const packageJson = JSON.parse(await readFile(resolve(shim.packageJson), "utf8"));
  if (packageJson.scripts?.build !== shim.buildCommand) {
    violations.push(`${source}: local-font build wrapper is not the package build command`);
  }

  const wrapper = await readFile(resolve(shim.wrapper), "utf8");
  if (!wrapper.includes("NEXT_FONT_GOOGLE_MOCKED_RESPONSES")) {
    violations.push(`${shim.wrapper}: local-font response hook is missing`);
  }

  const responses = await readFile(resolve(shim.responses), "utf8");
  for (const asset of shim.assets) {
    if (!responses.includes(asset)) {
      violations.push(`${shim.responses}: ${asset} is not mapped`);
    }
  }
}

const provenance = await readFile(FONT_SOURCES, "utf8");
const documentedAssets = new Map(
  [...provenance.matchAll(/^\| `([^`]+\.woff2)` \|.*\| `([a-f0-9]{64})` \|$/gm)].map(
    ([, file, sha256]) => [file, sha256],
  ),
);
const assetFiles = (await readdir(FONT_ASSET_ROOT)).filter((file) => file.endsWith(".woff2"));

for (const file of assetFiles) {
  const expected = documentedAssets.get(file);
  if (!expected) {
      violations.push(`packages/ui/fonts/assets/${file}: missing from SOURCES.md`);
    continue;
  }
  const actual = createHash("sha256")
    .update(await readFile(join(FONT_ASSET_ROOT, file)))
    .digest("hex");
  if (actual !== expected) {
    violations.push(`packages/ui/fonts/assets/${file}: SHA-256 differs from SOURCES.md`);
  }
}

for (const file of documentedAssets.keys()) {
  if (!assetFiles.includes(file)) {
    violations.push(`packages/ui/fonts/assets/${file}: documented asset is missing`);
  }
}

if (violations.length > 0) {
  console.error("font-independence: remote font build/runtime dependencies found:");
  for (const violation of violations) console.error(`  - ${violation}`);
  process.exit(1);
}

console.log("font-independence: repository-local site fonts only — PASS");
