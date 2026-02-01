export default function Solution() {
  return (
    <section id="solution" className="card section">
      <p className="kicker">Solution</p>
      <h2 className="h2" style={{ marginTop: 10 }}>A simple system for first contact</h2>
      <p className="p">
        Looply keeps sales focused on the first response and ends all follow-ups the moment a clear outcome is set.
      </p>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">Fast response</p>
          <p className="p">Instant alerts and gentle reminders so reps reach leads quickly.</p>
        </div>
        <div className="card">
          <p className="kicker">Respectful nudges</p>
          <p className="p">Short messages help the lead reply or pick a time.</p>
        </div>
        <div className="card">
          <p className="kicker">Auto-Stop</p>
          <p className="p">Once an outcome is set, all lead messages and reminders stop.</p>
        </div>
      </div>
    </section>
  );
}
