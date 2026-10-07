import type { CampaignConfig, Currency, Fees, Locale, Maybe } from "../kit/types.ts";
import type { LpRequest } from "../route.ts";
import { isPending } from "../kit/pending.ts";
import { fromPrice } from "../kit/price.ts";
import { formatMoney } from "../kit/currency.ts";

/** The "from" amount text in a currency: the pending id ([C2]) until fees are confirmed; "[no tariff]" when
 *  confirmed fees have no figure in that currency and no USD fallback. Pure, so the server render and the
 *  client PriceText (interactive/Fees.tsx) produce identical text for the same currency (no hydration mismatch). */
export function priceAmount(fees: Maybe<Fees>, currency: Currency, locale: Locale): string {
  if (isPending(fees)) return `[${fees.id}]`;
  const p = fromPrice(fees, currency);
  return p ? formatMoney(p.amount, p.currency, locale) : "[no tariff]";
}

/** True when the page may show any price at all. `fees: null` is the owner-approved hidden-pricing state. */
export function showsPrice(c: Pick<CampaignConfig, "fees">): c is { fees: Maybe<Fees> } {
  return c.fees !== null;
}

/** "From" price for the hero and the form card, or null when pricing is hidden (fees: null). */
export function heroPrice(c: CampaignConfig, req: LpRequest): { nights: number; amount: string } | null {
  if (c.fees === null) return null;
  return { nights: isPending(c.fees) ? 14 : c.fees.nights, amount: priceAmount(c.fees, req.currency, req.locale) };
}
