/** Owner: eligible care programmes must be discoverable before rates/enquiry. English only; preserve locale source archives. */
export function offersFlow(html, route, locale = 'en') {
 if(route !== '/offers/' || locale !== 'en' || !html) return html;
 // A telephone link makes a call; label it without promising WhatsApp.
 html=html.replace(/(<a\b[^>]*href="tel:[^"]*"[^>]*>)\s*Call\s*\/\s*WhatsApp/gi,'$1Call');
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
 const groups=[
  {key:'senior',match:/Holistic Ayurvedic|Elderly|Senior/i,route:'/offers/senior-citizen-offer/',anchor:'senior-citizen-',label:'Explore elderly &amp; senior care',nav:'Senior care',intro:'Planning care for yourself or a parent? Explore the programme and the practical questions to clarify before booking.'},
  {key:'athlete',match:/Olympic|Paralympic|Athlete/i,route:'/offers/olympics-and-paralympics-offer/',anchor:'athlete-care-',label:'Explore Olympic &amp; Paralympic care',nav:'Athlete care',intro:'Set aside time for your health beyond competition. Explore care planning and rates for eligible Olympic and Paralympic athletes.'},
  {key:'defence',match:/Defence|Paramilitary/i,route:'/offers/defence-and-paramilitary/',anchor:'defence-paramilitary-care-',label:'Explore defence &amp; paramilitary care',nav:'Defence &amp; paramilitary care',intro:'Planning care for yourself or your family? Eligible spouses, parents and children may book and travel independently.'},
 ];
 if(groups.every(group=>html.includes(`data-care-flow="${group.key}"`))) return html;
 // The upper desktop cards had photographs shifted by one audience. Use the
 // hospital care photographs already approved in the matching lower cards.
 html=html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g,article=>{
  const heading=article.match(/<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>/);
  if(!heading)return article;
  const text=heading[0].replace(/<[^>]+>/g,' ');
  const group=groups.find(item=>item.match.test(text));
  if(!group)return article;
  const image=group.key==='athlete'
   ? {old:'Senior Wellness at Kairali',src:'/ahv/assets/img/gallery-2026/photo/yoga-side-female-patient-02.webp',alt:'A patient in a side-stretch yoga pose at Kairali'}
   : group.key==='defence'
    ? {old:'Athletes and Recovery',src:'/ahv/assets/img/gallery-2026/treatments/hero-detail-cloth-herbal-poultice-01.webp',alt:'A warm herbal poultice being pressed during an Ayurvedic treatment at Kairali'}
    : null;
  if(image)article=article.replace(/<img\b[^>]*>/g,tag=>tag.includes(`alt="${image.old}"`)?tag.replace(/src="[^"]*"/,`src="${image.src}"`).replace(/alt="[^"]*"/,`alt="${image.alt}"`):tag);
  return article;
 });
 // The upper mobile cards are divs. Replace only their remaining commercial
 // audience portraits with the same approved hospital care photographs.
 html=html.replace(/<img\b[^>]*>/g,tag=>{
  if(!tag.includes('/img/commercial/'))return tag;
  const image=tag.includes('alt="Athletes and Recovery"')
   ? {src:'/ahv/assets/img/gallery-2026/photo/yoga-side-female-patient-02.webp',alt:'A patient in a side-stretch yoga pose at Kairali'}
   : tag.includes('alt="Wellness for Defence Personnel"')
    ? {src:'/ahv/assets/img/gallery-2026/treatments/hero-detail-cloth-herbal-poultice-01.webp',alt:'A warm herbal poultice being pressed during an Ayurvedic treatment at Kairali'}
    : null;
  return image?tag.replace(/src="[^"]*"/,`src="${image.src}"`).replace(/alt="[^"]*"/,`alt="${image.alt}"`):tag;
 });
 // The upper phone cards are divs, whereas desktop and lower care cards are
 // articles. Enhance audience headings in both layouts before their rates.
 html=html.replace(/<a\b[^>]*href="(?:https:\/\/(?:www\.)?ayurvedichealingvillage\.com)?\/offers\/(?:senior-citizen-offer|olympics-and-paralympics-offer|defence-and-paramilitary|defence-paramilitary-personnel-get-upto-30-off)\/"[^>]*>[\s\S]*?<\/a>/g,'');
 const seen=new Set();
 html=html.replace(/<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>/g,heading=>{
  const group=groups.find(item=>item.match.test(heading.replace(/<[^>]+>/g,' ')));
  if(!group)return heading;
  const primary=!seen.has(group.key);seen.add(group.key);
  const markedHeading=primary?heading.replace(/<h([1-6])\b([^>]*)>/,`<h$1$2 id="${group.anchor}">`):heading;
  const senior=group.key==='senior'?'data-senior-flow="1" ':'';
  const intro=`<p style="font-size:18px;line-height:1.7;margin:18px 0;text-align:center">${group.intro}</p>`;
  const button=`<div class="ahv-care-cta-row" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;text-align:center;max-width:100%;margin:0 0 18px"><a ${senior}href="${group.route}" data-care-flow="${group.key}" style="display:inline-flex;align-items:center;justify-content:center;text-align:center;box-sizing:border-box;max-width:100%;min-height:52px;padding:14px 22px;background:#5A4420;color:#F7F4EA;font-size:18px;line-height:1.4;font-weight:600;text-decoration:none;overflow-wrap:anywhere">${group.label}<span aria-hidden="true" style="margin-left:12px">→</span></a></div>`;
  return markedHeading+intro+button;
 });
 if(!seen.size)return html;
 // The existing React template renderer cannot retain !important priorities
 // inside style props. A scoped stylesheet keeps the CTA palette intact in
 // both the server snapshot and the hydrated desktop/mobile template.
 html=html.replace(/(<main\b[^>]*>)/,'$1<style data-care-flow-style="1">#ahv-design-root[data-ahv-route="/offers/"] .ahv-care-cta-row a[data-care-flow]{background:#5A4420!important;color:#F7F4EA!important}</style>');
 const nav=groups.filter(group=>seen.has(group.key)).map(group=>`<a href="#${group.anchor}" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 16px;border:1px solid #C9BFA8;background:#F7F4EA;color:#5A4420;font-size:18px;text-decoration:none">${group.nav}</a>`).join(' ');
 if(/<a\b[^>]*href="#current-offers"/.test(html))html=html.replace(/(<a\b[^>]*href="#current-offers"[^>]*>)/,nav+' $1');
 else html=html.replace(/(<main\b[^>]*>)/,'$1<nav aria-label="Care programmes" style="margin:0 0 24px">'+nav+'</nav>');
 const mainStart=html.indexOf('<main'), mainEnd=html.indexOf('</main>');
 if(mainStart>=0 && mainEnd>mainStart){
  let body=html.slice(mainStart,mainEnd);
  body=body.replace(/(<(?:p|li|dt|dd|a)\b[^>]*style="[^"<>]*font-size:)(\d+(?:\.\d+)?)px/g,(_,prefix,size)=>prefix+(Number(size)<18?'18':size)+'px');
  html=html.slice(0,mainStart)+body+html.slice(mainEnd);
 }
 return html;
}
