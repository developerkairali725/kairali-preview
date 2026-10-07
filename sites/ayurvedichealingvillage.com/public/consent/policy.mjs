import { promptForCountry } from './regions.mjs';
// Candidate retention and copy require owner/privacy review before publication.
export const REVISION = 2;
export const EXPIRY_DAYS = 182;
// At least twelve months, including a leap year. Refusal never grants a vendor.
export const REFUSAL_DAYS = 366;
export const STORAGE_KEY = 'ahv-consent-v2';
export const REFUSAL_KEY = 'ahv-consent-refusals-v1';
const DAY = 86400000;
export function preferences(categories, globalPrivacyControl = false) {
  const choices = Array.isArray(categories) ? categories : [];
  return { analytics: choices.includes('analytics'), advertising: !globalPrivacyControl && choices.includes('advertising') };
}
export function legacyRejection(storage) {
  try { return !storage.getItem('ahv-consent-migrated-v2') && !storage.getItem(STORAGE_KEY) && storage.getItem('ktahv-consent') === 'declined'; } catch { return false; }
}
export function readSavedChoice(storage, now = Date.now()) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.categories) || saved.categories.some(c => !['necessary', 'analytics', 'advertising'].includes(c))) return null;
    const first = Date.parse(saved.consentTimestamp), last = Date.parse(saved.lastConsentTimestamp);
    const optional = saved.categories.some(c => c === 'analytics' || c === 'advertising');
    if (typeof saved.consentId !== 'string' || !saved.consentId || !Number.isInteger(saved.revision) || saved.revision < 1 || saved.revision > REVISION) return null;
    if (!Number.isFinite(first) || !Number.isFinite(last) || first > last || last > now || first <= 0) return null;
    if (!Number.isFinite(saved.expirationTime) || saved.expirationTime <= last || saved.expirationTime > last + (optional ? EXPIRY_DAYS : REFUSAL_DAYS) * DAY + 1000) return null;
    return saved;
  } catch { return null; }
}
export function readRefusals(storage, now = Date.now()) {
  let saved;
  try { saved = JSON.parse(storage.getItem(REFUSAL_KEY)); } catch {}
  const result = { version: 1 };
  for (const category of ['analytics', 'advertising']) {
    const at = saved?.version === 1 && saved[category];
    if (Number.isFinite(at) && at > 0 && at <= now && now - at < REFUSAL_DAYS * DAY) result[category] = at;
  }
  return result;
}
export function hasRefusal(record) { return !!(record.analytics || record.advertising); }
export function recordRefusals(storage, categories, at = Date.now(), { explicit = false, gpc = false } = {}) {
  const record = readRefusals(storage);
  for (const category of ['analytics', 'advertising']) {
    if (categories.includes(category) && !(category === 'advertising' && gpc)) {
      if (explicit) delete record[category];
    } else if (explicit || !record[category]) record[category] = at;
  }
  try { storage.setItem(REFUSAL_KEY, JSON.stringify(record)); } catch {}
  return record;
}
const publicOrigins = new Set(['https://ayurvedichealingvillage.com', 'https://www.ayurvedichealingvillage.com']);
export function tracePrompt(text, origin, now = Date.now()) {
  if (!publicOrigins.has(origin) || typeof text !== 'string' || text.length > 4096) return true;
  // Select only these three fields. Do not retain/log IP, UA or other trace data.
  const fields = {};
  for (const line of text.split('\n')) {
    const match = /^(h|loc|ts)=(.*)$/.exec(line);
    if (!match) continue;
    if (Object.hasOwn(fields, match[1])) return true;
    fields[match[1]] = match[2];
  }
  if (fields.h !== new URL(origin).hostname || !/^\d{10}(?:\.\d{1,9})?$/.test(fields.ts || '')) return true;
  const age = now - Number(fields.ts) * 1000;
  if (age < -10000 || age > 60000) return true;
  return promptForCountry(fields.loc) !== 'passive';
}
async function boundedText(response, maxBytes = 4096) {
  if (Number(response.headers.get('content-length')) > maxBytes || !response.body) throw Error('invalid region response');
  const reader = response.body.getReader(), decoder = new TextDecoder();
  let text = '', bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      bytes += value.byteLength;
      if (bytes > maxBytes) throw Error('invalid region response');
      text += decoder.decode(value, { stream: true });
    }
  } finally { await reader.cancel().catch(() => {}); }
}
export async function automaticPrompt(fetcher = fetch, timeoutMs = 1500, origin = globalThis.location?.origin) {
  const controller = new AbortController();
  let timer;
  try {
    const result = await Promise.race([
      (async () => {
        const cloudflare = publicOrigins.has(origin);
        const url = cloudflare ? origin + '/cdn-cgi/trace' : '/api/consent-region/';
        const response = await fetcher(url, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', signal: controller.signal });
        if (cloudflare) {
          if (!response.ok || response.redirected || response.url !== url || !response.headers.get('content-type')?.startsWith('text/plain')) return true;
          const age = response.headers.get('age'), cache = response.headers.get('cf-cache-status');
          if ((age !== null && (!/^\d+$/.test(age) || Number(age) > 0)) || (cache !== null && !['DYNAMIC', 'BYPASS', 'MISS'].includes(cache))) return true;
          return tracePrompt(await boundedText(response), origin);
        }
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return true;
        const value = await response.json();
        return value?.version !== 1 || value?.prompt !== 'passive';
      })(),
      new Promise(resolve => { timer = setTimeout(() => { controller.abort(); resolve(true); }, timeoutMs); }),
    ]);
    return result;
  } catch { return true; } finally { clearTimeout(timer); }
}
