"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./_lib/mvpAuth";

export default function AppIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/app/login");
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

