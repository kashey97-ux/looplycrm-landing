export default function NotSpam() {
  return (
    <section id="not-spam" className="card section">
      <p className="kicker">Not spam</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Follow‑ups that stay respectful and controlled</h2>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">Opt out</p>
          <p className="p">Leads can reply STOP to opt out (and OPTED_OUT stops everything).</p>
        </div>
        <div className="card">
          <p className="kicker">Auto‑stop</p>
          <p className="p">When sales marks an outcome, Looply stops lead messages and sales reminders instantly.</p>
        </div>
        <div className="card">
          <p className="kicker">Guardrails</p>
          <p className="p">Quiet hours, rate limits, and clear status control to prevent over‑messaging.</p>
        </div>
      </div>
    </section>
  );
}

