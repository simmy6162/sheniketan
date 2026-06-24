/**
 * Edge-compatible session token utilities using Web Crypto API.
 * This file is safe to import from middleware (Edge Runtime).
 * Do NOT import Node.js-only modules here.
 */
import type { SessionPayload } from '@/types';

const JWT_SECRET =
  process.env.JWT_SECRET || 'she_niketan_sanctuary_fallback_secret_2026';
const encoder = new TextEncoder();

function base64UrlEncode(data: string): string {
  return btoa(data).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return atob(s);
}

async function getHmacKey(usage: KeyUsage[]) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usage
  );
}

/**
 * Creates a signed session token with a 7-day expiry.
 * Uses Web Crypto API — safe for both Node.js and Edge runtimes.
 */
export async function signToken(payload: SessionPayload): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp }));
  const dataToSign = `${header}.${body}`;

  const key = await getHmacKey(['sign']);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign)
  );

  const sigBytes = new Uint8Array(signatureBuffer);
  let sigStr = '';
  sigBytes.forEach((b) => (sigStr += String.fromCharCode(b)));

  return `${dataToSign}.${base64UrlEncode(sigStr)}`;
}

/**
 * Verifies a session token. Returns the payload or null if invalid / expired.
 * Uses Web Crypto API — safe for both Node.js and Edge runtimes.
 */
export async function verifyToken(
  token: string
): Promise<(SessionPayload & { exp: number }) | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, encodedSig] = parts;
    const sigStr = base64UrlDecode(encodedSig);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const key = await getHmacKey(['verify']);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(`${header}.${body}`)
    );
    if (!valid) return null;

    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload & {
      exp: number;
    };
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}
