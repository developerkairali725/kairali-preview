"use client";

// Fees (Main.dc.html section 10 / Mobile-Full "Fees") and the shared currency state.
//
// Currency: the server renders with the geo currency (req.currency). After hydration a stored choice
// (localStorage "lp-currency") takes over, and every listener follows the "lp-currency" window event, so the
// hero price, the form-card price, the switcher chip and these rows always agree. Prices are never converted:
// a currency without a published tariff shows the USD figure, labelled. No villa sizes.

import { useCallback, useEffect, useState } from "react";
import type { Currency, FeeRow, Fees as FeesT, Locale, Maybe, Variant } from "../../kit/types.ts";
import { CURRENCIES, formatMoney } from "../../kit/currency.ts";
import { feeFor } from "../../kit/price.ts";
import { isPending } from "../../kit/pending.ts";
import { priceAmount } from "../price-line.ts";
import { track } from "../../integrations/track.ts";
import { readPref, writePref } from "./prefs.ts";
import { CURRENCY_EVENT, CURRENCY_PREF, isCurrency, reconcileCurrency } from "./ui-helpers.ts";
import { SectionHead } from "../head";

function storage(): Storage | undefined {
  try { return window.localStorage; } catch { return undefined; }
}

/** The visitor's currency: `initial` (geo) on the server and first paint, then the stored choice and live changes. */
export function useCurrency(initial: Currency): Currency {
  const [cur, setCur] = useState<Currency>(initial);
  useEffect(() => {
    setCur(reconcileCurrency(readPref(storage(), CURRENCY_PREF), initial));
    const on = (e: Event) => {
      const d = (e as CustomEvent<unknown>).detail;
      if (isCurrency(d)) setCur(d);
    };
    window.addEventListener(CURRENCY_EVENT, on);
    return () => window.removeEventListener(CURRENCY_EVENT, on);
  }, [initial]);
  return cur;
}

/** Store the choice, tell every listener, and fire currency_change. */
export function chooseCurrency(c: Currency): void {
  writePref(storage(), CURRENCY_PREF, c);
  try { window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: c })); } catch { /* very old browser */ }
  track("currency_change", { to: c });
}

/** The hero / form-card "from" amount, following the visitor's currency. Server text = heroPrice().amount. */
export function PriceText({ fees, locale, currency }: { fees: Maybe<FeesT>; locale: Locale; currency: Currency }) {
  const cur = useCurrency(currency);
  return <>{priceAmount(fees, cur, locale)}</>;
}

type Cell = { text: string; fallback: boolean };
function cell(row: FeeRow, kind: "single" | "twinEach", c: Currency, locale: Locale): Cell {
  const p = feeFor(row, kind, c);
  return p ? { text: formatMoney(p.amount, p.currency, locale), fallback: p.fallback } : { text: "[no tariff]", fallback: false };
}

export default function Fees({ fees, v, locale, currency }: { fees: Maybe<FeesT>; v: Variant; locale: Locale; currency: Currency }) {
  const cur = useCurrency(currency);
  const pick = useCallback((c: Currency) => { if (c !== cur) chooseCurrency(c); }, [cur]);
  const pending = isPending(fees);
  const nights = pending ? 14 : fees.nights;
  const ph = pending ? `[${fees.id}]` : "";
  const rows = pending
    ? [{ name: ph, note: "", single: { text: ph, fallback: false }, twin: { text: ph, fallback: false } }]
    : fees.rows.map((r) => ({ name: r.name, note: r.note, single: cell(r, "single", cur, locale), twin: cell(r, "twinEach", cur, locale) }));
  const rowFell = rows.map((r) => r.single.fallback || r.twin.fallback);
  const anyFell = rowFell.some(Boolean);
  const allFell = anyFell && rowFell.every(Boolean);
  const label = `Shown in USD — no ${cur} tariff published.`;
  const validTo = pending ? ph : fees.validTo;

  return (
    <section className="lp-sec lp-fees" aria-labelledby="lp-fees-h">
      <div className="lp-fees__intro">
        <SectionHead v={v} kicker="Program fees" title="Clear fees, all-inclusive." id="lp-fees-h">
          <p className="lp-fees__lede">Per person for a {nights}-night admission. Your doctor confirms the length at consultation.</p>
        </SectionHead>
        <div className="lp-fees__cur" role="group" aria-label="Currency">
          {CURRENCIES.map((c) => (
            <button key={c} type="button" className="lp-fees__cur-btn" aria-pressed={c === cur} onClick={() => pick(c)}>{c}</button>
          ))}
        </div>
      </div>
      <div className="lp-fees__table">
        {/* Always rendered (a live region must exist before it changes). Every row in USD → one visible line;
            mixed → each USD row carries its own note and this region only announces it. */}
        <p className={allFell ? "lp-fees__fallback" : "lp-fees__fallback lp-fees__fallback--sr"} role="status">
          {allFell ? label : anyFell ? `Some fees are shown in USD — no ${cur} tariff published.` : ""}
        </p>
        <ul className="lp-fees__rows">
          {rows.map((r, i) => (
            <li key={`${r.name}-${i}`} className="lp-fees__row">
              <div className="lp-fees__name">
                <h3>{r.name}</h3>
                {r.note ? <p className="lp-fees__note">{r.note}</p> : null}
                {rowFell[i] && !allFell ? <p className="lp-fees__row-usd">{label}</p> : null}
              </div>
              <dl className="lp-fees__amts">
                <div><dt>Single</dt><dd>{r.single.text}</dd></div>
                <div><dt>Twin sharing, each</dt><dd>{r.twin.text}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
        <p className="lp-fees__foot">Fees valid to {validTo}. Taxes as applicable. Medicines and laboratory tests charged separately.</p>
        <a className="lp-btn lp-btn--primary lp-fees__cta" href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="section">Get free doctor consultation</a>
      </div>
    </section>
  );
}
