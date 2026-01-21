import { Suspense } from "react";
import LeadDetailClient from "./leadDetailClient";

export default function LeadDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="card section">
          <p className="kicker">Loading…</p>
        </div>
      }
    >
      <LeadDetailClient />
    </Suspense>
  );
}

