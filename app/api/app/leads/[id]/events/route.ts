import { NextResponse } from "next/server";
import { kvConfigured, kvGetJson, kvLpush, kvLrange, kvSetJson, StorageNotConfiguredError } from "../../../../_lib/kv";

export const runtime = "nodejs";

type StoredUser = {
  email: string;
  trialStart: number;
  trialDays: number;
};

type Lead = {
  id: string;
  ownerEmail: string;
};

type TimelineEvent = {
  id: string;
  leadId: string;
  type: string;
  title: string;
  details?: string;
  createdAt: number;
};

type CreateEventBody = {
  ownerEmail?: unknown;
  type?: unknown;
  title?: unknown;
  details?: unknown;
};

function norm(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isTrialExpired(u: StoredUser, now = Date.now()) {
  const end = u.trialStart + u.trialDays * 24 * 60 * 60 * 1000;
  return now >= end;
}

export async function GET(req: Request, ctx: { params: { id: string } }) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  const leadId = ctx.params.id;
  const { searchParams } = new URL(req.url);
  const ownerEmail = norm(searchParams.get("ownerEmail")).toLowerCase();
  const cursorRaw = searchParams.get("cursor");
  const cursor = cursorRaw ? Number(cursorRaw) : 0;
  const limitRaw = searchParams.get("limit");
  const limit = Math.min(100, Math.max(1, limitRaw ? Number(limitRaw) : 20));

  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });

  try {
    const lead = await kvGetJson<Lead>(`lead:${leadId}`);
    if (!lead || lead.ownerEmail !== ownerEmail) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

    const ids = await kvLrange(`eventsByLead:${leadId}`, cursor, cursor + limit - 1);
    const events = await Promise.all(ids.map((id) => kvGetJson<TimelineEvent>(`event:${id}`)));
    const items = events.filter(Boolean) as TimelineEvent[];
    const nextCursor = ids.length < limit ? null : cursor + ids.length;
    return NextResponse.json({ ok: true, items, nextCursor });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "events_list_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  const leadId = ctx.params.id;

  let body: CreateEventBody;
  try {
    body = (await req.json()) as CreateEventBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const ownerEmail = norm(body.ownerEmail).toLowerCase();
  const type = norm(body.type);
  const title = norm(body.title);
  const details = typeof body.details === "string" ? body.details : body.details ? JSON.stringify(body.details) : "";

  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });
  if (!type) return NextResponse.json({ ok: false, error: "missing_type" }, { status: 400 });
  if (!title) return NextResponse.json({ ok: false, error: "missing_title" }, { status: 400 });

  try {
    const user = await kvGetJson<StoredUser>(`user:${ownerEmail}`);
    if (!user) return NextResponse.json({ ok: false, error: "user_not_registered" }, { status: 400 });
    if (isTrialExpired(user)) return NextResponse.json({ ok: false, error: "trial_expired" }, { status: 402 });

    const lead = await kvGetJson<Lead>(`lead:${leadId}`);
    if (!lead || lead.ownerEmail !== ownerEmail) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

    const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `evt_${Date.now()}`;
    const event: TimelineEvent = { id, leadId, type, title, details: details || undefined, createdAt: Date.now() };
    await kvSetJson(`event:${id}`, event);
    await kvLpush(`eventsByLead:${leadId}`, id);
    return NextResponse.json({ ok: true, event });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "event_create_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

