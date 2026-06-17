import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const poses = [
  {
    index: 0,
    img: "/frontpage.jpeg",
    alt: "Front Pose",
    badge: "POSE 01/06 · FRONT CLASSIC",
    title: "FRONT PROPORTION",
    desc: "The foundation of aesthetic symmetry. Maintaining a tight vacuum midsection while showcasing quad sweep and shoulder width.",
    metrics: [
      { name: "SYMMETRY RATING", val: "98%" },
      { name: "VACUUM DEPTH", val: "94%" },
      { name: "CHEST EXPANSION", val: "96%" }
    ],
    quote: "Focus on expanding the ribcage from the solar plexus. Keep the abdominal wall pulled in completely."
  },
  {
    index: 1,
    img: "/straight_back_pose.jpg",
    alt: "Straight Back Pose",
    badge: "POSE 02/06 · BACK SETUP",
    title: "LAT TRANSITION",
    desc: "Setting up the posterior silhouette. Preparing the shoulder girdle and engaging the lower body base before full expansion.",
    metrics: [
      { name: "LAT WIDTH", val: "85%" },
      { name: "SCAPULAR FLARE", val: "88%" },
      { name: "SPINE ERECTOR ENGAGEMENT", val: "90%" }
    ],
    quote: "Do not squeeze the scapulae together yet. Keep the shoulders low and begin flaring the outer margins of the lats."
  },
  {
    index: 2,
    img: "/fullback.jpeg",
    alt: "Full Back Pose",
    badge: "POSE 03/06 · FULL BACK SHOT",
    title: "POSTERIOR CHAIN",
    desc: "A full-length examination of posterior symmetry. Demonstrating the connection between lower body conditioning and upper body width.",
    metrics: [
      { name: "GLUTE-HAM TIE-IN", val: "89%" },
      { name: "CALF SYMMETRY", val: "92%" },
      { name: "V-TAPER PROJECTION", val: "95%" }
    ],
    quote: "Drive the weight through your heels. Contract the hamstrings and flex the calves to anchor the entire pose."
  },
  {
    index: 3,
    img: "/back_pose.jpg",
    alt: "Back Double Biceps",
    badge: "POSE 04/06 · DOUBLE BICEPS",
    title: "REAR DOUBLE BICEPS",
    desc: "The ultimate show of upper back density and bicep peaks. Every single muscle group in the posterior chain must fire simultaneously.",
    metrics: [
      { name: "BICEP PEAK HEIGHT", val: "99%" },
      { name: "UPPER BACK DENSITY", val: "97%" },
      { name: "DELTOID ROUNDNESS", val: "95%" }
    ],
    quote: "Pull the elbows slightly forward, supinating the wrists. Squeeze the traps and infraspinatus to pop the back detail."
  },
  {
    index: 4,
    img: "/backleanPose.jpeg",
    alt: "Back Lean Flex",
    badge: "POSE 05/06 · BACK LEAN FLEX",
    title: "CHRISTMAS TREE ENGAGEMENT",
    desc: "Leaning back to flex the lower back and lower lat attachments. Showcases deep striations and thickness of the erector spinae.",
    metrics: [
      { name: "LOWER BACK DENSITY", val: "94%" },
      { name: "TERES MAJOR STRIATION", val: "91%" },
      { name: "RHOMBOID DEPTH", val: "93%" }
    ],
    quote: "Lean back slightly to compress the lumbar region. This forces the 'Christmas Tree' detail to emerge under lighting."
  },
  {
    index: 5,
    img: "/back.jpeg",
    alt: "Final Lat Spread",
    badge: "POSE 06/06 · REAR LAT SPREAD",
    title: "MAXIMUM WIDTH",
    desc: "The final climax of the routine. Opening up the lats as wide as possible to block out the light. Demonstrating extreme V-taper.",
    metrics: [
      { name: "LAT SPREAD WIDTH", val: "100%" },
      { name: "WAIST TO SHOULDER RATIO", val: "0.61" },
      { name: "POSTERIOR DELT FLARE", val: "95%" }
    ],
    quote: "Flex the lats out and forward. Keep the shoulders depressed and push the thumbs into the waist to lock the width."
  }
];

