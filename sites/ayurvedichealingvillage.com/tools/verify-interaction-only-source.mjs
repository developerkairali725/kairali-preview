import vm from 'node:vm';

// These two scripts only bind form interactions. Their submit payloads cannot
// change the pre-interaction crawlable body. Keep that dependency boundary
// executable: DOM access/writes, timers, requests and load-event work fail here.
export function verifyInteractionOnlySource(source, filename) {
  if (!/\/design\/(landing-page|opd)-form-submit\.js$/.test(filename)) throw Error('Unreviewed interaction-only source: '+filename);
  const routes = filename.endsWith('/opd-form-submit.js')
    ? ['/walk-in-ayurveda-treatment/', '/de/walk-in-ayurveda-treatment/']
    : [...source.matchAll(/^\s{4}'(\/[^']+)',$/gm)].map(x=>x[1]);
  if (!routes.length || routes.length>25) throw Error('Invalid interaction source route coverage: '+filename);
  for (const route of routes) {
    const callbacks=[];
    const host=Object.freeze({getAttribute:name=>name==='data-ahv-route'?route:null});
    const document=Object.freeze({
      getElementById:id=>{if(id!=='ahv-design-root')throw Error('Unexpected DOM read');return host;},
      addEventListener:(type,callback)=>{if(!['submit','input','change'].includes(type)||typeof callback!=='function')throw Error('Non-interaction work');},
    });
    class MutationObserver { constructor(callback){callbacks.push(callback);} observe(target){if(target!==host)throw Error('Unexpected observer target');} }
    const window={location:Object.freeze({pathname:route}),MutationObserver};
    // Strict mode makes writes to the frozen DOM stand-ins throw rather than
    // silently disappearing in otherwise non-strict legacy scripts.
    vm.runInNewContext('"use strict";\n'+source,{window,document,MutationObserver},{filename,timeout:1000});
    // A view mounting after registration must also leave an untouched form alone.
    for(const callback of callbacks) callback([]);
  }
  return routes.length;
}
