export default function LeadTolerance() {
  return (
    <section id="why" className="card section">
      <p className="kicker">Why leads tolerate it</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Short, respectful nudges until the outcome is set</h2>
      <p className="p">
        The goal is first contact, not spam. Messages sound like your team:
        “We tried calling you — want to pick a time?” Leads can reply, pick a slot, or opt out.
      </p>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">Simple reply</p>
          <p className="p">A quick reply marks CONTACTED and stops all follow-ups.</p>
        </div>
        <div className="card">
          <p className="kicker">Pick a time</p>
          <p className="p">Offer a slot so the lead can book without back-and-forth.</p>
        </div>
        <div className="card">
          <p className="kicker">Opt out</p>
          <p className="p">Reply STOP and everything stops immediately.</p>
        </div>
      </div>
    </section>
  );
}
