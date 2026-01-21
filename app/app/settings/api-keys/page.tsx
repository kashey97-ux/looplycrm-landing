import { Suspense } from "react";
import ApiKeysClient from "./apiKeysClient";

export default function ApiKeysPage() {
  return (
    <Suspense
      fallback={
        <div className="card section">
          <p className="kicker">Loading…</p>
        </div>
      }
    >
      <ApiKeysClient />
    </Suspense>
  );
}

