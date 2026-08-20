import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dumbbell, ShieldAlert, Award, Sparkles } from "lucide-react";

interface PoseInfo {
  title: string;
  subtitle: string;
  quote: string;
  stats: { label: string; value: string }[];
  image: string;
}

const POSES: PoseInfo[] = [
  {
    title: "SYMMETRY & DEDICATION",
    subtitle: "Front Double Biceps",
    quote: "The iron never lies to you. You can walk outside and listen to all kinds of talk, but 200 pounds is always 200 pounds.",
    stats: [
      { label: "Target Area", value: "Biceps, Lats & Quads" },
      { label: "Focus Key", value: "Peak contraction & Width" },
      { label: "Mindset", value: "Absolute focus" }
    ],
    image: "/src/assets/images/pose_biceps_1782785833029.jpg"
  },
  {
    title: "POWER & VOLUME",
    subtitle: "Side Chest Pose",
    quote: "No citizen has a right to be an amateur in the matter of physical training. What a disgrace it is for a man to grow old without seeing the beauty and strength of which his body is capable.",
    stats: [
      { label: "Target Area", value: "Pectorals & Hamstrings" },
      { label: "Focus Key", value: "Thick expansion & Arch" },
      { label: "Mindset", value: "Maximum density" }
    ],
    image: "/src/assets/images/pose_chest_1782785856122.jpg"
  },
  {
    title: "DOMINANCE & WIDTH",
    subtitle: "Back Lat Spread",
    quote: "When you have a well-developed back, people notice you before you even turn around. Width commands respect. Symmetry defines perfection.",
    stats: [
      { label: "Target Area", value: "Lats, Rhomboids & Calves" },
      { label: "Focus Key", value: "V-Taper flare & Detail" },
      { label: "Mindset", value: "Dominant presence" }
    ],
    image: "/src/assets/images/pose_back_1782785877091.jpg"
  },
  {
    title: "PURE ESTHETICS",
    subtitle: "Most Muscular",
    quote: "Success isn't always about greatness. It's about consistency. Consistent hard work gains success. Greatness will come.",
    stats: [
      { label: "Target Area", value: "Trapezius, Deltoids & Abs" },
      { label: "Focus Key", value: "Striations & Vascularity" },
      { label: "Mindset", value: "Unbreakable will" }
    ],
    image: "/src/assets/images/pose_muscular_1782785889076.jpg"
  }
];

