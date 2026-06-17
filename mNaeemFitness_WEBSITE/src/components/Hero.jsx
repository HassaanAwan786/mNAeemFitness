import React from "react";

export default function Hero() {
  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero">
      <img
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070"
        alt="Gym Background"
        className="hero-bg"
      />
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge reveal active">PROFESSIONAL BODYBUILDER & COACH</div>
          <h1 className="reveal active">
            SCULPT <span>THE</span><br />ULTIMATE<br />BODY
          </h1>
          <p className="hero-desc reveal active">
            15+ years forging champions. Elite coaching for serious athletes who
            demand real results.
          </p>
          <div className="reveal active">
            <a href="#contact" className="btn btn-primary" onClick={handleScrollToContact}>Start Training</a>
          </div>
          <div className="hero-stats reveal active">
            <div className="stat">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat">
              <div className="stat-number">200+</div>
              <div className="stat-label">Athletes Coached</div>
            </div>
            <div className="stat">
              <div className="stat-number">37</div>
              <div className="stat-label">Titles Won</div>
            </div>
          </div>
        </div>

        {/* Interactive 3D Frame for local frontpage.jpeg image */}
        <div className="hero-image-wrapper reveal active">
          <div className="hero-image-frame">
            <div className="hero-image-corner tl"></div>
            <div className="hero-image-corner tr"></div>
            <div className="hero-image-corner bl"></div>
            <div className="hero-image-corner br"></div>
            <img src="/frontpage.jpeg" alt="Arnold Front Pose" />
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>SCROLL</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
