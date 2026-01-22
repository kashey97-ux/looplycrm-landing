export default function Pricing() {
  return (
    <section id="pricing" className="card section">
      <p className="kicker">Pricing</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Two plans for fast first contact</h2>
      <p className="p">Pick a plan based on your team size. Start with a demo if you want help.</p>

      <div className="pricingGrid2" style={{ marginTop: 12 }}>
        <div className="card pricingCard">
          <p className="kicker">Starter</p>
          <p className="h2">For owner-operators</p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Sales alerts and reminders</li>
            <li>Gentle lead nudges until outcome</li>
            <li>Auto-Stop on CONTACTED / BOOKED / LOST / OPTED_OUT</li>
            <li>Basic outcomes reporting</li>
            <li>Single pipeline setup</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="#demo">Get a demo</a>
            <a className="button" style={{ width: "100%", marginTop: 8 }} href="/app/signup">Start trial</a>
          </div>
        </div>

        <div className="card pricingCard" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
          <p className="kicker">Pro</p>
          <p className="h2">For teams</p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Everything in Starter</li>
            <li>Multiple reps and shared inbox</li>
            <li>Advanced outcomes workflows</li>
            <li>Message variants and testing</li>
            <li>Priority support</li>
          </ul>
          <div className="pricingCardCta">
            <a className="button primary" style={{ width: "100%" }} href="#demo">Get a demo</a>
            <a className="button" style={{ width: "100%", marginTop: 8 }} href="/app/signup">Start trial</a>
          </div>
        </div>
      </div>
    </section>
  );
}