export default function PosingMasterclass() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const imgContainerRef = useRef(null);
  

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 901px)").matches;
    const images = gsap.utils.toArray(".posing-img");
    const cards = gsap.utils.toArray(".telemetry-card");
    const numSlides = images.length;
    
    let ctx = gsap.context(() => {
      if (isDesktop && numSlides > 0) {
        // Reset properties in case of window resize re-trigger
        gsap.set(".posing-img", { opacity: 0, x: 0, y: 0, z: 0, rotationY: 0 });
        gsap.set(".posing-img[data-index='0']", { opacity: 1 });
        gsap.set(".telemetry-card", { opacity: 0, y: 0, pointerEvents: "none" });
        gsap.set(".telemetry-card[data-index='0']", { opacity: 1, pointerEvents: "all" });

        // Setup main pinned scrollytelling timeline
        const poseTl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            pin: containerRef.current,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const idx = Math.min(
                Math.floor(progress * numSlides),
                numSlides - 1
              );
              setActiveIdx(idx);
            }
          }
        });

        // Scrub transitions
        images.forEach((img, i) => {
          if (i === 0) return;

          const prevImg = images[i - 1];
          const prevCard = cards[i - 1];
          const currCard = cards[i];
          const startAt = (i - 1) / (numSlides - 1);

          poseTl.to(prevImg, {
            opacity: 0,
            x: -80,
            z: -150,
            rotationY: -25,
            duration: 0.35,
            onStart: () => prevImg.classList.remove("active"),
            onReverseComplete: () => prevImg.classList.add("active")
          }, startAt)
          .to(prevCard, {
            opacity: 0,
            y: -30,
            pointerEvents: "none",
            duration: 0.25,
            onStart: () => prevCard.classList.remove("active"),
            onReverseComplete: () => prevCard.classList.add("active")
          }, startAt)
          .fromTo(img, {
            opacity: 0,
            x: 80,
            z: -150,
            rotationY: 25
          }, {
            opacity: 1,
            x: 0,
            z: 0,
            rotationY: 0,
            duration: 0.35,
            onStart: () => img.classList.add("active"),
            onReverseComplete: () => img.classList.remove("active")
          }, startAt + 0.05)
          .fromTo(currCard, {
            opacity: 0,
            y: 30,
            pointerEvents: "none"
          }, {
            opacity: 1,
            y: 0,
            pointerEvents: "all",
            duration: 0.25,
            onStart: () => currCard.classList.add("active"),
            onReverseComplete: () => currCard.classList.remove("active")
          }, startAt + 0.1);
        });
      } else if (!isDesktop && numSlides > 0) {
        // Mobile transitions: toggle active states as cards scroll
        cards.forEach((card, idx) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 65%",
            end: "bottom 65%",
            onToggle: (self) => {
              if (self.isActive) {
                setActiveIdx(idx);
                images.forEach((img, i) => {
                  if (i === idx) {
                    img.classList.add("active");
                    gsap.to(img, { opacity: 1, scale: 1, duration: 0.4 });
                  } else {
                    img.classList.remove("active");
                    gsap.to(img, { opacity: 0, scale: 0.95, duration: 0.4 });
                  }
                });
                cards.forEach((c, i) => {
                  if (i === idx) c.classList.add("active");
                  else c.classList.remove("active");
                });
              }
            }
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // 3D tilt interaction on mouse move
  const handleMouseMove = (e) => {
    const chamber = e.currentTarget;
    const rect = chamber.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = -(y / (rect.height / 2)) * 18;
    const rotateY = (x / (rect.width / 2)) * 18;
    
    gsap.to(imgContainerRef.current, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3,
      ease: "power2.out"
    });
    
    const totalAngle = Math.round(Math.sqrt(rotateX * rotateX + rotateY * rotateY));
    setRotationAngle(totalAngle);
  };

  const handleMouseLeave = () => {
    gsap.to(imgContainerRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "power2.out"
    });
    setRotationAngle(0);
  };

  return (
    <section id="posing-masterclass" ref={triggerRef}>
      <div className="posing-container" ref={containerRef}>
        <div className="hologram-bg-grid"></div>
        <div className="hologram-glow"></div>
        
        <div className="posing-grid">
          {/* Left side: Hologram Chamber */}
          <div className="hologram-viewport-wrapper">
            <div className="hologram-corner tl"></div>
            <div className="hologram-corner tr"></div>
            <div className="hologram-corner bl"></div>
            <div className="hologram-corner br"></div>
            
            <div 
              className="hologram-viewport" 
              id="hologramChamber"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="hologram-perspective-grid"></div>
              
              <div className="hologram-img-container" ref={imgContainerRef}>
                {poses.map((pose) => (
                  <img
                    key={pose.index}
                    src={pose.img}
                    alt={pose.alt}
                    data-index={pose.index}
                    className={`posing-img ${activeIdx === pose.index ? "active" : ""}`}
                  />
                ))}
              </div>
              
              <div className="scanlines"></div>
              <div className="hologram-scanner-line"></div>
            </div>
            
            <div className="hologram-telemetry-overlay">
              <div className="telemetry-item">POSING SIMULATOR v1.0</div>
              <div className="telemetry-item tracker-3d">
                3D ROTATION: <span>{rotationAngle}°</span>
              </div>
            </div>
          </div>
          
          {/* Right side: Technical Telemetry & Coaching Tips */}
          <div className="telemetry-panel">
            <div className="section-tag">Anatomy & Symmetry</div>
            <h2 className="telemetry-title">Arnold Masterclass</h2>
            <p className="telemetry-subtitle">Scroll to scrub posing dynamics</p>
            
            <div className="telemetry-cards-container">
              {poses.map((pose) => (
                <div
                  key={pose.index}
                  data-index={pose.index}
                  className={`telemetry-card ${activeIdx === pose.index ? "active" : ""}`}
                >
                  <div className="tech-badge">{pose.badge}</div>
                  <h3>{pose.title}</h3>
                  <p className="tech-desc">{pose.desc}</p>
                  <div className="metrics-list">
                    {pose.metrics.map((metric, mIdx) => (
                      <div className="metric-item" key={mIdx}>
                        <div className="metric-info">
                          <span>{metric.name}</span>
                          <span>{metric.val}</span>
                        </div>
                        <div className="metric-bar">
                          <div
                            className="metric-progress"
                            style={{ "--val": metric.val }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="coaching-quote">
                    <i className="fas fa-quote-left"></i>
                    <span>"{pose.quote}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
