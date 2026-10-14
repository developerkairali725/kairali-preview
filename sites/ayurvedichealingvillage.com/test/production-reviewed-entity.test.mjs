import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { productionCampaign, PRODUCTION_SLUGS } from '../campaign-v2/production/load.ts';
import { productionJsonLd, productionJsonLdScript } from '../campaign-v2/production/metadata.ts';
import baseline from './fixtures/production-schema-before-batch003.json' with { type: 'json' };
import monsoonDelta from './fixtures/monsoon-2027-approved-delta.json' with { type: 'json' };
import { ROUTES } from '../campaign-v2/production/bindings.ts';
import { ORGANIZATION_ROUTES } from '../campaign-v2/production/organization.ts';
import { reverseTrainAConfig } from './fixtures/train-a-20261014.mjs';
import { reverseTrainBConfig } from './fixtures/train-b-20261015.mjs';
// Train F (15 Oct 2026) sits on top of Train B: its exact photograph picks are reversed first (fixtures/train-f-20261015.mjs).
import { reverseTrainFConfig } from './fixtures/train-f-20261015.mjs';

const REVIEWED = new Set([
  'cleansing-centre', 'lp-cleansing-centre', 'lp-hospital-kerala', 'lp-pain-management', 'lp-panchakarma',
  'lp-south-india', 'lp-treatment-kerala', 'lp-treatment-kerala-ru', 'lp-treatment-packages',
  'lp-weight-management', 'south-india-cities', 'treatment-kerala', 'weight-management',
]);
// Train D02: exactly the six batch004 routes of HOSPITAL-AUTHORITY-RESOLUTION.json (14 Oct 2026), same entity.
const BATCH004 = ['monsoon-wellness', 'rejuvenation-detox', 'wellness-kerala', 'brand', 'lp-brand', 'lp-behandlung-kerala'];
for (const slug of BATCH004) REVIEWED.add(slug);
const LANGUAGE = { 'lp-treatment-kerala-ru': 'ru', 'lp-behandlung-kerala': 'de' };
// Train B (15 Oct 2026): train D01 adds the same entity, with a WebPage publisher, on its six routes (organization.ts).
const D01 = ['treatment-packages', 'panchakarma', 'pain-management', 'family-ayurvedic-retreat', 'ayurveda-retreat', 'cleansing-centre'];
const WITH_ENTITY = new Set([...REVIEWED, ...D01]);
const plain = (v) => JSON.parse(JSON.stringify(v));
/**
 * The graph as the c54e2795e code would have written it before any entity: every Train B and Train A config change
 * reversed exactly (their composed fixtures), then the two code-level graph deltas removed exactly: D01's WebPage
 * publisher on its six routes, and Train A batch 5's two-item BreadcrumbList on every route that had none before
 * (bindings.ts breadcrumbName marks the one route, treatment-packages, whose breadcrumb predates it, unchanged).
 */
function priorGraph(slug, c) {
  const graph = productionJsonLd(slug, reverseTrainAConfig(slug, reverseTrainBConfig(slug, reverseTrainFConfig(slug, plain(c)))));
  const page = graph[0];
  assert.equal(page['@type'], 'WebPage', slug);
  if (D01.includes(slug)) { assert.deepEqual(page.publisher, { '@id': entityId }, slug); delete page.publisher; }
  else assert.equal(page.publisher, undefined, slug);
  if (!ROUTES[slug].breadcrumbName) { assert.equal(page.breadcrumb['@type'], 'BreadcrumbList', slug); delete page.breadcrumb; }
  return graph;
}
const ORIGIN = 'https://ayurvedichealingvillage.com';
const entityId = `${ORIGIN}/#organization`;
// AHV-OWNER.monsoon-2027 (d3e8de62b) later changed Monsoon's WebPage/FAQ strings under its own authority.
// Reverse only those exact approved string values to compare with the unchanged 8146a2bc baseline hash.
const LITERAL = /"(?:[^"\\]|\\.)*"/g;
function baselineHash(slug, value) {
  let json = JSON.stringify(value);
  if (slug === 'monsoon-wellness') {
    let reversed = 0;
    for (const { before, after } of monsoonDelta.edits) {
      const b = before.match(LITERAL) || [], a = after.match(LITERAL) || [];
      if (a.length !== b.length) continue;
      a.forEach((v, i) => { if (v !== b[i] && json.includes(v)) { reversed++; json = json.split(v).join(b[i]); } });
    }
    assert.equal(reversed, 3, 'exact approved Monsoon description and two FAQ answers');
  }
  return crypto.createHash('sha256').update(json).digest('hex');
}
// Execute just the real main-site entity literal: changing its approved identity/NAP must trigger review here.
const mainSchema = fs.readFileSync(new URL('../app/(english)/_families/schema.ts', import.meta.url), 'utf8');
const start = mainSchema.indexOf('  graph.push({\n    // NABH-accredited');
assert.ok(start >= 0, 'actual main-site organization node exists');
const end = mainSchema.indexOf('\n  });', start);
assert.ok(end > start);
const expression = mainSchema.slice(start + '  graph.push('.length, end) + '\n  }';
function expectedEntity(lang) {
  const context = { ORIGIN, ORG_ID: entityId, ORG_NAME: 'Kairali — The Ayurvedic Healing Village',
    LOGO_ID: `${ORIGIN}/#/schema/logo/image/`, CTX: { lang },
    LOGO: { url: `${ORIGIN}/ahv/assets/img/kairali-colorful-logo.png`, width: 290, height: 68 } };
  return { '@context': 'https://schema.org', ...JSON.parse(JSON.stringify(vm.runInNewContext(`(${expression})`, context))) };
}

