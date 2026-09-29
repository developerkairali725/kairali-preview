"""Propagate narrow reviewed image/alt corrections to existing mobile SSR bodies.
A full snapshot rebuild remains the combined release step.
"""
from pathlib import Path
import gzip,json,re,hashlib
base=Path(__file__).resolve().parents[1]
old='Side view of female patient in crescent lunge with arms extended overhead on a teal mat in a bright glass-walled'
new=old+' hall'
hashid=lambda s:'t_'+hashlib.sha256(s.encode()).hexdigest()[:20]
count=0
for locale in ['en']+list(json.loads((base/'l10n/locales.json').read_text())):
 if locale=='en': root=base/'english-candidate/prerender';suffix='.html';a,b=old,new
 else:
  root=base/'l10n/prerender'/locale;suffix='.html.gz'
  cat=json.loads((base/f'l10n/generated/{locale}.catalog.json').read_text());a=cat.get(hashid(old));b=cat.get(hashid(new))
 for slug in ['ayurvedic-treatments','what-is-yoga']:
  p=root/(slug+suffix)
  if not p.exists():continue
  raw=p.read_bytes();s=gzip.decompress(raw).decode() if locale!='en' else raw.decode();before=s
  if slug=='ayurvedic-treatments':
   def fix(m):
    tag=m[0]
    if 'srcset=' in tag:return tag
    return tag.replace(' width=', ' srcset="/ahv/assets/img/ayurveda-training-768.webp 768w, /ahv/assets/img/ayurveda-training.webp 1920w" sizes="(min-width: 1327px) 1218px, calc(92vw - 2px)" width=',1)
   s=re.sub(r'<img[^>]+src="/ahv/assets/img/ayurveda-training.webp"[^>]*>',fix,s)
  elif a and b:s=s.replace('alt="'+a+'"','alt="'+b+'"')
  if s!=before:
   p.write_bytes(gzip.compress(s.encode(),mtime=0) if locale!='en' else s.encode());count+=1
print('Snapshot deltas:',count)
