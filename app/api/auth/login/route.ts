export const runtime = "nodejs";

import { NextResponse } from "next/server";

function getEngineBaseUrl() {
  const base = (process.env.ENGINE_API_URL || "").trim();
  return base.replace(/\/+$/, "");
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function getTokenFromResponse(json: any) {
  return (
    json?.token ||
    json?.access_token ||
    json?.session?.token ||
    json?.data?.token ||
    json?.data?.access_token ||
    ""
  );
}

export async function POST(request: Request) {
  const base = getEngineBaseUrl();
  if (!base) {
    return NextResponse.json(
      { ok: false, error: "engine_not_configured", message: "ENGINE_API_URL is not configured." },
      { status: 500 },
    );
  }

  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body || {}),
    });

    const json = await parseJsonSafe(res);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: json?.message || json?.error || "Login failed." },
        { status: res.status },
      );
    }

    const token = getTokenFromResponse(json);
    if (!token) {
      return NextResponse.json({ ok: false, message: "Login succeeded but token is missing." }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true, ...json });
    response.cookies.set({
      name: "looply_session",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "network_error", message: err?.message || "Network error" },
      { status: 502 },
    );
  }
}
