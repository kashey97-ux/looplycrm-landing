const OUTCOMES = [
  { key: "CONTACTED", desc: "Sales reached the lead. Stop lead messages + stop sales reminders." },
  { key: "BOOKED", desc: "Appointment booked. Stop everything instantly." },
  { key: "LOST", desc: "Not a fit. Stop everything instantly." },
  { key: "OPTED_OUT", desc: "Lead opted out. Stop everything immediately and stay compliant." },
] as const;

export default function OutcomesStop() {
  return (
    <section id="outcomes" className="card section">
      <p className="kicker">Outcomes that stop everything</p>
      <h2 className="h2" style={{ marginTop: 10 }}>One outcome ends all follow‑ups and reminders</h2>
      <p className="p">No more lead messages. No more reminders.</p>

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

