# Optional regeneration: existing fontTools + Node's built-in Brotli; installs nothing.
# All original fonts and licensing metadata are retained. Build uses committed outputs.
import sys,types,subprocess,json
from pathlib import Path
b=types.ModuleType('brotli');b.MODE_FONT=2
b.compress=lambda data,**kw: subprocess.check_output(['node','-e',"const z=require('node:zlib');process.stdout.write(z.brotliCompressSync(require('node:fs').readFileSync(0),{params:{[z.constants.BROTLI_PARAM_MODE]:z.constants.BROTLI_MODE_FONT,[z.constants.BROTLI_PARAM_QUALITY]:11}}))"],input=data)
b.decompress=lambda data: subprocess.check_output(['node','-e',"process.stdout.write(require('node:zlib').brotliDecompressSync(require('node:fs').readFileSync(0)))"],input=data)
sys.modules['brotli']=b
from fontTools import subset
from fontTools.ttLib import TTFont
units=json.load(open('l10n/source/units.json'))['units'];common=set(range(0x180))
for u in units:common.update(map(ord,u['source']))

import re,hashlib
root=Path('public/ahv/fonts');css_paths=list(root.glob('*.css'))
css_sources={p:p.read_text() for p in css_paths}
font_names=sorted(set(re.findall(r'([a-f0-9]{64})(?:[.]common|[.]extra)?[.]woff2',''.join(css_sources.values()))))
records=[]
def ranges(points):
 runs=[]
 for cp in sorted(points):
  if runs and cp==runs[-1][1]+1:runs[-1][1]=cp
  else:runs.append([cp,cp])
 return ','.join('U+%X'%a+('-%X'%b if b!=a else '') for a,b in runs)
for name in font_names:
 source=root/(name+'.ttf');original=TTFont(source, recalcTimestamp=False);cmap=original.getBestCmap();coverage=set(cmap);parts={}
 for kind,points in [('common',coverage&common),('extra',coverage-common)]:
  if not points:continue
  font=TTFont(source, recalcTimestamp=False);options=subset.Options();options.layout_features=['*'];options.name_IDs=['*'];options.recalc_timestamp=False
  worker=subset.Subsetter(options=options);worker.populate(unicodes=points);worker.subset(font);font.flavor='woff2'
  target=root/(name+'.'+kind+'.woff2');font.save(target)
  check=TTFont(target);new_cmap=check.getBestCmap();assert set(new_cmap)==points
  assert check['head'].unitsPerEm==original['head'].unitsPerEm
  for cp,glyph in new_cmap.items():assert check['hmtx'][glyph]==original['hmtx'][cmap[cp]], (name,cp)
  parts[kind]={'range':ranges(points),'bytes':target.stat().st_size,'coverage':points}
 assert set().union(*(v['coverage'] for v in parts.values()))==coverage
 records.append({'font':name,'originalSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'fullBytes':(root/(name+'.woff2')).stat().st_size,'commonBytes':parts['common']['bytes'],'extraBytes':parts.get('extra',{}).get('bytes',0),'codepoints':len(coverage),'commonCodepoints':len(parts['common']['coverage']),'metricsUnchanged':True})
 for css,content in list(css_sources.items()):
  # Regenerate from each original definition once; already-split faces are replaced as a group.
  pattern=r'@font-face\s*\{[^}]*'+re.escape(name)+r'(?:[.]common|[.]extra)?[.]woff2[^}]*\}'
  found=list(re.finditer(pattern,content))
  if not found:continue
  prototype=re.sub(r'unicode-range:[^;}]*;?','',found[0].group())
  prototype=re.sub(re.escape(name)+r'(?:[.]common|[.]extra)?[.]woff2',name+'.woff2',prototype)
  rebuilt='\n'.join(prototype.replace(name+'.woff2',name+'.'+kind+'.woff2').replace('}', 'unicode-range:'+info['range']+';}') for kind,info in parts.items())
  first=True
  def replacement(match):
   global first
   if first:first=False;return rebuilt
   return ''
  css_sources[css]=re.sub(pattern,replacement,content)
for css,content in css_sources.items():css.write_text(re.sub(r'\n{2,}', '\n', content).strip()+'\n')
Path('english-candidate/font-subsets.json').write_text(json.dumps({'method':'common site characters plus remaining Unicode coverage','fonts':records},indent=2)+'\n')
print(json.dumps({'fonts':len(records),'fullBytes':sum(r['fullBytes'] for r in records),'commonBytes':sum(r['commonBytes'] for r in records),'coverageAndMetrics':'PASS'}))
