export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="card">
        <p className="kicker">Sales-first inbound conversion</p>
        <h1 className="h1">First-contact conversion with Auto-Stop.</h1>
        <p className="sub">
          Looply keeps the rep in control: fast first contact, gentle lead nudges, and instant stop when an outcome is set.
        </p>

        <ul style={{ margin: "12px 0 0 18px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
          <li>Sales reminders until the rep marks an outcome.</li>
          <li>Gentle lead nudges until CONTACTED / BOOKED / LOST / OPTED_OUT.</li>
        </ul>

        <div className="btnRow" style={{ marginTop: 16 }}>
          <a className="button primary" href="#demo">Get a demo</a>
          <a className="button" href="/app/login">Log in</a>
        </div>
        <p className="small" style={{ marginTop: 10 }}>
          Designed for roofing &amp; home services. Start a trial in minutes.
        </p>
      </div>
    </section>
  );
}

