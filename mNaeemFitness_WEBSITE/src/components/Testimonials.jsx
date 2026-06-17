import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    stars: "★★★★★",
    text: "Coach Naeem didn't just transform my body — he rewired my mindset. From 95kg to competition-ready in 20 weeks. The discipline he instilled stays with me for life.",
    avatar: "AK",
    name: "Arham Khan",
    info: "IFBB Amateur · Lahore"
  },
  {
    stars: "★★★★★",
    text: "I tried 5 coaches before Naeem. None understood the science like he does. His nutrition programming alone changed my entire relationship with food and performance.",
    avatar: "SM",
    name: "Sohail Mirza",
    info: "Online Client · Karachi"
  },
  {
    stars: "★★★★★",
    text: "Three national championships under his coaching. He sees what others don't. His posing sessions alone saved me from my biggest weakness. A true master.",
    avatar: "FA",
    name: "Farhan Abbas",
    info: "3× National Champion"
  }
];

export default function Testimonials() {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 80%"
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials">
      <div className="container">
        <div className="section-header reveal active">
          <div className="section-tag">VOICES OF VICTORY</div>
          <h2>WHAT THEY SAY</h2>
          <p>Don't take my word for it — listen to my athletes</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <div className="stars">{t.stars}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.avatar}</div>
                <div className="author-info">
                  <h5>{t.name}</h5>
                  <p>{t.info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
