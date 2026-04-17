import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Allow large file uploads (200MB to match backend limit)
export const maxDuration = 60;

// Increase body size limit for file uploads (default is ~4MB)
export const fetchCache = "default-no-store";

const PRIMARY_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8090";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function buildCandidateApiUrls(): string[] {
  const defaults = [
    "http://127.0.0.1:9191",
    "http://localhost:9191",
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:8090",
    "http://localhost:8090",
  ];

  const all = [PRIMARY_API_URL, ...defaults].map(normalizeBaseUrl);
  return Array.from(new Set(all));
}

async function proxy(request: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join("/");
  const apiBaseCandidates = buildCandidateApiUrls();
  const shouldForwardCookies =
    path === "api/auth/refresh" ||
    path === "api/auth/logout";

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const xFilename = request.headers.get("x-filename");
  const accept = request.headers.get("accept");

  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);
  if (shouldForwardCookies && cookie) headers.set("cookie", cookie);
  if (xFilename) headers.set("x-filename", xFilename);
  if (accept) headers.set("accept", accept);

  const method = request.method;
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  let lastError: unknown;
  const isUploadGetRequest =
    method === "GET" && (path.startsWith("uploads/") || path.includes("/uploads/"));

  for (const base of apiBaseCandidates) {
    const targetUrl = `${base}/${path}${request.nextUrl.search}`;

    try {
      const response = await fetch(targetUrl, {
        method,
        headers,
        body: body ? new Uint8Array(body) : undefined,
      });

      // For uploaded media, try other candidates when current base doesn't have the file.
      if (
        isUploadGetRequest &&
        !response.ok &&
        (response.status === 404 || response.status >= 500)
      ) {
        lastError = new Error(`Upload fetch failed from ${base} with ${response.status}`);
        continue;
      }

      const responseHeaders = new Headers(response.headers);
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (error) {
      lastError = error;
      // Try next candidate on network-level failures.
    }
  }

  const message = lastError instanceof Error ? lastError.message : "Proxy error";
  return new Response(JSON.stringify({ message }), {
    status: 502,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolved = await params;
  return proxy(request, resolved.path || []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolved = await params;
  return proxy(request, resolved.path || []);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolved = await params;
  return proxy(request, resolved.path || []);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolved = await params;
  return proxy(request, resolved.path || []);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolved = await params;
  return proxy(request, resolved.path || []);
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const resolved = await params;
  return proxy(request, resolved.path || []);
}
