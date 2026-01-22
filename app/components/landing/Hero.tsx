import DemoForm from "../DemoForm";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="card">
        <p className="kicker">Sales-first lead nurture with Auto‑Stop</p>
        <h1 className="h1">First‑contact conversion for inbound leads — with Auto‑Stop.</h1>
        <p className="sub">
          Sales gets alerted + reminders. Lead gets gentle follow‑ups. Stop instantly when outcome is set.
        </p>

        <div className="btnRow" style={{ marginTop: 12 }}>
          <a className="button primary" href="#demo">Get a demo</a>
          <a className="button" href="#waitlist">Join waitlist</a>
          <a className="button" href="#how">How it works</a>
        </div>

        <div className="section grid" style={{ marginTop: 18 }}>
          <div className="card">
            <p className="kicker">Auto‑Stop</p>
            <p className="h2">No spam, ever</p>
            <p className="p">As soon as your sales rep marks an outcome, Looply stops everything.</p>
          </div>
          <div className="card">
            <p className="kicker">Conversion control</p>
            <p className="h2">Outcomes drive the system</p>
            <p className="p">CONTACTED / BOOKED / LOST / OPTED_OUT instantly ends all reminders and messages.</p>
          </div>
          <div className="card">
            <p className="kicker">What improves</p>
            <p className="h2">First contact + booked</p>
            <p className="p">Gentle follow‑ups help the lead pick a time and respond faster — without losing control.</p>
          </div>
        </div>

        <div className="section">
          <p className="small">
            Designed for roofing &amp; home services. Already have an account? <a href="/app/login" style={{ textDecoration: "underline" }}>Log in</a>
          </p>
        </div>
      </div>

      <aside className="card">
        <p className="kicker">Request a demo</p>
        <p className="h2">See it on your lead flow</p>
        <p className="p">
          Tell us your lead volume and channels (SMS/email). We’ll show how Auto‑Stop and outcomes keep your pipeline clean.
        </p>
        <div className="section">
          <DemoForm intent="demo" />
          <p className="small" style={{ marginTop: 10 }}>
            Or email <a href="mailto:support@looplycrm.com" style={{ textDecoration: "underline" }}>support@looplycrm.com</a>.
          </p>
        </div>
      </aside>
    </section>
  );
}

