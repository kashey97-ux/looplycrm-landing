export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="card">
        <p className="kicker">Sales-first inbound conversion</p>
        <h1 className="h1">First-contact conversion with Auto-Stop.</h1>
        <p className="sub">
          Looply helps sales reps respond faster with reminders, inbound replies, and instant stop when an outcome is set.
        </p>

        <div className="btnRow" style={{ marginTop: 16 }}>
          <a className="button primary" href="#demo">Get a demo</a>
          <a className="button" href="/app/signup?plan=starter">Start trial</a>
        </div>
        <p className="small" style={{ marginTop: 10 }}>
          Stop instantly when an outcome is set. No spam.
        </p>
      </div>
    </section>
  );
}

