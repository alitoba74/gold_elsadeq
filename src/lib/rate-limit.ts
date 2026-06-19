import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory rate limiter using a Map.
 * For production scale, use Upstash Redis or Vercel KV.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30; // 30 req/min per IP for refresh

// Cleanup old entries periodically
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return; // 5 min
  lastCleanup = now;
  for (const [k, v] of buckets.entries()) {
    if (v.resetAt < now) buckets.delete(k);
  }
}

export function rateLimit(req: NextRequest, max: number = MAX_REQUESTS): NextResponse | null {
  cleanup();
  // Use x-forwarded-for or fall back to a default
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || "anonymous";

  const now = Date.now();
  const entry = buckets.get(ip);

  if (!entry || entry.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  entry.count += 1;
  if (entry.count > max) {
    return NextResponse.json(
      {
        error: "Too many requests",
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      },
    );
  }
  return null;
}
