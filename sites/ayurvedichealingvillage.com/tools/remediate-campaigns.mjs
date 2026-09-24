import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('public/ahv/assets');
const maps='https://www.google.com/maps/search/?api=1&query=Kairali+The+Ayurvedic+Healing+Village+Palakkad';
const corrections=[[/115\+\s*[Yy]ears/g,'118+ years'],[/115\+/g,'118+'],[/loose weight/gi,'lose weight'],[/Consultion/g,'Consultation'],[/Feautures/g,'Features'],[/Cholestrol/g,'Cholesterol'],[/distintive/g,'distinctive'],[/naturewalk/g,'nature walk'],[/Wight Loss/g,'Weight Loss']];
for(const filename of ['campaign-nine-data.js','campaign-family-data.js']){
 const p=path.join(base,filename),raw=fs.readFileSync(p,'utf8'),start=raw.indexOf('{'),end=raw.lastIndexOf('}');const data=JSON.parse(raw.slice(start,end+1));
 function edit(value,key=''){
  if(typeof value==='string'){
   if(['text','v','h1','alt','title','label'].includes(key))for(const [a,b]of corrections)value=value.replace(a,b);
   if(/South\+Perth|South%20Perth|115\.84934/.test(value))value=maps;
   return value;
  }
  if(Array.isArray(value))return value.map(v=>edit(v,key));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,edit(v,k)]));return value;
 }
 const updated=edit(data);
 fs.writeFileSync(p,raw.slice(0,start)+JSON.stringify(updated)+raw.slice(end+1));
}
