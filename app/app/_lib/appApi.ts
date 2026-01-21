"use client";

export type AppLead = {
  id: string;
  ownerEmail: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  status: "New" | "Contacted";
  createdAt: number;
};

export type TimelineEvent = {
  id: string;
  leadId: string;
  type: string;
  title: string;
  details?: string;
  createdAt: number;
};

export async function apiListLeads(ownerEmail: string, cursor = 0, limit = 20) {
  const res = await fetch(`/api/app/leads?ownerEmail=${encodeURIComponent(ownerEmail)}&cursor=${cursor}&limit=${limit}`, {
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  return { res, json } as { res: Response; json: any };
}

export async function apiCreateLead(payload: {
  ownerEmail: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  origin?: "manual" | "test";
}) {
  const res = await fetch("/api/app/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  return { res, json } as { res: Response; json: any };
}

export async function apiGetLead(ownerEmail: string, id: string) {
  const res = await fetch(`/api/app/leads/${encodeURIComponent(id)}?ownerEmail=${encodeURIComponent(ownerEmail)}`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  return { res, json } as { res: Response; json: any };
}

export async function apiListEvents(ownerEmail: string, leadId: string, cursor = 0, limit = 20) {
  const res = await fetch(
    `/api/app/leads/${encodeURIComponent(leadId)}/events?ownerEmail=${encodeURIComponent(ownerEmail)}&cursor=${cursor}&limit=${limit}`,
    { cache: "no-store" },
  );
  const json = await res.json().catch(() => ({}));
  return { res, json } as { res: Response; json: any };
}

export async function apiCreateApiKey(ownerEmail: string) {
  const res = await fetch("/api/app/api-keys", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ownerEmail }),
  });
  const json = await res.json().catch(() => ({}));
  return { res, json } as { res: Response; json: any };
}

export async function apiListApiKeys(ownerEmail: string) {
  const res = await fetch(`/api/app/api-keys?ownerEmail=${encodeURIComponent(ownerEmail)}`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  return { res, json } as { res: Response; json: any };
}

export async function apiRevokeApiKey(ownerEmail: string, id: string) {
  const res = await fetch(`/api/app/api-keys?ownerEmail=${encodeURIComponent(ownerEmail)}&id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  return { res, json } as { res: Response; json: any };
}

