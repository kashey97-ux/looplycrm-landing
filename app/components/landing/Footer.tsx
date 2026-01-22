export default function Footer() {
  return (
    <>
      <section className="card section" id="waitlist">
        <p className="kicker">Join the waitlist</p>
        <h2 className="h2" style={{ marginTop: 10 }}>Want early access?</h2>
        <p className="p">Join the waitlist and we’ll reach out when your workflow is supported.</p>

        <div className="btnRow" style={{ marginTop: 12 }}>
          <a className="button primary" href="#demo">Get a demo</a>
          <a className="button" href="mailto:support@looplycrm.com?subject=Looply%20Waitlist">Email support</a>
        </div>
      </section>

      <footer className="footer">
        <div>© {new Date().getFullYear()} Looply</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/terms-and-conditions">Terms</a>
          <a href="/privacy-policy">Privacy</a>
          <a href="/refund-policy">Refund Policy</a>
          <a href="mailto:support@looplycrm.com">support@looplycrm.com</a>
        </div>
      </footer>
    </>
  );
}

