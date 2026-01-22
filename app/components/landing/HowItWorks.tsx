export default function HowItWorks() {
  return (
    <section id="how" className="card section">
      <p className="kicker">How it works</p>
      <h2 className="h2" style={{ marginTop: 10 }}>5 quick steps from lead to outcome</h2>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">1) Lead arrives</p>
          <p className="p">Form, webhook, or import.</p>
        </div>
        <div className="card">
          <p className="kicker">2) Sales notified</p>
          <p className="p">Instant alert + reminders.</p>
        </div>
        <div className="card">
          <p className="kicker">3) Lead nudged</p>
          <p className="p">“We tried calling you — pick a time?”</p>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">4) Outcome set</p>
          <p className="p">CONTACTED / BOOKED / LOST / OPTED_OUT.</p>
        </div>
        <div className="card">
          <p className="kicker">5) Auto-Stop</p>
          <p className="p">Everything stops instantly after the outcome.</p>
        </div>
        <div className="card">
          <p className="kicker">Reporting</p>
          <p className="p">See first-contact and booking performance.</p>
        </div>
      </div>
    </section>
  );
}

