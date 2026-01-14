export default function SuccessPage() {
  const starterUrl = process.env.NEXT_PUBLIC_PADDLE_STARTER_CHECKOUT_URL || "/";

  return (
    <div className="card section">
      <p className="pill">Success</p>
      <h1>Payment received</h1>
      <p className="p">Next step: check your email for onboarding.</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <a className="button" href="mailto:support@looplycrm.com">
          Contact support
        </a>
        <a className="button primary" href={starterUrl}>
          Start Free Trial
        </a>
      </div>
    </div>
  );
}

