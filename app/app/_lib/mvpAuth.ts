export type Session = {
  email: string;
  name?: string;
  plan?: string;
  createdAt: number;
};

const SESSION_KEY = "looply_session_v2";

function assertBrowser() {
  if (typeof window === "undefined") throw new Error("Browser-only");
}

export async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getSession(): Session | null {
  assertBrowser();
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    if (!s?.email) return null;
    return s;
  } catch {
    return null;
  }
}

export function setSession(session: { email: string; name?: string; plan?: string }) {
  assertBrowser();
  const next: Session = {
    email: session.email,
    name: session.name,
    plan: session.plan,
    createdAt: Date.now(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export function logout() {
  assertBrowser();
  window.localStorage.removeItem(SESSION_KEY);
  fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
}

