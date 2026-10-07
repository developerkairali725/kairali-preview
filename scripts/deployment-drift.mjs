#!/usr/bin/env node
// Read-only, authenticated release preflight. Never prints environment values.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export function checkDeploymentMappings(manifest, readProject, log = console.log) {
const failures=[];
for (const expected of manifest.projects) {
 let actual;
 try { actual = readProject(expected, manifest); }
 catch { failures.push(`${expected.name}: project read failed; verify Vercel login, team access and project ID`); continue; }
 if (!actual || typeof actual !== 'object') { failures.push(`${expected.name}: invalid project response`); continue; }
 const differences=[];
 // Git-connected fleet projects must not silently omit the deployment selector.
 if(expected.gitConnected && expected.affectedProjects!==true) differences.push('manifest must require unaffected-project skipping');
 if(actual.id!==expected.id || actual.name!==expected.name) differences.push('project identity');
 if(actual.rootDirectory!==expected.rootDirectory) differences.push('source root');
 if(Boolean(actual.link)!==expected.gitConnected) differences.push('Git connection');
 if(expected.gitConnected && `${actual.link?.org}/${actual.link?.repo}`!==manifest.repository) differences.push('repository');
 if(expected.gitConnected && actual.link?.productionBranch!==expected.branch) differences.push('branch');
 if(expected.affectedProjects===true && actual.enableAffectedProjectsDeployments!==true) differences.push('unaffected-project skipping');
 if(differences.length) failures.push(`${expected.name}: ${differences.join(', ')}`);
 else log(`${expected.name}: deployment mapping PASS (${expected.mode})`);
}
return failures;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
const manifest = JSON.parse(readFileSync('deployment-projects.json','utf8'));
const failures = checkDeploymentMappings(manifest, (expected, config) => JSON.parse(execFileSync('vercel',['api',`/v9/projects/${expected.id}?teamId=${config.teamId}`],{encoding:'utf8',stdio:['ignore','pipe','ignore']})));
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
}
