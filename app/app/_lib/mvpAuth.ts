export type User = {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
  plan: "starter" | "growth" | "pro";
  trialStart: number;
  trialDays: number;
  onboarding: {
    completed: boolean;
    completedAt?: number;
    leadSource?: "website_form" | "webhook_api";
    channel?: "email";
    niche?: "roofing" | "home_services" | "generic";
    tone?: "friendly" | "direct";
  };
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

function normalizeUser(u: any): User {
  const createdAt = typeof u?.createdAt === "number" ? u.createdAt : Date.now();
  const plan = (u?.plan === "starter" || u?.plan === "growth" || u?.plan === "pro") ? u.plan : "starter";
  const trialStart = typeof u?.trialStart === "number" ? u.trialStart : createdAt;
  const trialDays = typeof u?.trialDays === "number" ? u.trialDays : 7;

  // Existing users (pre-wizard) should skip setup by default.
  const onboardingCompleted =
    typeof u?.onboarding?.completed === "boolean" ? u.onboarding.completed : true;

  const onboarding: User["onboarding"] = {
    completed: onboardingCompleted,
    completedAt: typeof u?.onboarding?.completedAt === "number" ? u.onboarding.completedAt : undefined,
    leadSource: u?.onboarding?.leadSource,
    channel: u?.onboarding?.channel,
    niche: u?.onboarding?.niche,
    tone: u?.onboarding?.tone,
  };

  return {
    email: String(u?.email || ""),
    name: String(u?.name || ""),
    passwordHash: String(u?.passwordHash || ""),
    createdAt,
    plan,
    trialStart,
    trialDays,
    onboarding,
  };
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
    const parsed = JSON.parse(raw) as Record<string, any>;
    const out: Record<string, User> = {};
    let changed = false;
    for (const [email, u] of Object.entries(parsed || {})) {
      const normalized = normalizeUser({ ...u, email });
      out[email] = normalized;
      if (JSON.stringify(u) !== JSON.stringify(normalized)) changed = true;
    }
    if (changed) setUsers(out);
    return out;
  } catch {
    return {};
  }
}

export function setUsers(users: Record<string, User>) {
  assertBrowser();
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUser(email: string): User | null {
  const users = getUsers();
  return users[email] || null;
}

export function updateUser(email: string, updater: (u: User) => User) {
  const users = getUsers();
  const existing = users[email];
  if (!existing) return null;
  const updated = updater(existing);
  users[email] = updated;
  setUsers(users);
  return updated;
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

export function isTrialExpired(user: User, now = Date.now()) {
  const end = user.trialStart + user.trialDays * 24 * 60 * 60 * 1000;
  return now >= end;
}

export function trialDaysLeft(user: User, now = Date.now()) {
  const end = user.trialStart + user.trialDays * 24 * 60 * 60 * 1000;
  const msLeft = end - now;
  return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
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

