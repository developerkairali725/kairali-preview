// AHV T06 campaign — renderer for the remaining nine English routes.
// Reuses the proven T04 ordered-source block reader (/ahv/assets/collection-family-render.js) rather than adding a
// new template per URL. Prototype binding only: no submission, no tracking, no provider, no map, no embed.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const D = window.AHV_CAMPAIGN_NINE || { routes: [] };
    const want = q || propRoute;
    // An explicitly requested route that does not exist must NOT silently fall back to an unrelated
    // record — that is how a 404 becomes a plausible-looking wrong page. Only an absent request defaults.
    if (want) return D.routes.find(r => r.path === want || r.slug === want) || null;
    return D.routes[0] || null;
  }

  // Head contract: exactly the source values under the governed effective canonical. Absent source metadata
  // stays absent — no description, image or offer schema is invented.
  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    [...H.querySelectorAll('link[rel="canonical"]:not([data-ahv-head]), meta[name="robots"]:not([data-ahv-head]), meta[name="description"]:not([data-ahv-head]), meta[property^="og:"]:not([data-ahv-head]), meta[name^="twitter:"]:not([data-ahv-head]), script[type="application/ld+json"]:not([data-ahv-head])')].forEach(n => n.remove());
    const add = (tag, attrs, text) => {
      const el = d.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => { if (v != null) el.setAttribute(k, v); });
      if (text != null) el.textContent = text;
      el.setAttribute('data-ahv-head', '');
      H.appendChild(el); return el;
    };
    d.title = M.title;
    // Governed English runtime locale. The source's own html lang value stays recorded in the dataset
    // (metadata.htmlLang) and is not overwritten there.
    d.documentElement.lang = 'en-US';
    if (M.description) add('meta', { name: 'description', content: M.description });
    add('link', { rel: 'canonical', href: M.effectiveCanonical });
    if (M.robots) add('meta', { name: 'robots', content: M.robots });
    const og = M.openGraph || {};
    ['locale', 'type', 'title', 'description', 'url', 'siteName'].forEach(k => {
      if (og[k]) add('meta', { property: 'og:' + (k === 'siteName' ? 'site_name' : k), content: og[k] });
    });
    (og.images || []).forEach(im => {
      add('meta', { property: 'og:image', content: im.url });
      if (im.width) add('meta', { property: 'og:image:width', content: im.width });
      if (im.height) add('meta', { property: 'og:image:height', content: im.height });
      if (im.type) add('meta', { property: 'og:image:type', content: im.type });
    });
    if (M.twitter && M.twitter.card) add('meta', { name: 'twitter:card', content: M.twitter.card });
    const wp = { '@type': 'WebPage', '@id': M.effectiveCanonical, url: M.effectiveCanonical, name: M.title,
      isPartOf: { '@id': A + '/#website' }, inLanguage: 'en-US' };
    if (M.description) wp.description = M.description;
    // Governed BreadcrumbList, emitted exactly as the route record specifies. Routes without a recorded
    // chain emit none — no ancestry is invented.
    if (R.breadcrumbSchemaExpected) add('script', { type: 'application/ld+json' }, JSON.stringify(R.breadcrumbSchemaExpected));
    add('script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      wp, { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }
    ] }));
  }

  const LBL = { fname: 'Name', lname: 'Last Name', phone: 'Phone No', email: 'Email Id', message: 'Message',
    result: 'Answer the sum shown in the source captcha', rdogender: 'Gender', chkAgree: 'Consent' };

  // The source form, control for control: exact names, types, order and requiredness, with a real visible label
  // for each (the source relied on placeholders alone). Inert by contract — nothing is posted anywhere.
  function CampaignForm() {
    const E=React.createElement, [error,setError]=React.useState(''),[sending,setSending]=React.useState(false);
    async function submit(event){
      event.preventDefault(); const form=event.currentTarget;
      if(!form.reportValidity()||sending)return;
      setSending(true);setError('');
      try{
        const response=await fetch('/api/forms-unavailable',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
        if(!response.ok)throw new Error('This preview does not send enquiries. Nothing has been sent. Your details are still here; please use WhatsApp or email info@kairali.com.');
        // This endpoint must never claim successful delivery before integration.
        setError('Please contact our patient care team to complete your enquiry.');
      }catch(e){setError(e.message||'Unable to send. Please retry or contact patient care.');}finally{setSending(false);}
    }
    const field=(name,label,type,required)=>E('label',{key:name,className:'campaign-field'},E('span',null,label),E(type==='textarea'?'textarea':'input',{name,type:type==='textarea'?undefined:type,required,rows:type==='textarea'?3:undefined,autoComplete:name==='fullName'?'name':name==='email'?'email':name==='phone'?'tel':undefined,maxLength:name==='message'?3000:254,pattern:name==='phone'?'[+0-9() .-]{7,30}':name==='fullName'?'.*\\S.*':undefined}));
    return E('form',{action:'/api/forms-unavailable',method:'post',onSubmit:submit,className:'campaign-short-form'},
      field('fullName','Your name','text',true),field('email','Email','email',true),field('phone','Phone / WhatsApp (optional, include country code)','tel',false),field('message','How can we help? (optional)','textarea',false),
      E('input',{type:'hidden',name:'landingPage',value:location.href}),
      E('label',{className:'campaign-consent'},E('input',{type:'checkbox',name:'consent',required:true}),E('span',null,'I agree to be contacted about my enquiry. ',E('a',{href:'/privacy-policy/'},'Privacy policy'))),
      E('button',{type:'submit',disabled:sending,className:'campaign-primary'},sending?'Sending…':'Send enquiry'),
      error?E('p',{role:'alert'},error):null,
      E('p',null,'Prefer to talk? ',E('a',{href:'https://wa.me/919289838797',target:'_blank',rel:'noopener noreferrer'},'WhatsApp patient care ↗')));
  }
  function formEl() { return React.createElement(CampaignForm); }

  // The page H1, at the campaign scale. A source H1 arrives inside the ordered block stream, so it is rendered
  // here rather than by the shared T04 block reader — that reader has no h1 case (the collection routes render
  // their H1 outside the stream) and would size a source H1 below its own H2s. The T04 pages are untouched.
  const H1_STYLE = { fontFamily: "'Marcellus',serif", fontWeight: 400, fontSize: 'clamp(30px,3.4vw,44px)',
    lineHeight: 1.18, margin: '0 0 22px', color: '#2A2118', textWrap: 'balance' };

  // Blocks in exact source order: contiguous runs go to the shared reader, source H1s are rendered in place.
  // Legacy sources carry more than one H1 (duplicate desktop/mobile wrappers). The first renders as the page's
  // single H1; each later one keeps its exact text and renders as an H2 marked with the correction.
  function bodyEls(blocks, guard) {
    const CR = window.AHV_COLLECTION_RENDER;
    const out = []; let run = []; let seenH1 = 0;
    const flush = tag => { if (run.length) { out.push(...CR.sourceBlocks(run, 'n' + tag, guard)); run = []; } };
    (blocks || []).forEach((b, i) => {
      if (b.kind === 'heading' && b.tag === 'h1') {
        flush(i);
        seenH1 += 1;
        const first = seenH1 === 1;
        out.push(React.createElement(first ? 'h1' : 'h2', {
          key: 'h1-' + i, 'data-source-pointer': b.ptr,
          'data-correction': first ? undefined : 'h1→h2',
          style: first ? H1_STYLE : Object.assign({}, H1_STYLE, { fontSize: 'clamp(24px,2.4vw,32px)', margin: '26px 0 10px', lineHeight: 1.22 })
        }, ...CR.inline(b.tree, 'h1-' + i, guard)));
        return;
      }
      if (b.kind === 'inertEmbed') { flush(i); out.push(inertEmbedEl(b, 'em-' + i)); return; }
      run.push(b);
    });
    flush('z');
    return out;
  }

  // View-time breakpoint selection. The source ships both members of each responsive image pair and hid one
  // in CSS; the kits captured no stylesheet, so the surviving evidence is the class token on each image.
  // Each view renders only the member its width would have shown. The suppressed sibling is not dropped —
  // it stays in the dataset and is accounted in the QA harness.
  // Generic deep filter: drops non-matching image objects wherever they nest (blocks, list items, nested
  // lists, table cells). A shape-specific walk missed images nested inside list items.
  function forBreakpoint(blocks, bp) {
    const drop = v => v && typeof v === 'object' && !Array.isArray(v)
      && typeof v.src === 'string' && typeof v.ptr === 'string'
      && v.breakpoint != null && v.breakpoint !== bp;
    return (function copy(n) {
      if (!n || typeof n !== 'object') return n;
      if (Array.isArray(n)) return n.filter(x => !drop(x)).map(copy);
      const out = {};
      Object.keys(n).forEach(k => { out[k] = (n[k] && typeof n[k] === 'object') ? copy(n[k]) : n[k]; });
      return out;
    })(blocks);
  }

  function campaignAnchor(event) {
    const url=new URL(event.currentTarget.href,location.href);
    if(url.pathname!==location.pathname||!url.hash)return;
    const target=document.getElementById(url.hash.slice(1));if(!target)return;
    event.preventDefault();
    for(let parent=target.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;
    history.pushState(null,'',location.pathname+location.search+url.hash);
    target.scrollIntoView({block:'start'});
    // Secondary navigation takes over after the first scroll; realign once
    // its measured height and placeholder have settled.
    requestAnimationFrame(()=>requestAnimationFrame(()=>target.scrollIntoView({block:'start'})));
  }
  // September redesign: source content is organised into readable sections,
  // not a restoration of the legacy CSS or duplicated responsive wrappers.
  const CAMPAIGN_PRESENTATION = {
    '/weight-loss.html': ['Ayurvedic weight management in Kerala','/images/consultation-pulse.webp',7,311],
    '/preventive-rejuvenation-detoxification.html': ['Ayurvedic rejuvenation & detoxification in Kerala','/ahv/assets/img/wx-pathway.jpg',7,304],
    '/pain-management.html': ['Ayurvedic pain management in Kerala','/images/therapy-pain-management.jpg',3,124],
    '/kairali-cleansing-centre.html': ['Ayurvedic cleansing programmes in Kerala','/images/therapy-panchakarma.jpg',2,238],
    '/wellness-resort-kerala.html': ['Ayurvedic treatment at the Healing Village','/ahv/assets/img/wx-hero.webp',2,235],
    '/Ayurveda_Treatment_Neo_S.India_Cities.html': ['Ayurvedic treatment in Kerala','/ahv/assets/img/wx-welcome.webp',5,140],
    '/Kairali_Brand_and_Competition_Neo-original.html': ['Discover Kairali — The Ayurvedic Healing Village','/ahv/assets/img/wx-hero.webp',5,124]
  };
  function campaignBody(route, bp) {
    const E=React.createElement, CR=window.AHV_COLLECTION_RENDER;
    const config=CAMPAIGN_PRESENTATION[route.path];
    if(!config)return bodyEls(forBreakpoint(route.blocks,bp),undefined);
    const norm=s=>(s||'').replace(/\s+/g,' ').trim();
    const local=id=>A+route.path+(typeof location!=='undefined'?location.search:'')+'#'+id;
    const isDecor=b=>b.kind==='image'&&(/leaf|dumbles|tape-image|top-bar-img|floral|border.items|star-rating|facebook-icon|insta-icon|you-tube-icon|play-icon|\/play\.|Logo_new|kairali-logo|logo-ktahv|colorful-logo|f-logo|104-cal|9-kgs/i.test((b.src||'')+' '+(b.sourceClass||'')));
    let blocks=forBreakpoint(route.blocks.slice(config[2],config[3]),bp).filter(b=>!isDecor(b));
    // Copy only the rendered tree; frozen source provenance remains intact.
    blocks=JSON.parse(JSON.stringify(blocks));
    const imageTargets=blocks.filter(b=>b.kind==='image'&&/five-folds-images\/(doc_cons|image-[2-5])\./.test(b.src||''));
    imageTargets.forEach((b,i)=>b.campaignId='image-'+(i+1));
    const whyNames=['Premium Villas','Personal Consultation','Unique Features','Trained Therapist','Own Manufacturing of Medicines','Organic Farming'];
    whyNames.forEach((name,i)=>{const b=blocks.find(b=>b.kind==='heading'&&norm(b.text).toLowerCase()===name.toLowerCase());if(b)b.campaignId='why-'+(i+1);});
    const available=new Set(blocks.map(b=>b.campaignId).filter(Boolean));
    const videoLinks={'videostory-three':'https://www.youtube.com/watch?v=CcDPOeSR67E','videostory-two':'https://www.youtube.com/watch?v=3vWviQfW1Ug','videostory':'/video-gallery/#featured-film'};
    function links(n){
      if(!n||typeof n!=='object')return;
      if(n.tag==='a' && n.c && !n.c.some(c=>(c.v||'').trim() || c.tag==='img')) {n.tag='span';delete n.attrs;}
      if(n.linkHref && !n.alt) n.linkHref=null;
      for(const [k,v]of Object.entries(n)){
        if(typeof v==='string'&&(k==='href'||k==='linkHref')){
          if(v.startsWith('#')){const id=v.slice(1);n[k]=videoLinks[id]||local(available.has(id)?id:'campaign-enquiry');}
          else if(/\/enquiry-form\/?$/.test(v))n[k]=local('campaign-enquiry');
          else if(/email-protection/.test(v))n[k]='mailto:info@kairali.com';
        } else if(typeof v==='object')links(v);
      }
    }
    blocks.forEach(links);
    blocks.forEach(b=>{if(b.kind==='image'&&/header-atp|header-mobile|38[ab]-copy|Layer(?:%20| )8/i.test(b.src||'')){b.src='/ahv/assets/img/wx-hero.webp';b.alt='Palm-lined gardens and traditional buildings at Kairali';b.width=1200;b.height=800;}});
    const groups=[];let current=null;const seen=new Set(),seenImages=new Set();
    for(const b of blocks){
      const text=norm(b.text),key=b.kind+':'+text;
      const sectionImageKey=(b.ptr||'').split('/').slice(0,4).join('/')+':'+b.src;
      if(b.kind==='image'){if(seenImages.has(sectionImageKey))continue;seenImages.add(sectionImageKey);}
      if(text&&((b.kind==='heading'||text.length>80)&&seen.has(key)))continue;
      if(text)seen.add(key);
      if(!text&&b.kind==='line')continue;
      if(/^[“”"]$/.test(text))continue;
      // Remove obsolete embed pointing at the video confirmed unavailable in July.
      if(b.kind==='inertEmbed'&&/JztT26hwdnA/.test(b.sourceUrl||''))continue;
      const section=(b.ptr||'').match(/^\/sections\/(?:c\/)?\d+/)?.[0]||'offer';
      if(!current||current.source!==section||(b.kind==='heading'&&b.tag==='h2'&&current.blocks.length>6)){
        current={source:section,blocks:[]};groups.push(current);
      }
      current.blocks.push(b);
    }
    function renderBlock(b,i){
      if(b.kind==='inertEmbed')return inertEmbedEl(b,'em'+i);
      if(b.kind==='heading')return E(/^h[1-3]$/.test(b.tag)?(b.tag==='h1'?'h2':b.tag):'p',{key:i,id:b.campaignId,className:/^h[1-3]$/.test(b.tag)?'campaign-heading':'campaign-eyebrow'},...CR.inline(b.tree,'h'+i,campaignAnchor));
      if(b.kind==='image')return E('figure',{key:i,id:b.campaignId,className:'campaign-photo'},E('img',{src:b.src,alt:b.alt||'',width:b.width,height:b.height,loading:'lazy',decoding:'async'}));
      return E('div',{key:i,id:b.campaignId,className:'campaign-copy-block'},...CR.sourceBlocks([b],'c'+i,campaignAnchor));
    }
    const sections=groups.map((g,gi)=>{
      const children=[];
      for(let i=0;i<g.blocks.length;i++){
        const b=g.blocks[i],next=g.blocks[i+1];
        if(b.kind==='heading'&&/faq-title/.test(b.sourceClass||'')&&next){children.push(E('details',{key:i,className:'campaign-faq'},E('summary',null,norm(b.text)),renderBlock(next,i+'a')));i++;continue;}
        if(b.kind==='image'){
          const images=[];let j=i;
          while(j<g.blocks.length&&g.blocks[j].kind==='image'){images.push(renderBlock(g.blocks[j],j));j++;}
          children.push(E('div',{key:'photos'+i,className:'campaign-photo-grid'},...images));i=j-1;continue;
        }
        children.push(renderBlock(b,i));
      }
      const textSize=n=>typeof n==='string'?n.length:Array.isArray(n)?n.reduce((sum,c)=>sum+textSize(c),0):n&&typeof n==='object'?textSize(n.props?.children||n.children||[]):0;
      const textLength=textSize(children);
      const heading=g.blocks.find(b=>b.kind==='heading'&&/^h[1-3]$/.test(b.tag));
      const label=heading?norm(heading.text):'Programme details';
      const optional=textLength>2200&&!g.blocks.some(b=>/faq-title/.test(b.sourceClass||''));
      return E('section',{key:gi,className:'campaign-section',id:'campaign-section-'+gi},...(optional?[E('details',{className:'campaign-more',key:'more'},E('summary',null,label),...children)]:children));
    });
    const cta=E('div',{className:'campaign-actions'},E('a',{href:local('campaign-enquiry'),onClick:campaignAnchor,className:'campaign-primary'},'Enquire about this programme'),E('a',{href:'https://wa.me/919289838797?text='+encodeURIComponent('Hello, I would like to know more about '+config[0]+'.'),target:'_blank',rel:'noopener noreferrer'},'WhatsApp patient care ↗'));
    return [E('header',{key:'hero',className:'campaign-hero'},E('div',null,E('p',{className:'campaign-eyebrow'},'Kairali · Palakkad, Kerala'),E('h1',null,config[0]),E('p',null,'Plan your visit with our patient care team. Your Ayurvedic doctor will help you choose the programme and duration suited to you.'),cta),E('img',{src:config[1],alt:config[1].includes('consultation')?'Ayurvedic physician examining a patient during consultation':config[1].includes('therapy')?'Therapists providing an Ayurvedic treatment':'Palm-lined gardens and buildings at the Healing Village',width:960,height:720,fetchPriority:'high'})),E('nav',{key:'nav','aria-label':'On this page',className:'campaign-nav'},E('a',{href:local('campaign-section-0'),onClick:campaignAnchor},'Programme'),E('a',{href:local('campaign-enquiry'),onClick:campaignAnchor},'Enquire'),E('a',{href:'/how-to-reach/'},'Travel')),E('div',{key:'sections',className:'campaign-sections'},...sections)];
  }
  function nineVals(R, guard, bp) {
    const el = campaignBody(R, bp || 'wide');
    // Route-level H1 only where the source stream carries none (the short-offer route: see its heading decision).
    const h1 = R.h1 && !CAMPAIGN_PRESENTATION[R.path] ? React.createElement('h1', { style: H1_STYLE }, R.h1) : null;
    return {
      route: R, title: R.metadata.title, path: R.path,
      h1El: h1,
      bodyEl: el,
      formEl: formEl(R.form, 'This form is being connected. Until then, please write to info@kairali.com or message us on WhatsApp at +91 92898 38797.'),
      hasForm: !!(R.form && R.form.fields && R.form.fields.length),
      canonical: R.metadata.effectiveCanonical,
      robots: R.metadata.robots,
      indexable: R.governance.indexable ? 'Indexable' : 'Not indexable (source noindex)',
      layoutFit: R.governance.layoutFit,
      headingDecision: R.headingLedger.decision,
      flags: R.releaseFlags || [],
      imageCount: String(R.imageAccounting.placements),
      blockCount: String(R.blocks.length),
      // The link guard travels with the vals so every anchor in the view — including the breadcrumb parents
      // — is inert. Returning it from nineVals keeps the two views from drifting apart.
      guard: guard,
      // Route-specific breadcrumb. Routes with no recorded chain render no nav and emit no BreadcrumbList.
      showBreadcrumb: !!(R.breadcrumb && R.breadcrumb.length),
      crumbs: (R.breadcrumb || []).slice(0, -1).map(c => ({ url: A + c.path, label: c.label })),
      crumbLast: (R.breadcrumb && R.breadcrumb.length) ? R.breadcrumb[R.breadcrumb.length - 1].label : '',
      notFound: false, found: true, requestedRoute: '', validRoutes: []
    };
  }

  // A requested route that does not exist gets a real, visible state naming what was asked for and what
  // exists. Returning only nulls made the page paint nothing at all — a silent blank is no better than
  // silently rendering an unrelated record.
  // The not-found state is a rendered visitor-facing page, so it gets a governed head of its own: a real
  // title, the English runtime locale, and noindex — it is not a source route and must never be indexed.
  // Without this the miss path shipped no <title> and no lang at all (WCAG 2.4.2 and 3.1.1, both Level A).
  function applyNotFoundHead(requested) {
    const d = document, H = d.head;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    [...H.querySelectorAll('link[rel="canonical"], meta[name="robots"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]')].forEach(n => n.remove());
    d.documentElement.lang = 'en-US';
    d.title = 'Route not in the campaign set — Ayurvedic Healing Village';
    const add = (tag, attrs) => {
      const el = d.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => { if (v != null) el.setAttribute(k, v); });
      el.setAttribute('data-ahv-head', '');
      H.appendChild(el);
    };
    add('meta', { name: 'robots', content: 'noindex, nofollow' });
    add('meta', { name: 'description', content: 'The requested route is not one of the campaign routes in this prototype. No other page was substituted for it.' });
  }

  function notFoundVals(requested) {
    const D = window.AHV_CAMPAIGN_NINE || { routes: [] };
    return Object.assign(emptyVals(), {
      notFound: true, found: false,
      showBreadcrumb: false, crumbs: [], crumbLast: '',
      requestedRoute: requested || '(none given)',
      validRoutes: D.routes.map(r => r.path)
    });
  }

  const emptyVals = () => ({ route: null, title: '', path: '', h1El: null, bodyEl: null, formEl: null,
    hasForm: false, canonical: '', robots: '', indexable: '', layoutFit: '', headingDecision: '',
    flags: [], imageCount: '0', blockCount: '0', notFound: false, found: false, requestedRoute: '', validRoutes: [],
    showBreadcrumb: false, crumbs: [], crumbLast: '', guard: () => {} /* preview-only nav guard neutralised for the published site */ });

  // A source embed, never mounted: no provider frame, no provider request. The visitor sees a plain label
  // and a real (inert) link to the source destination. The technical accounting — provider, pointer,
  // "not loaded in this prototype" — lives only in the QA harness, never in a visitor view.
  function inertEmbedEl(b, key) {
    const R = React.createElement;
    const still = b.still;
    const isMap = b.provider === 'google-maps';
    // The source title on video embeds is the provider's own generic player label; show a plain word instead.
    const srcTitle = /youtube video player/i.test(b.title || '') ? null : b.title;
    const label = (still && still.label) || srcTitle || (isMap ? 'Location' : 'Video');
    const linkText = isMap ? 'Open the location map' : 'Watch the video';
    return R('figure', { key: key, 'data-source-pointer': b.ptr, 'data-source-embed': b.provider,
        style: { margin: '28px 0', display: 'flex', flexDirection: 'column', minWidth: 0,
          border: '1px solid #E0D7C4', borderRadius: '6px', overflow: 'hidden', background: '#FBF8F1' } },
      still ? R('img', { src: still.src, alt: label, loading: 'lazy',
        style: { display: 'block', width: '100%', height: 'auto' } }) : null,
      R('figcaption', { style: { padding: '16px', fontSize: '17px', lineHeight: 1.6, color: '#2A2118',
          display: 'flex', flexWrap: 'wrap', gap: '6px 14px', alignItems: 'baseline' } },
        R('span', null, label),
        R('a', { href: b.sourceUrl, onClick: undefined, /* preview-only nav guard neutralised for the published site */
          style: { textUnderlineOffset: '2px', minHeight: '44px', display: 'inline-flex', alignItems: 'center' } },
          linkText)));
  }

  window.AHV_CAMPAIGN_NINE_RENDER = { resolveRoute, applyHead, applyNotFoundHead, nineVals, campaignBody, bodyEls, forBreakpoint, formEl, inertEmbedEl, emptyVals, notFoundVals, A };
})();
