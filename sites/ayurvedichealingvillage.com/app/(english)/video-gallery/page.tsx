import '@kairali/ui/brand-tokens.css';
import type { Metadata } from 'next';
import { siteChrome } from '../search/site-chrome';
import { ReviewsShell } from '../read-feedback/ReviewsShell';
import { CONSENT_RUNTIME } from '../_families/consent-runtime';
import { findRoute } from '../_families/registry';
import { routeSchema } from '../_families/schema';
import analyticsConfig from '../../../analytics.config.json';
import films from './films.json';
import './gallery.css';

export const metadata: Metadata = {
 title:'Video Gallery | Kairali – The Ayurvedic Healing Village',
 description:'Watch the Kairali story, yoga at the Healing Village and short films of Ayurvedic therapies, villas and village life. Browse real video previews and runtimes.',
 alternates:{canonical:'https://ayurvedichealingvillage.com/video-gallery/'},
};
type Film = typeof films[number];
const categories = ['Village life','Yoga & meditation','Ayurveda & therapies','Villas & spaces'];
const categoryId = (category:string) => category.toLowerCase().replace(/[^a-z]+/g,'-');
function FilmCard({film,featured=false,index=0}:{film:Film;featured?:boolean;index?:number}) {
 const href=film.localSrc||`https://www.youtube.com/watch?v=${film.id}`;
 return <article id={featured?(index===0?'featured-film':'yoga-film'):`film-${film.id}`} className={`vg-film${featured?' vg-featured':''}`}>
  <a className="vg-poster" href={href} target="_blank" rel="noopener noreferrer" data-ahv-film={film.id} data-film-title={film.title} aria-label={`Play ${film.title}, ${film.duration}`}>
   <img src={film.image} alt={film.id==='1RWUh8QEIpE'?'Paddy fields and palms around Kairali in Palakkad':`${film.title} — video preview`} width="960" height="540" loading={featured?'eager':'lazy'}/>
   <span className="vg-play" aria-hidden="true">▶</span><span className="vg-duration" aria-label={`Duration ${film.duration}`}>{film.duration}</span>
  </a>
  <div className="vg-film-copy"><p className="vg-kicker">{featured?(index===0?'Start here · The main film':'Featured · Yoga & meditation'):film.category}</p>
   {featured?<h2>{film.title}</h2>:<h3>{film.title}</h3>}<p>{film.description}</p>
   <div className="vg-actions"><a href={href} target="_blank" rel="noopener noreferrer" data-ahv-film={film.id} data-film-title={film.title}>Watch {featured?'film':'video'} <span aria-hidden="true">▶</span></a>{!film.localSrc&&<a className="vg-external" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${film.title} on YouTube in a new tab`}>YouTube ↗</a>}</div>
  </div>
 </article>;
}
export default function Page(){
 const chrome=siteChrome(), route=findRoute(['video-gallery']);
 const measurement=process.env[analyticsConfig.activation.env]===analyticsConfig.activation.enabledWhen?{ga4:analyticsConfig.measurement.ga4.id,clarity:analyticsConfig.measurement.clarity.id,metaPixel:analyticsConfig.measurement.metaPixel.id}:undefined;
 const consentScript=`(function(){var cfg=${JSON.stringify({breakpoint:700,measurement})};var host=document.getElementById("ahv-design-root");${CONSENT_RUNTIME}\nensureConsentNotice();if(consentChoice()==="accepted")startMeasurement();window.addEventListener("resize",function(){var notice=document.getElementById("ahv-consent");if(notice)notice.remove();ensureConsentNotice();});})();`;
 const videoList={'@context':'https://schema.org','@type':'ItemList',name:'Kairali video gallery',itemListElement:films.filter(f=>f.uploadDate).map((f,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'VideoObject',name:f.title,description:f.description,thumbnailUrl:`https://www.ayurvedichealingvillage.com${f.image}`,uploadDate:f.uploadDate,duration:`PT${f.seconds}S`,embedUrl:`https://www.youtube-nocookie.com/embed/${f.id}`}}))};
 return <ReviewsShell route="/video-gallery/" consentScript={consentScript} headerScript={chrome.script||''}>
  <link rel="stylesheet" href="/ahv/fonts/ahv-33eeac48ab44.css"/><style dangerouslySetInnerHTML={{__html:chrome.css}}/>
  {route&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(routeSchema(route)).replace(/</g,'\\u003c')}}/>}
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(videoList).replace(/</g,'\\u003c')}}/>
  <a href="#main-content" className="vg-skip">Skip to videos</a><div data-sc-name="AHV Chrome Header" dangerouslySetInnerHTML={{__html:chrome.header}}/>
  <main id="main-content" className="vg-main">
   <header className="vg-intro"><nav aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/gallery/">Gallery</a><span aria-hidden="true">/</span><span aria-current="page">Video gallery</span></nav><p className="vg-kicker">Life at Kairali · Palakkad, Kerala</p><h1>A closer look at the village</h1><p>Meet Kairali through its films — the story behind our Ayurveda, moments of yoga, and the places you’ll spend your day.</p></header>
   <div className="vg-layout"><nav aria-labelledby="ctx-h"><h2 id="ctx-h">Gallery</h2><a href="/gallery/">All galleries</a><a href="/photo-gallery/">Photo gallery</a><a href="/video-gallery/" aria-current="page">Video gallery</a><a href="/virtual-tour/">Virtual tour</a></nav>
    <div className="vg-body"><section className="vg-features" aria-label="Featured films">{films.slice(0,2).map((f,i)=><FilmCard key={f.id} film={f} featured index={i}/>)}</section>
     <p className="vg-play-note">Choose a film to play it here. YouTube loads only when you press Play. You can also open any YouTube film in a new tab.</p>
     <section className="vg-library" aria-labelledby="library-title"><div className="vg-library-head"><p className="vg-kicker">Explore the collection</p><h2 id="library-title">Little windows into village life</h2><p>Short films of the grounds, guest spaces, yoga and Ayurvedic therapies.</p></div>
      <nav className="vg-categories" aria-label="Video topics">{categories.map(c=><a key={c} href={`#${categoryId(c)}`}>{c} <span>{films.slice(2).filter(f=>f.category===c).length}</span></a>)}</nav>
      {categories.map(c=><section key={c} id={categoryId(c)} className="vg-category" aria-labelledby={`${categoryId(c)}-title`}><h2 id={`${categoryId(c)}-title`}>{c}</h2><div className="vg-grid">{films.slice(2).filter(f=>f.category===c).map(f=><FilmCard key={f.id} film={f}/>)}</div></section>)}
     </section>
     <section className="vg-next"><p className="vg-kicker">Keep exploring</p><h2>Picture your time at Kairali</h2><div><a href="/our-villas/">Explore the villas →</a><a href="/yoga-meditation-programs/">Yoga & meditation programmes →</a><a href="/read-feedback/">Hear from our guests →</a></div></section>
    </div>
   </div>
  </main><div dangerouslySetInnerHTML={{__html:chrome.footer}}/>
 </ReviewsShell>;
}
