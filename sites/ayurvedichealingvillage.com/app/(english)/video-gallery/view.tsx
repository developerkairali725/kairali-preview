import { routeStylesFor } from "../_families/route-styles.mjs";
import { measurementForEnvironment } from "../../../lib/measurement-config.mjs";
import { translate, localizedPath, LOCALE_INFO, type LocaleCode } from "../_families/l10n";
import '@kairali/ui/brand-tokens.css';
import type { Metadata } from 'next';
import { siteChrome } from '../search/site-chrome';
import { ReviewsShell } from '../read-feedback/ReviewsShell';
import { CONSENT_RUNTIME } from '../_families/consent-runtime';
import { findRoute } from '../_families/registry';
import { routeSchema } from '../_families/schema';
import analyticsConfig from '../../../analytics.config.json';
import films from './films.json';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inlineFontStyles } from '../_families/snapshot-styles.mjs';
const galleryFontCss = inlineFontStyles(['/ahv/fonts/ahv-33eeac48ab44.css'], (url:string) => readFileSync(join(process.cwd(), 'public', url), 'utf8'))[0].css;
const galleryCss = readFileSync(join(process.cwd(), 'app/(english)/video-gallery/gallery.css'), 'utf8');

export const metadata: Metadata = {
 title:'Video Gallery | Kairali – The Ayurvedic Healing Village',
 description:'Watch the Kairali story, yoga at the Healing Village and short films of Ayurvedic therapies, villas and village life. Browse real video previews and runtimes.',
 alternates:{canonical:'https://ayurvedichealingvillage.com/video-gallery/'},
};
type Film = typeof films[number];
const categories = ['Village life','Yoga & meditation','Ayurveda & therapies','Villas & spaces'];
const categoryId = (category:string) => category.toLowerCase().replace(/[^a-z]+/g,'-');
function FilmCard({film,featured=false,index=0,locale='en'}:{film:Film;featured?:boolean;index?:number;locale?:LocaleCode}) {
 const T = (s: string) => translate(locale, s); const L = (p: string) => localizedPath(p, locale) ?? p;
 const href=film.localSrc||`https://www.youtube.com/watch?v=${film.id}`;
 return <article id={featured?(index===0?'featured-film':'yoga-film'):`film-${film.id}`} className={`vg-film${featured?' vg-featured':''}`}>
  <a className="vg-poster" href={href} target="_blank" rel="noopener noreferrer" data-ahv-film={film.id} data-film-title={film.title} aria-label={`Play ${film.title}, ${film.duration}`}>
   <img className="vg-poster-img" src={film.image} srcSet={film.id==='1RWUh8QEIpE'?"/ahv/assets/img/AHV-Gallery-Landscape-768-film.webp 768w, "+film.image+" 960w":undefined} sizes={film.id==='1RWUh8QEIpE'?"(max-width:760px) calc(100vw - 36px), 960px":undefined} alt={film.id==='1RWUh8QEIpE'?T("Paddy fields and palms around Kairali in Palakkad"):`${film.title} — video preview`} width="960" height="540" loading={featured&&index===0?'eager':'lazy'} fetchPriority={featured&&index===0?'high':'low'}/>
   <span className="vg-play" aria-hidden="true">▶</span><span className="vg-duration" aria-label={`Duration ${film.duration}`}>{film.duration}</span>
  </a>
  <div className="vg-film-copy"><p className="vg-kicker">{featured?(index===0?T("Start here · The main film"):T("Featured · Yoga & meditation")):film.category}</p>
   {featured?<h2>{T(film.title)}</h2>:<h3>{T(film.title)}</h3>}<p>{T(film.description)}</p>
   <div className="vg-actions"><a href={href} target="_blank" rel="noopener noreferrer" data-ahv-film={film.id} data-film-title={film.title}>{T("Watch")}{" "}{featured?'film':'video'} <span aria-hidden="true">▶</span></a>{!film.localSrc&&<a className="vg-external" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${film.title} on YouTube in a new tab`}>{T("YouTube ↗")}</a>}</div>
  </div>
 </article>;
}
export function PageView({ locale = "en" }: { locale?: LocaleCode }){
 const T = (s: string) => translate(locale, s); const L = (p: string) => localizedPath(p, locale) ?? p;
 const chrome=siteChrome(locale,'/video-gallery/'), route=findRoute(['video-gallery']);
 const measurement = measurementForEnvironment(process.env, analyticsConfig);
 const consentScript=`(function(){var cfg=${JSON.stringify({breakpoint:700,measurement,locale:{privacyHref:L("/new-privacy-policy/")}})};var host=document.getElementById("ahv-design-root");${CONSENT_RUNTIME}\nensureConsentNotice();if(consentChoice()==="accepted")startMeasurement();window.addEventListener("resize",function(){var notice=document.getElementById("ahv-consent");if(notice)notice.remove();ensureConsentNotice();});})();`;
 const videoList={'@context':'https://schema.org','@type':'ItemList',name:T("Kairali video gallery"),itemListElement:films.filter(f=>f.uploadDate).map((f,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'VideoObject',name:f.title,description:f.description,thumbnailUrl:`https://www.ayurvedichealingvillage.com${f.image}`,uploadDate:f.uploadDate,duration:`PT${f.seconds}S`,embedUrl:`https://www.youtube-nocookie.com/embed/${f.id}`}}))};
 return <ReviewsShell route="/video-gallery/" locale={locale} designBase={locale==='en'?'/design/':`/ahv/l10n/${LOCALE_INFO[locale].prefix}/design/`} consentScript={consentScript} headerScript={chrome.script||''}>
  <style data-ahv-route-styles="" dangerouslySetInnerHTML={{ __html: routeStylesFor() }} /><link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/ahv/fonts/46ee5f47fed537401cd92c16b666fccd05140bab39a0390a9b90ee1040c31af9.common.woff2"/><link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/ahv/fonts/2f6fa616f76102d81c4a935c3a8cd547a8db9de679ad9fda9cfd42f16e7f0743.common.woff2"/><style dangerouslySetInnerHTML={{__html:galleryFontCss || ""}}/><style dangerouslySetInnerHTML={{__html:chrome.css}}/><style dangerouslySetInnerHTML={{__html:galleryCss}}/>
  {route&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(routeSchema(route, locale)).replace(/</g,'\\u003c')}}/>}
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(videoList).replace(/</g,'\\u003c')}}/>
  <a href="#main-content" className="vg-skip">{T("Skip to videos")}</a><div data-sc-name="AHV Chrome Header" dangerouslySetInnerHTML={{__html:chrome.header}}/>
  <main id="main-content" className="vg-main">
   <header className="vg-intro"><nav aria-label={T("Breadcrumb")}><a href={L("/")}>{T("Home")}</a><span aria-hidden="true">/</span><a href={L("/gallery/")}>{T("Gallery")}</a><span aria-hidden="true">/</span><span aria-current="page">{T("Video gallery")}</span></nav><p className="vg-kicker">{T("Life at Kairali · Palakkad, Kerala")}</p><h1>{T("A closer look at the village")}</h1><p>{T("Meet Kairali through its films — the story behind our Ayurveda, moments of yoga, and the places you’ll spend your day.")}</p></header>
   <div className="vg-layout">
    <div className="vg-body"><section className="vg-features" aria-label={T("Featured films")}>{films.slice(0,2).map((f,i)=><FilmCard key={f.id} film={f} featured index={i} locale={locale}/>)}</section>
     <p className="vg-play-note">{T("Choose a film to play it here. YouTube loads only when you press Play. You can also open any YouTube film in a new tab.")}</p>
     <section className="vg-library" aria-labelledby="library-title"><div className="vg-library-head"><p className="vg-kicker">{T("Explore the collection")}</p><h2 id="library-title">{T("Little windows into village life")}</h2><p>{T("Short films of the grounds, villas, yoga and Ayurvedic therapies.")}</p></div>
      <nav className="vg-categories" aria-label={T("Video topics")}>{categories.map(c=><a key={c} href={`#${categoryId(c)}`}>{c} <span>{films.slice(2).filter(f=>f.category===c).length}</span></a>)}</nav>
      {categories.map(c=><section key={c} id={categoryId(c)} className="vg-category" aria-labelledby={`${categoryId(c)}-title`}><h2 id={`${categoryId(c)}-title`}>{c}</h2><div className="vg-grid">{films.slice(2).filter(f=>f.category===c).map(f=><FilmCard key={f.id} film={f} locale={locale}/>)}</div></section>)}
     </section>
     <section className="vg-next"><p className="vg-kicker">{T("Keep exploring")}</p><h2>{T("Picture your time at Kairali")}</h2><div><a href={L("/our-villas/")}>{T("Explore the villas →")}</a><a href={L("/yoga-meditation-programs/")}>{T("Yoga & meditation programmes →")}</a><a href={L("/read-feedback/")}>{T("Hear from our patients →")}</a></div></section>
    </div>
   </div>
  </main><div dangerouslySetInnerHTML={{__html:chrome.footer}}/>
 </ReviewsShell>;
}
