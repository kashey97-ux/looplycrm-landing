export default function SignupPage() {
  return (
    <SignupPageShell />
  );
}

import { Suspense } from "react";
import SignupClient from "./SignupClient";

function SignupPageShell() {
  return (
    <Suspense
      fallback={
        <div className="card section">
          <p className="kicker">Loading…</p>
        </div>
      }
    >
      <SignupClient />
    </Suspense>
  );
}

