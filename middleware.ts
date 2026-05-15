import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { applyRateLimit } from "@/lib/security/rate-limit";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const limit = await applyRateLimit(request, {
    bucket: "global-api",
    limit: 120,
    windowMs: 60_000,
  });

  if (!limit.success) {
    return NextResponse.json(
      { message: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: limit.headers,
      },
    );
  }

  const response = NextResponse.next();

  for (const [key, value] of Object.entries(limit.headers)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
