import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";

function setCorsHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");

  if (origin && env.allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Vary", "Origin");
}

export function jsonResponse(
  request: NextRequest,
  body: unknown,
  init?: ResponseInit,
) {
  const response = NextResponse.json(body, init);
  setCorsHeaders(request, response);
  return response;
}

export function optionsResponse(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  setCorsHeaders(request, response);
  return response;
}

export function rejectDisallowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin || env.allowedOrigins.includes(origin)) {
    return null;
  }

  return jsonResponse(request, { message: "Origin not allowed." }, { status: 403 });
}

export function getRequestMeta(request: NextRequest) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null,
    userAgent: request.headers.get("user-agent"),
  };
}
