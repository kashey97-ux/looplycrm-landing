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
import { Resend } from "resend";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
  createdAt?: unknown; // anti-spam: minimum submission time
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

function jsonWithRequestId(body: unknown, init: { status?: number; requestId: string }) {
  const res = NextResponse.json(body, { status: init.status });
  res.headers.set("x-request-id", init.requestId);
  return res;
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
    return jsonWithRequestId({ ok: false, error: "rate_limited" }, { status: 429, requestId });
  }

  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return jsonWithRequestId({ ok: false, message: "Invalid request." }, { status: 400, requestId });
  }

  // Honeypot: if filled, treat as success but do nothing.
  const honeypot = norm(body.website);
  if (honeypot) {
    return jsonWithRequestId({ ok: true }, { status: 200, requestId });
  }

  // Anti-spam: minimum submission time (client sends createdAt timestamp)
  const createdAtRaw = body.createdAt;
  const createdAt =
    typeof createdAtRaw === "number"
      ? createdAtRaw
      : typeof createdAtRaw === "string"
        ? Number(createdAtRaw)
        : NaN;
  if (!Number.isFinite(createdAt) || Date.now() - createdAt < 1200) {
    return jsonWithRequestId({ ok: false, error: "spam" }, { status: 400, requestId });
  }

  const name = norm(body.name);
  const email = norm(body.email).toLowerCase();
  const phone = norm(body.phone);
  const company = norm(body.company);
  let message = norm(body.message);

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
  // Sanitize and enforce max message length
  message = message.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (message.length > 4000) errors.message = "Message looks too long.";

  if (Object.keys(errors).length > 0) {
    return jsonWithRequestId({ ok: false, errors }, { status: 400, requestId });
  }

  console.log(
    JSON.stringify({
      tag: "demo_lead_received",
      requestId,
      ip,
      name,
      email,
      hasMessage: Boolean(message),
    }),
  );

  const shouldUseResend = process.env.EMAIL_PROVIDER === "resend" || Boolean(process.env.RESEND_API_KEY);

  if (shouldUseResend) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_TO_EMAIL;
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    const missingResend: string[] = [];
    if (!resendApiKey) missingResend.push("RESEND_API_KEY");
    if (!to) missingResend.push("LEAD_TO_EMAIL");
    if (!from) missingResend.push("SMTP_FROM (or SMTP_USER)");

    if (missingResend.length > 0) {
      console.error(
        JSON.stringify({
          tag: "lead_email_not_configured",
          requestId,
          provider: "resend",
          missing: missingResend,
        }),
      );
      return jsonWithRequestId({ error: "email_not_configured", missing: missingResend }, { status: 500, requestId });
    }

    try {
      const resend = new Resend(resendApiKey!);
      await resend.emails.send({
        from: from!,
        to: to!,
        subject: `Looply demo request — ${name}`,
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
        replyTo: email || undefined,
      });

      return jsonWithRequestId({ ok: true }, { status: 200, requestId });
    } catch (err: any) {
      const code = err?.statusCode || err?.code || err?.name;
      const msg = err?.message || String(err);
      console.error(
        JSON.stringify({
          tag: "lead_send_failed",
          requestId,
          provider: "resend",
          code,
          message: msg,
        }),
      );
      return jsonWithRequestId({ ok: false, error: "send_failed" }, { status: 500, requestId });
    }
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
    console.error(
      JSON.stringify({
        tag: "lead_email_not_configured",
        requestId,
        provider: "smtp",
        missing,
      }),
    );
    return jsonWithRequestId({ error: "email_not_configured", missing }, { status: 500, requestId });
  }

  const to = process.env.LEAD_TO_EMAIL!;
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT);
  const secure = String(process.env.SMTP_SECURE).toLowerCase() === "true";
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const from = process.env.SMTP_FROM || user;

  if (!Number.isFinite(port) || port <= 0) {
    console.error(
      JSON.stringify({
        tag: "lead_email_not_configured",
        requestId,
        provider: "smtp",
        missing: ["SMTP_PORT"],
      }),
    );
    return jsonWithRequestId({ error: "email_not_configured", missing: ["SMTP_PORT"] }, { status: 500, requestId });
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

    return jsonWithRequestId({ ok: true }, { status: 200, requestId });
  } catch (err: any) {
    const responseCode = err?.responseCode;
    const code = responseCode ?? err?.code ?? err?.name;
    const msg = err?.message || String(err);
    const hint =
      responseCode === 535
        ? "Likely wrong SMTP_PASS or need Zoho App Password or wrong smtp host (.eu vs .com)"
        : undefined;

    console.error(
      JSON.stringify({
        tag: "lead_send_failed",
        requestId,
        provider: "smtp",
        code,
        message: msg,
        hint,
        host: process.env.SMTP_HOST,
        port,
        secure,
      }),
    );

    // Keep user-facing response generic & safe.
    return jsonWithRequestId({ ok: false, error: "send_failed" }, { status: 500, requestId });
  }
}

