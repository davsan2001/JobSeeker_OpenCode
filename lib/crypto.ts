import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * App-wide symmetric encryption for secrets at rest (API keys, SMTP passwords,
 * refresh tokens, etc). Uses AES-256-GCM with a per-record random IV.
 *
 * The master key MUST come from the `APP_ENCRYPTION_KEY` environment variable
 * and MUST be 32 bytes once decoded. Accepted formats:
 *   - 64 hex chars       (e.g. `openssl rand -hex 32`)
 *   - 44-char base64     (e.g. `openssl rand -base64 32`)
 *
 * Payload format on disk:  `${iv_b64}:${tag_b64}:${ciphertext_b64}`
 *
 * This module is import-safe: it does NOT throw at import time so build/SSR
 * doesn't blow up when the env var isn't present. It throws on first use.
 * Call `selfTestEncryption()` at boot (e.g. in a server route) if you want a
 * fast fail on misconfiguration.
 */

const ALGO = 'aes-256-gcm';
const KEY_BYTES = 32;

let cachedKey: Buffer | null = null;

function decodeMasterKey(raw: string): Buffer {
  const trimmed = raw.trim();

  // Hex (64 chars)
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, 'hex');
  }

  // Base64 (standard or url-safe, with/without padding)
  const b64 = trimmed.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const buf = Buffer.from(b64, 'base64');
    if (buf.length === KEY_BYTES) return buf;
  } catch {
    /* fallthrough */
  }

  throw new Error(
    'APP_ENCRYPTION_KEY must decode to exactly 32 bytes. ' +
      'Generate one with: `openssl rand -base64 32` (or `openssl rand -hex 32`).'
  );
}

function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      'APP_ENCRYPTION_KEY is not set. Generate one with `openssl rand -base64 32` and put it in your env.'
    );
  }
  cachedKey = decodeMasterKey(raw);
  return cachedKey;
}

export function encryptSecret(plain: string): string {
  if (typeof plain !== 'string') throw new Error('encryptSecret expects a string');
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${enc.toString('base64')}`;
}

export function decryptSecret(payload: string): string {
  if (typeof payload !== 'string' || !payload.includes(':')) {
    throw new Error('Invalid encrypted payload');
  }
  const [ivB64, tagB64, encB64] = payload.split(':');
  if (!ivB64 || !tagB64 || !encB64) throw new Error('Invalid encrypted payload');
  const key = getKey();
  const decipher = createDecipheriv(ALGO, key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(encB64, 'base64')),
    decipher.final()
  ]);
  return dec.toString('utf8');
}

/**
 * Encrypts a value only if it's a non-empty string. Returns null otherwise.
 * Convenience helper for optional fields.
 */
export function encryptOptional(plain: string | null | undefined): string | null {
  if (!plain) return null;
  return encryptSecret(plain);
}

/**
 * Decrypts a value only if present. Returns null if the payload is null/empty.
 */
export function decryptOptional(payload: string | null | undefined): string | null {
  if (!payload) return null;
  return decryptSecret(payload);
}

/**
 * Call at boot (e.g. from a `/api/health` route) to verify the master key is
 * correctly configured and that round-trip encryption works. Throws on failure.
 */
export function selfTestEncryption(): void {
  const sample = 'jobseeker-crypto-selftest';
  const out = decryptSecret(encryptSecret(sample));
  if (out !== sample) throw new Error('Crypto self-test failed: round-trip mismatch');
}
