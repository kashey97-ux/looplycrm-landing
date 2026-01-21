"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { engineFetch, tsFromAny, type EngineApiKeyList } from "../../_lib/engineApi";
import { getSession } from "../../_lib/mvpAuth";

type ApiKeyListItem = { id: string; prefix: string; createdAt: number };

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function ApiKeysClient() {
  const session = useMemo(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  }, []);
  const ownerEmail = session?.email || null;

  const [items, setItems] = useState<ApiKeyListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdKey, setCreatedKey] = useState<{ id: string; apiKey: string; prefix: string } | null>(null);

  useEffect(() => {
    if (!ownerEmail) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    engineFetch<EngineApiKeyList>("/v1/api-keys")
      .then((r) => {
        if (cancelled) return;
        if (r.ok === false) {
          setError(r.error.message || "Failed to load API keys.");
          setItems([]);
          return;
        }
        const list = Array.isArray(r.data?.items) ? r.data.items : [];
        setItems(
          list.map((k: any) => ({
            id: String(k.id),
            prefix: String(k.prefix || ""),
            createdAt: typeof k.createdAt === "number" ? k.createdAt : tsFromAny(k.created_at),
          })),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load API keys.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ownerEmail]);

  async function onCreate() {
    if (!ownerEmail) return;
    setError(null);
    setCreatedKey(null);
    setLoading(true);
    try {
      const r = await engineFetch<{ id?: string; apiKey?: string; prefix?: string }>("/v1/api-keys", { method: "POST", json: {} });
      if (r.ok === false) {
        setError(r.error.message || "Failed to create API key.");
        return;
      }
      setCreatedKey({ id: String((r.data as any)?.id || ""), apiKey: String((r.data as any)?.apiKey || ""), prefix: String((r.data as any)?.prefix || "") });
      const next = await engineFetch<EngineApiKeyList>("/v1/api-keys");
      if (next.ok) {
        const list = Array.isArray(next.data?.items) ? next.data.items : [];
        setItems(
          list.map((k: any) => ({
            id: String(k.id),
            prefix: String(k.prefix || ""),
            createdAt: typeof k.createdAt === "number" ? k.createdAt : tsFromAny(k.created_at),
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function onRevoke(id: string) {
    if (!ownerEmail) return;
    setError(null);
    setLoading(true);
    try {
      const r = await engineFetch("/v1/api-keys/revoke", { method: "POST", json: { id } });
      if (r.ok === false) {
        setError(r.error.message || "Failed to revoke API key.");
        return;
      }
      const next = await engineFetch<EngineApiKeyList>("/v1/api-keys");
      if (next.ok) {
        const list = Array.isArray(next.data?.items) ? next.data.items : [];
        setItems(
          list.map((k: any) => ({
            id: String(k.id),
            prefix: String(k.prefix || ""),
            createdAt: typeof k.createdAt === "number" ? k.createdAt : tsFromAny(k.created_at),
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (!ownerEmail) {
    return (
      <div className="card section">
        <p className="p">Please log in.</p>
        <div className="btnRow" style={{ marginTop: 12 }}>
          <Button variant="primary" href="/app/login">Log in</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Settings</p>
            <h1 style={{ margin: 0 }}>API keys</h1>
            <p className="small dashboardSubtitle">Use an API key to send leads into Looply via webhook.</p>
          </div>
          <div className="btnRow">
            <Button href="/app/integrations/website">Website docs</Button>
            <Button href="/app/dashboard">Back</Button>
          </div>
        </div>
      </div>

      {createdKey ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">New key (shown once)</p>
          <p className="p" style={{ marginTop: 10 }}>
            Save this now. For webhook calls you will need:
            <br />
            <strong style={{ color: "rgba(255,255,255,0.92)" }}>x-api-key-id</strong>: {createdKey.id}
            <br />
            <strong style={{ color: "rgba(255,255,255,0.92)" }}>x-api-key</strong>: {createdKey.apiKey}
          </p>
        </div>
      ) : null}

      <div className="card section">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="kicker">Keys</p>
            <p className="small dashboardSubtitle">Owner: {ownerEmail}</p>
          </div>
          <div className="btnRow">
            <Button variant="primary" type="button" onClick={onCreate} disabled={loading}>
              {loading ? "Working…" : "Create key"}
            </Button>
          </div>
        </div>

        {error ? (
          <p className="p" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
            {error}
          </p>
        ) : null}

        {items.length === 0 ? (
          <p className="p" style={{ marginTop: 10 }}>
            {loading ? "Loading…" : "No API keys yet."}
          </p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "rgba(255,255,255,0.75)" }}>
                  <th style={{ padding: "8px 6px" }}>Prefix</th>
                  <th style={{ padding: "8px 6px" }}>Created</th>
                  <th style={{ padding: "8px 6px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((k) => (
                  <tr key={k.id} style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.92)" }}>{k.prefix}…</td>
                    <td style={{ padding: "10px 6px", color: "rgba(255,255,255,0.70)" }}>{formatDate(k.createdAt)}</td>
                    <td style={{ padding: "10px 6px" }}>
                      <div className="btnRow">
                        <Button type="button" onClick={() => onRevoke(k.id)} disabled={loading}>
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

