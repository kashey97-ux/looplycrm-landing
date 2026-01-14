import LeadForm from "./components/LeadForm";

export default function Home() {
  const startTrialUrl = "/app/signup";

  return (
    <>
      <header className="nav">
        <div className="logo">
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.85)" }} />
          <span>Looply</span>
          <span className="pill">Lead Recovery CRM</span>
        </div>

        <nav className="navlinks">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a className="button primary" href={startTrialUrl}>
            Start Free Trial
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="card">
            <p className="kicker">Stop losing leads in the first 5 minutes</p>
            <h1 className="h1">Recover More Leads. Automatically.</h1>
            <p className="sub">
              Looply instantly follows up with every inbound lead and keeps the conversation going — so your team can focus
              on closing, not chasing.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="button primary" href={startTrialUrl}>
                Start Free Trial
              </a>
              <a className="button" href="#how">See How It Works</a>
            </div>

            <p className="small" style={{ marginTop: 10 }}>
              Already have an account? <a href="/app/login">Log in</a>
            </p>

            <div className="section grid" style={{ marginTop: 18 }}>
              <div className="card">
                <p className="kicker">Instant</p>
                <p className="h2">Follow-up in seconds</p>
                <p className="p">Automatic first reply immediately after form submission.</p>
              </div>
              <div className="card">
                <p className="kicker">Persistent</p>
                <p className="h2">Smart sequences</p>
                <p className="p">Multi-step follow-ups over days until they reply or book.</p>
              </div>
              <div className="card">
                <p className="kicker">Simple</p>
                <p className="h2">Lead timeline</p>
                <p className="p">Every message and attempt logged in one clean history.</p>
              </div>
            </div>
          </div>

          <aside className="card">
            <p className="kicker">Perfect for</p>
            <p className="h2">Service businesses</p>
            <p className="p">
              Roofing, contractors, home services, local services, agencies handling inbound leads.
            </p>

            <div className="section">
              <p className="kicker">What you get</p>
              <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
                <li>Automated email follow-ups</li>
                <li>Manual tasks and reminders</li>
                <li>Lead status and booking tracking</li>
                <li>Multi-tenant ready (teams/clients)</li>
                <li>WhatsApp-ready (optional)</li>
              </ul>
            </div>

            <div className="section">
              <a className="button primary" style={{ width: "100%" }} href="#demo">
                Request a demo
              </a>
              <p className="small" style={{ marginTop: 10 }}>
                Contact: support@looplycrm.com
              </p>
            </div>
          </aside>
        </section>

        <section id="how" className="card section">
          <p className="kicker">How it works</p>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="card">
              <p className="kicker">Step 1</p>
              <p className="h2">Lead arrives</p>
              <p className="p">From your website form, ads, or any inbound source.</p>
            </div>
            <div className="card">
              <p className="kicker">Step 2</p>
              <p className="h2">Instant reply</p>
              <p className="p">Looply sends a polite, branded first message automatically.</p>
            </div>
            <div className="card">
              <p className="kicker">Step 3</p>
              <p className="h2">Follow-up chain</p>
              <p className="p">Automated reminders and touches continue until they respond or book.</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="section grid">
          <div className="card">
            <p className="kicker">Starter</p>
            <p className="h2">$99 / month</p>
            <p className="p">For small teams getting serious about lead conversion.</p>
            <ul style={{ margin: "10px 0 0 18px" }}>
              <li>Automated email follow-ups</li>
              <li>Lead timeline</li>
              <li>Manual tasks</li>
            </ul>
            <div style={{ marginTop: 12 }}>
              <a className="button primary" style={{ width: "100%" }} href="/app/signup?plan=starter">
                Choose plan
              </a>
            </div>
          </div>

          <div className="card" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
            <p className="kicker">Growth</p>
            <p className="h2">$199 / month</p>
            <p className="p">More leads, more automation, better conversion.</p>
            <ul style={{ margin: "10px 0 0 18px" }}>
              <li>Everything in Starter</li>
              <li>Advanced sequences</li>
              <li>WhatsApp option</li>
            </ul>
            <div style={{ marginTop: 12 }}>
              <a className="button primary" style={{ width: "100%" }} href="/app/signup?plan=growth">
                Choose plan
              </a>
            </div>
          </div>

          <div className="card">
            <p className="kicker">Pro</p>
            <p className="h2">$299 / month</p>
            <p className="p">For high-volume lead pipelines.</p>
            <ul style={{ margin: "10px 0 0 18px" }}>
              <li>Everything in Growth</li>
              <li>Priority support</li>
              <li>Custom workflows</li>
            </ul>
            <div style={{ marginTop: 12 }}>
              <a className="button primary" style={{ width: "100%" }} href="/app/signup?plan=pro">
                Choose plan
              </a>
            </div>
          </div>
        </section>

        <section id="demo" className="card section">
          <p className="kicker">Request a demo</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
            <div>
              <p className="h2">See Looply on your leads</p>
              <p className="p">
                Tell us what kind of leads you get and how you follow up today — we’ll show you how Looply can recover more
                of them with instant replies and smart sequences.
              </p>
              <p className="small" style={{ marginTop: 10 }}>
                Or email us directly at <a href="mailto:support@looplycrm.com">support@looplycrm.com</a>.
              </p>
            </div>

            <div className="card" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
              <LeadForm />
            </div>
          </div>
        </section>

        <section className="card section">
          <p className="kicker">Ready?</p>
          <p className="h2">Stop losing leads today</p>
          <p className="p">
            You already pay for leads. Looply helps you actually convert them.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <a className="button primary" href={startTrialUrl}>
              Start Free Trial
            </a>
            <a className="button" href="/terms-and-conditions">Terms</a>
            <a className="button" href="/privacy-policy">Privacy</a>
            <a className="button" href="/refund-policy">Refunds</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>© {new Date().getFullYear()} Looply</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/terms-and-conditions">Terms</a>
          <a href="/privacy-policy">Privacy</a>
          <a href="/refund-policy">Refund Policy</a>
          <a href="mailto:support@looplycrm.com">support@looplycrm.com</a>
        </div>
      </footer>
    </>
  );
}

