import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dumbbell, Calendar, Apple, MessageSquare, ChevronRight, Sparkles, Award, ShieldAlert, Heart, Users, Compass, Mail, Clock, MapPin, BellRing, Flame } from "lucide-react";

// Component imports
import BodybuilderScroll3D from "./components/BodybuilderScroll3D";
import MembershipPlans from "./components/MembershipPlans";
import WorkoutDashboard from "./components/WorkoutDashboard";
import NutritionCalculator from "./components/NutritionCalculator";
import TrainerChat from "./components/TrainerChat";
import GymCalendar from "./components/GymCalendar";
import NotificationCenter from "./components/NotificationCenter";
import PillGate from "./components/PillGate";

// Type imports
import { NotificationItem } from "./types";

const getDefaultNotifications = (): NotificationItem[] => [
  {
    id: 1,
    title: "Welcome to mNaeem fitness!",
    body: "Embark on your physical metamorphosis today. Consult with Coach mNaeem to design your dry shredding schedule.",
    timestamp: new Date().toISOString(),
    read: false
  }
];

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeTab, setActiveTab] = useState<"workout" | "nutrition" | "chat" | "calendar">("workout");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeToasts, setActiveToasts] = useState<{ id: string; title: string; body: string }[]>([]);

  // Initialize notifications from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem("mnaeem_alerts");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        setNotifications(getDefaultNotifications());
      }
    } else {
      const defaults = getDefaultNotifications();
      setNotifications(defaults);
      localStorage.setItem("mnaeem_alerts", JSON.stringify(defaults));
    }
  }, []);

  const saveNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    localStorage.setItem("mnaeem_alerts", JSON.stringify(updated));
  };

  const addNotification = (title: string, body: string) => {
    // 1. Add to active floating toasts
    const toastId = Math.random().toString(36).substring(2, 9);
    setActiveToasts((prev) => [...prev, { id: toastId, title, body }]);

    // Auto dismiss toast after 4 seconds
    setTimeout(() => {
      setActiveToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);

    // 2. Add to global list
    const newAlert: NotificationItem = {
      id: Date.now(),
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false
    };

    const saved = localStorage.getItem("mnaeem_alerts");
    let current: NotificationItem[] = [];
    if (saved) {
      try {
        current = JSON.parse(saved);
      } catch (e) {
        current = [];
      }
    }
    const updated = [newAlert, ...current];
    saveNotifications(updated);
  };

  const handleMarkRead = (id: number) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const handleClearNotifications = () => {
    saveNotifications([]);
  };

  // Triggers when a subscription completes
  const handleSubscribeSuccess = (planName: string) => {
    // Add success logic or update user details here if needed
  };

  // Triggers when exercises are logged
  const handleWorkoutLogged = (exercise: string, weight: number) => {
    // Custom workflow when workouts are logged (can track points or rewards)
  };

  // Triggers when session calendars are booked
  const handleSessionBooked = (title: string, date: string, time: string) => {
    // Custom workflow when sessions are scheduled
  };

  if (!hasEntered) {
    return <PillGate onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-brand-obsidian text-zinc-100 flex flex-col font-sans selection:bg-brand-amber selection:text-brand-obsidian">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 bg-brand-obsidian/85 backdrop-blur-md border-b border-white/10 z-30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-baseline gap-2 group">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-brand-amber transition-transform duration-200 group-hover:scale-[1.02] block">MNAEEM</span>
            <span className="text-2xl md:text-3xl font-light tracking-widest text-white/90">FITNESS</span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold uppercase tracking-widest text-white/50">
            <a href="#3d-pose-experience" className="hover:text-white transition-colors">3D EXPERIENCES</a>
            <a href="#portal-section" className="hover:text-white transition-colors" onClick={() => setActiveTab("workout")}>Dashboard</a>
            <a href="#portal-section" className="hover:text-white transition-colors" onClick={() => setActiveTab("nutrition")}>Nutrition</a>
            <a href="#portal-section" className="hover:text-white transition-colors" onClick={() => setActiveTab("chat")}>Coaching</a>
            <a href="#portal-section" className="hover:text-white transition-colors" onClick={() => setActiveTab("calendar")}>Schedule</a>
            <a href="#membership-section" className="hover:text-white transition-colors">Plans</a>
          </nav>

          {/* Action Center (Alert bell dropdown + CTA) */}
          <div className="flex items-center gap-4">
            <NotificationCenter 
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onClearAll={handleClearNotifications}
            />

            <a
              href="#portal-section"
              onClick={() => setActiveTab("calendar")}
              className="hidden sm:inline-flex items-center bg-white text-black px-5 py-2 text-xs font-bold uppercase tracking-tighter hover:bg-brand-amber hover:text-white transition-colors cursor-pointer"
            >
              Book Session
            </a>
          </div>

        </div>
      </header>

      {/* 2. Floating Action Toast Alerts (Simulated System Push Reminders) */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 w-80 max-w-full pointer-events-none">
        <AnimatePresence>
          {activeToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 30 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="bg-[#111111] border border-brand-amber/30 text-white p-4 rounded-xl shadow-2xl flex gap-3 pointer-events-auto items-start glow-box-amber"
            >
              <div className="bg-brand-amber/15 text-brand-amber p-1.5 rounded-full border border-brand-amber/30 mt-0.5">
                <BellRing size={16} className="animate-pulse" />
              </div>
              <div className="space-y-1 font-sans">
                <div className="font-bold text-xs leading-none">{toast.title}</div>
                <p className="text-[10px] text-zinc-400 leading-snug">{toast.body}</p>
                <span className="text-[8px] text-zinc-500 font-mono block pt-1 uppercase tracking-widest">
                  mNaeem push protocol
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Hero Visual Section */}
      <section className="relative w-full overflow-hidden bg-brand-obsidian py-16 md:py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 bg-gradient-to-b from-brand-charcoal to-brand-obsidian rounded-3xl border border-white/5 overflow-hidden relative flex flex-col justify-end p-8 md:p-10 min-h-[480px] shadow-2xl">
              <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-center bg-no-repeat" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, #ff5f1f 0%, transparent 70%)" }}></div>
              
              <div className="relative z-10 space-y-5">
                <div className="inline-block px-3 py-1 bg-brand-amber text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Current Pose: Front Lat Spread
                </div>
                
                <h2 className="text-5xl md:text-6xl font-display font-black leading-none uppercase italic tracking-tighter text-white">
                  Sculpt<br/>Your<br/><span className="text-brand-amber text-glow-amber">Legacy</span>
                </h2>

                <p className="text-sm text-white/60 max-w-sm leading-relaxed">
                  Personalized 1-on-1 coaching with Coach Naeem. Elite level methodology for professional results and raw metabolic power.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#portal-section"
                    onClick={() => setActiveTab("workout")}
                    className="bg-white text-black font-display font-extrabold text-xs px-6 py-3 tracking-tighter hover:bg-brand-amber hover:text-white uppercase transition-colors duration-200 cursor-pointer"
                  >
                    ENTER PORTAL
                  </a>
                  <a
                    href="#3d-pose-experience"
                    className="border border-white/10 hover:bg-white hover:text-black text-white font-display font-extrabold text-xs px-6 py-3 tracking-widest uppercase transition-colors duration-200"
                  >
                    VIEW 3D POSES
                  </a>
                </div>

                {/* Trust signals */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/5 mt-6 text-left">
                  <div>
                    <div className="text-lg md:text-xl font-display font-black text-white">100%</div>
                    <div className="text-[9px] text-zinc-500 font-mono uppercase mt-0.5">COMPLIANT</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-display font-black text-white">24/7</div>
                    <div className="text-[9px] text-zinc-500 font-mono uppercase mt-0.5">SLOT BOOKING</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-display font-black text-white">0.4 lbs</div>
                    <div className="text-[9px] text-zinc-500 font-mono uppercase mt-0.5">FAT LOSS RATE</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-8 right-8 text-[120px] font-black text-white/5 select-none leading-none">01</div>
            </div>

            {/* Right Interactive Card Panel (Feature Bento Grid teaser) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#111111] border border-white/5 p-6 rounded-3xl flex flex-col justify-between h-56 cursor-pointer hover:border-brand-amber/30 transition-all duration-300 relative group"
                onClick={() => {
                  setActiveTab("workout");
                  const el = document.getElementById("portal-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="bg-brand-amber/10 text-brand-amber p-3 rounded-2xl border border-brand-amber/20 self-start group-hover:bg-brand-amber/20 transition-colors">
                  <Dumbbell size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-brand-amber font-mono font-bold uppercase tracking-widest">METRIC LOGGER</span>
                  <h4 className="font-display font-black text-base text-white mt-1 uppercase">WORKOUT LOG</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-snug">Track physical outputs & workout volume with dynamic charts.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#111111] border border-white/5 p-6 rounded-3xl flex flex-col justify-between h-56 cursor-pointer hover:border-brand-amber/30 transition-all duration-300 relative group"
                onClick={() => {
                  setActiveTab("nutrition");
                  const el = document.getElementById("portal-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="bg-brand-amber/10 text-brand-amber p-3 rounded-2xl border border-brand-amber/20 self-start group-hover:bg-brand-amber/20 transition-colors">
                  <Apple size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-brand-amber font-mono font-bold uppercase tracking-widest">DIETARY BALANCE</span>
                  <h4 className="font-display font-black text-base text-white mt-1 uppercase">MACRO CALC</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-snug">Assess calorie quotas, dynamic macro metrics & plans.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#111111] border border-white/5 p-6 rounded-3xl flex flex-col justify-between h-56 cursor-pointer hover:border-brand-amber/30 transition-all duration-300 relative group"
                onClick={() => {
                  setActiveTab("chat");
                  const el = document.getElementById("portal-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="bg-brand-amber/10 text-brand-amber p-3 rounded-2xl border border-brand-amber/20 self-start group-hover:bg-brand-amber/20 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-brand-amber font-mono font-bold uppercase tracking-widest">REALTIME RESPONSE</span>
                  <h4 className="font-display font-black text-base text-white mt-1 uppercase">COACH MN CHAT</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-snug">Discuss macro blueprints & daily metrics on demand.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-[#111111] border border-white/5 p-6 rounded-3xl flex flex-col justify-between h-56 cursor-pointer hover:border-brand-amber/30 transition-all duration-300 relative group"
                onClick={() => {
                  setActiveTab("calendar");
                  const el = document.getElementById("portal-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="bg-brand-amber/10 text-brand-amber p-3 rounded-2xl border border-brand-amber/20 self-start group-hover:bg-brand-amber/20 transition-colors">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-brand-amber font-mono font-bold uppercase tracking-widest">TRAINING ROTATION</span>
                  <h4 className="font-display font-black text-base text-white mt-1 uppercase">PLANNER CALENDAR</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-snug">Schedule workouts & secure premium coaching slots.</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Scroll Poses Engine (3D perspective bodybuilder sequence) */}
      <BodybuilderScroll3D />

      {/* 5. Core Portal Tab Deck (Tabs: Workouts, Nutrition, Chat, Calendar) */}
      <div id="portal-section" className="w-full bg-zinc-950 py-16 md:py-24 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center bg-zinc-900/60 border border-zinc-850 p-2 rounded-xl mb-12 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab("workout")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-display font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "workout"
                  ? "bg-brand-amber text-brand-obsidian shadow-md shadow-brand-amber/15"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              <Dumbbell size={14} />
              METRICS LOG
            </button>
            <button
              onClick={() => setActiveTab("nutrition")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-display font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "nutrition"
                  ? "bg-brand-amber text-brand-obsidian shadow-md shadow-brand-amber/15"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              <Apple size={14} />
              NUTRITION CALC
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-display font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "chat"
                  ? "bg-brand-amber text-brand-obsidian shadow-md shadow-brand-amber/15"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              <MessageSquare size={14} />
              COACH MN MESSENGER
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-display font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "calendar"
                  ? "bg-brand-amber text-brand-obsidian shadow-md shadow-brand-amber/15"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              <Calendar size={14} />
              CALENDAR SCHEDULE
            </button>
          </div>

          {/* Core active portal rendering with tab transition effects */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {activeTab === "workout" && (
                  <WorkoutDashboard 
                    onLogLogged={handleWorkoutLogged} 
                    onNotification={addNotification} 
                  />
                )}
                {activeTab === "nutrition" && (
                  <NutritionCalculator />
                )}
                {activeTab === "chat" && (
                  <TrainerChat 
                    onNotification={addNotification} 
                  />
                )}
                {activeTab === "calendar" && (
                  <GymCalendar 
                    onSessionBooked={handleSessionBooked} 
                    onNotification={addNotification} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* 6. Pricing Subscription tiers with checkouts */}
      <MembershipPlans 
        onSubscribeSuccess={handleSubscribeSuccess} 
        onNotification={addNotification} 
      />

      {/* 7. Beautiful Responsive Footer Layout */}
      <footer className="w-full bg-[#050505] border-t border-white/10 py-12 md:py-16 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-10 mb-10">
            
            {/* Column 1: Brand details */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black tracking-tighter text-brand-amber">MNAEEM</span>
                <span className="text-xl font-light tracking-widest text-white/90">FITNESS</span>
              </div>
              <p className="max-w-xs text-zinc-400 font-sans leading-relaxed">
                Elite sandow bodybuilding zones and digital training coordination portals. Build your biological architecture with precision.
              </p>
              <div className="flex gap-3 text-zinc-500 font-mono text-[10px]">
                <span>IFBB PRO AFFILIATE</span>
                <span>•</span>
                <span>OLYMPIA PREP ZONE</span>
              </div>
            </div>

            {/* Column 2: Quick actions */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="font-display font-bold text-white uppercase text-xs">PORTAL DIRECTORIES</h5>
              <ul className="space-y-2 font-mono text-[11px] text-zinc-400">
                <li><a href="#3d-pose-experience" className="hover:text-brand-amber transition-colors">3D POSE INTERACTIVE EXPERIENCE</a></li>
                <li><a href="#portal-section" onClick={() => setActiveTab("workout")} className="hover:text-brand-amber transition-colors">VOLUME PROGRESS METRICS</a></li>
                <li><a href="#portal-section" onClick={() => setActiveTab("nutrition")} className="hover:text-brand-amber transition-colors">MACRO CALCULATOR</a></li>
                <li><a href="#portal-section" onClick={() => setActiveTab("chat")} className="hover:text-brand-amber transition-colors">MESSENGER WITH MNAEEM</a></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="font-display font-bold text-white uppercase text-xs">IRON PARADISE HQ</h5>
              <ul className="space-y-2 font-sans text-zinc-400 leading-tight">
                <li className="flex items-center gap-2">
                  <MapPin size={12} className="text-brand-amber shrink-0" />
                  <span>Suite 400, Sandow Avenue, Olympia West Coast</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={12} className="text-brand-amber shrink-0" />
                  <span>Open 24/7/365 to Gold & Elite Holders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={12} className="text-brand-amber shrink-0" />
                  <span>support@mnaeemfitness.com</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Compliance & Live System Bar from Elegant Dark Theme */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl mb-8">
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <span>Active Subscription: <span className="text-white">Elite Pro</span></span>
              <span className="hidden sm:inline text-white/10">|</span>
              <span>Days Trained: <span className="text-white">142</span></span>
              <span className="hidden sm:inline text-white/10">|</span>
              <span>Personal Best: <span className="text-white">220KG</span></span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-black px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> System Live
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-wider text-zinc-600">
            <div>
              &copy; {new Date().getFullYear()} MNAEEM FITNESS LLC. ALL METAMORPHIC RIGHTS RESERVED.
            </div>
            <div className="flex gap-4">
              <span>SANDBOX LICENSE 224-A</span>
              <span>|</span>
              <span>DESIGN BY GOOGLE AI STUDIO</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
