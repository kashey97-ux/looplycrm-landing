export default function TermsAndConditions() {
  const lastUpdated = "January 21, 2026";
  const supportEmail = "support@looplycrm.com";
  const sellerName = "Vladimir Belyaev";

  return (
    <div className="card legal">
      <div className="btnRow">
        <a className="button" href="/">Back to Home</a>
      </div>

      <p className="pill">Terms and Conditions</p>
      <h1>Terms and Conditions</h1>
      <p className="small">Last updated: {lastUpdated}</p>

      <p>
        These Terms and Conditions ("Terms") govern your access to and use of the Looply software service ("Looply", "we",
        "us", or "our"). Looply is a software service operated by {sellerName}, an individual seller, operating under the
        trade name "Looply". By accessing or using Looply, you agree to be bound by these Terms.
      </p>

      <h2>1. Service</h2>
      <p>
        Looply provides tools to manage inbound leads and automate follow-ups through supported channels (e.g., email,
        messaging integrations). Features may change over time as we improve the product.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for all activity under
        your account. You agree to provide accurate information and keep it up to date.
      </p>

      <h2>3. Subscriptions & Billing</h2>
      <p>
        The Service is offered on a subscription basis. Payments and subscriptions are processed by our payment partner,
        Paddle, who acts as the Merchant of Record. By subscribing, you authorize recurring charges according to your plan
        until you cancel.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Send unlawful, harmful, or spam messages.</li>
        <li>Violate applicable laws or third-party rights.</li>
        <li>Attempt to disrupt or compromise the Service or its security.</li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <p>
        The Service may integrate with third-party providers (email, messaging, analytics, payments). Your use of such
        services is subject to their terms. We are not responsible for third-party outages or policy enforcement.
      </p>

      <h2>6. No Guarantees</h2>
      <p>
        We do not guarantee increased revenue, conversion rates, or business outcomes. The Service is provided "as is"
        and "as available."
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Looply shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
      </p>

      <h2>8. Termination</h2>
      <p>
        You may cancel your subscription at any time. We may suspend or terminate access if you violate these Terms or
        misuse the Service.
      </p>

      <h2>9. Refunds</h2>
      <p>
        Refunds are described in our{" "}
        <a href="/refund-policy" style={{ textDecoration: "underline" }}>
          Refund Policy
        </a>
        .
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. The updated version will be posted on this page with a new effective
        date.
      </p>

      <h2>11. Contact</h2>
      <p>
        If you have any questions about these Terms, please contact Looply at{" "}
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>. Seller: {sellerName}.
      </p>

      <div className="btnRow" style={{ marginTop: 18 }}>
        <a className="button" href="/">Back to Home</a>
      </div>
    </div>
  );
}
