// Train A batch 8 (14 Oct 2026): reverse exactly its reviewed campaign-config deltas (train-a-batch8-20261014.json
// configDeltas) on a JSON clone, so the earlier config-hash pins keep checking everything else unchanged.
import assert from 'node:assert/strict';
import { IMAGES } from '../../campaign-v2/data/images.ts';
import batch8 from './train-a-batch8-20261014.json' with { type: 'json' };

export function reverseBatch8Config(slug, c) {
  for (const d of batch8.configDeltas.filter((x) => x.slug === slug)) {
    if (d.op === 'heroPhone') {
      assert.equal(c.hero.mobileImage.id, 'kt-314', slug);
      assert.ok(!c.gallery.some((g) => g.image.id === 'kt-314'), slug);
      c.hero.mobileImage = JSON.parse(JSON.stringify(IMAGES['kt-199']));
      c.gallery.splice(1, 0, { category: 'Villas', image: JSON.parse(JSON.stringify(IMAGES['kt-314'])) });
      continue;
    }
    let o = c;
    for (const k of d.path.slice(0, -1)) o = o[k];
    const k = d.path.at(-1);
    assert.ok(o[k] !== undefined, `${slug}: ${d.path.join('.')}`);
    if (d.op === 'delete') delete o[k];
    else o[k] = d.value;
  }
  return c;
}
