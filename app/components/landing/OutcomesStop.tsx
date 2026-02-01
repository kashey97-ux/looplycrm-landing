const OUTCOMES = [
  { key: "CONTACTED", desc: "Sales reached the lead. Stop lead messages and sales reminders." },
  { key: "BOOKED", desc: "Appointment booked. Stop everything instantly." },
  { key: "LOST", desc: "Not a fit. Stop everything instantly." },
  { key: "OPTED_OUT", desc: "Lead opted out. Stop everything immediately and stay compliant." },
] as const;

export default function OutcomesStop() {
  return (
    <section id="outcomes" className="card section">
      <p className="kicker">Outcomes (Auto-Stop)</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Set one outcome and all follow-ups stop</h2>
      <p className="p">Auto-Stop keeps lead messages and sales reminders clean.</p>

      <div className="grid4" style={{ marginTop: 12 }}>
        {OUTCOMES.map((o) => (
          <div key={o.key} className="card">
            <p className="pill">{o.key}</p>
            <p className="p" style={{ marginTop: 10 }}>{o.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

