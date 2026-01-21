import { Suspense } from "react";
import WebhooksClient from "./webhooksClient";

export default function WebhooksPage() {
  return (
    <Suspense
      fallback={
        <div className="card section">
          <p className="kicker">Loading…</p>
        </div>
      }
    >
      <WebhooksClient />
    </Suspense>
  );
}

