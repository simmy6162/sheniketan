// Edge-compatible JWT-like session signing using Web Crypto API

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_she_niketan_sanctuary_2026';
const encoder = new TextEncoder();

/**
 * Returns the HMAC-SHA256 key for signing/verification.
 */
async function getHmacKey() {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Encodes a string to url-safe base64.
 */
function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Decodes a url-safe base64 string.
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

/**
 * Signs a payload with HMAC-SHA256 and returns a token string.
 */
export async function signToken(payload: { userId: string; email: string; role: string; name: string }): Promise<string> {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  // Set expiration to 7 days
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const fullPayload = JSON.stringify({ ...payload, exp });
  
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(fullPayload);
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign)
  );
  
  const signatureBytes = new Uint8Array(signature);
  let signatureString = '';
  for (let i = 0; i < signatureBytes.length; i++) {
    signatureString += String.fromCharCode(signatureBytes[i]);
  }
  
  const encodedSignature = base64UrlEncode(signatureString);
  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verifies a token and returns the payload, or null if invalid.
 */
export async function verifyToken(token: string): Promise<{ userId: string; email: string; role: string; name: string; exp: number } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    
    const key = await getHmacKey();
    
    // Decode signature
    const signatureString = base64UrlDecode(encodedSignature);
    const signatureBytes = new Uint8Array(signatureString.length);
    for (let i = 0; i < signatureString.length; i++) {
      signatureBytes[i] = signatureString.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(dataToVerify)
    );
    
    if (!isValid) return null;
    
    const decodedPayload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    if (decodedPayload.exp && Date.now() > decodedPayload.exp) {
      return null;
    }
    
    return decodedPayload;
  } catch (err) {
    return null;
  }
}
