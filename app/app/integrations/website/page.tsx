"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { engineFetch, isPaywalled, type EngineApiKeyList, type EngineBusinessSettings } from "../../_lib/engineApi";
import { getSession } from "../../_lib/mvpAuth";

export default function WebsiteIntegrationsPage() {
  const router = useRouter();
  const session = useMemo(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  }, []);
  const ownerEmail = session?.email || null;

  const [business, setBusiness] = useState<EngineBusinessSettings | null>(null);
  const [apiKeys, setApiKeys] = useState<EngineApiKeyList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ownerEmail) {
      router.replace("/app/login");
    }
  }, [ownerEmail, router]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const [b, k] = await Promise.all([
        engineFetch<EngineBusinessSettings>("/v1/settings/business"),
        engineFetch<EngineApiKeyList>("/v1/api-keys"),
      ]);
      if (cancelled) return;
      if (b.ok) setBusiness(b.data);
      if (k.ok) setApiKeys(k.data);
      if (b.ok === false && k.ok === false) {
        setError(b.error.message || k.error.message || "Failed to load integration data.");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const paywalled = isPaywalled(business);
  const webhookUrl = (business as any)?.webhook_url || (business as any)?.webhookUrl || "https://engine.looplycrm.com/v1/leads/webhook";

  const exampleKeyId =
    (Array.isArray(apiKeys?.items) && apiKeys?.items?.[0]?.id) || "YOUR_API_KEY_ID";
  const exampleKeyPrefix =
    (Array.isArray(apiKeys?.items) && apiKeys?.items?.[0]?.prefix) || "your_api_key";

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Integrations</p>
            <h1 style={{ margin: 0 }}>Connect your website form</h1>
            <p className="small dashboardSubtitle">
              Beginner-friendly guide to send your website form leads into Looply.
            </p>
          </div>
          <div className="btnRow">
            <Button href="/app/dashboard">Back to dashboard</Button>
          </div>
        </div>
      </div>

      {!process.env.NEXT_PUBLIC_ENGINE_API_URL ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Engine is not configured</p>
          <p className="p" style={{ marginTop: 10 }}>
            Set <strong style={{ color: "rgba(255,255,255,0.92)" }}>NEXT_PUBLIC_ENGINE_API_URL</strong> to enable live examples.
          </p>
        </div>
      ) : null}

      {paywalled ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Trial ended</p>
          <p className="h2">Some actions may be blocked</p>
          <p className="p">
            Looply Engine decides which calls are allowed. You can still follow the steps below to wire your form.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="card section">
          <p className="p" style={{ color: "rgba(255,150,150,0.92)" }}>{error}</p>
        </div>
      ) : null}

      <div className="card section">
        <p className="kicker">Step 1</p>
        <p className="h2">Copy your webhook URL</p>
        <p className="p">
          This is the URL your website should send JSON to when someone submits the form.
        </p>
        <div className="card" style={{ background: "rgba(0,0,0,0.25)", marginTop: 10 }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.5 }}>
            {loading ? "Loading…" : webhookUrl}
          </pre>
        </div>
      </div>

      <div className="card section">
        <p className="kicker">Step 2</p>
        <p className="h2">Send a test lead via curl</p>
        <p className="p">
          Run this command in your terminal. Replace the API key placeholders with a real key from the{" "}
          <a href="/app/settings/api-keys" style={{ textDecoration: "underline" }}>API keys</a> page.
        </p>
        <div className="card" style={{ background: "rgba(0,0,0,0.25)", marginTop: 10 }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.5 }}>
{`curl -X POST '${webhookUrl}' \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key-id: ${exampleKeyId}' \\
  -H 'x-api-key: ${exampleKeyPrefix}_REPLACE_ME' \\
  -d '{
    "name": "Website Test Lead",
    "email": "lead@example.com",
    "phone": "+1 555 123 4567",
    "source": "website_form",
    "message": "Test from my website form"
  }'`}
          </pre>
        </div>
      </div>

      <div className="card section">
        <p className="kicker">Step 3</p>
        <p className="h2">Connect your real form (HTML example)</p>
        <p className="p">
          On your site, submit the form data to the webhook URL using JavaScript. Here is a simple example:
        </p>
        <div className="card" style={{ background: "rgba(0,0,0,0.25)", marginTop: 10 }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.5 }}>
{`<form id="lead-form">
  <input name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <input name="phone" placeholder="Phone" />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>

<script>
  const WEBHOOK_URL = '${webhookUrl}';
  const API_KEY_ID = '${exampleKeyId}'; // from Looply
  const API_KEY = '${exampleKeyPrefix}_REPLACE_ME'; // from Looply

  document.getElementById('lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
      source: 'website_form',
    };

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key-id': API_KEY_ID,
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Lead sent to Looply!');
    } else {
      console.error('Failed to send lead', await res.text());
      alert('Send failed – check your API key and webhook URL.');
    }
  });
</script>`}
          </pre>
        </div>
      </div>

      <div className="card section">
        <p className="kicker">Step 4</p>
        <p className="h2">How to verify it works</p>
        <ol style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
          <li>Open the Looply dashboard.</li>
          <li>Submit your website form once with your own email.</li>
          <li>In the dashboard, open the new lead and check the timeline for <code>lead_created</code> events.</li>
          <li>If nothing appears, double-check the webhook URL and API key headers.</li>
        </ol>
      </div>

      <div className="section btnRow">
        <Button href="/app/dashboard">Back to dashboard</Button>
        <Button href="/app/settings/api-keys">API keys</Button>
      </div>
    </div>
  );
}

