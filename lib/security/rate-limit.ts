import type { NextRequest } from "next/server";

type RateLimitOptions = {
  bucket: string;
  limit: number;
  windowMs: number;
};

type BucketState = {
  count: number;
  resetAt: number;
};

const globalState = globalThis as typeof globalThis & {
  __nestfindRateLimit?: Map<string, BucketState>;
};

const store = globalState.__nestfindRateLimit ?? new Map<string, BucketState>();

if (!globalState.__nestfindRateLimit) {
  globalState.__nestfindRateLimit = store;
}

function getIpAddress(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export async function applyRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
) {
  const ip = getIpAddress(request);
  const key = `${options.bucket}:${ip}`;
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const nextValue = {
      count: 1,
      resetAt: now + options.windowMs,
    };

    store.set(key, nextValue);

    return {
      success: true,
      headers: {
        "X-RateLimit-Limit": `${options.limit}`,
        "X-RateLimit-Remaining": `${Math.max(options.limit - 1, 0)}`,
        "X-RateLimit-Reset": `${Math.ceil(nextValue.resetAt / 1000)}`,
      },
    };
  }

  current.count += 1;
  store.set(key, current);

  const remaining = Math.max(options.limit - current.count, 0);

  return {
    success: current.count <= options.limit,
    headers: {
      "X-RateLimit-Limit": `${options.limit}`,
      "X-RateLimit-Remaining": `${remaining}`,
      "X-RateLimit-Reset": `${Math.ceil(current.resetAt / 1000)}`,
    },
  };
}
