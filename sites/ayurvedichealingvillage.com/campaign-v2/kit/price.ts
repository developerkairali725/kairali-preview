import type { Currency, FeeRow, Fees } from "./types.ts";

type Picked = { currency: Currency; amount: number; fallback: boolean } | null;

const valid = (x: number | undefined): x is number => typeof x === "number" && Number.isFinite(x) && x > 0;

export function feeFor(row: FeeRow, kind: "single" | "twinEach", c: Currency): Picked {
  const m = row[kind];
  const amount = m[c];
  if (valid(amount)) return { currency: c, amount, fallback: false };
  const usd = m.USD;
  if (valid(usd)) return { currency: "USD", amount: usd, fallback: true };
  return null;
}

export function fromPrice(fees: Fees, c: Currency): Picked {
  const picks = fees.rows.map((r) => {
    // Within each row, try in priority order: twinEach requested, single requested, twinEach USD, single USD
    const te = r.twinEach[c];
    if (valid(te)) {
      return { currency: c, amount: te, fallback: false };
    }
    const si = r.single[c];
    if (valid(si)) {
      return { currency: c, amount: si, fallback: false };
    }
    const te_usd = r.twinEach.USD;
    if (valid(te_usd)) {
      return { currency: "USD", amount: te_usd, fallback: true };
    }
    const si_usd = r.single.USD;
    if (valid(si_usd)) {
      return { currency: "USD", amount: si_usd, fallback: true };
    }
    return null;
  }).filter((p): p is NonNullable<Picked> => p !== null);

  if (!picks.length) return null;
  const same = picks.filter((p) => !p.fallback);
  const pool = same.length ? same : picks;
  return pool.reduce((a, b) => (b.amount < a.amount ? b : a));
}

/** validTo is inclusive until 23:59:59 IST (UTC+5:30). */
export function isExpired(validTo: string, now: Date): boolean {
  const end = new Date(`${validTo}T23:59:59+05:30`);
  if (Number.isNaN(end.getTime())) return true;
  return now.getTime() > end.getTime();
}
