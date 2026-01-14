"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUsers, setSession, setUsers, sha256Hex } from "../_lib/mvpAuth";

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

      const users = getUsers();
      if (users[normalizedEmail]) {
        setError("Account already exists. Please log in.");
        return;
      }

      const passwordHash = await sha256Hex(password);
      users[normalizedEmail] = {
        email: normalizedEmail,
        name: name.trim(),
        passwordHash,
        createdAt: Date.now(),
      };
      setUsers(users);
      setSession(normalizedEmail);
      router.push(`/app/dashboard?plan=${encodeURIComponent(planLabel.toLowerCase())}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card section">
      <p className="pill">Free Trial</p>
      <h1>Create your account</h1>
      <p className="p">Plan: {planLabel} (trial)</p>

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

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
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

