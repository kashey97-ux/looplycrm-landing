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

const RATE_LIMIT_WINDOW_MS = 30_000;
const lastLeadByIp = new Map<string, number>();

function norm(v: unknown) {
  if (typeof v !== "string") return "";
  return v.trim();
}

function tooLong(s: string, max: number) {
  return s.length > max;
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = (forwardedFor?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();

  if (ip !== "unknown") {
    const now = Date.now();
    const last = lastLeadByIp.get(ip) || 0;
    if (now - last < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
    }
    lastLeadByIp.set(ip, now);
  }

  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const honeypot = norm(body.website);
  if (honeypot) {
    // Pretend success to avoid tipping off bots.
    return NextResponse.json({ ok: true });
  }

  const name = norm(body.name);
  const email = norm(body.email).toLowerCase();
  const phone = norm(body.phone);
  const company = norm(body.company);
  const message = norm(body.message);

  if (name.length < 2 || tooLong(name, 120)) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!emailRe.test(email) || tooLong(email, 200)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (message.length < 3 || tooLong(message, 4000)) {
    return NextResponse.json({ ok: false, error: "Please enter a short message." }, { status: 400 });
  }
  if (tooLong(phone, 60)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (tooLong(company, 200)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid company name." }, { status: 400 });
  }

  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { ok: false, error: "Email service is not configured. Please email support@looplycrm.com." },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(apiKey);
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
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to send. Please try again or email support@looplycrm.com." },
      { status: 500 },
    );
  }
}

