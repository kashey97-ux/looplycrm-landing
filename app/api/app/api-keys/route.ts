import { NextResponse } from "next/server";
import { kvConfigured, kvGetJson, kvLpush, kvLrange, kvLrem, kvSetJson, StorageNotConfiguredError } from "../../_lib/kv";
import crypto from "crypto";

export const runtime = "nodejs";

type StoredUser = {
  email: string;
  trialStart: number;
  trialDays: number;
};

type ApiKeyRecord = {
  id: string;
  ownerEmail: string;
  prefix: string;
  keyHash: string;
  createdAt: number;
  revokedAt?: number;
};

function norm(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isTrialExpired(u: StoredUser, now = Date.now()) {
  const end = u.trialStart + u.trialDays * 24 * 60 * 60 * 1000;
  return now >= end;
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generateApiKey() {
  // Prefix helps identify keys without revealing full secret.
  const secret = crypto.randomBytes(24).toString("base64url");
  return `looply_${secret}`;
}

export async function GET(req: Request) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const ownerEmail = norm(searchParams.get("ownerEmail")).toLowerCase();
  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });

  try {
    const ids = await kvLrange(`apiKeysByUser:${ownerEmail}`, 0, 200);
    const keys = await Promise.all(ids.map((id) => kvGetJson<ApiKeyRecord>(`apiKey:${id}`)));
    const items = (keys.filter(Boolean) as ApiKeyRecord[])
      .filter((k) => !k.revokedAt)
      .map((k) => ({ id: k.id, prefix: k.prefix, createdAt: k.createdAt }));
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "api_keys_list_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  let body: { ownerEmail?: unknown };
  try {
    body = (await req.json()) as any;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const ownerEmail = norm(body.ownerEmail).toLowerCase();
  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });

  try {
    const user = await kvGetJson<StoredUser>(`user:${ownerEmail}`);
    if (!user) return NextResponse.json({ ok: false, error: "user_not_registered" }, { status: 400 });
    if (isTrialExpired(user)) return NextResponse.json({ ok: false, error: "trial_expired" }, { status: 402 });

    const apiKey = generateApiKey();
    const prefix = apiKey.slice(0, 12);
    const keyHash = sha256Hex(apiKey);
    const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `key_${Date.now()}`;
    const record: ApiKeyRecord = { id, ownerEmail, prefix, keyHash, createdAt: Date.now() };

    await kvSetJson(`apiKey:${id}`, record);
    await kvLpush(`apiKeysByUser:${ownerEmail}`, id);

    // Return secret ONCE.
    return NextResponse.json({ ok: true, id, apiKey, prefix, createdAt: record.createdAt });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "api_key_create_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const ownerEmail = norm(searchParams.get("ownerEmail")).toLowerCase();
  const id = norm(searchParams.get("id"));
  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  try {
    const record = await kvGetJson<ApiKeyRecord>(`apiKey:${id}`);
    if (!record || record.ownerEmail !== ownerEmail) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

    await kvSetJson(`apiKey:${id}`, { ...record, revokedAt: Date.now() });
    // Keep ID in list for history, but remove duplicates if any.
    await kvLrem(`apiKeysByUser:${ownerEmail}`, 0, id);
    await kvLpush(`apiKeysByUser:${ownerEmail}`, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "api_key_revoke_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

