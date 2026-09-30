"""Apply the owner's 24 September yoga-film reuse to six current yoga routes.
Run from any directory with an explicit --backup-dir. Each mutation batch is <=25 files.
"""
import argparse,hashlib,json,re
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--backup-dir',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[1];backup=Path(args.backup_dir);backup.mkdir(parents=True,exist_ok=True)
manifest=json.loads((root/'english-candidate/route-manifest.json').read_text())
routes={
 '/yoga-meditation-training/':'testimonials',
 '/yoga-meditation-program/':'testimonials',
 '/yoga-based-stress-energy-reset-program/':'testimonials',
 '/digestive-wellness-gut-health-yoga-therapy/':'testimonials',
 '/yoga-meditation-programs/':'guidance',
 '/yoga-retreats/':'practice',
}
film='''<section id="yoga-film" class="ahv-yoga-film" aria-labelledby="yoga-film-title" data-ahv-yoga-film="1">
<style>.ahv-yoga-film{width:min(1220px,94%);margin:56px auto 0;padding:32px;background:#EAE5D4;box-sizing:border-box;border-radius:4px}.ahv-yoga-film-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:34px;align-items:center}.ahv-yoga-film-poster{display:block;position:relative;padding:0!important;aspect-ratio:16/9;overflow:hidden;border-radius:3px;background:#003c26}.ahv-yoga-film-poster img{position:absolute!important;inset:0;width:100%!important;height:100%!important;max-height:none!important;object-fit:cover;display:block}.ahv-yoga-film-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#F7F4EA;color:#006038;font-size:24px;padding-left:4px;box-sizing:border-box;box-shadow:0 3px 15px #0003}.ahv-yoga-film h2{font-family:Marcellus,serif;font-size:clamp(27px,3vw,38px);line-height:1.2;font-weight:400;margin:0 0 18px}.ahv-yoga-film p{font-size:17px;line-height:1.75;margin:0 0 16px;color:#2A2118}.ahv-yoga-film .ahv-yoga-film-eyebrow{font:700 12px Mulish,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#80601e;margin-bottom:14px}.ahv-yoga-film-link{min-height:48px;display:inline-flex;align-items:center;gap:8px;font:700 16px Mulish,sans-serif;text-decoration:underline;text-underline-offset:5px;color:#006038}.ahv-yoga-film a:focus-visible{outline:3px solid #80601e;outline-offset:5px}.ahv-yoga-film .ahv-yoga-film-note{font-size:13px;color:#635B4B;margin:6px 0 0}@media(max-width:760px){.ahv-yoga-film{width:calc(100% - 40px);padding:22px;margin-top:40px}.ahv-yoga-film-grid{grid-template-columns:1fr;gap:24px}.ahv-yoga-film h2{font-size:28px}}</style>
<div class="ahv-yoga-film-grid"><a class="ahv-yoga-film-poster" href="https://www.youtube.com/watch?v=ExM6_gMdRHs" target="_blank" rel="noopener noreferrer" aria-label="Watch Yoga at the Healing Village — opens YouTube in a new tab"><img src="/ahv/assets/img/gallery-2026-09-24/08-yoga-side-female-patient-02.webp" alt="Yoga practice in Kairali’s bright studio" width="1600" height="1066" loading="lazy"><span class="ahv-yoga-film-play" aria-hidden="true">▶</span></a><div><p class="ahv-yoga-film-eyebrow">Watch the film</p><h2 id="yoga-film-title">Yoga at the Healing Village</h2><p>Take a closer look at the setting and experience of a yoga retreat at Kairali.</p><a class="ahv-yoga-film-link" href="https://www.youtube.com/watch?v=ExM6_gMdRHs" target="_blank" rel="noopener noreferrer">Watch yoga film <span aria-hidden="true">↗</span></a><p class="ahv-yoga-film-note">Opens on YouTube in a new tab.</p></div></div></section>'''
changes={};touched_routes=[]
def inject(s,target):
 if 'data-ahv-yoga-film="1"' in s:return s
 pattern=r'<section\b[^>]*aria-label="Guidance"[^>]*>' if target=='guidance' else r'<section\b[^>]*\bid="'+target+r'"[^>]*>'
 found=re.search(pattern,s);assert found, 'Insertion target missing: '+target
 return s[:found.start()]+film+'\n'+s[found.start():]
for route in manifest['routes']:
 path=route['path']
 if path not in routes:continue
 for key in ['desktopView','mobileView']:
  p=root/'public/ahv/views'/(route[key]+'.json');d=json.loads(p.read_text());d['template']=inject(d['template'],routes[path]);changes[p]=json.dumps(d,ensure_ascii=False,separators=(',',':'))
 name=path.strip('/')+'.html';p=root/'english-candidate/prerender'/name;changes[p]=inject(p.read_text(),routes[path]);touched_routes.append(path)
# Re-label this exact video's old website title only. Historical retreat names and URLs stay intact.
old='Amazing Experience at Lakshya Yoga Retreat, June 2017'
for folder,pattern in [('public/ahv/views','*.json'),('public/ahv/assets','*.js'),('english-candidate/prerender','*.html')]:
 for p in (root/folder).glob(pattern):
  s=changes.get(p,p.read_text())
  if old in s:changes[p]=s.replace(old,'Yoga at the Healing Village')
index=root/'english-candidate/prerender/index.json';data=json.loads(index.read_text())
for row in data['routes']:
 p=root/'english-candidate/prerender'/row['file']
 if p in changes:
  row['bytes']=len(changes[p].encode());row['imgs']=len(re.findall(r'<img\b',changes[p]));row['snapshotUpdate']='Owner yoga-film reuse and neutral video label, 2026-09-24'
changes[index]=json.dumps(data,ensure_ascii=False,indent=1)+'\n'
changed=[(p,s) for p,s in changes.items() if p.read_text()!=s]
if not changed:
 print('Already applied; no files changed.');raise SystemExit(0)
receipts=[]
for start in range(0,len(changed),25):
 batch=changed[start:start+25]
 for p,s in batch:
  rel=p.relative_to(root);b=backup/rel;b.parent.mkdir(parents=True,exist_ok=True)
  if not b.exists():b.write_bytes(p.read_bytes())
  assert b.read_bytes()==p.read_bytes(),'Backup mismatch: '+str(rel)
  receipts.append({'path':str(rel),'before':hashlib.sha256(p.read_bytes()).hexdigest(),'after':hashlib.sha256(s.encode()).hexdigest()})
 for p,s in batch:p.write_text(s)
 print('Updated batch:',len(batch))
(backup/'changes.json').write_text(json.dumps({'routes':touched_routes,'video':'https://www.youtube.com/watch?v=ExM6_gMdRHs','files':receipts},indent=2)+'\n')
print('Updated files:',len(changed))
