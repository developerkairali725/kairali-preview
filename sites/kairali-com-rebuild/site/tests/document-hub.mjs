import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../content/downloads.json',import.meta.url),'utf8'));
const results=[];
for(const collection of data.current){
  const hub=`https://kairali-documents.vercel.app/?property=${collection.property}#${collection.id}`;
  const pdf=collection.editions[0].url;
  try{
    const hr=await fetch(hub,{signal:AbortSignal.timeout(20000)}); assert.equal(hr.status,200); const h=await hr.text(); assert.ok(h.includes(`id="${collection.id}"`),`Missing ${collection.id} collection`);
    const r=await fetch(pdf,{headers:{Range:'bytes=0-4'},signal:AbortSignal.timeout(20000)}); assert.ok([200,206].includes(r.status),`PDF status ${r.status}`);
    assert.match(r.headers.get('content-type'),/application\/pdf/); const reader=r.body.getReader(); const first=await reader.read(); assert.equal(Buffer.from(first.value).subarray(0,5).toString(),'%PDF-'); await reader.cancel();
    results.push({collection:collection.id,hub,pdf,ok:true});console.log(`PASS ${collection.id}: maintained collection + current PDF`);
  }catch(e){results.push({collection:collection.id,hub,pdf,ok:false,error:String(e)}); console.error(`FAIL ${collection.id}: ${e}`);}
}
fs.writeFileSync(new URL('../../evidence/document-hub-report.json',import.meta.url),JSON.stringify(results,null,2));
console.log(`${results.filter(r=>r.ok).length}/${results.length} passed`); process.exitCode=results.some(r=>!r.ok)?1:0;
