import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type WhiteoutState = {
  active?: boolean;
};

const PRIMARY_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8090";

const API_CANDIDATES = Array.from(
  new Set(
    [
      PRIMARY_API_URL,
      "http://127.0.0.1:9191",
      "http://localhost:9191",
      "http://127.0.0.1:8080",
      "http://localhost:8080",
      "http://127.0.0.1:8090",
      "http://localhost:8090",
    ].map((url) => url.replace(/\/+$/, ""))
  )
);

function whitePage() {
  return new NextResponse("<!doctype html><html><body></body></html>", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

async function fetchBackend(path: string, request?: NextRequest) {
  let lastError: unknown;

  for (const baseUrl of API_CANDIDATES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const response = await fetch(`${baseUrl}${path}`, {
        method: "GET",
        headers: request
          ? {
              accept: request.headers.get("accept") || "application/json",
              authorization: request.headers.get("authorization") || "",
              cookie: request.headers.get("cookie") || "",
            }
          : undefined,
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) return response;
      lastError = new Error(`Backend ${baseUrl} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Backend unavailable");
}

async function isWhiteoutActive() {
  try {
    const response = await fetchBackend("/api/site-whiteout?status=1");
    const state = (await response.json()) as WhiteoutState;
    return state.active === true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/api/site-whiteout") {
    try {
      const response = await fetchBackend(`/api/site-whiteout${search}`, request);
      return new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
      });
    } catch {
      return NextResponse.json(
        { error: true, message: "Backend unavailable" },
        { status: 502 }
      );
    }
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  if (await isWhiteoutActive()) {
    return whitePage();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/site-whiteout",
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
