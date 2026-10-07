import * as CC from './vendor/cookieconsent.esm.js';
import { REVISION, EXPIRY_DAYS, REFUSAL_DAYS, STORAGE_KEY, REFUSAL_KEY, preferences, legacyRejection, readSavedChoice, readRefusals, recordRefusals, hasRefusal, automaticPrompt } from './policy.mjs';
import { translation, gpcNotice } from './copy.mjs';
let storage; try { storage = localStorage; } catch {}
const rejectedBefore = legacyRejection(storage);
const gpc = navigator.globalPrivacyControl === true;
const savedChoice = readSavedChoice(storage);
// Retain only refusals across grant expiry/revision changes. Never renew a grant
// or reset a refusal's clock on a visit. Invalid records cannot authorize SDKs.
if (savedChoice) recordRefusals(storage, savedChoice.categories, Date.parse(savedChoice.lastConsentTimestamp));
else { try { storage.removeItem(STORAGE_KEY); } catch {} }
if (gpc) recordRefusals(storage, ['analytics'], Date.now(), { gpc: true });
// Remove only advertising before hydration so GPC cannot show a stale grant.
// This never extends expiry, upgrades revision, or grants any category.
if (gpc) {
 try {
  const saved=JSON.parse(storage.getItem(STORAGE_KEY));
  if(Array.isArray(saved?.categories) && saved.categories.includes('advertising')) {
   saved.categories=saved.categories.filter(category=>category!=='advertising');
   storage.setItem(STORAGE_KEY,JSON.stringify(saved));
  }
 } catch {}
}
// Derive a trusted local URL from the current locale, not arbitrary markup.
const lang=document.documentElement.lang;
const prefix=/^\/(de|fr|es|it|pt|nl|ru|ar|hi|zh|ja|ko)(?:\/|$)/.exec(location.pathname)?.[1];
const policy=(prefix ? '/'+prefix : '')+'/new-privacy-policy/';

let last;
let opened = false;
function apply({cookie}) {
  const current = preferences(cookie.categories, gpc);
  const signature = JSON.stringify(current);
  if (signature === last) return;
  last = signature;
  window.AHV_SET_CONSENT?.(current);
  // Keep old home-view code from showing its captured binary banner; this
  // value never authorizes measurement, which reads only CC's validated state.
  try {
    localStorage.setItem('ktahv-consent', current.analytics || current.advertising ? 'accepted' : 'declined');
    localStorage.removeItem('kairali-consent-v1');
    localStorage.setItem('ahv-consent-migrated-v2','1');
  } catch {}
}
function rememberChoice({cookie}) {
  recordRefusals(storage, cookie.categories, Date.now(), { explicit: true, gpc });
}
const copy=translation(lang,policy);
if(gpc){const section=copy.preferencesModal.sections.find(s=>s.linkedCategory==='advertising');delete section.linkedCategory;section.description=gpcNotice(lang);CC.eraseCookies([/^_gcl_/,/^_fb(c|p)$/]);}
await CC.run({
  mode:'opt-in', autoShow:false, revision:REVISION, hideFromBots:false, manageScriptTags:false,
  cookie:{name:STORAGE_KEY, useLocalStorage:true, expiresAfterDays:type=>type==='necessary'?REFUSAL_DAYS:EXPIRY_DAYS},
  guiOptions:{consentModal:{layout:'box wide',position:'bottom center',equalWeightButtons:true,flipButtons:false},preferencesModal:{layout:'box',equalWeightButtons:true}},
  categories:{
    necessary:{enabled:true,readOnly:true},
    analytics:{autoClear:{cookies:[{name:/^_ga/},{name:/^_gid$/},{name:/^_cl(ck|sk)$/}]}},
    ...(gpc ? {} : {advertising:{autoClear:{cookies:[{name:/^_gcl_/},{name:/^_fb(c|p)$/}]}}})
  },
  onFirstConsent:rememberChoice, onConsent:apply, onChange:event=>{rememberChoice(event);apply(event);},
  onModalShow:()=>{opened=true;document.documentElement.setAttribute('data-consent-open','');},
  onModalHide:()=>document.documentElement.removeAttribute('data-consent-open'),
  language:{default:'current',rtl:lang.startsWith('ar') ? 'current' : undefined,translations:{current:copy}}
});
if (gpc && CC.acceptedCategory('advertising')) CC.acceptCategory(CC.getCookie().categories.filter(c=>c!=='advertising'));
if (!CC.validConsent() && rejectedBefore) CC.acceptCategory([]);
window.AHV_COOKIE_SETTINGS = () => CC.showPreferences();
// Some captured home/footer variants have no preferences button. Ensure an
// accessible persistent entry point, including after a captured view remounts.
function ensurePreferencesButton() {
 if(document.querySelector('[data-ahv-cookie-choices]')) return;
 const button=document.createElement('button');
 button.type='button';button.dataset.ahvCookieChoices='';
 button.className='ahv-cookie-preferences';button.textContent=copy.preferencesModal.title;
 (document.querySelector('footer') || document.body).appendChild(button);
}
ensurePreferencesButton();
new MutationObserver(ensurePreferencesButton).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',event=>{
 const target=event.target.closest?.('[data-ahv-cookie-choices]');
 if(target){event.preventDefault();CC.showPreferences();}
});
// Reconcile withdrawal in another tab by starting a fresh, default-denied page.
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY || event.key===REFUSAL_KEY || event.key===null)location.reload();});
// Geography controls presentation only. A passive response never saves consent
// or starts a vendor. Saved choices win; recent refusals suppress renewed asks.
if (!CC.validConsent() && !gpc && !hasRefusal(readRefusals(storage))) {
  const show = await automaticPrompt();
  if (show && !opened && !CC.validConsent()) CC.show();
}
