export default function Refunds() {
  const effective = "January 13, 2026";
  const supportEmail = "support@looplycrm.com";
  const company = "Looply (LooplyCRM)";

  return (
    <div className="card legal">
      <p className="pill">Refund Policy</p>
      <h1>Refund Policy</h1>
      <p className="small">Effective date: {effective}</p>

      <p>
        {company} is a digital subscription service. This policy explains when refunds may be issued.
      </p>

      <h2>1. 7-Day Refund Window</h2>
      <p>
        If you are not satisfied, you may request a refund within <b>7 days</b> of your initial purchase, provided the Service
        was not materially used (e.g., no significant lead processing or automation runs).
      </p>

      <h2>2. Subscription Renewals</h2>
      <p>
        Recurring subscription charges are generally non-refundable once a billing period begins. You can cancel anytime to
        prevent future renewals.
      </p>

      <h2>3. How to Request a Refund</h2>
      <p>
        Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a> with your account email and reason. If eligible, we will
        process the refund via our payment provider.
      </p>

      <h2>4. Exceptions</h2>
      <p>
        We may decline refund requests in cases of abuse, excessive use within the refund window, or violations of our Terms.
      </p>

      <p className="small" style={{ marginTop: 18 }}>
        Note: Paddle may handle the refund mechanics; this page satisfies the required refund policy link.
      </p>
    </div>
  );
}

