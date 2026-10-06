#!/usr/bin/env node
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export function incomplete(results, count) {
  const failures = ['changes', 'brand-lint'].filter(name => results?.[name]?.result !== 'success');
  if (!Number.isInteger(count) || count < 0) failures.push('invalid site count');
  const expected = count === 0 ? ['success', 'skipped'] : ['success'];
  if (!expected.includes(results?.['site-check']?.result)) failures.push('site-check');
  return failures;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const rawCount = process.env.SITE_COUNT;
  const failures = incomplete(JSON.parse(process.env.RESULTS || '{}'), /^\d+$/.test(rawCount || '') ? Number(rawCount) : NaN);
  if (failures.length) { console.error(`Incomplete required checks: ${failures.join(', ')}`); process.exitCode = 1; }
  else console.log('Every affected-site check completed; only an explicit empty plan may skip site QA.');
}
