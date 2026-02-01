export default function FinalCTA() {
  return (
    <section id="cta" className="card section">
      <p className="kicker">Final CTA</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Start your trial and keep follow-ups clean</h2>
      <p className="p">
        Looply is a focused system for first-contact conversion and respectful Auto-Stop. Simple to set up, easy to run.
      </p>

      <div className="btnRow" style={{ marginTop: 12 }}>
        <a className="button primary" href="/app/signup?plan=starter">Start trial</a>
        <a className="button" href="#how">See how it works</a>
      </div>
      <p className="small" style={{ marginTop: 10 }}>
        Already have an account? <a href="/app/login" style={{ textDecoration: "underline" }}>Log in</a>
      </p>
    </section>
  );
}
