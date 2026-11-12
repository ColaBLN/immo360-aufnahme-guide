// Signierte Sitzungs-Cookies (HMAC-SHA256) – ohne Abhängigkeiten, Web Crypto.
export const COOKIE = 'i360_session';
export const MAX_AGE = 12 * 60 * 60; // 12 Stunden

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function key(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function sign(value, secret) {
  return hex(await crypto.subtle.sign('HMAC', await key(secret), enc.encode(value)));
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function createToken(secret) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${await sign(String(exp), secret)}`;
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(sig, await sign(exp, secret));
}

export function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function pinMatches(input, pin) {
  return typeof input === 'string' && typeof pin === 'string' && pin.length > 0 && safeEqual(input, pin);
}
