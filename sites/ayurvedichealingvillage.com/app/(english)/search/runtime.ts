import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { LocaleCode } from '../_families/l10n';

type SearchRuntime = { script: string; index: any; catalog: Record<string, string>; chrome: string };
const cache = new Map<LocaleCode, SearchRuntime>();

export function searchRuntime(locale: LocaleCode): SearchRuntime {
  if (!cache.has(locale)) {
    cache.set(locale, JSON.parse(fs.readFileSync(path.join(process.cwd(), 'search-runtime', `${locale}.json`), 'utf8')));
  }
  return cache.get(locale)!;
}

/** Same accepted catalogue lookup as the site, with search's own deployment data. */
export function translateSearch(locale: LocaleCode, english: string): string {
  if (locale === 'en' || !english) return english;
  const norm = english.replace(/[\s ]+/g, m => m.includes(' ') && !/[\t\n\r ]/.test(m) ? ' ' : ' ').trim();
  const id = 't_' + crypto.createHash('sha256').update(norm, 'utf8').digest('hex').slice(0, 20);
  return searchRuntime(locale).catalog[id] ?? english;
}
