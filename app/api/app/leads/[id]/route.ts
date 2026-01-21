import { NextResponse } from "next/server";
import { kvConfigured, kvGetJson, StorageNotConfiguredError } from "../../../_lib/kv";

export const runtime = "nodejs";

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

function norm(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function GET(req: Request, ctx: { params: { id: string } }) {
  if (!kvConfigured()) return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });

  const id = ctx.params.id;
  const { searchParams } = new URL(req.url);
  const ownerEmail = norm(searchParams.get("ownerEmail")).toLowerCase();
  if (!ownerEmail) return NextResponse.json({ ok: false, error: "missing_ownerEmail" }, { status: 400 });

  try {
    const lead = await kvGetJson<Lead>(`lead:${id}`);
    if (!lead || lead.ownerEmail !== ownerEmail) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, lead });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage_not_configured" }, { status: 500 });
    }
    console.error(JSON.stringify({ tag: "lead_get_failed", message: String((e as any)?.message || e) }));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

