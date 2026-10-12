"use client";

// Language & currency (Locale-Switcher.dc.html). A 44px header chip "EN · INR" opens a dialog
// (bottom sheet on mobile, panel on desktop).
//   Language: only the campaign's own locales (c.locales), each name in its own script with a lang attribute.
//     Choosing one sets the lp-lang cookie, fires locale_change and reloads the same URL with ?lang=xx.
//   Currency: the five CURRENCIES. Choosing one stores the pref, dispatches "lp-currency" (hero price, fees and
//     form card follow without a reload) and fires currency_change.
// Both lists are radiogroups: arrow keys move focus, Enter/Space (or a click) chooses.

import { useState, type KeyboardEvent } from "react";
import type { Currency, Locale } from "../../kit/types.ts";
import { LOCALE_NAMES } from "../../kit/locale.ts";
import { CURRENCIES } from "../../kit/currency.ts";
import { track } from "../../integrations/track.ts";
import { useDialog } from "./useDialog";
import { chooseCurrency, useCurrency } from "./Fees";
import { langCookie, langUrl, localeChip } from "./ui-helpers.ts";

const Globe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></svg>
);
const Close = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
);

/** Roving focus inside a radiogroup: arrows move focus between the radios; they do not choose. */
function roveKeys(e: KeyboardEvent<HTMLDivElement>) {
  const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
  if (!keys.includes(e.key)) return;
  const radios = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
  const i = radios.indexOf(document.activeElement as HTMLButtonElement);
  if (i < 0 || !radios.length) return;
  e.preventDefault();
  const rtl = document.documentElement.dir === "rtl";
  const fwd = e.key === "ArrowDown" || e.key === (rtl ? "ArrowLeft" : "ArrowRight");
  const back = e.key === "ArrowUp" || e.key === (rtl ? "ArrowRight" : "ArrowLeft");
  const next = e.key === "Home" ? 0 : e.key === "End" ? radios.length - 1 : fwd ? (i + 1) % radios.length : back ? (i - 1 + radios.length) % radios.length : i;
  radios[next].focus();
}

export default function LocaleSwitcher({ locales, locale, currency }: { locales: Locale[]; locale: Locale; currency: Currency }) {
  const [open, setOpen] = useState(false);
  const cur = useCurrency(currency);
  const { ref, trapKeyDown, setTrigger, dialogProps } = useDialog(open, () => setOpen(false));
  const list: Locale[] = locales.length ? locales : ["en"];

  const pickLang = (l: Locale) => {
    if (l === locale) { setOpen(false); return; }
    try { document.cookie = langCookie(l); } catch { /* cookies blocked: ?lang still works for this view */ }
    track("locale_change", { to: l });
    window.location.assign(langUrl(window.location.href, l));
  };

  return (
    <>
      <button type="button" className="lp-loc__chip" aria-haspopup="dialog" onClick={(e) => { setTrigger(e.currentTarget); setOpen(true); }}>
        {/* The accessible name starts with the visible label (WCAG 2.5.3 label in name); the rest is for screen readers. */}
        <Globe /><span>{localeChip(locale)} · {cur}</span><span className="lp-sr">, language and currency: {LOCALE_NAMES[locale]}, {cur}</span>
      </button>
      <dialog ref={ref} className="lp-dlg lp-dlg--sheet lp-loc" aria-labelledby="lp-loc-h" {...dialogProps}
        onKeyDown={trapKeyDown} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        {open ? (
          <div className="lp-dlg__inner">
            <div className="lp-dlg__head">
              <h2 id="lp-loc-h" className="lp-dlg__title">Language &amp; currency</h2>
              <button type="button" className="lp-dlg__close" aria-label="Close" onClick={() => setOpen(false)}><Close /></button>
            </div>
            <p className="lp-dlg__note">Set for you from your location. Change it any time.</p>
            <p className="lp-loc__label" id="lp-loc-lang">Language</p>
            <div className="lp-loc__grid lp-loc__grid--lang" role="radiogroup" aria-labelledby="lp-loc-lang" onKeyDown={roveKeys}>
              {list.map((l) => (
                <button key={l} type="button" role="radio" aria-checked={l === locale} lang={l} className="lp-loc__opt"
                  tabIndex={l === locale ? 0 : -1} data-autofocus={l === locale ? "" : undefined} onClick={() => pickLang(l)}>
                  {LOCALE_NAMES[l]}
                </button>
              ))}
            </div>
            <p className="lp-loc__label" id="lp-loc-cur">Currency</p>
            <div className="lp-loc__grid lp-loc__grid--cur" role="radiogroup" aria-labelledby="lp-loc-cur" onKeyDown={roveKeys}>
              {CURRENCIES.map((c) => (
                <button key={c} type="button" role="radio" aria-checked={c === cur} className="lp-loc__opt"
                  tabIndex={c === cur ? 0 : -1} onClick={() => { if (c !== cur) chooseCurrency(c); }}>
                  {c}
                </button>
              ))}
            </div>
            <button type="button" className="lp-btn lp-btn--primary lp-loc__done" onClick={() => setOpen(false)}>Done</button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
