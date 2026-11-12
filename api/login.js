import { COOKIE, MAX_AGE, createToken, pinMatches } from '../lib/session.js';

// Einfache Bremse gegen Durchprobieren (pro Server-Instanz).
const attempts = new Map(); // ip -> { n, until }
const LIMIT = 5, BLOCK_MS = 10 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const a = attempts.get(ip) || { n: 0, until: 0 };
  if (a.until > now) return new Response('Zu viele Versuche', { status: 429 });

  let pin = '';
  try { pin = String((await request.json()).pin || ''); } catch {}

  const secret = process.env.SESSION_SECRET;
  if (!secret || !process.env.APP_PIN) return new Response('Server nicht konfiguriert', { status: 500 });

  if (!pinMatches(pin, process.env.APP_PIN)) {
    a.n += 1;
    if (a.n >= LIMIT) { a.n = 0; a.until = now + BLOCK_MS; }
    attempts.set(ip, a);
    await sleep(800);
    return new Response('Falscher Code', { status: 401 });
  }

  attempts.delete(ip);
  const token = await createToken(secret);
  return new Response('ok', {
    status: 200,
    headers: {
      'Set-Cookie': `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      'Cache-Control': 'no-store',
    },
  });
}
