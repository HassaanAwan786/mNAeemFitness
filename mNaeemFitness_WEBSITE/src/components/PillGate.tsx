import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Flame, Eye, ShieldAlert, ArrowRight, Video } from "lucide-react";

interface PillGateProps {
  onEnter: () => void;
}

const TIKTOK_FOR_YOU_URL = "https://www.tiktok.com/foryou";

function redirectToTikTok(tiktokUrl: string) {
  try {
    window.open(tiktokUrl, "_blank", "noopener,noreferrer");
  } catch (err) {
    console.warn("Popup blocked, trying next routing scheme", err);
  }

  try {
    if (window.top) {
      window.top.location.href = tiktokUrl;
    } else {
      window.location.href = tiktokUrl;
    }
  } catch (err) {
    console.warn("Top-level redirection blocked by sandbox, navigating iframe location", err);
    window.location.href = tiktokUrl;
  }
}

export default function PillGate({ onEnter }: PillGateProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [choseBlue, setChoseBlue] = useState(false);

  const handleSelectRedPill = () => {
    if (isExiting || choseBlue) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 800); // Allow exit animations to play out
  };

  const handleSelectBluePill = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setChoseBlue(true);
    redirectToTikTok(TIKTOK_FOR_YOU_URL);
  };

  // Automatically trigger standard browser redirection check if Blue Pill is selected
  useEffect(() => {
    if (choseBlue) {
      const timer = setTimeout(() => {
        try {
          if (window.top) {
            window.top.location.href = TIKTOK_FOR_YOU_URL;
          } else {
            window.location.href = TIKTOK_FOR_YOU_URL;
          }
        } catch {
          // sandbox restriction, click backup is ready
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [choseBlue]);

  // If the user selected the Blue Pill, render a strict lockdown "Comfort Zone Deportation Terminal"
  if (choseBlue) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black text-white flex flex-col justify-between items-center p-6 text-center font-sans selection:bg-blue-500 selection:text-black">
        {/* Dynamic scanning grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-black to-black" />
        </div>

        <div className="my-auto space-y-8 relative z-10 max-w-lg">
          {/* Pulsing blue warning shield */}
          <motion.div 
            animate={{ scale: [1, 1.08, 1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mx-auto w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
          >
            <ShieldAlert size={48} className="animate-pulse" />
          </motion.div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-blue-400 tracking-[0.3em] uppercase block font-black animate-pulse">
              ACCESS REJECTED
            </span>
            <h2 className="text-4xl font-display font-black tracking-tight text-white uppercase italic">
              YOU CHOSE <span className="text-blue-400">COMFORT</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-mono">
              The mNaeem elite training archives are strictly locked. By choosing the path of comfort, you have been routed to the TikTok For You feed.
            </p>
          </div>

          <div className="p-6 bg-blue-950/20 border border-blue-500/20 rounded-2xl space-y-4 shadow-xl">
            <p className="text-xs text-zinc-300 font-mono">
              If your browser blocked the instant automatic redirect, tap below to open TikTok For You:
            </p>
            <a 
              href={TIKTOK_FOR_YOU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full justify-center items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-display font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Video size={16} />
              OPEN TIKTOK FOR YOU
              <ArrowRight size={14} />
            </a>
          </div>

          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest leading-relaxed">
            Refresh the page to try again only if you are ready to choose the Red Pill and transform your legacy.
          </p>
        </div>

        <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase relative z-10">
          MNAEEM FITNESS PORTAL &bull; COMFORT ROUTE ESTABLISHED
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 1.05 : 1,
        filter: isExiting ? "blur(12px)" : "blur(0px)"
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#030303] text-white overflow-y-auto flex flex-col justify-between font-sans selection:bg-red-500 selection:text-black"
    >
      
      {/* Splendid Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left/Red glow */}
        <div className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-red-600/10 blur-[150px] animate-pulse" style={{ animationDuration: "8s" }} />
        {/* Right/Blue glow */}
        <div className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" style={{ animationDuration: "10s" }} />
        {/* Matrix digital code grid style back lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header Info Banner */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black tracking-tighter text-red-500">MNAEEM</span>
          <span className="text-xl font-light tracking-widest text-white/50">FITNESS</span>
        </div>
        <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase flex items-center gap-1.5">
          <ShieldAlert size={12} className="text-red-500 animate-pulse" />
          SESSION STATUS: PENDING DECISION
        </div>
      </header>

      {/* Core Breathtaking Decision Space */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12 md:py-20 flex-1 flex flex-col justify-center items-center gap-12 md:gap-16">
        
        {/* Central Motivating Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 max-w-2xl"
        >
          <span className="text-xs md:text-sm font-mono text-red-500 tracking-[0.3em] uppercase block">
            THE CRITICAL THRESHOLD
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-none uppercase">
            TURNING BOYS <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500">INTO MEN</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-mono tracking-wide leading-relaxed max-w-xl mx-auto">
            A single metric logs your trajectory. Choose to metamorphose, or choose to remain comfortable. There are no secondary trials.
          </p>
        </motion.div>

        {/* Dynamic Dual Pill Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl">
          
          {/* RED PILL: TRANSFORMATION ZONE - ENTIRE CARD IS CLICKABLE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -8 }}
            onClick={handleSelectRedPill}
            className="group relative bg-[#09090b]/90 border border-red-500/25 hover:border-red-500/80 rounded-3xl p-8 md:p-10 flex flex-col justify-between items-center text-center transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(239,68,68,0.25)] min-h-[480px] cursor-pointer"
          >
            {/* Red Light overlay beam */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full text-red-500 text-[10px] font-mono uppercase tracking-widest relative z-10 mb-6">
              <Flame size={10} className="animate-pulse" />
              PATH OF COGNITION
            </div>

            {/* Breathtaking 3D-Style Red Pill Element */}
            <div className="relative w-16 h-32 mb-8 flex flex-col items-center justify-center filter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)] relative z-10 group-hover:scale-110 transition-transform duration-500">
              {/* Outer Capsule glass */}
              <div className="w-12 h-28 rounded-full border border-white/20 relative overflow-hidden flex flex-col">
                {/* Upper Red Capsule half */}
                <div className="h-1/2 bg-gradient-to-br from-red-400 to-red-600 relative overflow-hidden">
                  {/* Gloss highlight */}
                  <div className="absolute top-2 left-2 w-1.5 h-10 bg-white/40 rounded-full blur-[0.5px]" />
                </div>
                {/* Lower Red/Dark Capsule half */}
                <div className="h-1/2 bg-gradient-to-br from-red-700 to-red-950 relative overflow-hidden">
                  {/* Bottom shadow reflection */}
                  <div className="absolute bottom-2 right-2 w-2 h-6 bg-black/40 rounded-full blur-[1px]" />
                </div>
              </div>
              {/* Hologram Pulse Ring */}
              <div className="absolute inset-x-0 -bottom-2 h-1 bg-red-500 rounded-full blur-[4px] animate-ping opacity-60" />
            </div>

            {/* Title & Slogans */}
            <div className="space-y-3 relative z-10 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-display font-black text-red-500 tracking-tighter uppercase italic group-hover:scale-105 transition-transform duration-300">
                RED PILL
              </h3>
              <p className="text-white font-mono text-xs uppercase tracking-widest font-semibold">
                transform your life today
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                Embrace rigorous athletic symmetry, calorie optimization, volume progression calendars, and expert mentoring by Coach mNaeem.
              </p>
            </div>

            {/* Features Bullet List */}
            <ul className="mt-6 space-y-2 text-left w-full max-w-xs font-mono text-[10px] text-zinc-300 border-t border-white/5 pt-6 relative z-10">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Gain 100% Full Portal Access</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Direct AI Coach mNaeem Chat</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Interactive 3D Bodybuilding Scroll</span>
              </li>
            </ul>

            {/* Beautiful Interactive Card Action Box */}
            <div className="mt-8 w-full bg-red-600 group-hover:bg-red-500 text-white font-display font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 group-hover:shadow-red-500/40 relative z-10">
              ACCEPT METAMORPHOSIS
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* BLUE PILL: COMFORT ZONE - ENTIRE CARD IS CLICKABLE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -8 }}
            onClick={() => handleSelectBluePill()}
            className="group relative bg-[#09090b]/90 border border-blue-500/25 hover:border-blue-500/80 rounded-3xl p-8 md:p-10 flex flex-col justify-between items-center text-center transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(59,130,246,0.25)] min-h-[480px] cursor-pointer"
          >
            {/* Blue Light overlay beam */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-[10px] font-mono uppercase tracking-widest relative z-10 mb-6">
              <Eye size={10} className="animate-pulse" />
              PATH OF ILLUSION
            </div>

            {/* Breathtaking 3D-Style Blue Pill Element */}
            <div className="relative w-16 h-32 mb-8 flex flex-col items-center justify-center filter drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] relative z-10 group-hover:scale-110 transition-transform duration-500">
              {/* Outer Capsule glass */}
              <div className="w-12 h-28 rounded-full border border-white/20 relative overflow-hidden flex flex-col">
                {/* Upper Blue Capsule half */}
                <div className="h-1/2 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                  {/* Gloss highlight */}
                  <div className="absolute top-2 left-2 w-1.5 h-10 bg-white/40 rounded-full blur-[0.5px]" />
                </div>
                {/* Lower Blue/Dark Capsule half */}
                <div className="h-1/2 bg-gradient-to-br from-blue-700 to-blue-950 relative overflow-hidden">
                  {/* Bottom shadow reflection */}
                  <div className="absolute bottom-2 right-2 w-2 h-6 bg-black/40 rounded-full blur-[1px]" />
                </div>
              </div>
              {/* Hologram Pulse Ring */}
              <div className="absolute inset-x-0 -bottom-2 h-1 bg-blue-500 rounded-full blur-[4px] animate-ping opacity-60" />
            </div>

            {/* Title & Slogans */}
            <div className="space-y-3 relative z-10 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-display font-black text-blue-400 tracking-tighter uppercase italic group-hover:scale-105 transition-transform duration-300">
                BLUE PILL
              </h3>
              <p className="text-white font-mono text-xs uppercase tracking-widest font-semibold">
                you don't care
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                Exit immediately. Decline athletic accountability. Be routed directly to the TikTok For You feed.
              </p>
            </div>

            {/* Features Bullet List */}
            <ul className="mt-6 space-y-2 text-left w-full max-w-xs font-mono text-[10px] text-zinc-300 border-t border-white/5 pt-6 relative z-10">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Zero Fitness Accountability</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Settle for Instant Satisfaction</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>TikTok For You Feed</span>
              </li>
            </ul>

            {/* Beautiful Interactive Card Action Box */}
            <div className="mt-8 w-full bg-blue-600 group-hover:bg-blue-500 text-white font-display font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-500/40 relative z-10">
              RETURN TO COMFORT
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

        </div>

      </main>

      {/* Decorative Matrix Footer info bar */}
      <footer className="relative z-10 bg-white/5 border-t border-white/10 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
        <div>
          SELECTION SESSION: <span className="text-red-500 animate-pulse">ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          DESIGN SECURED FOR ATHLETES ONLY
        </div>
      </footer>

    </motion.div>
  );
}
