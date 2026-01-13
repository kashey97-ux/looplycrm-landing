export default function RefundPolicy() {
  const lastUpdated = "January 13, 2026";
  const supportEmail = "support@looplycrm.com";

  return (
    <div className="card legal">
      <p className="pill">Refund Policy</p>
      <h1>Refund Policy</h1>
      <p className="small">Last updated: {lastUpdated}</p>

      <p>We offer a full refund within 14 days of the initial purchase.</p>

      <p>
        If you are not satisfied with Looply for any reason, you may request a refund within 14 days of your first payment.
      </p>

      <p>Refunds are processed back to the original payment method.</p>

      <p>
        To request a refund, contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
      </p>
    </div>
  );
}
