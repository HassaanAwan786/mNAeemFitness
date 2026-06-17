import React from "react";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-header reveal active">
          <div className="section-tag">THE IRON PHILOSOPHY</div>
          <h2>BUILT DIFFERENT</h2>
          <p>
            Muhammad Naeem — Professional bodybuilder, coach, and architect of
            champions
          </p>
        </div>
        <div className="about-grid">
          <div className="about-text reveal active">
            <p>
              I don't just train athletes — I forge them. With over 15 years on
              the competitive stage and countless championship titles, I've
              developed a coaching methodology that combines old-school
              bodybuilding intensity with modern sports science.
            </p>
            <p>
              My clients don't settle for mediocrity. They demand excellence in
              every rep, every meal, every single day. If you're ready to stop
              making excuses and start building the physique you deserve —
              you're in the right place.
            </p>
            <div className="about-features">
              <div className="feature">
                <h4>Science-Based</h4>
                <p>Evidence-backed programming for optimal hypertrophy</p>
              </div>
              <div className="feature">
                <h4>No Nonsense</h4>
                <p>Direct coaching with zero sugar-coating</p>
              </div>
              <div className="feature">
                <h4>Full Support</h4>
                <p>24/7 access to your coach when you need it</p>
              </div>
              <div className="feature">
                <h4>Guaranteed Results</h4>
                <p>Proven systems that deliver every single time</p>
              </div>
            </div>
          </div>
          <div className="about-image reveal active">
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070"
              alt="M Naeem Training"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
