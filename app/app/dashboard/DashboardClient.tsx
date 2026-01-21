"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/Button";
import { engineFetch, isPaywalled, tsFromAny, type EngineApiKeyList, type EngineBusinessSettings, type EngineLead, type EngineLeadsList } from "../_lib/engineApi";
import { getSession, getUser, getUsers, logout, type User } from "../_lib/mvpAuth";

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

function toLead(l: EngineLead) {
  return {
    id: String(l.id),
    name: String(l.name || ""),
    email: String(l.email || ""),
    status: String(l.status || "New"),
    createdAt: l.createdAt ? Number(l.createdAt) : tsFromAny(l.created_at),
  };
}

export default function DashboardClient() {
  const router = useRouter();
  const search = useSearchParams();
  const plan = search.get("plan");

  const [leads, setLeads] = useState<Array<{ id: string; name: string; email: string; status: string; createdAt: number }>>([]);
  const [leadsCursor, setLeadsCursor] = useState<string | null>("");
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<EngineBusinessSettings | null>(null);
  const [apiKeys, setApiKeys] = useState<EngineApiKeyList | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [createdKeyOnce, setCreatedKeyOnce] = useState<string | null>(null);

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
    setUser(getUser(session.email));
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r1 = await engineFetch<EngineBusinessSettings>("/v1/settings/business");
      if (cancelled) return;
      if (r1.ok) setBusiness(r1.data);

      const r2 = await engineFetch<EngineApiKeyList>("/v1/api-keys");
      if (cancelled) return;
      if (r2.ok) setApiKeys(r2.data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    setLeadError(null);
    setLoadingLeads(true);
    engineFetch<EngineLeadsList>("/v1/leads?cursor=&limit=20")
      .then((r) => {
        if (cancelled) return;
        if (r.ok === false) {
          setLeadError(r.error.message || "Failed to load leads.");
          setLeads([]);
          setLeadsCursor(null);
          return;
        }
        const items = Array.isArray(r.data?.items) ? r.data.items : [];
        setLeads(items.map(toLead));
        const next = (r.data as any)?.nextCursor ?? (r.data as any)?.next_cursor;
        setLeadsCursor(typeof next === "string" ? next : null);
      })
      .catch(() => {
        if (cancelled) return;
        setLeadError("Failed to load leads.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingLeads(false);
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  async function onLoadMore() {
    if (!email || leadsCursor === null) return;
    setLeadError(null);
    setLoadingLeads(true);
    try {
      const r = await engineFetch<EngineLeadsList>(`/v1/leads?cursor=${encodeURIComponent(leadsCursor)}&limit=20`);
      if (r.ok === false) {
        setLeadError(r.error.message || "Failed to load more leads.");
        return;
      }
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      setLeads((prev) => [...prev, ...items.map(toLead)]);
      const next = (r.data as any)?.nextCursor ?? (r.data as any)?.next_cursor;
      setLeadsCursor(typeof next === "string" ? next : null);
    } finally {
      setLoadingLeads(false);
    }
  }

  function onLogout() {
    logout();
    router.push("/");
  }

  async function onCreateApiKey() {
    setCreatedKeyOnce(null);
    setCreatingKey(true);
    try {
      const r = await engineFetch<{ apiKey?: string; id?: string; prefix?: string }>("/v1/api-keys", { method: "POST", json: {} });
      if (r.ok === false) {
        setLeadError(r.error.message || "Failed to create API key.");
        return;
      }
      const key = String((r.data as any)?.apiKey || "");
      if (key) setCreatedKeyOnce(key);
      const refreshed = await engineFetch<EngineApiKeyList>("/v1/api-keys");
      if (refreshed.ok) setApiKeys(refreshed.data);
    } finally {
      setCreatingKey(false);
    }
  }

  const paywalled = isPaywalled(business);
  const webhookUrl = (business as any)?.webhook_url || (business as any)?.webhookUrl || "";
  const apiKeyPreview =
    createdKeyOnce ||
    String((apiKeys as any)?.apiKey || "") ||
    (Array.isArray(apiKeys?.items) && apiKeys.items.length ? `${apiKeys.items[0]?.prefix || "key"}…` : "");

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Dashboard</p>
            <h1 style={{ margin: 0 }}>Welcome{userName ? `, ${userName}` : ""}</h1>
            <p className="small dashboardSubtitle">
              Signed in as {email || "-"}
              {user ? ` • Plan: ${user.plan}` : ""}
              {business?.plan_status ? ` • Engine: ${business.plan_status}` : ""}
              {business?.trial_ended ? " • Trial ended" : ""}
              {plan ? ` • (via URL: ${plan})` : ""}
            </p>
          </div>
          <div className="btnRow">
            <Button variant="primary" href="/app/leads/new">Add lead manually</Button>
            <Button href="/app/integrations/website">Website docs</Button>
            <Button href="/app/integrations/twilio">Twilio</Button>
            <Button onClick={onLogout} type="button">Logout</Button>
          </div>
        </div>
      </div>

      {paywalled ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Trial ended</p>
          <p className="h2">Upgrade to continue</p>
          <p className="p">
            Your trial has ended or your plan is not active. Actions may be blocked by Engine.
          </p>
          <div className="btnRow" style={{ marginTop: 12 }}>
            <Button variant="primary" href="mailto:support@looplycrm.com?subject=Looply%20Upgrade%20Request">Contact support</Button>
            <Button href="/#demo">Request a demo</Button>
          </div>
        </div>
      ) : null}

      <div className="card section">
        <p className="kicker">Your Webhook</p>
        <p className="h2">Send leads into Looply</p>
        <p className="p">Use your Engine webhook URL + API key. We’ve added beginner docs in “Website docs”.</p>
        <div className="section">
          <p className="kicker">Webhook URL</p>
          <div className="card" style={{ background: "rgba(0,0,0,0.25)" }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.5 }}>
              {webhookUrl || "Loading…"}
            </pre>
          </div>
        </div>
        <div className="section">
          <p className="kicker">API key</p>
          <div className="card" style={{ background: "rgba(0,0,0,0.25)" }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.5 }}>
              {apiKeyPreview || "No key yet"}
            </pre>
          </div>
          <div className="btnRow" style={{ marginTop: 12 }}>
            <Button variant="primary" type="button" onClick={onCreateApiKey} disabled={creatingKey}>
              {creatingKey ? "Creating…" : "Create API key"}
            </Button>
            <Button href="/app/settings/api-keys">Manage keys</Button>
          </div>
          {createdKeyOnce ? (
            <p className="small" style={{ marginTop: 10 }}>
              Shown once — copy it now.
            </p>
          ) : null}
        </div>
      </div>

      <div className="card section">
        <p className="kicker">Leads</p>
        {leadError ? (
          <p className="p" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
            {leadError}
          </p>
        ) : leads.length === 0 ? (
          <p className="p" style={{ marginTop: 10 }}>
            {loadingLeads ? "Loading…" : "No leads yet. Click “Add lead manually” or send a webhook."}
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
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.92)" }}>
                      <a href={`/app/leads/${encodeURIComponent(l.id)}`} style={{ textDecoration: "underline" }}>
                        {l.name}
                      </a>
                    </td>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.70)" }}>{l.email}</td>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.70)" }}>{l.status}</td>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.70)" }}>{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leadsCursor !== null ? (
              <div className="btnRow" style={{ marginTop: 12 }}>
                <Button type="button" onClick={onLoadMore} disabled={loadingLeads}>
                  {loadingLeads ? "Loading…" : "Load more"}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="section btnRow">
        <Button href="/">Back to Home</Button>
        <Button href="/terms-and-conditions">Terms</Button>
        <Button href="/privacy-policy">Privacy</Button>
        <Button href="/refund-policy">Refund Policy</Button>
      </div>
    </div>
  );
}

