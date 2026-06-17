import React, { useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import PosingMasterclass from "./components/PosingMasterclass";
import Services from "./components/Services";
import Transformations from "./components/Transformations";
import Testimonials from "./components/Testimonials";
import InstagramFeed from "./components/InstagramFeed";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div style={{ 
        visibility: loading ? "hidden" : "visible", 
        height: loading ? "100vh" : "auto", 
        overflow: loading ? "hidden" : "visible" 
      }}>
        <Navbar />
        <Hero />
        <About />
        <PosingMasterclass />
        <Services />
        <Transformations />
        <Testimonials />
        <InstagramFeed />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;
