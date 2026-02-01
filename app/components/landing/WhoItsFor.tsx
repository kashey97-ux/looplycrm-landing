export default function WhoItsFor() {
  return (
    <section id="who" className="card section">
      <p className="kicker">Who it's for</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Home service teams that live on inbound leads</h2>
      <p className="p">
        Built for owner-operators and small sales teams that need faster first contact without extra tools or noise.
      </p>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">Roofing</p>
          <p className="p">Keep calls and follow-ups tight during storm surges.</p>
        </div>
        <div className="card">
          <p className="kicker">HVAC</p>
          <p className="p">Respond fast when comfort is urgent and schedules shift.</p>
        </div>
        <div className="card">
          <p className="kicker">Plumbing</p>
          <p className="p">Get to first contact quickly and stop messaging after the outcome.</p>
        </div>
      </div>
    </section>
  );
}
