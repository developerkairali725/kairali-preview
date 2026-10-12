/** localhost-only source renderer for regenerating English static snapshots.
 * NODE_ENV=development AHV_CAPTURE_RUNTIME=1 AHV_CAPTURE_ORIGIN=http://127.0.0.1:3218 node tools/serve-capture.mjs
 * Stop this server and unset the capture variables before normal UI/build QA.
 */
import http from 'node:http';
import next from 'next';
import {captureRuntimeEnabled,isLocalCaptureHost} from '../app/(english)/_families/capture-runtime.mjs';
if (!captureRuntimeEnabled()) throw Error('Capture mode must be explicitly enabled.');
const origin=new URL(process.env.AHV_CAPTURE_ORIGIN),port=Number(origin.port||80);
const app=next({dev:true,hostname:'127.0.0.1',port});
await app.prepare();
const handle=app.getRequestHandler();
const server=http.createServer((request,response)=>{
 if(!isLocalCaptureHost(request.headers.host)){response.writeHead(403);response.end('Local capture only');return;}
 handle(request,response);
});
server.listen(port,'127.0.0.1',()=>console.log('Local source capture ready: '+origin.origin));
async function close(){server.close();await app.close();process.exit(0);}
process.once('SIGINT',close);process.once('SIGTERM',close);
