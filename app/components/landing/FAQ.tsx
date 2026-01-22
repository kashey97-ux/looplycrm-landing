const FAQS = [
  {
    q: "Why message the lead?",
    a: "To speed up first contact. Short, polite nudges help the lead reply or pick a time while the rep is busy.",
  },
  {
    q: "Will this annoy people?",
    a: "No. Auto-Stop ends all messages when an outcome is set, plus quiet hours and rate limits keep it respectful.",
  },
  {
    q: "How do I stop messages?",
    a: "Set an outcome (CONTACTED / BOOKED / LOST / OPTED_OUT). Everything stops instantly for the lead and the rep.",
  },
  {
    q: "How are replies detected?",
    a: "Replies are captured in the connected channel and shown in the timeline. You can mark the outcome right away.",
  },
  {
    q: "What if I already have a CRM?",
    a: "Looply works alongside your CRM. It handles the first-contact window and Auto-Stop, without replacing your stack.",
  },
  {
    q: "Which channels are supported?",
    a: "Email is supported. SMS can be enabled via integrations such as Twilio.",
  },
  {
    q: "Quiet hours and rate limits?",
    a: "Yes. You can set quiet hours and pacing so messages never feel pushy.",
  },
] as const;

export default function FAQ() {
  return (
    <section id="faq" className="card section">
      <p className="kicker">FAQ</p>
      <h2 className="h2" style={{ marginTop: 10 }}>Short answers to common questions</h2>

      <div style={{ marginTop: 12 }}>
        {FAQS.map((x) => (
          <details key={x.q} className="faqItem">
            <summary>{x.q}</summary>
            <div className="faqBody">
              <p className="p">{x.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

