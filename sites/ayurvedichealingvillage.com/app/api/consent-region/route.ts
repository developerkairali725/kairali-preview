import { regionResponse } from '../../../lib/consent-region.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function GET(request: Request) {
  return regionResponse(request.headers, { VERCEL: process.env.VERCEL, VERCEL_URL: process.env.VERCEL_URL });
}
