export default function PrivacyPolicy() {
  const lastUpdated = "January 13, 2026";
  const supportEmail = "support@looplycrm.com";
  const company = "Looply (LooplyCRM)";

  return (
    <div className="card legal">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a className="button" href="/">Back to Home</a>
      </div>

      <p className="pill">Privacy Policy</p>
      <h1>Privacy Policy</h1>
      <p className="small">Last updated: {lastUpdated}</p>

      <p>
        This Privacy Policy explains how {company} ("we", "us") collects, uses, and protects information when you use our
        website and services ("Service").
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><b>Account info:</b> name, email, password hash, organization details.</li>
        <li><b>Lead data:</b> lead name, phone, email, message, source, and related notes you store in the Service.</li>
        <li><b>Usage data:</b> pages viewed, actions taken, logs, and diagnostic data.</li>
        <li><b>Payment data:</b> handled by our payment partner (e.g., Paddle). We do not store full card details.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>Provide, maintain, and improve the Service.</li>
        <li>Operate follow-up messages you configure (email/messaging).</li>
        <li>Customer support, security, fraud prevention, and compliance.</li>
        <li>Billing and subscription management via payment providers.</li>
      </ul>

      <h2>3. Sharing</h2>
      <p>
        We may share information with service providers (hosting, analytics, email/messaging, payments) strictly to operate
        the Service. We do not sell personal data.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain data for as long as your account is active or as needed to provide the Service and comply with legal
        obligations. You may request deletion subject to applicable requirements.
      </p>

      <h2>5. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect data. However, no system is 100% secure.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We may use cookies or similar technologies for authentication and analytics. You can control cookies through your browser settings.
      </p>

      <h2>7. International Users</h2>
      <p>
        If you access the Service from outside the country where we operate, your data may be processed in other jurisdictions.
      </p>

      <h2>8. Contact</h2>
      <p>
        Privacy questions? Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
      </p>

      <p className="small" style={{ marginTop: 18 }}>
        Note: Once you finalize your legal entity + address, add them here (Paddle sometimes prefers seeing it).
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
        <a className="button" href="/">Back to Home</a>
      </div>
    </div>
  );
}
