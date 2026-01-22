export default function ABTesting() {
  return (
    <section id="ab" className="card section">
      <p className="kicker">A/B testing & conversions</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Test messages. Learn what books. Ship winners.</h2>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <p className="kicker">What we test</p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Text and tone (friendly vs direct)</li>
            <li>CTA (“pick a time” vs “reply yes”)</li>
            <li>Timing and cadence</li>
            <li>First message vs follow‑ups</li>
          </ul>
        </div>

        <div className="card">
          <p className="kicker">Success signals</p>
          <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
            <li>Reply rate</li>
            <li>CONTACTED rate</li>
            <li>BOOKED rate</li>
          </ul>
        </div>

        <div className="card">
          <p className="kicker">Reporting</p>
          <p className="p">
            Every lead has a timeline, every outcome is tracked, and you can see which messages move leads to first contact
            and bookings.
          </p>
        </div>
      </div>
    </section>
  );
}

