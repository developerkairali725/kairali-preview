// Build-time capture tooling only. Public URLs never select an alternate renderer.
export function captureRuntimeEnabled(env = process.env) {
  if (!env.AHV_CAPTURE_RUNTIME || env.AHV_CAPTURE_RUNTIME === '0') return false;
  if (env.AHV_CAPTURE_RUNTIME !== '1' || env.NODE_ENV !== 'development' || env.VERCEL || env.VERCEL_ENV) {
    throw new Error('AHV_CAPTURE_RUNTIME is permitted only for local development capture; never build or deploy with it enabled.');
  }
  let origin;
  try { origin = new URL(env.AHV_CAPTURE_ORIGIN); } catch { throw new Error('Local capture requires an explicit localhost AHV_CAPTURE_ORIGIN.'); }
  if (origin.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(origin.hostname) || origin.pathname !== '/' || origin.username || origin.password || origin.search || origin.hash) {
    throw new Error('Local capture origin must be an HTTP localhost origin.');
  }
  return true;
}
// Next's explicit phase is authoritative: NODE_ENV can be inherited as
// development even when the CLI is running `next build` or `next start`.
export function captureConfigEnabled(phase, env = process.env) {
  const enabled = captureRuntimeEnabled(env);
  if (enabled && phase !== 'phase-development-server') {
    throw new Error('AHV_CAPTURE_RUNTIME requires the Next development-server phase; never build, start production, or export with it enabled.');
  }
  return enabled;
}
export function isLocalCaptureHost(host) {
  if (typeof host !== 'string' || !/^(?:127\.0\.0\.1|localhost)(?::[0-9]{1,5})?$/.test(host)) return false;
  try { return ['127.0.0.1', 'localhost'].includes(new URL('http://' + host).hostname); } catch { return false; }
}
