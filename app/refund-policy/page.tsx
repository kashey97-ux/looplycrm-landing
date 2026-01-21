export default function RefundPolicy() {
  const lastUpdated = "January 21, 2026";
  const supportEmail = "support@looplycrm.com";

  return (
    <div className="card legal">
      <div className="btnRow">
        <a className="button" href="/">Back to Home</a>
      </div>

      <p className="pill">Refund Policy</p>
      <h1>Refund Policy</h1>
      <p className="small">Last updated: {lastUpdated}</p>

      <p>We offer a full refund within 14 days of the initial purchase.</p>
      <p>
        Refunds are processed to the original payment method via our payment partner, Paddle.
      </p>
      <p>
        To request a refund, contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
      </p>

      <div className="btnRow" style={{ marginTop: 18 }}>
        <a className="button" href="/">Back to Home</a>
      </div>
    </div>
  );
}
