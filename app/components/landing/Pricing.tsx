export default function Pricing() {
  return (
    <section id="pricing" className="card section">
      <p className="kicker">Pricing</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Two plans for fast first contact</h2>
      <p className="p">Simple pricing. Auto-Stop is included in every plan.</p>

      <div className="pricingGrid" style={{ marginTop: 12 }}>
        <div className="card pricingCard">
          <p className="kicker">Starter</p>
          <p className="h2">For owner-operators</p>
          <p className="sub" style={{ margin: "4px 0 0" }}>$99<span className="small">/mo</span></p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Email follow-ups</li>
            <li>Auto-Stop on CONTACTED / BOOKED / LOST / OPTED_OUT</li>
            <li>Sales alerts + reminders</li>
            <li>Inbound replies timeline</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="/app/signup?plan=starter">Start trial</a>
            <a className="button" style={{ width: "100%", marginTop: 8 }} href="#how">See how it works</a>
          </div>
        </div>

        <div className="card pricingCard" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Pro</p>
          <p className="h2">For teams</p>
          <p className="sub" style={{ margin: "4px 0 0" }}>$199<span className="small">/mo</span></p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Everything in Starter</li>
            <li>SMS follow-ups</li>
            <li>A/B testing</li>
            <li>Advanced workflows</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="/app/signup?plan=pro">Start trial</a>
            <a className="button" style={{ width: "100%", marginTop: 8 }} href="#how">See how it works</a>
          </div>
        </div>
      </div>
    </section>
  );
}

