import Hero from "./components/landing/Hero";
import Problem from "./components/landing/Problem";
import Solution from "./components/landing/Solution";
import HowItWorks from "./components/landing/HowItWorks";
import OutcomesStop from "./components/landing/OutcomesStop";
import WhoItsFor from "./components/landing/WhoItsFor";
import Pricing from "./components/landing/Pricing";
import FAQ from "./components/landing/FAQ";
import FinalCTA from "./components/landing/FinalCTA";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="logo">
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.85)" }} />
          <span>Looply</span>
          <span className="pill">First-contact conversion + Auto-Stop</span>
        </div>

        <nav className="navlinks">
          <a href="#problem">Problem</a>
          <a href="#solution">Solution</a>
          <a href="#how">How it works</a>
          <a href="#who">Who it's for</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="navlinks">
          <a className="button" href="/app/login">Login</a>
          <a className="button primary" href="/app/signup">Sign up</a>
        </div>
      </header>

      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <OutcomesStop />
        <WhoItsFor />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}

