import { Suspense } from "react";
import SetupClient from "./setupClient";

export default function SetupPage() {
  return (
    <Suspense
      fallback={
        <div className="card section">
          <p className="kicker">Loading…</p>
        </div>
      }
    >
      <SetupClient />
    </Suspense>
  );
}

