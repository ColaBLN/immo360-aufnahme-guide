import { next } from '@vercel/functions';
import { COOKIE, readCookie, verifyToken } from './lib/session.js';

// Alles ausser Sperrbildschirm und Login/Logout ist geschuetzt.
export const config = {
  matcher: ['/((?!lock\\.html|api/login|api/logout|favicon\\.ico).*)'],
};

export default async function middleware(request) {
  const token = readCookie(request.headers.get('cookie'), COOKIE);
  if (await verifyToken(token, process.env.SESSION_SECRET)) {
    return next({ headers: { 'Cache-Control': 'private, no-store' } });
  }
  const accept = request.headers.get('accept') || '';
  if (request.method === 'GET' && accept.includes('text/html')) {
    return new Response(null, { status: 302, headers: { Location: '/lock.html', 'Cache-Control': 'no-store' } });
  }
  return new Response('Nicht angemeldet', { status: 401, headers: { 'Cache-Control': 'no-store' } });
}
