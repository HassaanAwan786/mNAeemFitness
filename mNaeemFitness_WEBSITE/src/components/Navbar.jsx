import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileActive(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav style={{ 
      padding: scrolled ? "15px 5%" : "20px 5%", 
      background: scrolled ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.85)" 
    }}>
      <a href="#" className="logo" onClick={(e) => handleLinkClick(e, "home")}>
        M<span>NAEEM</span>
      </a>
      <div className={`nav-links ${mobileActive ? "mobile-nav-active" : ""}`}>
        <a href="#home" onClick={(e) => handleLinkClick(e, "home")}>Home</a>
        <a href="#about" onClick={(e) => handleLinkClick(e, "about")}>About</a>
        <a href="#posing-masterclass" onClick={(e) => handleLinkClick(e, "posing-masterclass")}>Masterclass</a>
        <a href="#services" onClick={(e) => handleLinkClick(e, "services")}>Services</a>
        <a href="#results" onClick={(e) => handleLinkClick(e, "results")}>Results</a>
        <a href="#contact" onClick={(e) => handleLinkClick(e, "contact")}>Contact</a>
      </div>
      <div className="mobile-menu" onClick={() => setMobileActive(!mobileActive)}>
        <i className={`fas ${mobileActive ? "fa-times" : "fa-bars"}`}></i>
      </div>
    </nav>
  );
}
