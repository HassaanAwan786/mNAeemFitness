import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const servicesList = [
  {
    icon: "fa-dumbbell",
    title: "1-on-1 Personal Training",
    desc: "In-gym sessions at my facility. Every rep coached in real-time. Maximum accountability, maximum results.",
    price: "PKR 15,000",
    unit: "/month"
  },
  {
    icon: "fa-laptop",
    title: "Online Coaching",
    desc: "World-class coaching delivered globally. Custom programs, nutrition plans, weekly video check-ins.",
    price: "PKR 8,000",
    unit: "/month"
  },
  {
    icon: "fa-trophy",
    title: "Competition Prep",
    desc: "Stage-ready in 16-24 weeks. Peak week mastery, posing, and psychological preparation for champions.",
    price: "PKR 25,000",
    unit: "/package"
  },
  {
    icon: "fa-apple-alt",
    title: "Nutrition Planning",
    desc: "Precision macro protocols for cutting, bulking, and recomposition. Science-driven, results-proven.",
    price: "PKR 5,000",
    unit: "/month"
  },
  {
    icon: "fa-chart-line",
    title: "Transformation Program",
    desc: "12-week total body overhaul. From beginner to athlete. Guaranteed visible results.",
    price: "PKR 20,000",
    unit: "/12 weeks"
  },
  {
    icon: "fa-crown",
    title: "VIP Mentorship",
    desc: "Direct access, unlimited communication, lifetime programming. The complete M Naeem experience.",
    price: "PKR 40,000",
    unit: "/month"
  }
];

export default function Services() {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="services">
      <div className="container">
        <div className="section-header reveal active">
          <div className="section-tag">WHAT I OFFER</div>
          <h2>ELITE PROGRAMS</h2>
          <p>Choose the path that matches your ambition</p>
        </div>
        <div className="services-grid">
          {servicesList.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">
                <i className={`fas ${service.icon}`}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="service-price">
                {service.price}
                <span>{service.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
