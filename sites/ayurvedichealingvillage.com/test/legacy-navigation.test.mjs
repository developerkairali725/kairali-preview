import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {loadDataset} from '../tools/lib/route-crumbs.mjs';

const site = new URL('../', import.meta.url);
const routes = JSON.parse(fs.readFileSync(new URL('english-candidate/route-manifest.json', site))).routes;
const rail = JSON.parse(fs.readFileSync(new URL('english-candidate/section-nav.json', site)));
const legacyTitle = /^(About Us|Things To Do|Knowledge Cent(?:er|re))$/;

test('Article data cannot import a legacy sidebar as ordinary article headings and lists', () => {
  const datasets = new Map();
  for (const route of routes.filter(r => r.desktopView === 'ahv-page-article-reader-desktop' && rail.routes[r.path])) {
    if (!route.dataset) continue;
    if (!datasets.has(route.dataset)) datasets.set(route.dataset, loadDataset(fileURLToPath(new URL('public/ahv/' + route.dataset, site))));
    const dataset = datasets.get(route.dataset);
    const record = (dataset.routes || dataset.records || []).find(r => r.path === route.path);
    for (const component of record?.components || []) {
      if (/context|menu|navigation/i.test(component.component || '')) continue;
      const leaked = (component.blocks || []).filter(b => b.kind === 'heading' && legacyTitle.test((b.tree || []).map(x => x.v || '').join('')) && /\/c\/1\/c\/1$/.test(b.ptr || ''));
      assert.equal(leaked.length, 0, `${route.path}: legacy menu embedded in article`);
    }
  }
});

test('Initial HTML does not expose the retired menus before hydration', () => {
  const dir = new URL('english-candidate/prerender/', site);
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'founders-message.html')) {
    const html = fs.readFileSync(new URL(file, dir), 'utf8');
    assert.doesNotMatch(html, /<h[23]\b[^>]*data-source-pointer="\/sections\/3\/c\/1\/c\/1"[^>]*>(?:About Us|Things To Do|Knowledge Cent(?:er|re))<\/h[23]>/, file);
  }
});