test('reviewed allowlist covers exactly 13 + 6 of 24 routes, D01 the other five plus cleansing-centre; saved baseline covers every route', () => {
  assert.equal(REVIEWED.size, 19);
  assert.equal(PRODUCTION_SLUGS.length, 24);
  assert.deepEqual([...PRODUCTION_SLUGS].filter(s => !REVIEWED.has(s)).sort(),
    ['ayurveda-retreat', 'family-ayurvedic-retreat', 'pain-management', 'panchakarma', 'treatment-packages']);
  assert.deepEqual([...ORGANIZATION_ROUTES].sort(), [...D01].sort());
  assert.deepEqual(D01.filter(s => REVIEWED.has(s)), ['cleansing-centre']);
  assert.equal(WITH_ENTITY.size, 24);
  assert.deepEqual(Object.keys(baseline.hashes).sort(), [...PRODUCTION_SLUGS].sort());
  for (const slug of REVIEWED) assert.ok(PRODUCTION_SLUGS.includes(slug));
});

for (const slug of PRODUCTION_SLUGS) {
  test(`${slug}: prior WebPage/FAQ/breadcrumb semantics intact; entity scope exact`, () => {
    const c = productionCampaign(slug);
    const graph = productionJsonLd(slug, c);
    const entities = graph.filter(n => n['@id'] === entityId);
    assert.equal(entities.length, WITH_ENTITY.has(slug) ? 1 : 0);
    // Train B: the non-entity graph is compared on the prior graph (exact Train A/B reversals, see priorGraph).
    assert.equal(baselineHash(slug, priorGraph(slug, c).filter(n => n['@id'] !== entityId)), baseline.hashes[slug]);
    if (WITH_ENTITY.has(slug)) {
      const language = LANGUAGE[slug] ?? 'en-US';
      assert.deepEqual(entities[0], expectedEntity(language));
      assert.deepEqual(graph.at(-1), entities[0]);
      for (const key of ['foundingDate', 'hasCredential', 'award', 'identifier', 'medicalSpecialty', 'priceRange', 'makesOffer', 'sameAs']) {
        assert.equal(key in entities[0], false, key);
      }
      assert.equal(JSON.stringify(entities[0]).includes('MedicalClinic'), false);
    }
    assert.deepEqual(JSON.parse(productionJsonLdScript(slug, c)), graph);
    for (const node of graph) assert.equal(node['@context'], 'https://schema.org');
  });
}

test('Russian page/FAQ language stays ru and uses the same AHV identity, not a second clinic', () => {
  const graph = productionJsonLd('lp-treatment-kerala-ru', productionCampaign('lp-treatment-kerala-ru'));
  assert.equal(graph[0].inLanguage, 'ru');
  assert.equal(graph.find(n => n['@type'] === 'FAQPage').inLanguage, 'ru');
  assert.equal(graph.at(-1)['@id'], entityId);
  assert.equal(graph.at(-1).logo.inLanguage, 'ru');
});

test('each render creates its own entity/address; serialized user-facing text remains script-safe', () => {
  const c = productionCampaign('cleansing-centre');
  const first = productionJsonLd('cleansing-centre', c);
  first.at(-1).address.addressLocality = 'mutated test value';
  assert.equal(productionJsonLd('cleansing-centre', c).at(-1).address.addressLocality, 'Palakkad');
  const changed = { ...c, seo: { ...c.seo, title: '</script><script>test</script>' } };
  const serialized = productionJsonLdScript('cleansing-centre', changed);
  assert.equal(serialized.includes('<'), false);
  assert.equal(JSON.parse(serialized)[0].name, changed.seo.title);
});
