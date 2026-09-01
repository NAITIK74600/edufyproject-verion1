import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

/**
 * Minimal, dependency-free auth primitives for the real login/registration
 * backend. Deliberately avoids bcrypt/jsonwebtoken: Node's built-in `crypto`
 * already provides everything needed —
 *   - scrypt (a memory-hard KDF, at least as strong as bcrypt) for passwords
 *   - HMAC-SHA256 for tamper-proof, stateless session tokens (no session
 *     table to clean up; the cookie itself is the source of truth)
 */

const SESSION_COOKIE = "edufy_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add a long random string to .env.local (e.g. `openssl rand -hex 32`)."
    );
  }
  return secret;
}

// ---------------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------------

/** Hashes a plaintext password as "<salt-hex>:<hash-hex>" using scrypt. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/** Verifies a plaintext password against a stored "<salt-hex>:<hash-hex>" value. */
export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  // timingSafeEqual throws if lengths differ, so guard first.
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

// ---------------------------------------------------------------------------
// Session tokens — "<base64url payload>.<base64url HMAC signature>"
// ---------------------------------------------------------------------------

export type SessionPayload = {
  userId: string;
  email: string;
  fullName: string;
  /** Unix seconds; token is rejected once past this. */
  exp: number;
};

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

function sign(data: string): string {
  return base64url(createHmac("sha256", getAuthSecret()).update(data).digest());
}

/** Creates a signed, stateless session token embedding the user identity. */
export function createSessionToken(user: { id: string; email: string; fullName: string }): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const body = base64url(Buffer.from(JSON.stringify(payload)));
  return `${body}.${sign(body)}`;
}

/** Verifies a session token's signature and expiry, returning its payload or null. */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE_SECONDS;

/** Basic, dependency-free email format check for form validation. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
