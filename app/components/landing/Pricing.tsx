export default function Pricing() {
  return (
    <section id="pricing" className="card section">
      <p className="kicker">Early access pricing</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Simple plans for sales-first lead conversion</h2>
      <p className="p">
        Get access early and help shape the product. Pricing is finalized during onboarding.
      </p>

      <div className="pricingGrid2" style={{ marginTop: 12 }}>
        <div className="card pricingCard">
          <p className="kicker">Starter</p>
          <p className="h2">For owner‑operators</p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Sales alerts + reminders</li>
            <li>Gentle lead follow‑ups</li>
            <li>Outcomes + Auto‑Stop</li>
            <li>Conversion reporting</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="#demo">Get a demo</a>
          </div>
        </div>

        <div className="card pricingCard" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Pro</p>
          <p className="h2">For teams</p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Everything in Starter</li>
            <li>A/B testing for messages</li>
            <li>Advanced outcomes workflows</li>
            <li>Priority support</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="#demo">Get a demo</a>
          </div>
        </div>
      </div>
    </section>
  );
}

