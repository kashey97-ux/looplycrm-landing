"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { engineFetch, tsFromAny, type EngineLead, type EngineTimelineEvent, type EngineTimelineList } from "../../_lib/engineApi";
import { getSession } from "../../_lib/mvpAuth";

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function LeadDetailClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const session = useMemo(() => {
    try {
      return getSession();
    } catch {
      return null;
    }
  }, []);
  const ownerEmail = session?.email || null;

  const [lead, setLead] = useState<EngineLead | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);

  const [events, setEvents] = useState<EngineTimelineEvent[]>([]);
  const [eventsCursor, setEventsCursor] = useState<string | null>("");
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerEmail) {
      router.replace("/app/login");
      return;
    }
    if (!id) return;

    let cancelled = false;
    setLeadError(null);
    setEventsError(null);
    setLoadingEvents(true);

    engineFetch<{ lead?: EngineLead }>(`/v1/leads/${encodeURIComponent(String(id))}`)
      .then(async (leadRes) => {
        if (cancelled) return;
        if (leadRes.ok === false) {
          setLeadError(leadRes.error.message || "Failed to load lead.");
          setLead(null);
          setEvents([]);
          setEventsCursor(null);
          return;
        }
        setLead((leadRes.data as any)?.lead || (leadRes.data as any) || null);

        const ev = await engineFetch<EngineTimelineList>(`/v1/leads/${encodeURIComponent(String(id))}/timeline?cursor=&limit=20`);
        if (ev.ok === false) {
          setEventsError(ev.error.message || "Failed to load timeline.");
          setEvents([]);
          setEventsCursor(null);
          return;
        }
        setEvents(Array.isArray(ev.data?.items) ? ev.data.items : []);
        const next = (ev.data as any)?.nextCursor ?? (ev.data as any)?.next_cursor;
        setEventsCursor(typeof next === "string" ? next : null);
      })
      .catch(() => {
        if (cancelled) return;
        setLeadError("Failed to load lead.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingEvents(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, ownerEmail, router]);

  async function loadMore() {
    if (!ownerEmail || !id || eventsCursor === null) return;
    setEventsError(null);
    setLoadingEvents(true);
    try {
      const r = await engineFetch<EngineTimelineList>(
        `/v1/leads/${encodeURIComponent(String(id))}/timeline?cursor=${encodeURIComponent(eventsCursor)}&limit=20`,
      );
      if (r.ok === false) {
        setEventsError(r.error.message || "Failed to load more timeline events.");
        return;
      }
      const more = Array.isArray(r.data?.items) ? r.data.items : [];
      setEvents((prev) => [...prev, ...more]);
      const next = (r.data as any)?.nextCursor ?? (r.data as any)?.next_cursor;
      setEventsCursor(typeof next === "string" ? next : null);
    } finally {
      setLoadingEvents(false);
    }
  }

  return (
    <div className="section">
      <div className="card">
        <div className="dashboardHeaderRow">
          <div className="dashboardHeaderLeft">
            <p className="pill">Lead</p>
            <h1 style={{ margin: 0 }}>{lead ? String(lead.name || "Lead") : "Lead details"}</h1>
            <p className="small dashboardSubtitle">
              {lead
                ? `${String(lead.email || "-")} • Created ${formatDate((lead as any).createdAt ? Number((lead as any).createdAt) : tsFromAny((lead as any).created_at))}`
                : "Loading…"}
            </p>
          </div>
          <div className="btnRow">
            <Button href="/app/dashboard">Back to dashboard</Button>
            <Button variant="primary" href="/app/leads/new">Add lead manually</Button>
          </div>
        </div>
      </div>

      {leadError ? (
        <div className="card section">
          <p className="p" style={{ color: "rgba(255,150,150,0.92)" }}>
            {leadError}
          </p>
        </div>
      ) : lead ? (
        <div className="card section">
          <p className="kicker">Details</p>
          <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", marginTop: 10 }}>
            <div className="card" style={{ background: "rgba(0,0,0,0.18)" }}>
              <p className="kicker">Contact</p>
              <p className="p" style={{ marginTop: 8 }}>
                <strong style={{ color: "rgba(255,255,255,0.92)" }}>Email:</strong> {String(lead.email || "-")}
                {lead.phone ? (
                  <>
                    <br />
                    <strong style={{ color: "rgba(255,255,255,0.92)" }}>Phone:</strong> {String(lead.phone)}
                  </>
                ) : null}
                {lead.company ? (
                  <>
                    <br />
                    <strong style={{ color: "rgba(255,255,255,0.92)" }}>Company:</strong> {String(lead.company)}
                  </>
                ) : null}
              </p>
            </div>
            <div className="card" style={{ background: "rgba(0,0,0,0.18)" }}>
              <p className="kicker">Meta</p>
              <p className="p" style={{ marginTop: 8 }}>
                <strong style={{ color: "rgba(255,255,255,0.92)" }}>Status:</strong> {String(lead.status || "New")}
                <br />
                <strong style={{ color: "rgba(255,255,255,0.92)" }}>Source:</strong> {String(lead.source || "-")}
              </p>
            </div>
          </div>

          {(lead as any).message ? (
            <div className="section">
              <p className="kicker">Message</p>
              <div className="card" style={{ background: "rgba(0,0,0,0.18)" }}>
                <p className="p" style={{ whiteSpace: "pre-wrap" }}>
                  {String((lead as any).message)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="card section">
        <p className="kicker">Timeline</p>
        {eventsError ? (
          <p className="p" style={{ marginTop: 10, color: "rgba(255,150,150,0.92)" }}>
            {eventsError}
          </p>
        ) : events.length === 0 ? (
          <p className="p" style={{ marginTop: 10 }}>
            {loadingEvents ? "Loading…" : "No timeline events yet."}
          </p>
        ) : (
          <div style={{ marginTop: 10 }}>
            {events.map((ev) => (
              <div key={ev.id} className="card" style={{ background: "rgba(0,0,0,0.18)", marginBottom: 10 }}>
                <p className="kicker">
                  {String(ev.type)} • {formatDate((ev as any).createdAt ? Number((ev as any).createdAt) : tsFromAny((ev as any).created_at))}
                </p>
                <p className="p" style={{ marginTop: 8, color: "rgba(255,255,255,0.92)" }}>
                  {String((ev as any).title || "")}
                </p>
                {(ev as any).details ? (
                  <pre style={{ margin: "10px 0 0", whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.70)", fontSize: 12, lineHeight: 1.5 }}>
                    {typeof (ev as any).details === "string" ? (ev as any).details : JSON.stringify((ev as any).details, null, 2)}
                  </pre>
                ) : null}
              </div>
            ))}

            {eventsCursor !== null ? (
              <div className="btnRow">
                <Button type="button" onClick={loadMore} disabled={loadingEvents}>
                  {loadingEvents ? "Loading…" : "Load more"}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

