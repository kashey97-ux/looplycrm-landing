export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="card">
        <p className="kicker">First-contact conversion</p>
        <h1 className="h1">Reach inbound leads faster, then stop on outcome.</h1>
        <p className="sub">
          Looply is a focused system for owner-operators and small sales teams in home services. It keeps first contact
          tight and ends follow-ups the moment an outcome is set.
        </p>

        <div className="btnRow" style={{ marginTop: 16 }}>
          <a className="button primary" href="/app/signup?plan=starter">Start trial</a>
          <a className="button" href="#how">See how it works</a>
        </div>
        <p className="small" style={{ marginTop: 10 }}>
          Respectful, sales-first follow-ups. Auto-Stop keeps it clean.
        </p>
      </div>
    </section>
  );
}

