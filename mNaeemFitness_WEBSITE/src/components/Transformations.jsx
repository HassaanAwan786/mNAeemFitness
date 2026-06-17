import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const transformations = [
  {
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070",
    name: "Ahmad R.",
    result: "-22kg | 16 Weeks"
  },
  {
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070",
    name: "Bilal K.",
    result: "+12kg Muscle | 24 Weeks"
  },
  {
    img: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070",
    name: "Usman T.",
    result: "Competition Ready | 20 Weeks"
  },
  {
    img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069",
    name: "Hamza M.",
    result: "Body Recomp | 12 Weeks"
  }
];

export default function Transformations() {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".transform-card", {
        scrollTrigger: {
          trigger: ".transformations-grid",
          start: "top 80%"
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="results">
      <div className="container">
        <div className="section-header reveal active">
          <div className="section-tag">PROOF OF WORK</div>
          <h2>REAL TRANSFORMATIONS</h2>
          <p>Real clients. Real sacrifice. Real results.</p>
        </div>
        <div className="transformations-grid">
          {transformations.map((client, index) => (
            <div className="transform-card" key={index}>
              <img src={client.img} alt="Client Transformation" />
              <div className="transform-overlay">
                <h4>{client.name}</h4>
                <p>{client.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
