import { NextResponse } from "next/server";
import { kvConfigured, kvGetJson, kvSetJson, StorageNotConfiguredError } from "../../_lib/kv";

export const runtime = "nodejs";

type RegisterBody = {
  email?: unknown;
  name?: unknown;
  plan?: unknown;
  trialStart?: unknown;
  trialDays?: unknown;
};

type StoredUser = {
  email: string;
  name: string;
  plan: "starter" | "growth" | "pro";
  trialStart: number;
  trialDays: number;
  createdAt: number;
};

function norm(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function parseNum(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return NaN;
}

export async function POST(req: Request) {
  if (!kvConfigured()) {
    return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
  }

  let body: RegisterBody;
  try {
    body = (await req.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = norm(body.email).toLowerCase();
  const name = norm(body.name);
  const planRaw = norm(body.plan).toLowerCase();
  const plan: StoredUser["plan"] = planRaw === "growth" || planRaw === "pro" ? (planRaw as any) : "starter";
  const trialStart = parseNum(body.trialStart);
  const trialDays = parseNum(body.trialDays);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const key = `user:${email}`;
  const now = Date.now();

  try {
    const existing = await kvGetJson<StoredUser>(key);
    const next: StoredUser = {
      email,
      name: name || existing?.name || "",
      plan: plan || existing?.plan || "starter",
      trialStart: Number.isFinite(trialStart) ? trialStart : existing?.trialStart || now,
      trialDays: Number.isFinite(trialDays) && trialDays > 0 ? trialDays : existing?.trialDays || 7,
      createdAt: existing?.createdAt || now,
    };
    await kvSetJson(key, next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "register_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

