"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, setUsers, sha256Hex } from "../_lib/mvpAuth";

export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const users = getUsers();
      const user = users[normalizedEmail];
      if (!user) {
        setError("No account found for that email.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      const passwordHash = await sha256Hex(newPassword);
      users[normalizedEmail] = { ...user, passwordHash };
      setUsers(users);
      setStatus("done");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card section">
      <p className="pill">Account</p>
      <h1>Reset password</h1>
      <p className="p">MVP reset: set a new password for your local demo account.</p>

      {status === "done" ? (
        <div className="section">
          <p className="small" style={{ color: "rgba(150,255,200,0.92)" }}>
            Password updated. You can now log in.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <a className="button primary" href="/app/login">
              Go to login
            </a>
            <a className="button" href="/">
              Back to Home
            </a>
          </div>
        </div>
      ) : (
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
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                type="password"
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <button className="button primary" type="submit" disabled={submitting}>
              {submitting ? "Updating…" : "Update password"}
            </button>
            <a className="button" href="/app/login">
              Back to login
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
        </form>
      )}
    </div>
  );
}

