"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/Button";
import { engineFetch, isPaywalled, tsFromAny, type EngineApiKeyList, type EngineBusinessSettings, type EngineLead, type EngineLeadsList } from "../_lib/engineApi";
import { getSession, logout } from "../_lib/mvpAuth";

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

function normalizeStatus(status?: string) {
  const raw = String(status || "").toUpperCase();
  if (!raw) return "NEW";
  if (raw === "NEW" || raw === "IN_PROGRESS" || raw === "STOPPED") return raw;
  if (raw === "ACTIVE" || raw === "OPEN" || raw === "PENDING") return "IN_PROGRESS";
  if (raw === "CANCELLED" || raw === "COMPLETED" || raw === "CLOSED") return "STOPPED";
  return raw;
}

function toLead(l: EngineLead) {
  return {
    id: String(l.id),
    name: String(l.name || ""),
    email: String(l.email || ""),
    status: normalizeStatus(l.status),
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
  const [keyError, setKeyError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [business, setBusiness] = useState<EngineBusinessSettings | null>(null);
  const [apiKeys, setApiKeys] = useState<EngineApiKeyList | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [createdKeyOnce, setCreatedKeyOnce] = useState<string | null>(null);
  const [engineConfigured, setEngineConfigured] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/app/login");
      return;
    }
    setEmail(session.email);
    setUserName(session.name || null);
    setUserPlan(session.plan || null);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r1 = await engineFetch<EngineBusinessSettings>("/v1/settings/business");
      if (cancelled) return;
      if (r1.ok) {
        setBusiness(r1.data);
        setEngineConfigured(true);
      } else if (r1.ok === false && r1.error.code === "engine_not_configured") {
        setEngineConfigured(false);
      }

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
    setKeyError(null);
    setCreatingKey(true);
    try {
      if (!email) {
        setKeyError("Please log in again to create an API key.");
        return;
      }
      const r = await engineFetch<{ apiKey?: string }>("/v1/api-keys", { method: "POST", json: {} });
      if (r.ok === false) {
        setKeyError(r.error.message || "Failed to create API key.");
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
  const billingStatus = String(business?.plan_status || "");
  const showBillingBanner = billingStatus === "past_due" || billingStatus === "inactive";
  const webhookUrl = (business as any)?.webhook_url || (business as any)?.webhookUrl || "";
  const apiKeyPreview =
    createdKeyOnce ||
    String((apiKeys as any)?.apiKey || "") ||
    (Array.isArray(apiKeys?.items) && apiKeys.items.length ? `${apiKeys.items[0]?.prefix || "key"}…` : "");
  const hasApiKey = Boolean(createdKeyOnce || (apiKeys as any)?.apiKey || (Array.isArray(apiKeys?.items) && apiKeys.items.length));
  const hasWebhook = Boolean(webhookUrl);
  const hasTestLead = leads.length > 0;
  const hasOutboundChannel = Boolean(
    (business as any)?.features?.twilio_enabled ||
      (business as any)?.features?.twilio ||
      (business as any)?.features?.email_enabled ||
      (business as any)?.features?.looply_email ||
      (business as any)?.features?.email,
  );
  const hasSalesReminders = (business as any)?.features?.sales_reminders_ui ?? true;

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Dashboard</p>
            <h1 style={{ margin: 0 }}>Welcome{userName ? `, ${userName}` : ""}</h1>
            <p className="small dashboardSubtitle">
              Signed in as {email || "-"}
              {userPlan ? ` • Plan: ${userPlan}` : ""}
              {business?.plan_status ? ` • Engine: ${business.plan_status}` : ""}
              {business?.trial_ended ? " • Trial ended" : ""}
              {plan ? ` • (via URL: ${plan})` : ""}
            </p>
          </div>
          <div className="btnRow">
            <Button variant="primary" href="/app/leads/new">Add lead manually</Button>
            <Button
              href="/app/integrations/website"
              className={!engineConfigured ? "isDisabled" : undefined}
              aria-disabled={!engineConfigured}
              title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
              onClick={!engineConfigured ? (e) => e.preventDefault() : undefined}
            >
              Website docs
            </Button>
            <Button
              href="/app/integrations/twilio"
              className={!engineConfigured ? "isDisabled" : undefined}
              aria-disabled={!engineConfigured}
              title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
              onClick={!engineConfigured ? (e) => e.preventDefault() : undefined}
            >
              Twilio
            </Button>
            <Button onClick={onLogout} type="button">Logout</Button>
          </div>
        </div>
      </div>

      {!engineConfigured ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Engine is not connected</p>
          <p className="p" style={{ marginTop: 10 }}>
            Engine is not connected. Set{" "}
            <strong style={{ color: "rgba(255,255,255,0.92)" }}>NEXT_PUBLIC_ENGINE_API_URL</strong> in Vercel env and redeploy.
          </p>
          <div className="btnRow" style={{ marginTop: 12 }}>
            <Button href="/app/integrations/website">Website docs</Button>
            <Button href="/app/settings/api-keys">API keys</Button>
          </div>
        </div>
      ) : null}

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

      {showBillingBanner ? (
        <div className="card section" style={{ borderColor: "rgba(255,200,120,0.5)" }}>
          <p className="kicker">Billing status</p>
          <p className="h2">Subscription {billingStatus.replace(/_/g, " ")}</p>
          <p className="p">Some features may be limited until billing is resolved.</p>
          <div className="btnRow" style={{ marginTop: 12 }}>
            <Button href="mailto:support@looplycrm.com?subject=Looply%20Billing%20Help">Contact support</Button>
          </div>
        </div>
      ) : null}

      <div className="card section">
        <p className="kicker">Setup checklist</p>
        <p className="h2">Finish onboarding to start getting first contact wins</p>
        <div className="section" style={{ display: "grid", gap: 10 }}>
          <div className="checklistRow">
            <div>
              <p className="kicker">Step 1 • API key</p>
              <p className="p">Create an API key for your website or integrations.</p>
            </div>
            <div className="checklistStatus">{hasApiKey ? "Done" : "Not done"}</div>
            <div className="checklistActions">
              <Button
                variant="primary"
                type="button"
                onClick={onCreateApiKey}
                disabled={creatingKey || hasApiKey || !engineConfigured}
                title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
              >
                {creatingKey ? "Creating…" : "Create API key"}
              </Button>
            </div>
          </div>
          <div className="checklistRow">
            <div>
              <p className="kicker">Step 2 • Webhook URL</p>
              <p className="p">Copy your Engine webhook and add it to your form.</p>
            </div>
            <div className="checklistStatus">{hasWebhook ? "Done" : "Not done"}</div>
            <div className="checklistActions">
              <Button
                href="/app/settings/webhooks"
                className={!engineConfigured ? "isDisabled" : undefined}
                aria-disabled={!engineConfigured}
                title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
                onClick={!engineConfigured ? (e) => e.preventDefault() : undefined}
              >
                View webhook
              </Button>
            </div>
          </div>
          <div className="checklistRow">
            <div>
              <p className="kicker">Step 3 • Send test lead</p>
              <p className="p">Post a test lead to confirm it reaches Looply.</p>
            </div>
            <div className="checklistStatus">{hasTestLead ? "Done" : "Not done"}</div>
            <div className="checklistActions">
              <Button
                href="/app/integrations/website"
                className={!engineConfigured ? "isDisabled" : undefined}
                aria-disabled={!engineConfigured}
                title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
                onClick={!engineConfigured ? (e) => e.preventDefault() : undefined}
              >
                Run test
              </Button>
            </div>
          </div>
          <div className="checklistRow">
            <div>
              <p className="kicker">Step 4 • Outbound channel</p>
              <p className="p">Enable at least one channel (Email or Twilio).</p>
            </div>
            <div className="checklistStatus">{hasOutboundChannel ? "Done" : "Not done"}</div>
            <div className="checklistActions">
              <Button
                href="/app/integrations/twilio"
                className={!engineConfigured ? "isDisabled" : undefined}
                aria-disabled={!engineConfigured}
                title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
                onClick={!engineConfigured ? (e) => e.preventDefault() : undefined}
              >
                Configure channel
              </Button>
            </div>
          </div>
          <div className="checklistRow">
            <div>
              <p className="kicker">Step 5 • Sales reminders</p>
              <p className="p">Default reminders are UI-based; email/Slack can be enabled later.</p>
            </div>
            <div className="checklistStatus">{hasSalesReminders ? "Done" : "Not done"}</div>
            <div className="checklistActions">
              <Button href="/app/dashboard">Review</Button>
            </div>
          </div>
        </div>
      </div>

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
            <Button
              variant="primary"
              type="button"
              onClick={onCreateApiKey}
              disabled={creatingKey || !engineConfigured}
              title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
            >
              {creatingKey ? "Creating…" : "Create API key"}
            </Button>
            <Button
              href="/app/settings/api-keys"
              className={!engineConfigured ? "isDisabled" : undefined}
              aria-disabled={!engineConfigured}
              title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
              onClick={!engineConfigured ? (e) => e.preventDefault() : undefined}
            >
              Manage keys
            </Button>
          </div>
          {keyError ? (
            <p className="small" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
              {keyError}
            </p>
          ) : null}
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
          <div className="tableWrap" style={{ marginTop: 10 }}>
            <table className="dataTable">
              <thead>
                <tr style={{ textAlign: "left", color: "rgba(255,255,255,0.75)" }}>
                  <th style={{ padding: "8px 6px" }}>Name</th>
                  <th style={{ padding: "8px 6px" }}>Email</th>
                  <th style={{ padding: "8px 6px" }}>Status</th>
                  <th style={{ padding: "8px 6px" }}>Created</th>
                  <th className="actionsCol actionsSticky" style={{ padding: "8px 6px" }}>Actions</th>
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
                    <td className="actionsCol actionsSticky" style={{ padding: "10px 6px" }}>
                      <div className="tableActionsRow">
                        <Button href={`/app/leads/${encodeURIComponent(l.id)}`}>Open</Button>
                        <Button href={`/app/leads/${encodeURIComponent(l.id)}`}>Outcome</Button>
                      </div>
                      <details className="tableActionsMenu">
                        <summary className="button">...</summary>
                        <div className="tableActionsMenuBody">
                          <Button href={`/app/leads/${encodeURIComponent(l.id)}`}>Open</Button>
                          <Button href={`/app/leads/${encodeURIComponent(l.id)}`}>Outcome</Button>
                        </div>
                      </details>
                    </td>
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

