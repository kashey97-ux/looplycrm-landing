"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, logout } from "./_lib/mvpAuth";
import { engineFetch, type EngineOnboardingState } from "./_lib/engineApi";

const PUBLIC_APP_ROUTES = new Set<string>(["/app/login", "/app/signup", "/app/forgot"]);

export default function AppGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.startsWith("/app")) return;

    const session = getSession();
    const isPublic = PUBLIC_APP_ROUTES.has(pathname);

    if (!session) {
      if (!isPublic) router.replace("/app/login");
      return;
    }

    if (isPublic) return;

    let cancelled = false;
    (async () => {
      const r = await engineFetch<EngineOnboardingState>("/v1/onboarding/state");
      if (cancelled) return;
      if (r.ok === false) {
        if (r.error.code === "unauthorized") {
          logout();
          router.replace("/app/login");
        }
        return;
      }

      const completed = Boolean(r.data?.completed);
      const needsSetup = !completed;
      if (needsSetup && pathname !== "/app/setup") {
        router.replace("/app/setup");
        return;
      }
      if (!needsSetup && pathname === "/app/setup") {
        router.replace("/app/dashboard");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}

