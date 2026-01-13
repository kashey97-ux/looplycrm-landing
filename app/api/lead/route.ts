/**
 * Lead capture endpoint (Resend) — used by the homepage demo form.
 *
 * ## Required env vars (local + Vercel)
 * - EMAIL_PROVIDER=resend
 * - RESEND_API_KEY=...                (Resend API key)
 * - LEADS_FROM_EMAIL=Looply <...>     (must be a verified sender in Resend)
 * - LEADS_TO_EMAIL=support@looplycrm.com
 *
 * ## Local testing (dev server must be running)
 * curl -i -X POST 'http://localhost:3000/api/lead' \
 *   -H 'content-type: application/json' \
 *   --data '{"name":"Test User","email":"test@example.com","phone":"","company":"","message":"Please show me a demo","website":""}'
 *
 * ## Honeypot test (should return 200 ok but send nothing)
 * curl -i -X POST 'http://localhost:3000/api/lead' \
 *   -H 'content-type: application/json' \
 *   --data '{"name":"Bot","email":"bot@example.com","message":"hello world","website":"http://spam.example"}'
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateByIp = new Map<string, { count: number; resetAt: number }>();

function norm(v: unknown) {
  if (typeof v !== "string") return "";
  return v.trim();
}

function getRequestId(request: Request) {
  return (
    request.headers.get("x-request-id") ||
    request.headers.get("x-vercel-id") ||
    (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `req_${Date.now()}`)
  );
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = (forwardedFor?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
  return ip;
}

function rateLimit(ip: string) {
  if (ip === "unknown") return { ok: true as const };

  const now = Date.now();
  const existing = rateByIp.get(ip);
  if (!existing || now >= existing.resetAt) {
    rateByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true as const };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return { ok: false as const };
  }

  existing.count += 1;
  rateByIp.set(ip, existing);
  return { ok: true as const };
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const ip = getClientIp(request);

  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json({ ok: false, message: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: if filled, treat as success but do nothing.
  const honeypot = norm(body.website);
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = norm(body.name);
  const email = norm(body.email).toLowerCase();
  const phone = norm(body.phone);
  const company = norm(body.company);
  const message = norm(body.message);

  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!emailRe.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 5) errors.message = "Message must be at least 5 characters.";

  if (phone && phone.length > 60) errors.phone = "Phone looks too long.";
  if (company && company.length > 200) errors.company = "Company looks too long.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const provider = process.env.EMAIL_PROVIDER;
  const resendApiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  const from = process.env.LEADS_FROM_EMAIL;

  if (provider !== "resend" || !resendApiKey || !to || !from) {
    console.error(`[lead][${requestId}] misconfigured env (provider=${provider || "unset"})`);
    return NextResponse.json(
      { ok: false, message: "We couldn’t send your request right now. Please email support@looplycrm.com." },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from,
      to,
      subject: `Looply demo request — ${name}`,
      text:
        `New demo request\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || "-"}\n` +
        `Company: ${company || "-"}\n` +
        `IP: ${ip}\n\n` +
        `Message:\n${message}\n`,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[lead][${requestId}] send failed`, err);
    return NextResponse.json(
      { ok: false, message: "We couldn’t send your request right now. Please try again shortly." },
      { status: 500 },
    );
  }
}

