import React, { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      e.target.reset();
    }, 3000);
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info reveal active">
            <div className="section-tag">READY TO TRANSFORM</div>
            <h3>
              LET'S BUILD<br /><span style={{ color: "var(--red)" }}>TOGETHER</span>
            </h3>
            <p>
              Whether you're chasing a championship stage or the best version of
              yourself — the journey starts with one message. No egos. Just iron
              and results.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fab fa-whatsapp"></i>
                <span>+92 300 1234567</span>
              </div>
              <div className="contact-item">
                <i className="far fa-envelope"></i>
                <span>naeem@mnaeemfitness.com</span>
              </div>
              <div className="contact-item">
                <i className="fab fa-instagram"></i>
                <span>@mnaeem_fitness</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>MNAEEM FITNESS, Mirpur, AJK</span>
              </div>
            </div>
          </div>
          <div className="contact-form reveal active">
            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" placeholder="YOUR NAME" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="EMAIL ADDRESS" required />
              </div>
              <div className="form-group">
                <select defaultValue="1-on-1 Personal Training">
                  <option>1-on-1 Personal Training</option>
                  <option>Online Coaching</option>
                  <option>Competition Prep</option>
                  <option>Nutrition Planning</option>
                  <option>Transformation Program</option>
                  <option>VIP Mentorship</option>
                </select>
              </div>
              <div className="form-group">
                <textarea
                  placeholder="YOUR GOAL — tell me about your current fitness level and what you want to achieve"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  width: "100%", 
                  background: sent ? "#2d6a4f" : "var(--red)" 
                }}
              >
                {sent ? "✓ MESSAGE SENT" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
