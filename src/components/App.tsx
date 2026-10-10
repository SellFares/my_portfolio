import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import RevealObserver from "./ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";

export default function App() {
  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
