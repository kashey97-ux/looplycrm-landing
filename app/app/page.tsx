"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUser } from "./_lib/mvpAuth";

export default function AppIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/app/login");
      return;
    }

    const user = getUser(session.email);
    if (!user) {
      router.replace("/app/login");
      return;
    }

    if (!user.onboarding?.completed) {
      router.replace("/app/setup");
      return;
    }

    router.replace("/app/dashboard");
  }, [router]);

  return (
    <div className="card section">
      <p className="kicker">Loading…</p>
    </div>
  );
}

