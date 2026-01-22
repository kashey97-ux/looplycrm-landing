export default function HowItWorks() {
  return (
    <section id="how" className="card section">
      <p className="kicker">How it works</p>
      <h2 className="h2" style={{ marginTop: 10 }}>5 steps from inbound lead to booked (with Auto‑Stop)</h2>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">1) Lead arrives</p>
          <p className="p">Website form, webhook/API, or import.</p>
        </div>
        <div className="card">
          <p className="kicker">2) Sales notified instantly</p>
          <p className="p">Immediate alert + reminders until there’s an outcome.</p>
        </div>
        <div className="card">
          <p className="kicker">3) Lead gets gentle follow‑ups</p>
          <p className="p">“Couldn’t reach you… want to pick a time?”</p>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">4) Sales marks outcome</p>
          <p className="p">CONTACTED / BOOKED / LOST / OPTED_OUT.</p>
        </div>
        <div className="card">
          <p className="kicker">5) Auto‑stop + reporting + A/B insights</p>
          <p className="p">Stop everything instantly, then learn what converts.</p>
        </div>
        <div className="card">
          <p className="kicker">Control</p>
          <p className="p">You can stop any lead with one click — anytime.</p>
        </div>
      </div>
    </section>
  );
}

