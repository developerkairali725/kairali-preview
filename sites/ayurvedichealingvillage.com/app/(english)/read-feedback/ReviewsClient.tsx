'use client';
import {useState} from 'react';
import {STORIES,LANGUAGES,GOOGLE_URL,TRIPADVISOR_URL,type Language} from './review-data';
import type {ReviewResult} from '../../../lib/google-reviews';

export function GuestStories(){
 const [region,setRegion]=useState('all');const [language,setLanguage]=useState<Language>('en');
 const stories=STORIES.filter(s=>region==='all'||s.region===region);
 return <section id="guest-stories" className="rv-section">
  <div className="rv-section-head"><div><p className="rv-eyebrow">From India. From around the world.</p><h2>Find a story that speaks to you</h2></div><p>Selected excerpts from guest reviews and Kairali’s published archive. Open the source to read the full account.</p></div>
  <div className="rv-filters"><div className="rv-tabs" role="group" aria-label="Guest location">{[{id:'all',label:'All guests'},{id:'india',label:'Guests from India'},{id:'international',label:'International guests'}].map(t=><button key={t.id} type="button" aria-pressed={region===t.id} onClick={()=>setRegion(t.id)}>{t.label}</button>)}</div><label className="rv-language">Read excerpts in<select value={language} onChange={e=>setLanguage(e.target.value as Language)}>{LANGUAGES.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select></label></div>
  <p className="rv-filter-note" aria-live="polite">{stories.length} stories · {language==='en'?'Original English excerpts':'Translated excerpts · original English remains available on each card'}. Guest location is shown only where the source identifies it.</p>
  <div className="rv-story-grid">{stories.map(s=><article className="rv-story" key={s.id}>
   <div className="rv-story-top"><span className="rv-source">{s.source}</span><span aria-hidden="true" className="rv-quote-mark">“</span></div>
   <blockquote lang={language}>{s.quote[language]}</blockquote>
   {language!=='en'&&<details className="rv-original"><summary>Original English</summary><p lang="en">{s.quote.en}</p></details>}
   <p className="rv-summary">{s.summary}</p><div className="rv-person"><span className="rv-initial" aria-hidden="true">{s.name.replace(/^Mrs\. & Mr\. /,'').charAt(0).toUpperCase()}</span><div><h3>{s.name}</h3><p>{s.place}</p></div></div>
   <p className="rv-date">{s.date}</p><a className="rv-text-link" href={s.href} target="_blank" rel="noopener noreferrer">{s.source==='Google'?'Read reviews on Google':'Read the original testimonial'} <span aria-hidden="true">↗</span></a>
  </article>)}</div>
  <p className="rv-small">These are selected guest accounts, not a complete review feed. Archived testimonials are labelled. Personal experiences and treatment outcomes vary.</p>
 </section>;
}

export function GoogleReviews(){
 const [language,setLanguage]=useState<Language>('en');const [state,setState]=useState<'idle'|'loading'|'ready'|'unavailable'>('idle');const [data,setData]=useState<ReviewResult>();
 async function load(){setState('loading');try{const response=await fetch('/api/reviews/google?language='+language,{cache:'no-store'});if(!response.ok)throw Error();const result:ReviewResult=await response.json();setData(result);setState(result.status);}catch{setState('unavailable');}}
 return <article className="rv-platform"><p className="rv-eyebrow">Independent guest feedback</p><h3>Google Maps</h3><p>Read what guests say about their stay, care, food and surroundings.</p>
  <div className="rv-widget-controls"><label>Review language<select value={language} disabled={state==='loading'} onChange={e=>{setLanguage(e.target.value as Language);setState('idle');setData(undefined);}}>{LANGUAGES.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select></label><button type="button" className="rv-button" onClick={load} disabled={state==='loading'}>{state==='loading'?'Loading reviews…':state==='unavailable'?'Try loading again':'Show Google reviews'}</button></div>
  <div aria-live="polite" aria-busy={state==='loading'}>
   {state==='loading'&&<p className="rv-widget-note">Loading reviews from Google Maps…</p>}
   {state==='unavailable'&&<p className="rv-widget-note">The review panel is unavailable right now. You can still read all reviews directly on Google Maps.</p>}
   {state==='ready'&&data&&<div className="rv-google-feed">
    <p className="rv-rating">{data.rating!==undefined&&<><strong>{data.rating.toFixed(1)}</strong> / 5 </>}{data.count!==undefined&&<span> · {data.count.toLocaleString()} reviews on Google Maps</span>}</p>
    <p className="rv-small">Up to five reviews, ordered by relevance by Google. No star-rating filter is applied.</p>
    {data.reviews.length===0&&<p>No reviews are available in this panel. Open Google Maps to see the full listing.</p>}
    {data.reviews.map((r,i)=><div className="rv-live-review" key={r.href+i}>
     <div className="rv-person">{r.photo&&<img src={r.photo} alt={r.name} width="44" height="44" loading="lazy" referrerPolicy="no-referrer"/>}<div>{r.profile?<a href={r.profile} target="_blank" rel="noopener noreferrer">{r.name}</a>:<strong>{r.name}</strong>}<p>{r.rating} / 5{r.published&&!Number.isNaN(Date.parse(r.published))?' · '+new Date(r.published).toLocaleDateString('en-GB',{month:'long',year:'numeric'}):''}</p></div></div>
     <p lang={r.language||undefined}>{r.text||'This guest left a rating without a written review.'}</p>
     {r.originalLanguage&&r.language!==r.originalLanguage&&<details><summary>Translated by Google · view original</summary><p lang={r.originalLanguage}>{r.originalText}</p></details>}
     {r.href&&<a href={r.href} target="_blank" rel="noopener noreferrer">Read on Google Maps ↗</a>}
    </div>)}
    <p className="rv-small">Reviews provided by Google Maps. Google checks for and removes fake content when identified; reviews are not verified by Google.</p>
   </div>}
  </div>
  <a className="rv-text-link" href={GOOGLE_URL} target="_blank" rel="noopener noreferrer">Read all Google reviews ↗</a>
 </article>;
}
export function TripadvisorReviews(){
 const [loaded,setLoaded]=useState(false);
 return <article className="rv-platform"><p className="rv-eyebrow">Traveller experiences</p><h3>Tripadvisor</h3><p>Explore traveller reviews, ratings and guest photographs on the property’s Tripadvisor listing.</p>
  {!loaded?<><button type="button" className="rv-button" onClick={()=>setLoaded(true)}>Show Tripadvisor reviews</button><p className="rv-small">Loads Tripadvisor’s own review widget when you choose to open it.</p></>:<iframe title="Kairali’s official Tripadvisor reviews widget" src="/review-widgets/tripadvisor.html" className="rv-tripadvisor-frame" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"/>}
  <a className="rv-text-link" href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer">Read all Tripadvisor reviews ↗</a>
 </article>;
}
