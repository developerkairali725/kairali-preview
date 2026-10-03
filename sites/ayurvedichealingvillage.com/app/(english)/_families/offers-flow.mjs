/** Owner 3 Oct: the senior programme must be discoverable before the rate/enquiry. English only; preserve locale source archives. */
export function offersFlow(html, route, locale = 'en') {
 if(route !== '/offers/' || locale !== 'en' || !html || html.includes('data-senior-flow="1"')) return html;
 const i=html.indexOf('Holistic Ayurvedic');
 if(i<0)return html;
 const start=html.lastIndexOf('<article',i),end=html.indexOf('</article>',i);
 if(start<0 || end<0)return html;
 let featured=html.slice(start,end);
 featured=featured.replace(/<h3\b([^>]*)>/, '<h3$1 id="senior-citizen-">');
 const intro='<p style="font-size:18px;line-height:1.7;margin:18px 0">Explore the care programme, then ask patient care about eligibility and the rate for your stay.</p><a data-senior-flow="1" href="/offers/senior-citizen-offer/" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:14px 22px;margin:0 0 18px;background:#5A4420;color:#F7F4EA;font-size:18px;line-height:1.4;font-weight:600;text-decoration:none">Explore elderly &amp; senior care <span aria-hidden="true" style="margin-left:12px">→</span></a>';
 featured=featured.replace('</h3>','</h3>'+intro);
 html=html.slice(0,start)+featured+html.slice(end);
 const nav='<a href="#senior-citizen-" style="display:inline-flex;align-items:center;min-height:48px;padding:0 16px;border:1px solid #C9BFA8;background:#F7F4EA;font-size:18px;text-decoration:none">Senior care</a>';
 if(/<a\b[^>]*href="#current-offers"/.test(html))html=html.replace(/(<a\b[^>]*href="#current-offers"[^>]*>)/,nav+' $1');
 else html=html.replace(/(<main\b[^>]*>)/,'$1<nav aria-label="Senior care" style="margin:0 0 24px">'+nav+'</nav>');
 const mainStart=html.indexOf('<main'), mainEnd=html.indexOf('</main>');
 if(mainStart>=0 && mainEnd>mainStart){
  let body=html.slice(mainStart,mainEnd);
  body=body.replace(/(<(?:p|li|dt|dd|a)\b[^>]*style="[^"<>]*font-size:)(\d+(?:\.\d+)?)px/g,(_,prefix,size)=>prefix+(Number(size)<18?'18':size)+'px');
  html=html.slice(0,mainStart)+body+html.slice(mainEnd);
 }
 return html;
}
