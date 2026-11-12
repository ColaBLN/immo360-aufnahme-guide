import { COOKIE } from '../lib/session.js';

export function GET() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/lock.html',
      'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
      'Cache-Control': 'no-store',
    },
  });
}
