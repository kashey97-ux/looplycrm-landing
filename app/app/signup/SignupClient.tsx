"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setSession } from "../_lib/mvpAuth";

export default function SignupClient() {
  const router = useRouter();
  const search = useSearchParams();
  const plan = (search.get("plan") || "starter").toLowerCase();
  const planLabel = useMemo(() => {
    if (plan === "growth") return "Growth";
    if (plan === "pro") return "Pro";
    return "Starter";
  }, [plan]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (name.trim().length < 2) {
        setError("Please enter your name.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        setError("Please enter a valid email.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          plan: planLabel.toLowerCase(),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as any;
      if (!res.ok || json?.ok === false) {
        setError(json?.message || json?.error || "Signup failed.");
        return;
      }

      const user = json?.user || json?.data?.user || {};
      setSession({
        email: String(user?.email || normalizedEmail),
        name: user?.name ? String(user.name) : name.trim(),
        plan: user?.plan ? String(user.plan) : planLabel.toLowerCase(),
      });

      router.push("/app/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card section">
      <p className="pill">Start trial</p>
      <h1>Create your account</h1>
      <p className="p">Plan: {planLabel}</p>

      <form className="leadForm" onSubmit={onSubmit} style={{ marginTop: 14 }}>
        <div className="leadFormGrid">
          <div className="leadField">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </div>
          <div className="leadField">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              type="email"
              required
            />
          </div>
        </div>

        <div className="leadField" style={{ marginTop: 10 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            type="password"
            required
          />
        </div>

        <div className="btnRow" style={{ marginTop: 12 }}>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create account"}
          </button>
          <a className="button" href="/">
            Back to Home
          </a>
        </div>

        {error ? (
          <p className="small" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
            {error}
          </p>
        ) : null}

        <p className="small" style={{ marginTop: 12 }}>
          Already have an account? <a href="/app/login">Log in</a>
        </p>
      </form>
    </div>
  );
}

