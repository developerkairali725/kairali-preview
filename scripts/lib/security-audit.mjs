#!/usr/bin/env node
// Preserve the audit threshold. A locally fixed advisory passes only after
// every reported dependency path resolves to hash-verified, regression-tested code.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
export const PATCHED_ADVISORY = 'GHSA-vfj7-8cjw-p6xm';

export function classifyAudit(report, verifyPath, expectedDetails) {
  if (!report?.advisories || !report.metadata || report.error) throw Error('Invalid or unavailable audit report');
  if (Array.isArray(report.advisories) || !report.metadata.vulnerabilities) throw Error('Incomplete audit schema');
  for (const severity of ['high','critical']) {
    const count=report.metadata.vulnerabilities[severity];
    if(!Number.isInteger(count) || count<0 || count!==Object.values(report.advisories).filter(a=>a.severity===severity).length) throw Error('Audit advisory counts do not reconcile');
  }
  const results=[];
  for (const advisory of Object.values(report.advisories)) {
    const findings=advisory.findings;
    const detailsMatch=expectedDetails && ['title','cwe','vulnerable_versions','patched_versions','severity'].every(key=>
      typeof expectedDetails[key]==='string' && expectedDetails[key]===advisory[key]);
    const eligible=detailsMatch && advisory.github_advisory_id===PATCHED_ADVISORY && advisory.module_name==='braces' &&
      Array.isArray(findings) && findings.length>0 && findings.every(f=>f.version==='3.0.3' && Array.isArray(f.paths) && f.paths.length>0);
    const paths=eligible ? [...new Set(findings.flatMap(f=>f.paths))] : [];
    const patched=eligible && paths.every(p=>verifyPath(p));
    const blocking=!patched && !['low','moderate','info'].includes(advisory.severity);
    results.push({id:advisory.github_advisory_id, severity:advisory.severity, patched, blocking, paths});
  }
  return results;
}

function packageDirectory(name, from) {
  const require=createRequire(join(from,'package.json'));
  let entry;
  try { entry=require.resolve(`${name}/package.json`); }
  catch { entry=require.resolve(name); }
  for(let dir=dirname(entry);;dir=dirname(dir)) {
    const pkg=join(dir,'package.json');
    if(existsSync(pkg) && JSON.parse(readFileSync(pkg,'utf8')).name===name) return realpathSync(dir);
    if(dirname(dir)===dir) throw Error(`Cannot resolve dependency ${name}`);
  }
}

export function verifyBracesPath(root, dependencyPath, manifest) {
  const [importer,...chain]=dependencyPath.split('>');
  const site=importer.replaceAll('__','/');
  if(!(site==='.' || /^(sites|packages)(\/[a-zA-Z0-9@_.-]+)+$/.test(site)) || site.split('/').includes('..') || !chain.length || chain.at(-1)!=='braces') return false;
  let dir=resolve(root,site);
  if(relative(root,dir).startsWith('..')) return false;
  for(const dependency of chain) dir=packageDirectory(dependency,dir);
  if(JSON.parse(readFileSync(join(dir,'package.json'),'utf8')).version!==manifest.version) return false;
  for(const [file,hash] of Object.entries(manifest.files)) {
    if(createHash('sha256').update(readFileSync(join(dir,file))).digest('hex')!==hash) return false;
  }
  // Isolated process gives malicious/deep inputs a strict time bound.
  execFileSync(process.execPath,['--input-type=commonjs','-e',`
    const assert=require('node:assert/strict');
    const braces=require(process.argv[1]);
    const bounded=e=>e instanceof SyntaxError && e.message==='Maximum brace nesting depth exceeded';
    const deep='{'.repeat(4000)+'a,b'+'}'.repeat(4000);
    for(const fn of [braces,braces.parse,braces.compile,braces.expand,braces.stringify]) assert.throws(()=>fn(deep),bounded);
    assert.throws(()=>braces.compile('('.repeat(4000)+'x'+')'.repeat(4000)),bounded);
    for(const fn of [braces.compile,braces.expand,braces.stringify]) {
      let ast={type:'text',value:'x'};
      for(let i=0;i<1000;i++) ast={type:'root',nodes:[ast]};
      assert.throws(()=>fn(ast),bounded);
    }
    assert.deepEqual(braces.expand('a/{b,c}/d'),['a/b/d','a/c/d']);
    assert.equal(braces.compile('a/{b,c}/d'),'a/(b|c)/d');
    assert.deepEqual(braces.expand('{01..03}'),['01','02','03']);
    assert.equal(braces.stringify(braces.parse('a/{b,c}/d')),'a/{b,c}/d');
  `,dir],{stdio:['ignore','pipe','pipe'],timeout:5000});
  return true;
}

if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  try {
    let raw;
    try { raw=execFileSync('pnpm',['audit','--json'],{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:120000}); }
    catch(error) { if(error.status!==1 || !error.stdout) throw Error('Dependency audit could not complete'); raw=error.stdout; }
    const report=JSON.parse(raw),root=process.cwd();
    const manifest=JSON.parse(readFileSync(join(root,'gates/security-patches/braces-3.0.3.json'),'utf8'));
    if(manifest.advisory!==PATCHED_ADVISORY || manifest.version!=='3.0.3' || !manifest.files['lib/depth.js']) throw Error('Invalid security patch manifest');
    const results=classifyAudit(report,path=>{
      try {
        const verified=verifyBracesPath(root,path,manifest);
        if(!verified) console.error(`Patch verification failed for ${path}: path, version or source hash differs`);
        return verified;
      } catch(error) { console.error(`Patch verification failed for ${path}: ${error.message}`); return false; }
    },manifest.advisory_details);
    for(const r of results) console.log(`${r.patched?'PATCH VERIFIED':r.blocking?'FAIL':'WARN'} ${r.id} (${r.severity})${r.patched?' — every reported path passed source integrity and depth regression checks':''}`);
    const failures=results.filter(r=>r.blocking).length;
    console.log(`security-audit: ${failures} unmitigated high/critical finding(s), ${results.filter(r=>r.patched).length} verified local patch(es), ${results.filter(r=>!r.blocking&&!r.patched).length} warning(s)`);
    process.exitCode=failures?1:0;
  } catch(error) { console.error(`security-audit: FAIL — ${error.message}`);process.exitCode=1; }
}
