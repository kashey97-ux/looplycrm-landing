export type EngineErrorCode =
  | "engine_not_configured"
  | "network_error"
  | "bad_request"
  | "unauthorized"
  | "rate_limited"
  | "server_error";

export type EngineResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: { code: EngineErrorCode; message: string; details?: any } };

function getEngineBaseUrl() {
  return "/api/engine";
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function engineFetch<T>(
  path: string,
  init?: RequestInit & { json?: any },
): Promise<EngineResult<T>> {
  const base = getEngineBaseUrl();
  const headers = new Headers(init?.headers || {});
  headers.set("accept", "application/json");

  let body: BodyInit | undefined = init?.body as any;
  if (Object.prototype.hasOwnProperty.call(init || {}, "json")) {
    headers.set("content-type", "application/json");
    body = JSON.stringify((init as any).json ?? {});
  }

  let res: Response;
  try {
    res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers,
      body,
      cache: "no-store",
    });
  } catch (e: any) {
    return {
      ok: false,
      status: 0,
      error: { code: "network_error", message: e?.message || "Network error" },
    };
  }

  const json = await parseJsonSafe(res);
  if (res.ok) return { ok: true, status: res.status, data: (json as T) ?? (null as any) };

  const message =
    (json && (json.message || json.error || json.detail)) ? String(json.message || json.error || json.detail) : `Request failed (${res.status})`;

  const code: EngineErrorCode =
    json?.error === "engine_not_configured" ? "engine_not_configured" :
    res.status === 400 ? "bad_request" :
    res.status === 401 ? "unauthorized" :
    res.status === 429 ? "rate_limited" :
    res.status >= 500 ? "server_error" :
    "server_error";

  return { ok: false, status: res.status, error: { code, message, details: json } };
}

// ---- Typed helpers (best-effort shapes; Engine is source of truth) ----

export type EngineBusinessSettings = {
  business?: { name?: string };
  plan_status?: string;
  trial_ended?: boolean;
  webhook_url?: string;
  features?: Record<string, any>;
};

export type EngineOnboardingState = {
  completed?: boolean;
  step?: number;
  step1?: any;
  step2?: any;
  step3?: any;
  plan_status?: string;
  trial_ended?: boolean;
};

export type EngineApiKeyList = {
  items?: Array<{ id: string; prefix?: string; created_at?: string | number; createdAt?: number }>;
  apiKey?: string; // some engines may return a single "current" key
};

export type EngineLead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  created_at?: string | number;
  createdAt?: number;
  status?: string;
};

export type EngineLeadsList = { items?: EngineLead[]; next_cursor?: string | null; nextCursor?: string | null };

export type EngineTimelineEvent = {
  id: string;
  type: string;
  title?: string;
  details?: any;
  created_at?: string | number;
  createdAt?: number;
};

export type EngineTimelineList = { items?: EngineTimelineEvent[]; next_cursor?: string | null; nextCursor?: string | null };

export function isPaywalled(s: { plan_status?: string; trial_ended?: boolean } | null | undefined) {
  return Boolean(s && s.plan_status && s.plan_status !== "active" && s.trial_ended);
}

export function tsFromAny(v: any): number {
  if (typeof v === "number") return v;
  const n = Date.parse(String(v || ""));
  return Number.isFinite(n) ? n : 0;
}

