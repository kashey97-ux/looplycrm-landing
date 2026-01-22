export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getEngineBaseUrl() {
  const base = (process.env.ENGINE_API_URL || "").trim();
  return base.replace(/\/+$/, "");
}

function buildTargetUrl(base: string, pathParts: string[], search: string) {
  const joined = pathParts.map((p) => encodeURIComponent(p)).join("/");
  return `${base}/${joined}${search || ""}`;
}

async function proxy(request: Request, pathParts: string[]) {
  const base = getEngineBaseUrl();
  if (!base) {
    return NextResponse.json(
      { ok: false, error: "engine_not_configured", message: "ENGINE_API_URL is not configured." },
      { status: 500 },
    );
  }

  const token = cookies().get("looply_session")?.value || "";
  const url = buildTargetUrl(base, pathParts, new URL(request.url).search);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("cookie");
  headers.set("accept", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);

  const method = request.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete("set-cookie");
    return new NextResponse(res.body, { status: res.status, headers: responseHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "network_error", message: err?.message || "Network error" },
      { status: 502 },
    );
  }
}

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path || []);
}
export async function POST(request: Request, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path || []);
}
export async function PUT(request: Request, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path || []);
}
export async function PATCH(request: Request, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path || []);
}
export async function DELETE(request: Request, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path || []);
}
