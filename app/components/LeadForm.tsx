"use client";

import { useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function LeadForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""), // honeypot
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as
        | { ok?: boolean }
        | { ok?: boolean; error?: string; missing?: string[] }
        | { ok?: boolean; message?: string }
        | { ok?: boolean; errors?: Record<string, string> };
      if (!res.ok || !json.ok) {
        const errors = "errors" in json ? json.errors : undefined;
        const firstError = errors ? Object.values(errors)[0] : undefined;

        if ("error" in json && json.error === "email_not_configured") {
          const missing = "missing" in json && Array.isArray(json.missing) ? json.missing : [];
          const suffix = missing.length ? ` Missing env: ${missing.join(", ")}` : "";
          setError(`Email is not configured on the server.${suffix}`);
          setState("error");
          return;
        }
        if ("error" in json && json.error === "rate_limited") {
          setError("Too many requests. Please try again later.");
          setState("error");
          return;
        }
        const msg =
          firstError ||
          ("message" in json ? json.message : undefined) ||
          ("error" in json ? json.error : undefined) ||
          "Couldn’t send your request. Please try again or email support@looplycrm.com.";
        setError(msg);
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
      <div className="leadFormGrid">
        <div className="leadField">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>

        <div className="leadField">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </div>

        <div className="leadField">
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" autoComplete="tel" placeholder="+1 555 000 0000" />
        </div>

        <div className="leadField">
          <label htmlFor="company">Company (optional)</label>
          <input id="company" name="company" autoComplete="organization" placeholder="Company name" />
        </div>
      </div>

      <div className="leadField" style={{ marginTop: 10 }}>
        <label htmlFor="message">Message (optional)</label>
        <textarea id="message" name="message" rows={5} placeholder="Tell us what you’re looking for…" />
      </div>

      {/* Honeypot: keep off-screen so screen readers don’t trip over it */}
      <div className="leadHoneypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
        <button className="button primary" type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending…" : "Request a demo"}
        </button>
        <p className="small" style={{ margin: 0 }}>
          We’ll reply to your email within 1 business day.
        </p>
      </div>

      {state === "success" ? (
        <p className="small" style={{ marginTop: 10, color: "rgba(150,255,200,0.92)" }}>
          Thanks! We&apos;ll reply shortly.
        </p>
      ) : null}

      {state === "error" ? (
        <p className="small" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
          {error}
        </p>
      ) : null}
    </form>
  );
}

