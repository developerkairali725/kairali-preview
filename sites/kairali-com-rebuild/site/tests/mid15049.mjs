// MID-15049 acceptance: owner removals, hub entry points and fail-closed APIs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8774';
const results = [];
async function check(name, run) {
  try { const detail = await run(); results.push({name, ok:true, detail:detail || ''}); console.log(`PASS ${name}`); }
  catch (e) { results.push({name, ok:false, detail:String(e)}); console.error(`FAIL ${name}: ${e}`); }
}
const get = async (path) => { const r = await fetch(BASE + path); assert.equal(r.status,200); return r.text(); };
for (const route of ['/', '/ayurvedic-healing-village.aspx', '/ayurvedic-medicine.aspx']) {
  await check(`${route}: unsupported promises removed`, async () => {
    const text = await get(route);
    assert.doesNotMatch(text, /solve chronic health problems|absolutely free from side.effects|heal the ailment without any side.effects|Cure your ailments through Ayurveda/i);
    if (route === '/') assert.doesNotMatch(text,/24 more centres|history-of-kairali.webp/);
  });
}
for (const route of ['/', '/ayurvedic-medicine.aspx', '/ayurvedic-products.aspx', '/patented-ayurvedic-remedies.aspx']) {
  await check(`${route}: unsupported product efficacy claims removed`, async () => {
    const text = await get(route);
    assert.doesNotMatch(text, /most effective and genuine therapeutic medicine|stand the test of time in healing|proven success and a wide application|2-4 kg per month|repair and maintenance of normal functioning of the liver|effective remedy for jaundice|boost the libido|proven aphrodisiac|solves sexual disorders|treat gastric problems|significantly reduce cholesterol levels/i);
  });
}
await check('Partnerships: official opening year 1999', async () => {
  const text=await get('/partnerships-and-investment.aspx');
  assert.match(text,/established in the year 1999/); assert.doesNotMatch(text,/established in the year 1997/);
});
await check('Svata: undated price tables removed', async () => {
  const text=await get('/svata-katerina-prague-czech-republic.aspx');
  assert.doesNotMatch(text,/<table\b|08 days Euro|€|rates below/);
  assert.match(text,/Standard Room/); assert.match(text,/Ayurveda Panchakarma/);
});
await check('Search index excludes removed promises and prices', async () => {
  const text=await get('/search-index.json');
  assert.doesNotMatch(text,/24 more centres|solve chronic health problems|absolutely free from side.effects|established in the year 1997|08 days Euro|help in curing numerous ailments|have no side effects|without any side.effects|cure health issues|cure their health.related issues|permanent results|recovery, cure/i);
});
await check('Legacy visible brochure actions use maintained hub', async () => {
  for (const route of ['/ayurvedic-healing-village.aspx','/villa-raag.aspx','/ayurvedic-medicine.aspx','/download-centre.aspx']) {
    const text=await get(route);
    assert.match(text,/href="https:\/\/kairali-documents.vercel.app\//);
    if (route !== '/download-centre.aspx') assert.doesNotMatch(text,/href="\/download\//);
  }
});
await check('Career routes use general interest and HR-pending status', async () => {
  for (const route of ['/careers.aspx','/current-openings.aspx','/apply-now.aspx?id=7']) {
    const text = await get(route);
    assert.match(text,/general expressions of interest/i);
    assert.match(text,/Vacancy status is pending HR confirmation/i);
    const visible = text.match(/<main[^>]*>(.*?)<\/main>/s)?.[1] ?? text;
    assert.doesNotMatch(visible,/Sales Manager|ASP\.Net Developer|Business Development Manager|Ayurveda Therapist|Ayurveda Doctor|Sal971967|ASP586225|Bus476258|Ayu819814|Ayu207815/);
  }
});
for (const id of ['contact','enquiry','svata','consultation','application','newsletter']) {
  await check(`${id}: API rejects before parsing body`, async () => {
    const r=await fetch(`${BASE}/api/forms/${id}`,{method:'POST',headers:{'Content-Type':'multipart/form-data; boundary=synthetic-qa'},body:'Deliberately malformed synthetic test body'});
    assert.equal(r.status,503); assert.equal((await r.json()).reason,'preview-inactive'); assert.match(r.headers.get('cache-control'),/no-store/);
  });
}
await check('Preview noindex across affected pages', async () => {
  for (const route of ['/','/onlineconsultation.aspx','/download-centre.aspx','/svata-katerina-prague-czech-republic.aspx']) {
    const r=await fetch(BASE+route); assert.match(r.headers.get('x-robots-tag'),/noindex/);
    const text=await r.text(); assert.doesNotMatch(text,/<script[^>]+src="https:\/\/(www.googletagmanager.com|www.clarity.ms)/);
  }
});
fs.writeFileSync(new URL('../../evidence/mid15049-report.json',import.meta.url),JSON.stringify(results,null,2));
console.log(`${results.filter(r=>r.ok).length}/${results.length} passed`);
process.exitCode=results.some(r=>!r.ok)?1:0;
