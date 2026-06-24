/**
 * Server-only auth helpers (Node.js runtime required).
 * Do NOT import this file from middleware or Edge routes.
 * For token operations in middleware, use @/lib/session instead.
 */
import crypto from 'crypto';

// ─── Password Hashing ────────────────────────────────────────────────────────

/**
 * Hashes a plaintext password using PBKDF2-SHA512.
 * Returns a "salt:hash" formatted string for storage.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored "salt:hash" string.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, originalHash] = parts;
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(originalHash, 'hex')
    );
  } catch {
    return false;
  }
}

// ─── Re-export edge-safe token utilities ─────────────────────────────────────
// API routes can import signToken/verifyToken from here for convenience.
export { signToken, verifyToken } from '@/lib/session';
