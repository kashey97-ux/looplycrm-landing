import Hero from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import OutcomesStop from "./components/landing/OutcomesStop";
import NotSpam from "./components/landing/NotSpam";
import ABTesting from "./components/landing/ABTesting";
import ForSalesTeams from "./components/landing/ForSalesTeams";
import SocialProof from "./components/landing/SocialProof";
import Pricing from "./components/landing/Pricing";
import FAQ from "./components/landing/FAQ";
import Footer from "./components/landing/Footer";
import DemoForm from "./components/DemoForm";

export default function Home() {
  const getDemoUrl = "#demo";

  return (
    <>
      <header className="nav">
        <div className="logo">
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.85)" }} />
          <span>Looply</span>
          <span className="pill">First‑contact conversion + Auto‑Stop</span>
        </div>

        <nav className="navlinks">
          <a href="#how">How it works</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a className="button primary" href={getDemoUrl}>Get a demo</a>
        </nav>
      </header>

      <main>
        <Hero />
        <HowItWorks />
        <OutcomesStop />
        <NotSpam />
        <ForSalesTeams />
        <ABTesting />
        <SocialProof />
        <Pricing />

        <section id="demo" className="card section">
          <p className="kicker">Request a demo</p>
          <h2 className="h2" style={{ marginTop: 10 }}>We’ll map Looply to your lead flow</h2>
          <p className="p">
            The goal is simple: faster first contact, more booked jobs, and a clean pipeline — with Auto‑Stop control.
          </p>

          <div className="section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card" style={{ background: "rgba(0,0,0,0.18)" }}>
              <p className="kicker">What you’ll see</p>
              <ul style={{ margin: "10px 0 0 18px", color: "rgba(255,255,255,0.70)", lineHeight: 1.7 }}>
                <li>Outcomes and Auto‑Stop in action</li>
                <li>Sales alerts + reminders until handled</li>
                <li>Gentle lead follow‑ups (not spam)</li>
                <li>Conversion reporting and A/B testing</li>
              </ul>
              <p className="small" style={{ marginTop: 12 }}>
                Prefer email? <a href="mailto:support@looplycrm.com" style={{ textDecoration: "underline" }}>support@looplycrm.com</a>
              </p>
            </div>

            <div className="card" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
              <DemoForm intent="demo" />
            </div>
          </div>
        </section>

        <FAQ />
      </main>

      <Footer />
    </>
  );
}

