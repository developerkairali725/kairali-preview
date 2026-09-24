import test from 'node:test';
import assert from 'node:assert/strict';
import {loadGoogleReviews} from '../lib/google-reviews.ts';
const config={enabled:'1',key:'test-key-not-real',placeId:'test-place',language:'fr'};
test('No external request without explicit configuration or supported language',async()=>{
 for(const c of [{},{...config,enabled:'0'},{...config,language:'xx'}]){
 let called=false;const result=await loadGoogleReviews(c,async()=>{called=true;throw Error();});
 assert.equal(called,false);assert.equal(result.status,'unavailable');
 }
});
test('Official request retains low ratings, attribution and original translations without leaking key',async()=>{
 const result=await loadGoogleReviews(config,async(url,opts)=>{
 assert.match(url,/places.googleapis.com\/v1\/places\/test-place\?languageCode=fr/);
 assert.equal(opts.headers['X-Goog-Api-Key'],config.key);assert.equal(opts.cache,'no-store');
 return {ok:true,json:async()=>({displayName:{text:'Kairali The Ayurvedic Healing Village'},rating:4.4,userRatingCount:17,googleMapsUri:'https://www.google.com/maps/test',reviews:[{rating:1,authorAttribution:{displayName:'Fixture reviewer',uri:'https://www.google.com/maps/contrib/test',photoUri:'https://lh3.googleusercontent.com/test'},text:{text:'Traduction de test',languageCode:'fr'},originalText:{text:'Test original',languageCode:'en'},googleMapsUri:'https://www.google.com/maps/reviews/test'}]})};
 });
 assert.equal(result.status,'ready');assert.equal(result.reviews[0].rating,1);assert.equal(result.reviews[0].originalText,'Test original');assert.match(result.reviews[0].profile,/google.com/);assert.doesNotMatch(JSON.stringify(result),/test-key-not-real/);
});
test('Wrong property, upstream errors and unsafe profile URLs fail safely',async()=>{
 for(const fetcher of [async()=>({ok:false}),async()=>{throw Error('private detail');},async()=>({ok:true,json:async()=>({displayName:{text:'Other hotel'}})})])assert.deepEqual(await loadGoogleReviews(config,fetcher),{status:'unavailable',reviews:[]});
 const result=await loadGoogleReviews(config,async()=>({ok:true,json:async()=>({displayName:{text:'Kairali Healing Village'},reviews:[{authorAttribution:{uri:'javascript:alert(1)',photoUri:'https://evil.test/x'}}]})}));
 assert.equal(result.reviews[0].profile,'');assert.equal(result.reviews[0].photo,'');
});
