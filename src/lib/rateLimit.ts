// Lightweight in-memory rate limiter for API route handlers. Protects the
// mutation endpoints (contact, register, B2B, payment, login) from bursts and
// abuse so a traffic spike or a single hot client can't overwhelm the database
// or mail queue.
//
// ponytail: in-memory + per-instance. On a multi-instance/serverless host each
// instance keeps its own counters, so the effective global limit is
// (limit × instances). That's fine as a first-line guard; swap the Map for a
// shared store (Upstash Redis / Vercel KV) when you need a strict global limit.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the Map can't grow unbounded under many unique IPs.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Fixed-window limiter. Returns ok:false once `limit` requests are seen from
 * the same key within `windowMs`.
 */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/** Best-effort client IP from proxy headers (Vercel/Cloudflare/Nginx). */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Convenience guard for route handlers. Returns a 429 Response when the caller
 * is over the limit, or null when the request may proceed.
 */
export function enforceRateLimit(
  request: Request,
  name: string,
  limit = 10,
  windowMs = 60_000
): Response | null {
  const { ok, retryAfterSeconds } = rateLimit(`${name}:${clientIp(request)}`, limit, windowMs);
  if (ok) return null;
  return Response.json(
    { error: "Too many requests. Please slow down and try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
