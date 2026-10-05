/** Owner 3 Oct: the senior programme must be discoverable before the rate/enquiry. English only; preserve locale source archives. */
export function offersFlow(html, route, locale = 'en') {
 if(route !== '/offers/' || locale !== 'en' || !html) return html;
 // English-only presentation: the translated source/snapshot contract stays intact.
 // Keep this self-contained: boot.ts also serializes the function into the browser.
 const photo = (kind) => {
  const heritage=kind==='heritage';
  const base='/ahv/assets/img/gallery-2026/'+(heritage?'photo/hero-grounds-garden-vine-covered-brick-01':'retreats/care-people-physician-white-coat-05');
  const alt=heritage?'Vine-covered brick buildings and gardens at Kairali in Palakkad':'A Kairali physician speaking with a patient on the verandah';
  const caption=heritage?'<strong>118 years</strong><span>of Ayurvedic tradition. Offered with purpose.</span>':'Care begins with a conversation.';
  return `<figure class="ahv-offer-photo ahv-offer-${kind}-photo"><img src="${base}-768.webp" srcset="${base}-768.webp ${heritage?768:511}w, ${base}.webp ${heritage?1600:1066}w" sizes="(max-width: 899px) calc(100vw - 40px), (max-width: 1280px) 45vw, 572px" width="${heritage?768:511}" height="${heritage?511:768}" alt="${alt}" loading="lazy" decoding="async"><figcaption>${caption}</figcaption></figure>`;
 };
 html=html.replace(/<section\b[^>]*aria-labelledby="(?:m-)?(?:a-note|why-special-care)"[^>]*>[\s\S]*?<\/section>/g, section => {
  if(section.includes('ahv-offer-photo')) return section;
  const mobile=/aria-labelledby="m-/.test(section);
  if(/aria-labelledby="(?:m-)?a-note"/.test(section)) {
   // Retire the standalone badge and move its heritage message onto the photo.
   const count=section.indexOf('118 Years');
   if(count<0) return section;
   const badgeStart=section.lastIndexOf('<div',count),badgeEnd=section.indexOf('</div>',count)+6;
   if(badgeStart<0 || badgeEnd<6) return section;
   section=section.slice(0,badgeStart)+(mobile?'':photo('heritage'))+section.slice(badgeEnd);
   section=section.replace(/<p\b[^>]*>118 years of Ayurvedic tradition\. Offered with purpose\.<\/p>/,'');
   if(mobile) {
    const intro=section.indexOf('For over a century'),start=section.lastIndexOf('<p',intro),end=section.indexOf('</ul>',intro)+5;
    if(start>=0 && end>start) section=section.slice(0,start)+'<div class="ahv-offer-story-grid"><div class="ahv-offer-story-copy">'+section.slice(start,end)+'</div>'+photo('heritage')+'</div>'+section.slice(end);
   } else {
    section=section.replace(/<div\b[^>]*style="[^"]*grid-template-columns:minmax\(0,1fr\) 300px;[^"]*"[^>]*>/,'<div class="ahv-offer-story-grid">');
   }
  } else {
   const first=section.indexOf('Healing is not equal'),start=section.lastIndexOf('<p',first);
   const last=section.indexOf('Ayurveda, when practised ethically'),end=section.indexOf('</p>',last)+4;
   if(start<0 || last<first || end<4) return section;
   const text=section.slice(start,end);
   const from=mobile?start:section.lastIndexOf('<div',start),to=mobile?end:section.indexOf('</div>',end)+6;
   if(from<0 || to<end) return section;
   section=section.slice(0,from)+'<div class="ahv-offer-care-grid"><div class="ahv-offer-care-copy">'+text+'</div>'+photo('care')+'</div>'+section.slice(to);
  }
  return section;
 });
 if(html.includes('data-senior-flow="1"')) return html;
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
