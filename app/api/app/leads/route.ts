import { NextResponse } from "next/server";
import { kvConfigured, kvGetJson, kvLpush, kvLrange, kvSetJson, StorageNotConfiguredError } from "../../_lib/kv";

export const runtime = "nodejs";

type StoredUser = {
  email: string;
  trialStart: number;
  trialDays: number;
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

type CreateLeadBody = {
  ownerEmail?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  source?: unknown;
  origin?: unknown; // "manual" | "test" | "webhook"
};

function norm(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isTrialExpired(u: StoredUser, now = Date.now()) {
  const end = u.trialStart + u.trialDays * 24 * 60 * 60 * 1000;
  return now >= end;
}

async function requireUser(ownerEmail: string) {
  const user = await kvGetJson<StoredUser>(`user:${ownerEmail}`);
  if (!user) return null;
  return user;
}

export async function GET(req: Request) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const ownerEmail = norm(searchParams.get("ownerEmail")).toLowerCase();
  const cursorRaw = searchParams.get("cursor");
  const cursor = cursorRaw ? Number(cursorRaw) : 0;
  const limitRaw = searchParams.get("limit");
  const limit = Math.min(100, Math.max(1, limitRaw ? Number(limitRaw) : 20));

  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });

  try {
    const ids = await kvLrange(`leadsByUser:${ownerEmail}`, cursor, cursor + limit - 1);
    const leads = await Promise.all(ids.map((id) => kvGetJson<Lead>(`lead:${id}`)));
    const items = leads.filter(Boolean) as Lead[];
    const nextCursor = ids.length < limit ? null : cursor + ids.length;
    return NextResponse.json({ ok: true, items, nextCursor });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "leads_list_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  let body: CreateLeadBody;
  try {
    body = (await req.json()) as CreateLeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const ownerEmail = norm(body.ownerEmail).toLowerCase();
  const name = norm(body.name);
  const email = norm(body.email).toLowerCase();
  const phone = norm(body.phone);
  const company = norm(body.company);
  const message = norm(body.message);
  const source = norm(body.source);
  const origin = norm(body.origin) || "manual";

  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });

  try {
    const user = await requireUser(ownerEmail);
    if (!user) return NextResponse.json({ ok: false, error: "user_not_registered" }, { status: 400 });
    if (isTrialExpired(user)) return NextResponse.json({ ok: false, error: "trial_expired" }, { status: 402 });

    const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `lead_${Date.now()}`;
    const lead: Lead = {
      id,
      ownerEmail,
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      message: message || undefined,
      source: source || undefined,
      status: "New",
      createdAt: Date.now(),
    };

    await kvSetJson(`lead:${id}`, lead);
    await kvLpush(`leadsByUser:${ownerEmail}`, id);

    // Initial timeline event
    const eventId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `evt_${Date.now()}`;
    await kvSetJson(`event:${eventId}`, {
      id: eventId,
      leadId: id,
      type: "lead_created",
      title: "Lead created",
      details: JSON.stringify({ origin }),
      createdAt: Date.now(),
    });
    await kvLpush(`eventsByLead:${id}`, eventId);

    if (message) {
      const msgId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `evt_${Date.now()}_msg`;
      await kvSetJson(`event:${msgId}`, {
        id: msgId,
        leadId: id,
        type: "lead_message",
        title: "Message captured",
        details: message,
        createdAt: Date.now(),
      });
      await kvLpush(`eventsByLead:${id}`, msgId);
    }

    if (origin === "test") {
      const seedId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `evt_${Date.now()}_seed`;
      await kvSetJson(`event:${seedId}`, {
        id: seedId,
        leadId: id,
        type: "test_seeded",
        title: "Test lead seeded",
        details: JSON.stringify({}),
        createdAt: Date.now(),
      });
      await kvLpush(`eventsByLead:${id}`, seedId);
    }

    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "lead_create_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

