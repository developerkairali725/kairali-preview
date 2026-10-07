import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { affectedSites, packages, factoryPackagePaths } from '../ci-site-plan.mjs';
import { checkDeploymentMappings } from '../deployment-drift.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const manifest = JSON.parse(readFileSync(new URL('../../deployment-projects.json', import.meta.url)));
const bulk = manifest.projects.filter(p => /^sites\/bulkayurveda(oils|products)\.com$/.test(p.rootDirectory));
const graph = packages(root);
const sites = graph.filter(p => p.site).map(p => p.site).sort();
const inputs = factoryPackagePaths(root);
const plan = files => affectedSites(files, graph, sites, inputs);
const ahv = 'sites/ayurvedichealingvillage.com';

test('both bulk project mappings require native unaffected-project skipping', () => {
  assert.equal(bulk.length, 2);
  for (const p of bulk) assert.equal(p.affectedProjects, true, p.name);
});
test('an AHV-only edit selects AHV without either bulk site', () => {
  assert.deepEqual(plan([`${ahv}/next.config.ts`, `${ahv}/test/measurement-config.test.mjs`]), [ahv]);
});
for (const p of bulk) test(`${p.rootDirectory} own edit still builds that site`, () => {
  assert.deepEqual(plan([`${p.rootDirectory}/app/page.tsx`]), [p.rootDirectory]);
});
test('shared UI and transitive dependencies preserve both bulk builds', () => {
  for (const file of ['packages/ui/brand-tokens.css', 'packages/consent/src/index.ts']) {
    const selected = plan([file]);
    for (const p of bulk) assert.ok(selected.includes(p.rootDirectory), `${file}: ${p.name}`);
  }
});
test('documentation-only change does not select website validation', () => {
  assert.deepEqual(plan(['docs/ci/build-skipping.md']), []);
});
test('unknown base, dependency config and safety check changes retain full validation', () => {
  for (const files of [null, ['pnpm-lock.yaml'], ['pnpm-workspace.yaml'], ['.github/workflows/gate.yml'], ['scripts/ci-completion.mjs']]) {
    assert.deepEqual(plan(files), sites);
  }
});
test('each null/false/missing live bulk flag is detected, explicit true passes', () => {
  for (const p of bulk) {
    const config = { ...manifest, projects: [p] };
    const actual = { ...p, link: { org: 'kairali-digital', repo: 'kairali-web-factory', productionBranch: 'main' } };
    for (const flag of [null, false, undefined]) {
      const failures = checkDeploymentMappings(config, () => ({ ...actual, enableAffectedProjectsDeployments: flag }), () => {});
      assert.ok(failures.some(f => f.includes('unaffected-project skipping')), `${p.name}: ${flag}`);
    }
    assert.deepEqual(checkDeploymentMappings(config, () => ({ ...actual, enableAffectedProjectsDeployments: true }), () => {}), []);
  }
});
test('a Git mapping cannot silently opt out of the skip requirement with null', () => {
  const p = { ...bulk[0], affectedProjects: null };
  const failures = checkDeploymentMappings({ ...manifest, projects: [p] }, () => ({ ...p, link: {org:'kairali-digital',repo:'kairali-web-factory',productionBranch:'main'} }), () => {});
  assert.ok(failures.some(f => f.includes('manifest must require unaffected-project skipping')));
});
