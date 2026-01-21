"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { engineFetch, isPaywalled, type EngineBusinessSettings } from "../../_lib/engineApi";
import { getSession } from "../../_lib/mvpAuth";

export default function NewLeadClient() {
  const router = useRouter();
  const session = useMemo(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  }, []);
  const ownerEmail = session?.email || null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [business, setBusiness] = useState<EngineBusinessSettings | null>(null);

  useEffect(() => {
    if (!ownerEmail) router.replace("/app/login");
  }, [ownerEmail, router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await engineFetch<EngineBusinessSettings>("/v1/settings/business");
      if (cancelled) return;
      if (r.ok) setBusiness(r.data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!ownerEmail) return;
    setSubmitting(true);
    try {
      const r = await engineFetch<{ lead?: { id?: string }; id?: string }>("/v1/leads/intake", {
        method: "POST",
        json: {
          name,
          email,
          phone,
          company,
          message,
          source,
          origin: "manual",
        },
      });
      if (r.ok === false) {
        setError(r.error.message || "Failed to create lead.");
        return;
      }
      const leadId = (r.data as any)?.lead?.id || (r.data as any)?.id;
      if (leadId) router.push(`/app/leads/${encodeURIComponent(String(leadId))}`);
    } finally {
      setSubmitting(false);
    }
  }

  const paywalled = isPaywalled(business);

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Leads</p>
            <h1 style={{ margin: 0 }}>Add lead</h1>
            <p className="small dashboardSubtitle">Create a lead manually via Engine.</p>
          </div>
          <div className="btnRow">
            <Button href="/app/dashboard">Back</Button>
          </div>
        </div>
      </div>

      {paywalled ? (
        <div className="card section" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Plan inactive</p>
          <p className="h2">Upgrade to continue</p>
          <p className="p">Engine may block manual lead intake while your plan is inactive.</p>
          <div className="btnRow" style={{ marginTop: 12 }}>
            <Button variant="primary" href="mailto:support@looplycrm.com?subject=Looply%20Upgrade%20Request">Contact support</Button>
            <Button href="/#demo">Request a demo</Button>
          </div>
        </div>
      ) : (
        <div className="card section">
          <form className="leadForm" onSubmit={onSubmit}>
            <div className="leadFormGrid">
              <div className="leadField">
                <label htmlFor="name">Name</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="leadField">
                <label htmlFor="email">Email</label>
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
            </div>

            <div className="leadFormGrid" style={{ marginTop: 10 }}>
              <div className="leadField">
                <label htmlFor="phone">Phone</label>
                <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="leadField">
                <label htmlFor="company">Company</label>
                <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>

            <div className="leadField" style={{ marginTop: 10 }}>
              <label htmlFor="source">Source (optional)</label>
              <input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="website, referral, outbound…" />
            </div>

            <div className="leadField" style={{ marginTop: 10 }}>
              <label htmlFor="message">Message (optional)</label>
              <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
            </div>

            <div className="btnRow" style={{ marginTop: 12 }}>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Create lead"}
              </Button>
              <Button href="/app/dashboard">Cancel</Button>
            </div>

            {error ? (
              <p className="small" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
                {String(error)}
              </p>
            ) : null}
          </form>
        </div>
      )}
    </div>
  );
}

