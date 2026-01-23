export default function ValueCards() {
  return (
    <section className="card section" id="value">
      <p className="kicker">Why Looply</p>
      <h2 className="h2" style={{ marginTop: 10 }}>First-contact conversion without the spam</h2>
      <p className="p">
        Looply keeps sales reps fast and focused while leads stay in control.
      </p>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">Sales reminders</p>
          <p className="p">Instant alerts and gentle nudges so reps never miss first contact.</p>
        </div>
        <div className="card">
          <p className="kicker">Inbound replies</p>
          <p className="p">Leads can reply “We tried calling you…” messages or pick a time.</p>
        </div>
        <div className="card">
          <p className="kicker">Auto-Stop</p>
          <p className="p">Stop instantly when an outcome is set. No spam.</p>
        </div>
      </div>
    </section>
  );
}
