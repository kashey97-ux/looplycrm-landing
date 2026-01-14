/**
 * Lead capture endpoint (Zoho SMTP via Nodemailer) — used by the homepage demo form.
 *
 * ## Required env vars (local + Vercel)
 * - LEAD_TO_EMAIL=support@looplycrm.com
 * - SMTP_HOST=smtp.zoho.com
 * - SMTP_PORT=465
 * - SMTP_SECURE=true                  ("true" / "false")
 * - SMTP_USER=...                     (Zoho mailbox user)
 * - SMTP_PASS=...                     (Zoho mailbox password / app password)
 * - SMTP_FROM=Looply <support@looplycrm.com>
 *
 * ## Local testing (dev server must be running)
 * curl -i -X POST 'http://localhost:3000/api/lead' \
 *   -H 'content-type: application/json' \
 *   --data '{"name":"Test User","email":"test@example.com","phone":"","company":"","message":"Hi!","website":""}'
 *
 * ## Honeypot test (should return 200 ok but send nothing)
 * curl -i -X POST 'http://localhost:3000/api/lead' \
 *   -H 'content-type: application/json' \
 *   --data '{"name":"Bot","email":"bot@example.com","website":"http://spam.example"}'
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lightweight disposable email domain denylist (no external services).
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "20minutemail.com",
  "anonaddy.com",
  "dispostable.com",
  "dropmail.me",
  "emailondeck.com",
  "fakeinbox.com",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "harakirimail.com",
  "inboxbear.com",
  "inboxkitten.com",
  "incognitomail.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "minuteinbox.com",
  "mohmal.com",
  "mytemp.email",
  "sharklasers.com",
  "spamgourmet.com",
  "tempmail.com",
  "tempmail.net",
  "tempmailo.com",
  "temp-mail.org",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
]);

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
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
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
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

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!emailRe.test(email)) errors.email = "Please enter a valid email address.";
  if (emailRe.test(email)) {
    const domain = email.split("@")[1] || "";
    if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      errors.email = "Please use a non-disposable email address.";
    }
  }
  if (phone && phone.length > 60) errors.phone = "Phone looks too long.";
  if (company && company.length > 200) errors.company = "Company looks too long.";
  if (message && message.length > 4000) errors.message = "Message looks too long.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const requiredEnvs = [
    "LEAD_TO_EMAIL",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
  ] as const;

  const missing = requiredEnvs.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[lead][${requestId}] email_not_configured missing=${missing.join(",")}`);
    return NextResponse.json({ error: "email_not_configured", missing }, { status: 500 });
  }

  const to = process.env.LEAD_TO_EMAIL!;
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT);
  const secure = String(process.env.SMTP_SECURE).toLowerCase() === "true";
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const from = process.env.SMTP_FROM!;

  if (!Number.isFinite(port) || port <= 0) {
    console.error(`[lead][${requestId}] email_not_configured invalid SMTP_PORT`);
    return NextResponse.json({ error: "email_not_configured", missing: ["SMTP_PORT"] }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      subject: `Looply demo request — ${name}`,
      replyTo: email || undefined,
      text: [
        "New demo request",
        "",
        `Name: ${name || "-"}`,
        `Email: ${email || "-"}`,
        `Phone: ${phone || "-"}`,
        `Company: ${company || "-"}`,
        `IP: ${ip}`,
        "",
        "Message:",
        message || "-",
        "",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[lead][${requestId}] smtp_send_failed`, err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}

