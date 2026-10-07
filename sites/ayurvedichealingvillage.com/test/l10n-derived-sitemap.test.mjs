import test from 'node:test';
import assert from 'node:assert/strict';
import { unitId } from '../tools/l10n/lib.mjs';
import { composeSitemapCatalog } from '../tools/l10n/derived-sitemap.mjs';

const count = (label, n) => `[[OPEN_1]][[CLOSE_1]][[OPEN_2]]${label}[[CLOSE_2]][[OPEN_3]]${n}[[OPEN_4]] pages[[CLOSE_4]][[CLOSE_3]]`;
const unit = (source, roles = ['html-text']) => ({ id: unitId(source), source, roles });
const tree = { sections: [{ title: 'Campaign pages', hub: null, children: [{ title: 'Pain management', path: '/lp/pain-management/', children: [] }] }] };

test('search corpus composes exact accepted labels and retains route bytes', () => {
  const source = 'Campaign pages Pain management /lp/pain-management/';
  const cat = new Map([[unitId('Campaign pages'), 'Kampagnenseiten'], [unitId('Pain management'), 'Schmerzbehandlung']]);
  const result = composeSitemapCatalog(cat, [unit(source, ['attr:data-search'])], tree, 'de');
  assert.equal(cat.get(unitId(source)), 'Kampagnenseiten Schmerzbehandlung /lp/pain-management/');
  assert.equal(result.derived.length, 1);
  const absent = new Map([[unitId('Campaign pages'), 'Kampagnenseiten']]);
  const unresolved = composeSitemapCatalog(absent, [unit(source, ['attr:data-search'])], tree, 'de');
  assert.equal(absent.has(unitId(source)), false);
  assert.deepEqual(unresolved.unresolved[0].missingLabels, ['Pain management']);
});

test('counts retain placeholder structure and reuse the applicable accepted plural form', () => {
  const three = count('Existing', 3), five = count('Another', 5), target = count('New label', 23);
  const cat = new Map([[unitId(three), three.replace('Existing', 'Существующий').replace(' pages', ' страницы')],
    [unitId(five), five.replace('Another', 'Другой').replace(' pages', ' страниц')], [unitId('New label'), 'Новая категория']]);
  composeSitemapCatalog(cat, [unit(three), unit(five), unit(target)], { sections: [] }, 'ru');
  assert.equal(cat.get(unitId(target)), target.replace('New label', 'Новая категория').replace(' pages', ' страницы'));
});

test('unknown prose and absent plural templates remain missing', () => {
  const prose = 'A new sentence about Campaign pages', target = count('New label', 1);
  const cat = new Map([[unitId('New label'), 'Neue Kategorie']]);
  composeSitemapCatalog(cat, [unit(prose), unit(target)], { sections: [] }, 'de');
  assert.equal(cat.has(unitId(prose)), false);
  assert.equal(cat.has(unitId(target)), false);
});
