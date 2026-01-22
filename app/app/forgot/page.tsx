"use client";

export default function ForgotPage() {
  return (
    <div className="card section">
      <p className="pill">Account</p>
      <h1>Reset password</h1>
      <p className="p">Password resets are handled by support.</p>
      <div className="btnRow" style={{ marginTop: 12 }}>
        <a className="button primary" href="mailto:support@looplycrm.com?subject=Looply%20Password%20Reset">
          Email support
        </a>
        <a className="button" href="/app/login">
          Back to login
        </a>
        <a className="button" href="/">
          Back to Home
        </a>
      </div>
    </div>
  );
}

