import React from "react";

export default function Footer() {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-logo">M<span>NAEEM</span></div>
        <div className="footer-links">
          <a href="#home" onClick={(e) => handleScroll(e, "home")}>Home</a>
          <a href="#about" onClick={(e) => handleScroll(e, "about")}>About</a>
          <a href="#posing-masterclass" onClick={(e) => handleScroll(e, "posing-masterclass")}>Masterclass</a>
          <a href="#services" onClick={(e) => handleScroll(e, "services")}>Services</a>
          <a href="#results" onClick={(e) => handleScroll(e, "results")}>Results</a>
          <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>Contact</a>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} MNAEEM FITNESS — Elite Bodybuilding Coach. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
