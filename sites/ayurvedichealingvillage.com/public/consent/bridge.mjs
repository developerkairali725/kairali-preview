import * as CC from './vendor/cookieconsent.esm.js';
import { REVISION, EXPIRY_DAYS, STORAGE_KEY, preferences, legacyRejection } from './policy.mjs';
import { translation } from './copy.mjs';
let storage; try { storage = localStorage; } catch {}
const rejectedBefore = legacyRejection(storage);
const gpc = navigator.globalPrivacyControl === true;
// Derive a trusted local URL from the current locale, not arbitrary markup.
const lang=document.documentElement.lang;
const prefix=/^\/(de|fr|es|it|pt|nl|ru|ar|hi|zh|ja|ko)(?:\/|$)/.exec(location.pathname)?.[1];
const policy=(prefix ? '/'+prefix : '')+'/new-privacy-policy/';

let last;
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
const copy=translation(lang,policy);
await CC.run({
  mode:'opt-in', revision:REVISION, hideFromBots:false, manageScriptTags:false,
  cookie:{name:STORAGE_KEY, useLocalStorage:true, expiresAfterDays:EXPIRY_DAYS},
  guiOptions:{consentModal:{layout:'box wide',position:'bottom center',equalWeightButtons:true,flipButtons:false},preferencesModal:{layout:'box',equalWeightButtons:true}},
  categories:{
    necessary:{enabled:true,readOnly:true},
    analytics:{autoClear:{cookies:[{name:/^_ga/},{name:/^_gid$/},{name:/^_cl(ck|sk)$/}]}},
    advertising:{readOnly:gpc,autoClear:{cookies:[{name:/^_gcl_/},{name:/^_fb(c|p)$/}]}}
  },
  onConsent:apply, onChange:apply,
  onModalShow:()=>document.documentElement.setAttribute('data-consent-open',''),
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
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY || event.key===null)location.reload();});
