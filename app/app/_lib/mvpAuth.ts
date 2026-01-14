export type User = {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
};

export type Session = {
  token: string;
  email: string;
  createdAt: number;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  status: "New" | "Contacted";
  createdAt: number;
};

const USERS_KEY = "looply_users_v1";
const SESSION_KEY = "looply_session_v1";
const LEADS_KEY = "looply_leads_v1";

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

export function getUsers(): Record<string, User> {
  assertBrowser();
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, User>;
  } catch {
    return {};
  }
}

export function setUsers(users: Record<string, User>) {
  assertBrowser();
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  assertBrowser();
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    if (!s?.email || !s?.token) return null;
    return s;
  } catch {
    return null;
  }
}

export function setSession(email: string) {
  assertBrowser();
  const token = crypto.randomUUID();
  const session: Session = { token, email, createdAt: Date.now() };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  assertBrowser();
  window.localStorage.removeItem(SESSION_KEY);
}

export function getLeads(): Lead[] {
  assertBrowser();
  const raw = window.localStorage.getItem(LEADS_KEY);
  if (!raw) return [];
  try {
    const leads = JSON.parse(raw) as Lead[];
    return Array.isArray(leads) ? leads : [];
  } catch {
    return [];
  }
}

export function setLeads(leads: Lead[]) {
  assertBrowser();
  window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function createTestLead() {
  assertBrowser();
  const lead: Lead = {
    id: crypto.randomUUID(),
    name: "Test Lead",
    email: "lead@example.com",
    status: "New",
    createdAt: Date.now(),
  };
  const leads = getLeads();
  setLeads([lead, ...leads]);
  return lead;
}

