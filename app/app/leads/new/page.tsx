import { Suspense } from "react";
import NewLeadClient from "./newLeadClient";

export default function NewLeadPage() {
  return (
    <Suspense
      fallback={
        <div className="card section">
          <p className="kicker">Loading…</p>
        </div>
      }
    >
      <NewLeadClient />
    </Suspense>
  );
}

