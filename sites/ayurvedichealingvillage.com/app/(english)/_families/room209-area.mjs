import copy from '../../../english-candidate/room209-area-copy.json' with { type: 'json' };

// AHV-OWNER.20261014.room209-area: owner correction, 14 October 2026.
// Guest Deluxe total areas include sit-outs. The RMO room is not a guest-area
// minimum; physical room rosters, occupancy, photographs and rates stay intact.
export function withRoom209Area(edits, route, locale = 'en') {
  const facts = copy[locale];
  if (!facts || !['/deluxe-villa/', '/our-villas/'].includes(route)) return edits;
  const corrections = [{ kind: 'text', old: facts.rangeOld, new: facts.rangeNew }];
  if (route === '/deluxe-villa/') corrections.push(
    { kind: 'text', old: facts.paragraphOld, new: facts.paragraphNew },
    { kind: 'text', old: facts.paragraphReviewed, new: facts.paragraphNew },
  );
  const byKey = new Map(corrections.map(edit => [edit.kind + '\0' + edit.old, edit]));
  const result = (edits || []).map(edit => {
    const key = edit.kind + '\0' + edit.old;
    const correction = byKey.get(key);
    byKey.delete(key);
    return correction || edit;
  });
  return [...result, ...byKey.values()];
}
