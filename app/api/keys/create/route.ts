export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getEngineBaseUrl() {
  const base = (process.env.ENGINE_API_URL || process.env.NEXT_PUBLIC_ENGINE_API_URL || "").trim();
  return base.replace(/\/+$/, "");
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const base = getEngineBaseUrl();
  if (!base) {
    return NextResponse.json(
      { ok: false, error: "engine_not_configured", message: "ENGINE_API_URL is not configured." },
      { status: 500 },
    );
  }

  const auth = request.headers.get("authorization") || "";
  const cookieToken = cookies().get("looply_session")?.value || "";
  const token = auth || (cookieToken ? `Bearer ${cookieToken}` : "");
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "unauthorized", message: "Missing authorization token." },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(`${base}/v1/api-keys`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    const json = await parseJsonSafe(res);
    return NextResponse.json(json ?? {}, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "network_error", message: err?.message || "Network error" },
      { status: 502 },
    );
  }
}
