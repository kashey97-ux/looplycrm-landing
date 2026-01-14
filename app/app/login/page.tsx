"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUsers, setSession, sha256Hex } from "../_lib/mvpAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s) router.replace("/app/dashboard");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const users = getUsers();
      const user = users[normalizedEmail];
      if (!user) {
        setError("Invalid email or password.");
        return;
      }
      const passwordHash = await sha256Hex(password);
      if (passwordHash !== user.passwordHash) {
        setError("Invalid email or password.");
        return;
      }
      setSession(normalizedEmail);
      router.push("/app/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card section">
      <p className="pill">Account</p>
      <h1>Log in</h1>

      <form className="leadForm" onSubmit={onSubmit} style={{ marginTop: 14 }}>
        <div className="leadFormGrid">
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
          <div className="leadField">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              type="password"
              required
            />
          </div>
        </div>

        <div className="btnRow" style={{ marginTop: 12 }}>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
          <a className="button" href="/app/signup">
            Create account
          </a>
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
          Forgot your password? <a href="/app/forgot">Reset it</a>
        </p>
      </form>
    </div>
  );
}

