import { test } from 'node:test';
import assert from 'node:assert/strict';
import { affectedSites, factoryPackagePaths, packages } from '../ci-site-plan.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const sites = ['sites/a', 'sites/b', 'sites/c'];
const pkgs = [
  { name: '@ui', path: 'packages/ui', dependencies: [] },
  { name: '@widgets', path: 'packages/widgets', dependencies: ['@ui'] },
  { name: 'a', path: 'sites/a', site: 'sites/a', dependencies: ['@widgets'] },
  { name: 'b', path: 'sites/b/site', site: 'sites/b', dependencies: ['@ui'] },
  { name: 'c', path: 'sites/c', site: 'sites/c', dependencies: [] },
];
test('site edit selects only that site', () => assert.deepEqual(affectedSites(['sites/a/app/page.tsx'], pkgs, sites), ['sites/a']));
test('AHV page changes do not select the corporate or other applications', () => {
 const fleet=['sites/ayurvedichealingvillage.com','sites/kairali.com'];
 const apps=fleet.map(site=>({name:site,path:site,site,dependencies:[]}));
 assert.deepEqual(affectedSites(['sites/ayurvedichealingvillage.com/app/page.tsx'],apps,fleet),[fleet[0]]);
});
test('unregistered candidate directories stay outside the registered build graph', t => {
 const root=mkdtempSync(join(tmpdir(),'registered-sites-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 for(const dir of ['sites/ayurvedichealingvillage.com','sites/kairali-com-rebuild/site','packages']) mkdirSync(join(root,dir),{recursive:true});
 writeFileSync(join(root,'sites/ayurvedichealingvillage.com/site.config.json'),JSON.stringify({domain:'ayurvedichealingvillage.com'}));
 writeFileSync(join(root,'sites/ayurvedichealingvillage.com/package.json'),JSON.stringify({name:'ahv'}));
 writeFileSync(join(root,'sites/kairali-com-rebuild/site/package.json'),JSON.stringify({name:'corporate-candidate'}));
 assert.deepEqual(packages(root).map(p=>p.name),['ahv']);
});
test('secret-scanner policy changes alone do not rebuild websites',()=>assert.deepEqual(affectedSites(['.gitleaks.toml'],pkgs,sites),[]));
test('nested app and parent config select the same identity', () => {
  for (const f of ['sites/b/site/app/page.tsx', 'sites/b/site.config.json']) assert.deepEqual(affectedSites([f], pkgs, sites), ['sites/b']);
});
test('shared dependency selects direct and transitive dependents', () => assert.deepEqual(affectedSites(['packages/ui/tokens.css'], pkgs, sites), ['sites/a','sites/b']));
test('docs only changes preserve explicit no-work matrix results', () => assert.deepEqual(affectedSites(['docs/note.md'], pkgs, sites), []));
test('unknown base, shared package, CI or lockfile changes select all sites', () => {
  for (const files of [null, ['packages/new/index.ts'], ['.github/workflows/gate.yml'], ['pnpm-lock.yaml'], ['scripts/site-preflight.mjs']]) assert.deepEqual(affectedSites(files,pkgs,sites), sites);
});
test('rename includes source and destination sites', () => assert.deepEqual(affectedSites(['sites/a/page.tsx','sites/c/page.tsx'],pkgs,sites),['sites/a','sites/c']));

test('root configuration changes fail safe to every site', () => {
 for (const file of ['tsconfig.base.json','playwright.config.ts','.npmrc','.nvmrc']) assert.deepEqual(affectedSites([file],pkgs,sites),sites);
});

test('factory imports affect every site even without an app dependency', t => {
 const root=mkdtempSync(join(tmpdir(),'factory-inputs-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 mkdirSync(join(root,'tests/factory/helpers'),{recursive:true});
 writeFileSync(join(root,'tests/factory/example.spec.ts'),`import { rules } from '../../packages/rules/src/index.js';`);
 writeFileSync(join(root,'tests/factory/helpers/check.ts'),`const social = require('../../../packages/social/src/config');`);
 const inputs=factoryPackagePaths(root);
 assert.deepEqual(inputs,['packages/rules','packages/social']);
 const known=[...pkgs,{name:'@rules',path:'packages/rules',dependencies:[]},{name:'@social',path:'packages/social',dependencies:[]}];
 for(const file of ['packages/rules/src/index.js','packages/social/src/config.ts']) assert.deepEqual(affectedSites([file],known,sites,inputs),sites);
 assert.deepEqual(affectedSites(['packages/ui/tokens.css'],known,sites,inputs),['sites/a','sites/b']);
});

test('relative shared font assets are dependencies even without a package declaration', t => {
 const root=mkdtempSync(join(tmpdir(),'relative-fonts-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 mkdirSync(join(root,'sites/example.com/app'),{recursive:true});
 mkdirSync(join(root,'packages/ui'),{recursive:true});
 writeFileSync(join(root,'sites/example.com/site.config.json'),'{}');
 writeFileSync(join(root,'sites/example.com/package.json'),JSON.stringify({name:'example'}));
 writeFileSync(join(root,'packages/ui/package.json'),JSON.stringify({name:'@kairali/ui'}));
 writeFileSync(join(root,'sites/example.com/app/layout.tsx'),`const font = {src: '../../../packages/ui/fonts/file.woff2'};`);
 const graph=packages(root);
 assert.deepEqual(affectedSites(['packages/ui/fonts/file.woff2'],graph,['sites/example.com']),['sites/example.com']);
});
test('a mined test fixture selects its consuming site, including the historical domain alias', () => {
 const fleet=['sites/healing.recipes','sites/arogyashala.in','sites/kairaliyoga.com'];
 for(const [input,site] of [['content-mined/healing.recipes/url-inventory.csv',fleet[0]],['content-mined/arogyashala.co.in/page.html',fleet[1]]]) assert.deepEqual(affectedSites([input],[],fleet),[site]);
});
