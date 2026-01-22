import Hero from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import OutcomesStop from "./components/landing/OutcomesStop";
import LeadTolerance from "./components/landing/LeadTolerance";
import Pricing from "./components/landing/Pricing";
import FAQ from "./components/landing/FAQ";
import Footer from "./components/landing/Footer";

export default function Home() {
  const getDemoUrl = "#demo";

  return (
    <>
      <header className="nav">
        <div className="logo">
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.85)" }} />
          <span>Looply</span>
          <span className="pill">First-contact conversion + Auto-Stop</span>
        </div>

        <nav className="navlinks">
          <a href="#how">How it works</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="navlinks">
          <a className="button" href="/app/login">Log in</a>
          <a className="button primary" href="/app/signup">Start trial</a>
        </div>
      </header>

      <main>
        <Hero />
        <HowItWorks />
        <OutcomesStop />
        <LeadTolerance />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}

