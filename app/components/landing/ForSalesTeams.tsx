export default function ForSalesTeams() {
  return (
    <section id="sales" className="card section">
      <p className="kicker">For sales teams</p>
      <h2 className="h2" style={{ marginTop: 10 }}>The rep stays in control — Looply just keeps the process moving</h2>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">Sales reminders</p>
          <p className="p">Instant alert on inbound leads + nudges until the lead has an outcome.</p>
        </div>
        <div className="card">
          <p className="kicker">Lead list + timeline</p>
          <p className="p">All attempts, messages, and replies in one place.</p>
        </div>
        <div className="card">
          <p className="kicker">Fast outcomes</p>
          <p className="p">One-click outcome updates and one-click stop for any lead.</p>
        </div>
      </div>
    </section>
  );
}

