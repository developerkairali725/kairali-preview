#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { relative } from 'node:path';
import { resolveSiteAppRoot } from './lib/site-app-root.mjs';
const site = process.env.SITE;
if (!site || !/^sites\/[A-Za-z0-9.-]+$/.test(site)) throw new Error('SITE must identify one registered site');
const app = relative(process.cwd(), resolveSiteAppRoot(site)).replaceAll('\\', '/');
// Browser and Lighthouse gates evaluate the deployable production artifact.
// Preview deployments still omit SITE_ENV and therefore retain their noindex
// and inactive-delivery safeguards.
execFileSync('pnpm', ['exec', 'turbo', 'run', 'build', `--filter=./${app}...`], {
  stdio: 'inherit',
  env: { ...process.env, SITE_ENV: 'production' },
});
