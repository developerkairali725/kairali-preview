#!/usr/bin/env node
// Build only affected registered sites and their dependencies.
import { realpathSync, readdirSync, readFileSync, existsSync, appendFileSync } from 'node:fs';
import { resolve, relative, join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { resolveSiteAppRoot } from './lib/site-app-root.mjs';
// Existing personal/internal exceptions affect browser QA only, not builds.
export const BROWSER_EXEMPT = new Set(['sites/abhilashkr', 'sites/kairali.ai']);

export function packages(root) {
  root = realpathSync(root);
  const result = [];
  for (const parent of ['sites', 'packages']) {
    for (const entry of readdirSync(join(root, parent), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const site = `${parent}/${entry.name}`;
      // Unregistered archived/rebuild directories do not enter the live fleet.
      // A change to one is rejected below instead of silently being untested.
      if (parent === 'sites' && !existsSync(join(root, site, 'site.config.json'))) continue;
      if (parent === 'sites') {
        const cfg = JSON.parse(readFileSync(join(root, site, 'site.config.json'), 'utf8'));
        if (site === 'sites/whyayurveda.org' && !existsSync(join(root, site, cfg.appRoot || '.', 'package.json'))) continue;
      }
      const dir = parent === 'sites' ? resolveSiteAppRoot(site, { root }) : join(root, site);
      if (!existsSync(join(dir, 'package.json'))) continue;
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      result.push({ name: pkg.name, path: relative(root, dir).replaceAll('\\', '/'), site: parent === 'sites' ? site : null,
        dependencies: Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies }) });
    }
  }
  // App-relative shared assets (e.g. next/font paths) are dependencies too.
  for (const pkg of result.filter(p => p.site)) {
    const sourceDir = join(root, pkg.path, 'app');
    const inputs = existsSync(sourceDir) ? sourcePackagePaths(root, sourceDir) : [];
    for (const input of inputs) {
      const shared = result.find(p => p.path === input);
      if (shared && !pkg.dependencies.includes(shared.name)) pkg.dependencies.push(shared.name);
    }
  }
  return result;
}

// Factory specs import shared rules directly, outside each app's package graph.
// Discover those inputs from every factory source, so new imports cannot drift
// from a hand-maintained list. Read errors fail the plan instead of skipping QA.
export function sourcePackagePaths(root, sourceDir) {
  const paths = new Set();
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!/\.[cm]?[jt]sx?$/.test(entry.name)) continue;
      const source = readFileSync(path, 'utf8');
      for (const match of source.matchAll(/['"]((?:\.\.?\/)+[^'"\n]+)['"]/g)) {
        const input = match[1];
        if (!input.startsWith('.')) continue;
        const target = relative(root, resolve(dirname(path), input)).replaceAll('\\', '/');
        const shared = target.match(/^packages\/[^/]+(?=\/|$)/);
        if (shared) paths.add(shared[0]);
      }
    }
  }
  walk(sourceDir);
  return [...paths].sort();
}

export function factoryPackagePaths(root) {
  return sourcePackagePaths(root, join(root, 'tests/factory'));
}

export function affectedSites(files, pkgs, sites, factoryInputs = []) {
  if (files === null || files.some(f => /^(scripts\/|tests\/|\.github\/workflows\/|package\.json$|pnpm-lock\.yaml$|pnpm-workspace\.yaml$|turbo\.json$)/.test(f))) return sites;
  // Unknown root inputs may affect compilation (tsconfig, npmrc, browser config).
  const nonBuild = /^(docs\/|audits\/|wiki\/|launches\/|content-mined\/|research\/)|\.md$|^\.gitleaks\.toml$/;
  if (files.some(f => !f.startsWith('sites/') && !f.startsWith('packages/') && !nonBuild.test(f))) return sites;
  if (files.some(f => factoryInputs.some(p => f.startsWith(`${p}/`)))) return sites;
  const affected = new Set();
  const direct = new Set(sites.filter(site => files.some(f => f.startsWith(`${site}/`) || f.startsWith(`content-mined/${site.slice(6)}/`) || (site === 'sites/arogyashala.in' && f.startsWith('content-mined/arogyashala.co.in/')))));
  for (const pkg of pkgs) {
    if (direct.has(pkg.site) || files.some(f => f.startsWith(`${pkg.path}/`))) affected.add(pkg.name);
  }
  // Unknown shared package paths fail safe; never silently miss a dependency.
  if (files.some(f => f.startsWith('packages/') && !pkgs.some(p => f.startsWith(`${p.path}/`)))) return sites;
  let changed = true;
  while (changed) {
    changed = false;
    for (const pkg of pkgs) if (!affected.has(pkg.name) && pkg.dependencies.some(d => affected.has(d))) {
      affected.add(pkg.name); changed = true;
    }
  }
  return sites.filter(site => direct.has(site) || pkgs.some(p => p.site === site && affected.has(p.name)));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = process.cwd();
  const pkgs = packages(root);
  const sites = pkgs.filter(p => p.site).map(p => p.site).sort();
  const base = process.argv[process.argv.indexOf('--base') + 1];
  let files = null;
  if (base && /^[0-9a-f]{40}$/.test(base)) {
    try { files = execFileSync('git', ['diff', '--no-renames', '--name-only', '-z', `${base}...HEAD`], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean); }
    catch { console.error('No usable base; checking every site.'); }
  }
  for (const file of files || []) {
    const site = file.match(/^sites\/[^/]+/)?.[0];
    if (site && !sites.includes(site)) throw new Error(`${site}: changed site is unregistered or has no buildable app; register it explicitly before release`);
  }
  const affected = affectedSites(files, pkgs, sites, factoryPackagePaths(root));
  const plan = { sites: affected, browserSites: affected.filter(s => !BROWSER_EXEMPT.has(s)) };
  const output = `affected_sites=${JSON.stringify(plan.sites)}\nbrowser_sites=${JSON.stringify(plan.browserSites)}\nsite_count=${plan.sites.length}\nhas_sites=${plan.sites.length > 0}\n`;
  const outIndex = process.argv.indexOf('--out');
  if (outIndex !== -1) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(process.argv[outIndex + 1], JSON.stringify(plan));
  }
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, output);
  console.log(output.trim());
}
