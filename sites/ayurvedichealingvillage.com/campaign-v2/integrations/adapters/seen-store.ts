// generate_lead de-dupe store for the kit's own adapters (only used on /lp-v2 previews when their slots are filled).
// The kit used to import createSeenStore from app/(english)/_families/lead-conversion.mjs, which main has since
// removed (the production lead path is public/design/lead-receipt.js + the consent runtime). Same behaviour as that
// helper: a bounded token list under "ktahv-lead-conversions", or memory-only when storage is null or blocked.

type Storage = { getItem(k: string): string | null; setItem(k: string, v: string): void };
export type SeenStore = { has(id: string): boolean; add(id: string): void };

const KEY = "ktahv-lead-conversions";
const MAX = 50;

export function createSeenStore(storage: Storage | null): SeenStore {
  const memory = new Set<string>();
  const read = (): string[] | null => {
    if (!storage) return null;
    try {
      const raw = storage.getItem(KEY);
      const list: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return null;
    }
  };
  return {
    has(id) {
      const list = read();
      return list === null ? memory.has(id) : list.includes(id);
    },
    add(id) {
      const list = read();
      if (list === null) {
        memory.add(id);
        return;
      }
      if (list.includes(id)) return;
      list.push(id);
      try {
        storage!.setItem(KEY, JSON.stringify(list.slice(-MAX)));
      } catch {
        memory.add(id);
      }
    },
  };
}
