export default function Footer() {
  return (
    <>
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

