import type { ReactNode } from "react";

const FAQS: Array<{ q: string; a: ReactNode }> = [
  {
    q: "Why message the lead?",
    a: "To speed up first contact. Short, polite nudges help the lead reply or pick a time while the rep is busy.",
  },
  {
    q: "Is this spam?",
    a: "No. Messages are brief, opt-out is always included, and Auto-Stop ends everything when an outcome is set.",
  },
  {
    q: "How do I stop messages?",
    a: (
      <>
        Reply STOP or set an outcome (CONTACTED / BOOKED / LOST / OPTED_OUT). Everything stops instantly. Manage this in{" "}
        <a href="/app/login" style={{ textDecoration: "underline" }}>the app</a>.
      </>
    ),
  },
  {
    q: "How do inbound replies work?",
    a: "Replies are captured from the connected channel and shown in the lead timeline so you can respond and set the outcome.",
  },
  {
    q: "Can I use my CRM?",
    a: "Yes. Looply runs alongside your CRM to manage first-contact speed and Auto-Stop without replacing your stack.",
  },
  {
    q: "Which channels are supported?",
    a: "Email is supported. SMS can be enabled via integrations such as Twilio.",
  },
  {
    q: "What happens if the lead replies STOP?",
    a: "Looply marks OPTED_OUT and stops all lead messages and reminders immediately.",
  },
  {
    q: "Do you support quiet hours?",
    a: "Yes. Configure quiet hours and pacing so outreach is always respectful.",
  },
];

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

