export const runtime = "nodejs";

type KvResponse = {
  result: any;
  error?: string;
};

export function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("storage_not_configured");
  }
}

async function kvFetch(command: string, args: Array<string | number>) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new StorageNotConfiguredError();

  const res = await fetch(`${url}/${command}/${args.map((a) => encodeURIComponent(String(a))).join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`kv_http_${res.status}${text ? `: ${text}` : ""}`);
  }

  const json = (await res.json()) as KvResponse;
  if (json?.error) throw new Error(json.error);
  return json?.result;
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  const raw = await kvFetch("get", [key]);
  if (!raw) return null;
  try {
    return JSON.parse(String(raw)) as T;
  } catch {
    return null;
  }
}

export async function kvSetJson(key: string, value: unknown) {
  return kvFetch("set", [key, JSON.stringify(value)]);
}

export async function kvDel(key: string) {
  return kvFetch("del", [key]);
}

export async function kvLpush(key: string, value: string) {
  return kvFetch("lpush", [key, value]);
}

export async function kvLrange(key: string, start: number, stop: number) {
  const res = await kvFetch("lrange", [key, start, stop]);
  return Array.isArray(res) ? (res as string[]) : [];
}

export async function kvLrem(key: string, count: number, value: string) {
  return kvFetch("lrem", [key, count, value]);
}

