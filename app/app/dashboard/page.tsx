export default function DashboardPage() {
  return <DashboardPageShell />;
}

import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

function DashboardPageShell() {
  return (
    <Suspense
      fallback={
        <div className="card section">
          <p className="kicker">Loading…</p>
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}

