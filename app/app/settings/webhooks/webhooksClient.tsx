"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { engineFetch, type EngineApiKeyList, type EngineBusinessSettings } from "../../_lib/engineApi";
import { getSession } from "../../_lib/mvpAuth";

export default function WebhooksClient() {
  const session = useMemo(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  }, []);
  const ownerEmail = session?.email || null;

  const [business, setBusiness] = useState<EngineBusinessSettings | null>(null);
  const [keys, setKeys] = useState<EngineApiKeyList | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [b, k] = await Promise.all([
        engineFetch<EngineBusinessSettings>("/v1/settings/business"),
        engineFetch<EngineApiKeyList>("/v1/api-keys"),
      ]);
      if (cancelled) return;
      if (b.ok) setBusiness(b.data);
      if (k.ok) setKeys(k.data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const webhookUrl = (business as any)?.webhook_url || (business as any)?.webhookUrl || "";
  const apiKey = String((keys as any)?.apiKey || "");

  const curl = ownerEmail
    ? `curl -i -X POST '${webhookUrl}' \\
  -H 'content-type: application/json' \\
  -H 'authorization: Bearer ${apiKey ? apiKey : "YOUR_API_KEY"}' \\
  --data '{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"phone\":\"+1 555 000\",\"company\":\"Acme\",\"message\":\"Interested\",\"source\":\"website\"}'`
    : `Log in to see the webhook URL.`;

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Settings</p>
            <h1 style={{ margin: 0 }}>Webhooks</h1>
            <p className="small dashboardSubtitle">Send leads into Looply via a secured webhook endpoint.</p>
          </div>
          <div className="btnRow">
            <Button href="/app/settings/api-keys">API keys</Button>
            <Button href="/app/dashboard">Back</Button>
          </div>
        </div>
      </div>

      {!ownerEmail ? (
        <div className="card section">
          <p className="p">Please log in to view webhook details.</p>
          <div className="btnRow" style={{ marginTop: 12 }}>
            <Button variant="primary" href="/app/login">Log in</Button>
          </div>
        </div>
      ) : (
        <div className="card section">
          <p className="kicker">Webhook URL</p>
          <p className="p" style={{ marginTop: 10 }}>
            <strong style={{ color: "rgba(255,255,255,0.92)" }}>{webhookUrl || "Loading…"}</strong>
          </p>

          <div className="section">
            <p className="kicker">Auth</p>
            <p className="p" style={{ marginTop: 10 }}>
              Include an auth header:
              <br />
              <strong style={{ color: "rgba(255,255,255,0.92)" }}>Authorization</strong>: Bearer {"<API_KEY>"}
              <br />
              Or (if your Engine supports it): <strong style={{ color: "rgba(255,255,255,0.92)" }}>x-api-key</strong>
            </p>
          </div>

          <div className="section">
            <p className="kicker">Example</p>
            <div className="card" style={{ background: "rgba(0,0,0,0.25)" }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.5 }}>
                {curl}
              </pre>
            </div>
          </div>

          <div className="section">
            <p className="kicker">Payload</p>
            <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
              <li>
                <strong style={{ color: "rgba(255,255,255,0.92)" }}>name</strong> (required)
              </li>
              <li>
                <strong style={{ color: "rgba(255,255,255,0.92)" }}>email</strong> (required)
              </li>
              <li>phone (optional)</li>
              <li>company (optional)</li>
              <li>message (optional)</li>
              <li>source (optional)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

