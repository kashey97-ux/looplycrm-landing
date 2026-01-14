"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTestLead, getLeads, getSession, getUsers, logout, type Lead } from "../_lib/mvpAuth";

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function DashboardClient() {
  const router = useRouter();
  const search = useSearchParams();
  const plan = search.get("plan");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  const userName = useMemo(() => {
    if (!email) return null;
    const users = getUsers();
    return users[email]?.name || null;
  }, [email]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/app/login");
      return;
    }
    setEmail(session.email);
    setLeads(getLeads());
  }, [router]);

  function onCreateTestLead() {
    createTestLead();
    setLeads(getLeads());
  }

  function onLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="section">
      <div className="card">
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <p className="pill">Dashboard</p>
            <h1 style={{ margin: "10px 0 6px" }}>Welcome{userName ? `, ${userName}` : ""}</h1>
            <p className="small" style={{ margin: 0 }}>
              Signed in as {email || "-"}
              {plan ? ` • Trial plan: ${plan}` : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="button primary" onClick={onCreateTestLead}>
              Create test lead
            </button>
            <button className="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="card section">
        <p className="kicker">Leads</p>
        {leads.length === 0 ? (
          <p className="p" style={{ marginTop: 10 }}>
            No leads yet. Click “Create test lead”.
          </p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "rgba(255,255,255,0.75)" }}>
                  <th style={{ padding: "8px 6px" }}>Name</th>
                  <th style={{ padding: "8px 6px" }}>Email</th>
                  <th style={{ padding: "8px 6px" }}>Status</th>
                  <th style={{ padding: "8px 6px" }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.92)" }}>{l.name}</td>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.70)" }}>{l.email}</td>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.70)" }}>{l.status}</td>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.70)" }}>{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a className="button" href="/">
          Back to Home
        </a>
        <a className="button" href="/terms-and-conditions">
          Terms
        </a>
        <a className="button" href="/privacy-policy">
          Privacy
        </a>
        <a className="button" href="/refund-policy">
          Refund Policy
        </a>
      </div>
    </div>
  );
}

