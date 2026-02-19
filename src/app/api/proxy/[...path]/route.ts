import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Allow large file uploads (200MB to match backend limit)
export const maxDuration = 60;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

async function proxy(request: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join("/");
  const targetUrl = `${API_URL}/${path}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const xFilename = request.headers.get("x-filename");
  const accept = request.headers.get("accept");

  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);
  if (cookie) headers.set("cookie", cookie);
  if (xFilename) headers.set("x-filename", xFilename);
  if (accept) headers.set("accept", accept);

  const method = request.method;
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body ? new Uint8Array(body) : undefined,
    });

    const responseHeaders = new Headers(response.headers);
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy error";
    return new Response(JSON.stringify({ message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
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
