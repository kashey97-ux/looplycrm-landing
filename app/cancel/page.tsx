export default function CancelPage() {
  const starterUrl = process.env.NEXT_PUBLIC_PADDLE_STARTER_CHECKOUT_URL || "/";

  return (
    <div className="card section">
      <p className="pill">Cancelled</p>
      <h1>Checkout cancelled</h1>
      <p className="p">You can try again.</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <a className="button primary" href={starterUrl}>
          Start Free Trial
        </a>
        <a className="button" href="/#pricing">
          Back to pricing
        </a>
      </div>
    </div>
  );
}

