"use client";

import { useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function DemoForm({
  intent,
}: {
  intent?: "demo" | "waitlist";
}) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const resolvedIntent = intent || "demo";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setRequestId(null);
    setState("submitting");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const email = String(fd.get("email") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const note = String(fd.get("message") ?? "").trim();

    const payload = {
      name: "", // optional
      email,
      phone,
      company,
      message:
        resolvedIntent === "waitlist"
          ? `Waitlist request.${note ? `\n\nNote:\n${note}` : ""}`
          : `Demo request.${note ? `\n\nNote:\n${note}` : ""}`,
      website: String(fd.get("website") ?? ""), // honeypot
      createdAt: Number(fd.get("createdAt") ?? Date.now()),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rid = res.headers.get("x-request-id");
      if (rid) setRequestId(rid);

      const json = (await res.json()) as
        | { ok?: boolean }
        | { ok?: boolean; error?: string; missing?: string[] }
        | { ok?: boolean; message?: string }
        | { ok?: boolean; errors?: Record<string, string> };

      if (!res.ok || !json.ok) {
        const errors = "errors" in json ? json.errors : undefined;
        const firstError = errors ? Object.values(errors)[0] : undefined;

        if ("error" in json && json.error === "email_not_configured") {
          setError("Email delivery is not configured. Please email support@looplycrm.com.");
          setState("error");
          return;
        }
        if ("error" in json && json.error === "rate_limited") {
          setError("Too many requests. Please try again later.");
          setState("error");
          return;
        }
        if ("error" in json && json.error === "spam") {
          setError("Looks like spam. Please try again.");
          setState("error");
          return;
        }
        if ("error" in json && json.error === "send_failed") {
          setError("Send failed. If this repeats, email support@looplycrm.com.");
          setState("error");
          return;
        }

        setError(
          firstError ||
            ("message" in json ? json.message : undefined) ||
            ("error" in json ? json.error : undefined) ||
            "Couldn’t send your request. Please try again or email support@looplycrm.com.",
        );
        setState("error");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setError("Couldn’t send your request. Please try again or email support@looplycrm.com.");
      setState("error");
    }
  }

  return (
    <form className="leadForm" onSubmit={onSubmit}>
      <input type="hidden" name="createdAt" value={Date.now()} />

      <div className="leadFormGrid">
        <div className="leadField">
          <label htmlFor={`email_${resolvedIntent}`}>Work email</label>
          <input
            id={`email_${resolvedIntent}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            disabled={state === "submitting"}
          />
        </div>

        <div className="leadField">
          <label htmlFor={`company_${resolvedIntent}`}>Company</label>
          <input
            id={`company_${resolvedIntent}`}
            name="company"
            required
            autoComplete="organization"
            placeholder="Your company"
            disabled={state === "submitting"}
          />
        </div>
      </div>

      <div className="leadField" style={{ marginTop: 10 }}>
        <label htmlFor={`phone_${resolvedIntent}`}>Phone (optional)</label>
        <input
          id={`phone_${resolvedIntent}`}
          name="phone"
          autoComplete="tel"
          placeholder="+1 555 000 0000"
          disabled={state === "submitting"}
        />
      </div>

      <div className="leadField" style={{ marginTop: 10 }}>
        <label htmlFor={`message_${resolvedIntent}`}>Note (optional)</label>
        <textarea
          id={`message_${resolvedIntent}`}
          name="message"
          rows={4}
          placeholder="Lead volume, channels (SMS/email), and what “outcome” looks like for your team."
          disabled={state === "submitting"}
        />
      </div>

      <div className="leadHoneypot" aria-hidden="true">
        <label htmlFor={`website_${resolvedIntent}`}>Website</label>
        <input id={`website_${resolvedIntent}`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="btnRow" style={{ marginTop: 12 }}>
        <button className="button primary" type="submit" disabled={state === "submitting"}>
          {state === "submitting"
            ? "Sending…"
            : resolvedIntent === "waitlist"
              ? "Join waitlist"
              : "Get a demo"}
        </button>
        <p className="small" style={{ margin: 0 }}>
          We’ll reach out by email.
        </p>
      </div>

      {state === "success" ? (
        <p className="small" style={{ marginTop: 10, color: "rgba(150,255,200,0.92)" }}>
          Thanks — we’ll reach out shortly.
        </p>
      ) : null}

      {state === "error" ? (
        <>
          <p className="small" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
            {error}
          </p>
          {requestId ? (
            <p className="small" style={{ marginTop: 6 }}>
              Request ID:{" "}
              <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                {requestId}
              </span>
            </p>
          ) : null}
        </>
      ) : null}
    </form>
  );
}

