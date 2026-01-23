"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { engineFetch, isPaywalled, type EngineBusinessSettings } from "../../_lib/engineApi";
import { getSession } from "../../_lib/mvpAuth";

type TwilioSettings = {
  account_sid?: string;
  auth_token?: string;
  from_number?: string;
};

export default function TwilioIntegrationsPage() {
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
  const [twilio, setTwilio] = useState<TwilioSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const engineConfigured = Boolean(process.env.NEXT_PUBLIC_ENGINE_API_URL);

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
      const [b, t] = await Promise.all([
        engineFetch<EngineBusinessSettings>("/v1/settings/business"),
        engineFetch<TwilioSettings>("/v1/integrations/twilio"),
      ]);
      if (cancelled) return;
      if (b.ok) setBusiness(b.data);
      if (t.ok) setTwilio(t.data || {});
      if (b.ok === false && t.ok === false) {
        setError(b.error.message || t.error.message || "Failed to load Twilio settings.");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const paywalled = isPaywalled(business);
  const twilioAllowed = Boolean((business as any)?.features?.twilio_enabled || (business as any)?.features?.twilio);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const r = await engineFetch("/v1/integrations/twilio", {
        method: "POST",
        json: {
          account_sid: twilio.account_sid,
          auth_token: twilio.auth_token,
          from_number: twilio.from_number,
        },
      });
      if (r.ok === false) {
        setError(r.error.message || "Failed to save Twilio settings.");
        return;
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Integrations</p>
            <h1 style={{ margin: 0 }}>Twilio SMS</h1>
            <p className="small dashboardSubtitle">
              Connect Twilio to let Looply send SMS in your follow-up sequences.
            </p>
          </div>
          <div className="btnRow">
            <Button href="/app/dashboard">Back to dashboard</Button>
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
        </div>
      ) : null}

      {paywalled ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Trial ended</p>
          <p className="h2">Some actions may be blocked</p>
          <p className="p">
            Looply Engine decides whether Twilio configuration is allowed based on your plan.
          </p>
        </div>
      ) : null}

      {!twilioAllowed ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Not enabled on your plan</p>
          <p className="p" style={{ marginTop: 10 }}>
            Twilio SMS is available on selected plans. If you need access, email{" "}
            <a href="mailto:support@looplycrm.com" style={{ textDecoration: "underline" }}>
              support@looplycrm.com
            </a>
            .
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="card section">
          <p className="p" style={{ color: "rgba(255,150,150,0.92)" }}>{error}</p>
        </div>
      ) : null}

      <div className="card section">
        <p className="kicker">Where to find your Twilio credentials</p>
        <p className="p">
          In the{" "}
          <a href="https://www.twilio.com/console" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
            Twilio Console
          </a>
          :
        </p>
        <ol style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
          <li>
            <strong>Account SID</strong>: shown on the main dashboard (“Account Info”).
          </li>
          <li>
            <strong>Auth Token</strong>: click “Show” next to Auth Token in the same section.
          </li>
          <li>
            <strong>From number</strong>: go to Phone Numbers → Manage → Active numbers and pick the number you want Looply to send from.
          </li>
        </ol>
      </div>

      <div className="card section">
        <p className="kicker">Configure Twilio in Looply</p>
        <p className="p">
          Looply will store these values in the Engine and use them when sending SMS. All validation and security checks happen in the Engine.
        </p>

        <form className="leadForm" onSubmit={onSave} style={{ marginTop: 12 }}>
          <div className="leadField">
            <label htmlFor="account_sid">Account SID</label>
            <input
              id="account_sid"
              value={twilio.account_sid || ""}
              onChange={(e) => setTwilio((prev) => ({ ...prev, account_sid: e.target.value }))}
              disabled={loading || saving || !twilioAllowed || !engineConfigured}
              placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            />
          </div>

          <div className="leadField" style={{ marginTop: 10 }}>
            <label htmlFor="auth_token">Auth Token</label>
            <input
              id="auth_token"
              type="password"
              value={twilio.auth_token || ""}
              onChange={(e) => setTwilio((prev) => ({ ...prev, auth_token: e.target.value }))}
              disabled={loading || saving || !twilioAllowed || !engineConfigured}
              placeholder="Your Twilio Auth Token"
            />
          </div>

          <div className="leadField" style={{ marginTop: 10 }}>
            <label htmlFor="from_number">From number</label>
            <input
              id="from_number"
              value={twilio.from_number || ""}
              onChange={(e) => setTwilio((prev) => ({ ...prev, from_number: e.target.value }))}
              disabled={loading || saving || !twilioAllowed || !engineConfigured}
              placeholder="+15551234567"
            />
          </div>

          <div className="btnRow" style={{ marginTop: 12 }}>
            <Button
              variant="primary"
              type="submit"
              disabled={loading || saving || !twilioAllowed || !engineConfigured}
              title={!engineConfigured ? "Engine is not connected. Set NEXT_PUBLIC_ENGINE_API_URL in Vercel env and redeploy." : undefined}
            >
              {saving ? "Saving…" : "Save Twilio settings"}
            </Button>
            <Button type="button" href="/app/dashboard">
              Cancel
            </Button>
          </div>

          {saved ? (
            <p className="small" style={{ marginTop: 10, color: "rgba(180,255,180,0.92)" }}>
              Saved. The Engine will use these values for SMS sends where Twilio is enabled.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

