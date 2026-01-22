import DemoForm from "../DemoForm";

export default function Footer() {
  return (
    <>
      <section className="card section" id="demo">
        <p className="kicker">Get a demo</p>
        <h2 className="h2" style={{ marginTop: 10 }}>See first-contact conversion in your flow</h2>
        <p className="p">
          Tell us your lead volume and channels. We’ll show how Auto-Stop keeps follow-ups clean.
        </p>

        <div className="section splitGrid">
          <div className="card" style={{ background: "rgba(0,0,0,0.18)" }}>
            <p className="kicker">What you’ll see</p>
            <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
              <li>Sales reminders and outcome control</li>
              <li>Gentle lead nudges that stop instantly</li>
              <li>Clean outcomes and reporting</li>
            </ul>
            <p className="small" style={{ marginTop: 12 }}>
              Prefer email? <a href="mailto:support@looplycrm.com" style={{ textDecoration: "underline" }}>support@looplycrm.com</a>
            </p>
          </div>

          <div className="card" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
            <DemoForm intent="demo" />
          </div>
        </div>

        <div className="btnRow" style={{ marginTop: 12 }}>
          <a className="button" href="/app/login">Log in</a>
          <a className="button primary" href="/app/signup">Start trial</a>
        </div>
      </section>

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

