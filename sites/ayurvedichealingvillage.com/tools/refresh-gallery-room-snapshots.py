"""Refresh only approved gallery main and room amenities in existing SSR snapshots.
Run after tools/apply-gallery-room-final.mjs. No network or browser side effects.
"""
import json,re,html,hashlib,subprocess
from pathlib import Path
from html.parser import HTMLParser
S=Path(__file__).resolve().parent.parent
data=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),vm=require('vm');let w={};\nfor(const f of ['gallery-hub-2026-candidate.js','rooms-2026-candidate.js'])vm.runInNewContext(fs.readFileSync('public/ahv/assets/'+f,'utf8'),{window:w});\nconst G=w.AHV_GALLERY_2026,A='https://ayurvedichealingvillage.com';const f=G.featured.map(c=>({...c,url:A+c.href}));\nconst out={gallery:{G,lead:f[0],side:f.slice(1),more:G.more.map(c=>({...c,url:A+c.href,hasMeta:!!c.meta})),media:G.media.map(m=>({...m,url:A+m.href,isFilm:m.kind==='film',isTour:m.kind==='tour'}))}};\nfor(const k of ['maharaja','deluxe','royal','classic'])out[k]={F:w.AHV_ROOMS_2026.features(k)};\nprocess.stdout.write(JSON.stringify(out));\n"],cwd=S,text=True))
void={'img','br','hr','input','meta','link','source','wbr','area','base','embed','param','track','col'}
class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=False);self.root=['root',{},[]];self.stack=[self.root]
 def handle_starttag(self,t,a):
  n=[t,dict(a),[]];self.stack[-1][2].append(n)
  if t not in void:self.stack.append(n)
 def handle_endtag(self,t):
  if t not in void:
   assert self.stack[-1][0]==t,(self.stack[-1][0],t)
   self.stack.pop()
 def handle_data(self,s):self.stack[-1][2].append(s)
 def handle_entityref(self,s):self.handle_data('&'+s+';')
 def handle_charref(self,s):self.handle_data('&#'+s+';')
def val(expr,c):
 expr=expr.strip()
 if expr=='true':return True
 if expr=='false':return False
 v=c
 for k in expr.split('.'):v=v[k]
 return v
def subst(s,c):return re.sub(r'{{(.*?)}}',lambda m:html.escape(str(val(m[1],c)),quote=True),s)
def render(n,c):
 if isinstance(n,str):return subst(n,c)
 tag,attrs,children=n
 if tag=='sc-for':return ''.join(render(x,{**c,attrs['as']:v}) for v in val(attrs['list'].strip('{} '),c) for x in children)
 if tag=='sc-if':return ''.join(render(x,c) for x in children) if val(attrs['value'].strip('{} '),c) else ''
 a=''.join(' '+k+('="'+subst(v,c)+'"' if v is not None else '') for k,v in attrs.items() if not k.lower().startswith(('onclick','style-hover','hint-')))
 return ('' if tag=='root' else '<'+tag+a+'>')+''.join(render(x,c) for x in children)+('' if tag in void or tag=='root' else '</'+tag+'>')
def compile(s,c):p=Parser();p.feed(s);assert len(p.stack)==1;return render(p.root,c)
receipt=[]
for slug,key in [('gallery','gallery'),('maharaja-suite','maharaja'),('deluxe-villa','deluxe'),('royal-villa','royal'),('classic-villa','classic')]:
 p=S/'english-candidate/prerender'/f'{slug}.html';old=p.read_text();template=json.loads((S/'public/ahv/views'/f'ahv-page-{slug}-mobile.json').read_text())['template']
 if key=='gallery':
  main=re.search(r'<main\b[\s\S]*?</main>',template)[0];new=re.sub(r'<main\b[\s\S]*?</main>',lambda m:compile(main,data[key]),old,count=1)
 else:
  pat=r'<section\b[^>]*id="amenities"[\s\S]*?</section>';section=re.search(pat,template)[0];new=re.sub(pat,lambda m:compile(section,data[key]),old,count=1)
  if key=='maharaja':
   new=new.replace('Twin/King Size Bed','Two suite layouts').replace('There are two separate rooms in the suite, one of which has an impressive king-size bed.','There are two suite layouts. Suite 1001 has a bedroom with a king-size bed and a separate living room; Suite 1002 has two bedrooms, one with a king-size bed and one with twin beds. Each suite has two bathrooms and two wardrobes, one of each in each room.')
   new=re.sub(r'(<th[^>]*>)Bed(</th>)',r'\1Layout\2',new)
   for name,text in [('Shivalya','King bedroom and separate living room'),('Brahmalaya','King bedroom and twin bedroom')]:
    new=re.sub(r'('+name+r'</th>\s*<td[^>]*>)[^<]+',lambda m:m[1]+text,new)
 new=re.sub(r'[ \t]+(?=\n)', '',new)
 assert '{{' not in new,slug
 if new==old:continue
 p.write_text(new);receipt.append({'path':'/'+slug+'/','before':hashlib.sha256(old.encode()).hexdigest(),'after':hashlib.sha256(new.encode()).hexdigest(),'bytes':len(new.encode())})
p=S/'english-candidate/prerender/index.json';idx=json.loads(p.read_text())
for row in idx['routes']:
 for r in receipt:
  if row['path']==r['path']:row['bytes']=r['bytes'];row['snapshotUpdate']='Owner-approved gallery/room final source, deterministic selected sections, 2026-09-24'
p.write_text(json.dumps(idx,indent=1)+'\n')
if receipt:(S/'english-candidate/gallery-room-snapshot-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n');print(receipt)
