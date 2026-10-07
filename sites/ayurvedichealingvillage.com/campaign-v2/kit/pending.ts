import type { Pending } from "./types.ts";

export function pending(id: string, note: string): Pending {
  return { __pending: true, id, note };
}

export function isPending(v: unknown): v is Pending {
  return typeof v === "object" && v !== null && (v as { __pending?: unknown }).__pending === true;
}

export function collectPending(value: unknown, path = "$", out: { path: string; id: string; note: string }[] = []) {
  if (isPending(value)) { out.push({ path, id: value.id, note: value.note }); return out; }
  if (Array.isArray(value)) { value.forEach((v, i) => collectPending(v, `${path}[${i}]`, out)); return out; }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collectPending(v, `${path}.${k}`, out);
  }
  return out;
}
