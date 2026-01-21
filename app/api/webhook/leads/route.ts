import { NextResponse } from "next/server";
import crypto from "crypto";
import { kvConfigured, kvGetJson, kvSetJson, kvLpush, StorageNotConfiguredError } from "../../_lib/kv";

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

type Lead = {
  id: string;
  ownerEmail: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  status: "New" | "Contacted";
  createdAt: number;
};

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function norm(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isTrialExpired(u: StoredUser, now = Date.now()) {
  const end = u.trialStart + u.trialDays * 24 * 60 * 60 * 1000;
  return now >= end;
}

export async function POST(req: Request) {
  const requestId =
    req.headers.get("x-request-id") ||
    req.headers.get("x-vercel-id") ||
    (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `req_${Date.now()}`);

  if (!kvConfigured()) {
    return NextResponse.json({ ok: false, error: "storage_not_configured", requestId }, { status: 500 });
  }

  const auth = req.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const apiKey = bearer || req.headers.get("x-api-key") || "";
  const apiKeyId = req.headers.get("x-api-key-id") || "";

  if (!apiKey || !apiKeyId) {
    return NextResponse.json({ ok: false, error: "unauthorized", requestId }, { status: 401 });
  }

  try {
    const record = await kvGetJson<ApiKeyRecord>(`apiKey:${apiKeyId}`);
    if (!record) return NextResponse.json({ ok: false, error: "unauthorized", requestId }, { status: 401 });

    if (record.revokedAt) {
      return NextResponse.json({ ok: false, error: "unauthorized", requestId }, { status: 401 });
    }

    const expectedHash = record.keyHash;
    const providedHash = sha256Hex(apiKey);
    if (providedHash !== expectedHash) {
      return NextResponse.json({ ok: false, error: "unauthorized", requestId }, { status: 401 });
    }

    const ownerEmail = record.ownerEmail;
    const user = await kvGetJson<StoredUser>(`user:${ownerEmail}`);
    if (!user) return NextResponse.json({ ok: false, error: "user_not_registered", requestId }, { status: 400 });
    if (isTrialExpired(user)) return NextResponse.json({ ok: false, error: "trial_expired", requestId }, { status: 402 });

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json", requestId }, { status: 400 });
    }

    const name = norm(body?.name);
    const email = norm(body?.email).toLowerCase();
    const phone = norm(body?.phone);
    const company = norm(body?.company);
    const message = norm(body?.message);
    const source = norm(body?.source) || "webhook";

    if (name.length < 2) return NextResponse.json({ ok: false, error: "invalid_name", requestId }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email", requestId }, { status: 400 });
    }

    const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `lead_${Date.now()}`;
    const lead: Lead = {
      id,
      ownerEmail,
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      message: message || undefined,
      source,
      status: "New",
      createdAt: Date.now(),
    };

    await kvSetJson(`lead:${id}`, lead);
    await kvLpush(`leadsByUser:${ownerEmail}`, id);

    const eventId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `evt_${Date.now()}`;
    await kvSetJson(`event:${eventId}`, {
      id: eventId,
      leadId: id,
      type: "lead_created",
      title: "Lead created (webhook)",
      details: JSON.stringify({ source }),
      createdAt: Date.now(),
    });
    await kvLpush(`eventsByLead:${id}`, eventId);

    console.log(JSON.stringify({ tag: "webhook_lead_created", requestId, leadId: id, ownerEmail }));

    return NextResponse.json({ ok: true, requestId, leadId: id });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured", requestId }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "webhook_lead_failed", requestId, message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error", requestId }, { status: 500 });
  }
}

