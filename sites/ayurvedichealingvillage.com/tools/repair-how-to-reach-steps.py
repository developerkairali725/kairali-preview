"""Repair only the dedicated How to Reach map section after design imports."""
from pathlib import Path
import json,re
SITE=Path(__file__).resolve().parents[1]
MAPS=[('9653d662c2fc437a5f8c23e8bef405d70675dedd13aa48633614f1e30dc79abf.webp','Map of India highlighting Kerala on the south-west coast'),('f36802a3b9f5345de250dc23004d4b5e14396915f863443e0466434a125d9b9e.webp','Map of Kerala highlighting Palakkad District')]
BUTTON='min-height:48px;padding:10px 20px;border:1px solid #5A4420;border-radius:4px;background:#FFFFFF;color:#5A4420;font:700 14px Mulish,sans-serif;cursor:pointer;'
EXTRA='''
  openZoom() {
    const img = this.root.querySelector('[data-panel="' + this.step + '"] img');
    const dialog = this.root.querySelector('[data-map-dialog]');
    if (!img || !dialog) return;
    const large = dialog.querySelector('img');
    large.src = img.src; large.alt = img.alt;
    dialog.querySelector('h3').textContent = ['India', 'Kerala', 'Palakkad', 'The grounds'][this.step];
    dialog.showModal();
  }
  closeZoom() { const d = this.root.querySelector('[data-map-dialog]'); if (d) d.close(); }
'''
for variant in ['desktop','mobile']:
 p=SITE/f'public/ahv/views/ahv-page-how-to-reach-{variant}.json'; d=json.loads(p.read_text());t=d['template']
 if 'data-map-dialog' not in t:
  for i,(file,alt) in enumerate(MAPS):
   pattern=r'(<div data-panel="'+str(i)+r'"[^>]*>).*?(</div>)'
   img=f'<img src="/ahv/assets/img/travel/{file}" alt="{alt}" style="display:block;width:100%;height:100%;object-fit:contain;padding:20px;box-sizing:border-box;" loading="eager">'
   t,n=re.subn(pattern,lambda m:m[1]+img+m[2],t,count=1,flags=re.S);assert n==1
  t=re.sub(r'(<p data-cap="0"[^>]*>).*?</p>',r'\1India, with Kerala highlighted on the south-west coast.</p>',t,flags=re.S)
  t=re.sub(r'(<p data-cap="1"[^>]*>).*?</p>',r'\1Kerala, with Palakkad District highlighted inland near the Tamil Nadu border.</p>',t,flags=re.S)
  t=t.replace('onClick="{{ onPrev }}"','data-map-prev="1" disabled onClick="{{ onPrev }}"').replace('onClick="{{ onNext }}"','data-map-next="1" onClick="{{ onNext }}"').replace('>Zoom in</button>','>Next</button>')
  t=re.sub(r'<a href="https://www.google.com/maps/place/[^>]*>View larger map</a>\s*','',t)
  t=t.replace('>Get directions</a>','>Get directions in Google Maps</a>').replace('>Open the road route</a>','>Open road route in Google Maps</a>').replace('>Open live directions</a>','>Open directions in Google Maps</a>')
  t=re.sub(r'Steps 1–2 (?:are drawn from Natural Earth country geometry|use Natural Earth geometry)\. Steps 3–4 are diagrams, not to scale\.', 'Maps and diagrams are for orientation, not to scale. Use Google Maps for live road directions.',t)
  pos=t.index('<p data-cap="0"')
  t=t[:pos]+f'<div style="margin:0 0 16px;"><button type="button" data-map-zoom="1" onClick="{{{{ onZoom }}}}" style="{BUTTON}">Enlarge map</button></div>\n      '+t[pos:]
  pos=t.index('  </section>',t.index('Four steps in'))
  dialog=f'''<dialog data-map-dialog="1" aria-label="Enlarged map" style="width:min(1100px,94vw);max-width:94vw;max-height:92vh;padding:16px;box-sizing:border-box;border:1px solid #C9BFA8;border-radius:6px;background:#F7F4EA;color:#2A2118;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:12px;"><h3 style="font:400 24px Marcellus,serif;margin:0;">Map</h3><button type="button" onClick="{{{{ onCloseZoom }}}}" style="{BUTTON}">Close map</button></div>
      <img alt="" style="display:block;width:100%;height:calc(85vh - 100px);object-fit:contain;">
    </dialog>\n'''
  t=t[:pos]+dialog+t[pos:]
  logic=d['logic'];logic=logic[:logic.index('  waitForLibs()')]+EXTRA+'}\n'
  logic=logic.replace('this.sync(); this.waitForLibs();','this.sync();')
  logic=logic.replace('      onPrev:', '      onZoom: () => this.openZoom(),\n      onCloseZoom: () => this.closeZoom(),\n      onPrev:')
  needle='    if (!this.root) return;'
  logic=logic.replace(needle,needle+'''
    this.q('[data-map-prev], [data-map-next]').forEach(b => {
      const disabled = b.hasAttribute('data-map-prev') ? this.step === 0 : this.step === 3;
      b.disabled = disabled; b.style.opacity = disabled ? '0.4' : '1';
      b.style.cursor = disabled ? 'default' : 'pointer';
    });
    this.q('[data-map-zoom]').forEach(b => { b.hidden = this.step === 2; });
''')
  logic=logic.replace('this.root = el;', 'this.root = el; requestAnimationFrame(() => this.sync());')
  d['template']=t;d['logic']=logic;d['scripts']=[]
  p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':'))+'\n')
 if variant=='mobile': mobile=t
p=SITE/'english-candidate/prerender/how-to-reach.html';html=p.read_text()
def bounds(s):
 h=s.index('Four steps in');return s.rfind('<section',0,h),s.index('</section>',h)+len('</section>')
a,b=bounds(mobile);section=mobile[a:b];section=re.sub(r' onClick="[^"]*"','',section)
a,b=bounds(html);html=html[:a]+section+html[b:];p.write_text(html)
p=SITE/'english-candidate/prerender/index.json';d=json.loads(p.read_text())
for r in d['routes']:
 if r['path']=='/how-to-reach/':r['bytes']=len(html.encode())
p.write_text(json.dumps(d,ensure_ascii=False,indent=1)+'\n')
print('Repaired desktop/mobile map section and SSR snapshot.')