export default function BodybuilderScroll3D() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle subtle 3D parallax on mouse move inside the card
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const scrollY = -rect.top;
      
      // We divide the container into sections
      const sectionHeight = containerHeight / POSES.length;
      let currentSection = Math.floor(scrollY / sectionHeight);
      currentSection = Math.max(0, Math.min(POSES.length - 1, currentSection));
      setActiveIdx(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      id="3d-pose-experience"
      className="relative w-full bg-brand-obsidian py-12 md:py-24 border-y border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/30 px-3 py-1 rounded-full text-brand-amber text-xs font-mono mb-4"
          >
            <Sparkles size={12} className="animate-pulse" />
            3D PERSPECTIVE BODY SCULPTING
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-none"
          >
            SCULPT YOUR <span className="text-brand-amber text-glow-amber">VISION</span>
          </motion.h2>
          <p className="mt-4 text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-sans">
            Scroll down to rotate through our master bodybuilder frames. Experience the sheer alignment of form, volume, and absolute power.
          </p>
        </div>

        {/* Dynamic Interactive Layout */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Panel: Pose Details */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center space-y-6 md:space-y-8 z-10 Order-last lg:order-first">
            <div className="flex gap-2">
              {POSES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const el = document.getElementById(`pose-anchor-${idx}`);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    } else {
                      setActiveIdx(idx);
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIdx ? "w-10 bg-brand-amber" : "w-3 bg-zinc-700 hover:bg-zinc-500"
                  }`}
                  aria-label={`Go to pose ${idx + 1}`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xs font-mono text-brand-amber tracking-widest uppercase">
                    {POSES[activeIdx].subtitle}
                  </h3>
                  <h4 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white leading-tight">
                    {POSES[activeIdx].title}
                  </h4>
                </div>

                <div className="relative pl-6 border-l-2 border-brand-amber/50 py-1">
                  <p className="text-zinc-300 italic text-sm md:text-base leading-relaxed">
                    &ldquo;{POSES[activeIdx].quote}&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-mono text-zinc-500">— COACH MNAEEM</p>
                </div>

                {/* Performance stats layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80">
                  {POSES[activeIdx].stats.map((stat, sIdx) => (
                    <div key={sIdx} className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                      <div className="text-xs text-zinc-500 font-sans">{stat.label}</div>
                      <div className="text-sm font-semibold text-white font-display mt-1">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <a
                    href="#membership-section"
                    className="inline-flex items-center gap-2 bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian font-display font-extrabold text-sm px-6 py-3 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg shadow-brand-amber/10 hover:shadow-brand-amber/20"
                  >
                    <Dumbbell size={16} />
                    START YOUR METAMORPHOSIS
                  </a>
                  <a
                    href="#trainer-chat-section"
                    className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-sm px-6 py-3 rounded-md border border-zinc-700 hover:border-zinc-600 transition-all duration-200"
                  >
                    CONSULT MNAEEM
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Panel: Interactive 3D Perspective Card Viewer */}
          <div className="col-span-1 lg:col-span-7 flex justify-center items-center h-[350px] sm:h-[450px] md:h-[550px] perspective-1000">
            <motion.div
              style={{
                rotateY: mousePos.x * 35, // Responsive 3D tilt
                rotateX: -mousePos.y * 35,
                translateZ: 60,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 25 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] h-full bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 transform-style-3d glow-box-amber"
            >
              {/* Corner Sci-Fi Styling Elements to accent the 3D grid layout */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-brand-amber rounded-tl z-20"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-brand-amber rounded-tr z-20"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-brand-amber rounded-bl z-20"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-brand-amber rounded-br z-20"></div>

              {/* Glowing Amber Overlay Strip */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-brand-obsidian/40 pointer-events-none z-10" />

              {/* AnimatePose transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 0.95, rotateY: 45 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotateY: -45 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={POSES[activeIdx].image}
                    alt={POSES[activeIdx].subtitle}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Title overlay floating on image with 3D depth */}
                  <div 
                    style={{ transform: "translateZ(30px)" }}
                    className="absolute bottom-8 left-6 right-6 p-4 rounded-xl bg-brand-obsidian/85 backdrop-blur-md border border-zinc-800/80 z-20"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-mono text-brand-amber tracking-widest uppercase">
                          ACTIVE SCAN
                        </div>
                        <div className="text-lg font-display font-extrabold text-white">
                          {POSES[activeIdx].subtitle}
                        </div>
                      </div>
                      <div className="bg-brand-amber/15 text-brand-amber p-1.5 rounded-full border border-brand-amber/30">
                        <Award size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Scroll Helper Elements to guide user interaction */}
        <div className="mt-16 text-center text-zinc-600 text-xs font-mono tracking-widest flex items-center justify-center gap-4">
          <span>01 / PREP STATE</span>
          <div className="w-16 h-px bg-zinc-800"></div>
          <span className="text-brand-amber">02 / INTERACTIVE SHADOWS</span>
          <div className="w-16 h-px bg-zinc-800"></div>
          <span>03 / FINAL FORM</span>
        </div>
      </div>

      {/* Invisible anchor tags distributed vertically inside the parent container 
          to let users click navigation bullets and easily align the page scroll */}
      <div className="absolute top-0 w-full h-full pointer-events-none flex flex-col justify-between">
        {POSES.map((_, idx) => (
          <div key={idx} id={`pose-anchor-${idx}`} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
