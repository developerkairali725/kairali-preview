/** Compose generated navigation text from accepted, source-matched labels.
 * Unknown labels remain missing: this is not an English fallback catalogue.
 */
import { unitId, norm } from './lib.mjs';

const COUNT = /^\[\[OPEN_1\]\]\[\[CLOSE_1\]\]\[\[OPEN_2\]\](.*?)\[\[CLOSE_2\]\]\[\[OPEN_3\]\](\d+)\[\[OPEN_4\]\](.*?)\[\[CLOSE_4\]\]\[\[CLOSE_3\]\]$/;
const TOKENS = /\[\[(?:OPEN|CLOSE)_\d+\]\]/g;

export function composeSitemapCatalog(cat, units, tree, locale) {
  const accepted = source => cat.get(unitId(source));
  const plural = new Intl.PluralRules(locale);
  const counts = units.flatMap(u => {
    const m = u.source.match(COUNT), translation = accepted(u.source);
    if (!m || translation == null) return [];
    const tr = translation.match(COUNT);
    if (!tr || tr[2] !== m[2]) return [];
    return [{ source: u.source, label: m[1], count: Number(m[2]), translatedLabel: tr[1], word: tr[3] }];
  });
  const labels = new Map();
  for (const item of counts) labels.set(item.label, item.translatedLabel);
  const label = source => accepted(source) ?? labels.get(source);
  const search = new Map();
  const walk = (node, trail) => {
    const parts = [...trail, node.title];
    search.set(norm([...parts, node.path || ''].join(' ')), { parts, path: node.path || '' });
    for (const child of node.children || []) walk(child, parts);
  };
  for (const section of tree.sections) {
    search.set(norm(section.title + ' ' + (section.hub || '')), { parts: [section.title], path: section.hub || '' });
    for (const child of section.children) walk(child, [section.title]);
  }
  const derived = [], unresolved = [];
  for (const unit of units) {
    if (accepted(unit.source) != null) continue;
    let text, dependencies = [];
    const entry = search.get(unit.source);
    if (entry && unit.roles.includes('attr:data-search')) {
      const translated = entry.parts.map(label);
      if (translated.every(x => x != null)) {
        text = norm([...translated, entry.path].join(' '));
        dependencies = entry.parts;
      } else unresolved.push({ source: unit.source, missingLabels: entry.parts.filter((_, i) => translated[i] == null) });
    }
    const count = unit.source.match(COUNT);
    if (text == null && count) {
      const translatedLabel = label(count[1]);
      // Select a previously accepted plural form for this exact numeric class.
      const template = counts.find(x => plural.select(x.count) === plural.select(Number(count[2])));
      if (translatedLabel != null && template) {
        text = unit.source.replace(count[1] + '[[CLOSE_2]]', translatedLabel + '[[CLOSE_2]]')
          .replace(count[3] + '[[CLOSE_4]]', template.word + '[[CLOSE_4]]');
        dependencies = [count[1], template.source];
      }
    }
    // Breadcrumbs and numbered section labels contain only independent labels,
    // punctuation and OPEN/CLOSE markup placeholders. Do not split prose.
    if (text == null && unit.source.includes('[[OPEN_') && !count) {
      let complete = true;
      const chunks = unit.source.split(/(\[\[(?:OPEN|CLOSE)_\d+\]\])/);
      const out = chunks.map(chunk => {
        if (!chunk || /^\[\[/.test(chunk) || /^[\s\d›·—–/]+$/.test(chunk)) return chunk;
        const translated = label(norm(chunk));
        if (translated == null) { complete = false; return chunk; }
        dependencies.push(norm(chunk));
        return chunk.replace(norm(chunk), translated);
      });
      if (complete && dependencies.length) text = out.join('');
    }
    if (text != null) {
      if (JSON.stringify(unit.source.match(TOKENS)) !== JSON.stringify(text.match(TOKENS))) throw new Error('Derived sitemap placeholders changed: ' + unit.id);
      cat.set(unit.id, text);
      derived.push({ id: unit.id, source: unit.source, text, dependencies });
    }
  }
  return { derived, unresolved };
}
