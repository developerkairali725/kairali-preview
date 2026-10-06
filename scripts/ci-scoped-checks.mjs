#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { resolveSiteAppRoot } from './lib/site-app-root.mjs';

const [mode, file] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(file, 'utf8'));
if (!Array.isArray(plan.sites) || plan.sites.some(s => typeof s !== 'string' || !/^sites\/[A-Za-z0-9.-]+$/.test(s))) throw new Error('Invalid site plan');
const node = (...args) => execFileSync(process.execPath, args, { stdio: 'inherit' });
if (!['brand', 'compliance', 'unit'].includes(mode)) throw new Error('Unknown check mode');
console.log(`${mode}: ${plan.sites.length} affected site(s): ${plan.sites.join(', ') || 'none — unchanged'}`);
for (const site of plan.sites) {
  const app = resolveSiteAppRoot(site);
  if (mode === 'brand') {
    node('packages/ui/bin/brand-lint.js', site);
    node('scripts/banned-string-lint.mjs', '--maintenance', '--root', site);
    node('scripts/cta-label-lint.mjs', '--root', site);
    node('scripts/chat-bubble-lint.mjs', '--only', site.slice(6));
    node('scripts/footer-socials-lint.mjs', '--only', site.slice(6));
  } else if (mode === 'compliance') {
    node('packages/compliance/bin/lint.js', site);
    if (site === 'sites/whatisayurveda.com') node('scripts/content-lint.mjs', '--quiet');
  } else {
    const pkg = JSON.parse(readFileSync(join(app, 'package.json'), 'utf8'));
    if (pkg.scripts?.test) execFileSync('pnpm', ['--dir', app, 'run', 'test'], { stdio: 'inherit' });
    else {
      const dir = join(app, 'test');
      const tests = existsSync(dir) ? readdirSync(dir).filter(f => /\.test\.(mjs|js|cjs)$/.test(f)).map(f => join(dir, f)) : [];
      if (tests.length) node('--test', ...tests);
      else console.log(`${relative(resolve('.'), app)}: no site unit-test files; browser checks still apply`);
    }
  }
}
