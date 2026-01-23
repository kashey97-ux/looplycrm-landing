export default function Pricing() {
  return (
    <section id="pricing" className="card section">
      <p className="kicker">Pricing</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Three plans for fast first contact</h2>
      <p className="p">Clear pricing for sales-first inbound conversion. Auto-Stop is included in every plan.</p>

      <div className="pricingGrid" style={{ marginTop: 12 }}>
        <div className="card pricingCard">
          <p className="kicker">Starter</p>
          <p className="h2">For owner-operators</p>
          <p className="sub" style={{ margin: "4px 0 0" }}>$99<span className="small">/mo</span></p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>1 rep</li>
            <li>Up to 300 leads/month</li>
            <li>Email channel</li>
            <li>Inbound replies + timeline</li>
            <li>Auto-Stop on CONTACTED / BOOKED / LOST / OPTED_OUT</li>
            <li>Standard support</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="/app/signup?plan=starter">Start trial</a>
            <a className="button" style={{ width: "100%", marginTop: 8 }} href="#demo">Get a demo</a>
          </div>
        </div>

        <div className="card pricingCard" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Pro</p>
          <p className="h2">For teams</p>
          <p className="sub" style={{ margin: "4px 0 0" }}>$199<span className="small">/mo</span></p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Everything in Starter</li>
            <li>Up to 5 reps</li>
            <li>Up to 1,500 leads/month</li>
            <li>Email + SMS channels</li>
            <li>A/B testing</li>
            <li>Priority support</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="#demo">Get a demo</a>
            <a className="button" style={{ width: "100%", marginTop: 8 }} href="/app/signup?plan=pro">Start trial</a>
          </div>
        </div>

        <div className="card pricingCard">
          <p className="kicker">Elite</p>
          <p className="h2">For multi-location teams</p>
          <p className="sub" style={{ margin: "4px 0 0" }}>$299<span className="small">/mo</span></p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Everything in Pro</li>
            <li>Unlimited reps</li>
            <li>Unlimited leads/month</li>
            <li>Multi-location routing</li>
            <li>Advanced analytics + outcomes</li>
            <li>Dedicated onboarding</li>
            <li>Priority + SLA support</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="#demo">Get a demo</a>
          </div>
        </div>
      </div>
    </section>
  );
}

