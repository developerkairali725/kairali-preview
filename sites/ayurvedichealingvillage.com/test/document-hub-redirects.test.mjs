import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readJson = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const redirects = readJson('../english-candidate/document-redirects.json');
// This manifest is the published website button contract. Its original hashes are
// retained: the maintained hub owns corrected PDF bytes; old bookmarks stay valid.
const documents = readJson('../public/documents/manifest.json').files;
const families = ['ayurveda', 'yoga', 'accommodation', 'opd', 'training'];
const languages = ['en', 'hi', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'ru', 'ar', 'zh', 'ja', 'ko'];
const hub = 'https://kairali-documents.vercel.app/';
const sources = redirects.map(rule => rule.source);

for (const family of families) {
  test(`${family}: every existing language and currency PDF URL reaches its own hub edition`, () => {
    const editions = documents.filter(document => document.doc === family);
    assert.deepEqual(editions.map(document => document.lang).sort(), [...languages].sort());
    // Each assertion batch is one document family: thirteen comparable editions.
    for (const edition of editions) {
      const source = '/documents/' + edition.screen.path;
      const matches = redirects.filter(rule => rule.source === source);
      assert.equal(matches.length, 1, `${source}: must have exactly one redirect`);
      assert.equal(matches[0].destination, hub + edition.screen.path,
        `${source}: preserve family, language, currency and filename`);
      assert.ok(!sources.includes(matches[0].destination), `${source}: redirect loop`);
    }
  });
}

test('hub PDF redirects are an exact allowlist and leave library pages, forms and Healing Secrets alone', () => {
  const expected = documents.filter(document => families.includes(document.doc))
    .map(document => '/documents/' + document.screen.path).sort();
  const actual = redirects.filter(rule => rule.source.startsWith('/documents/'));
  assert.equal(actual.length, 65);
  assert.deepEqual(actual.map(rule => rule.source).sort(), expected);
  assert.equal(new Set(sources).size, sources.length, 'ambiguous duplicate source');
  for (const rule of actual) {
    assert.match(rule.source, /^\/documents\/pdf\/[a-z-]+\/[a-z]{2}\/[A-Za-z0-9_-]+\.pdf$/);
    assert.equal(new URL(rule.destination).origin, 'https://kairali-documents.vercel.app');
    assert.equal(new URL(rule.destination).search, '');
    assert.equal(new URL(rule.destination).hash, '');
  }
  for (const guide of documents.filter(document => document.doc === 'healing-secrets')) {
    assert.ok(!sources.includes('/documents/' + guide.screen.path), 'do not redirect guide-download delivery');
  }
});
