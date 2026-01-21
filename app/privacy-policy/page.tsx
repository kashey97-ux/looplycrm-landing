export default function PrivacyPolicy() {
  const lastUpdated = "January 21, 2026";
  const supportEmail = "support@looplycrm.com";
  const controllerName = "Vladimir Belyaev";

  return (
    <div className="card legal">
      <div className="btnRow">
        <a className="button" href="/">Back to Home</a>
      </div>

      <p className="pill">Privacy Policy</p>
      <h1>Privacy Policy</h1>
      <p className="small">Last updated: {lastUpdated}</p>

      <p>
        This Privacy Policy explains how Looply ("we", "us") collects, uses, and protects information when you use our
        website and services (the "Service").
      </p>

      <h2>1. Data Controller</h2>
      <p>
        The data controller for the purposes of this Privacy Policy is {controllerName}, operating under the trade name
        "Looply". The Service is operated by an individual seller based in Turkey.
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li><b>Account info:</b> name, email, password hash, organization details.</li>
        <li><b>Lead data:</b> lead name, phone, email, message, source, and related notes you store in the Service.</li>
        <li><b>Usage data:</b> pages viewed, actions taken, logs, and diagnostic data.</li>
        <li>
          <b>Payment data:</b> handled exclusively by our payment partner, Paddle, who acts as the Merchant of Record. Looply
          does not store card data.
        </li>
      </ul>

      <h2>3. How We Use Information</h2>
      <ul>
        <li>Provide, maintain, and improve the Service.</li>
        <li>Operate follow-up messages you configure (email/messaging).</li>
        <li>Customer support, security, fraud prevention, and compliance.</li>
        <li>Billing and subscription management via payment providers.</li>
      </ul>

      <h2>4. Sharing</h2>
      <p>
        We may share information with service providers (hosting, analytics, email/messaging, payments) strictly to operate
        the Service. We do not sell personal data.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain data for as long as your account is active or as needed to provide the Service and comply with legal
        obligations. You may request deletion subject to applicable requirements.
      </p>

      <h2>6. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect data. However, no system is 100% secure.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We may use cookies or similar technologies for authentication and analytics. You can control cookies through your browser settings.
      </p>

      <h2>8. International Users</h2>
      <p>
        If you access the Service from outside the country where we operate, your data may be processed in other jurisdictions.
      </p>

      <h2>9. Contact</h2>
      <p>
        Privacy questions? Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>. Data controller: {controllerName}.
      </p>

      <div className="btnRow" style={{ marginTop: 18 }}>
        <a className="button" href="/">Back to Home</a>
      </div>
    </div>
  );
}
