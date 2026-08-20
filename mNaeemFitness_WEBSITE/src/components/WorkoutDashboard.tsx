import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Dumbbell, Calendar, Flame, TrendingUp, Sparkles, Filter, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { WorkoutLog } from "../types";

// Seed data to make the dashboard look stunning on first load
const SEED_WORKOUTS: WorkoutLog[] = [
  { id: "1", date: "2026-06-23", exercise: "Bench Press", category: "Chest", sets: 4, reps: 8, weight: 185 },
  { id: "2", date: "2026-06-24", exercise: "Barbell Rows", category: "Back", sets: 4, reps: 10, weight: 135 },
  { id: "3", date: "2026-06-25", exercise: "Barbell Squats", category: "Legs", sets: 3, reps: 8, weight: 225 },
  { id: "4", date: "2026-06-26", exercise: "Overhead Press", category: "Shoulders", sets: 4, reps: 8, weight: 115 },
  { id: "5", date: "2026-06-27", exercise: "Incline Dumbbell Press", category: "Chest", sets: 3, reps: 10, weight: 140 },
  { id: "6", date: "2026-06-28", exercise: "Deadlift", category: "Back", sets: 3, reps: 5, weight: 275 },
  { id: "7", date: "2026-06-29", exercise: "Bicep Curls", category: "Arms", sets: 3, reps: 12, weight: 65 }
];

interface WorkoutDashboardProps {
  onLogLogged: (exercise: string, weight: number) => void;
  onNotification: (title: string, body: string) => void;
}

export default function WorkoutDashboard({ onLogLogged, onNotification }: WorkoutDashboardProps) {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [exercise, setExercise] = useState("");
  const [category, setCategory] = useState<WorkoutLog["category"]>("Chest");
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(135);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Load workouts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mnaeem_workouts");
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved));
      } catch (e) {
        setWorkouts(SEED_WORKOUTS);
      }
    } else {
      setWorkouts(SEED_WORKOUTS);
      localStorage.setItem("mnaeem_workouts", JSON.stringify(SEED_WORKOUTS));
    }
  }, []);

  const saveWorkouts = (newWorkouts: WorkoutLog[]) => {
    setWorkouts(newWorkouts);
    localStorage.setItem("mnaeem_workouts", JSON.stringify(newWorkouts));
  };

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise.trim()) return;

    const newLog: WorkoutLog = {
      id: Math.random().toString(36).substring(2, 9),
      date,
      exercise,
      category,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight)
    };

    const updated = [newLog, ...workouts];
    saveWorkouts(updated);
    onLogLogged(exercise, weight);
    onNotification(
      "Workout Logged! 💪",
      `Logged ${sets} sets of ${exercise} (${weight} lbs) to your progress history.`
    );

    // Reset Form partially
    setExercise("");
  };

  const handleDeleteWorkout = (id: string) => {
    const updated = workouts.filter((w) => w.id !== id);
    saveWorkouts(updated);
  };

  // Prepare data for the total volume chart (grouped by date)
  const getVolumeChartData = () => {
    const grouped: { [key: string]: number } = {};
    // Sort chronological first
    const sorted = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach((w) => {
      const vol = w.sets * w.reps * w.weight;
      grouped[w.date] = (grouped[w.date] || 0) + vol;
    });

    return Object.keys(grouped).map((dateKey) => ({
      date: dateKey.substring(5), // MM-DD
      "Volume (lbs)": grouped[dateKey]
    }));
  };

  // Prepare data for muscle group bar chart
  const getCategoryChartData = () => {
    const counts: { [key: string]: number } = {
      Chest: 0, Back: 0, Legs: 0, Arms: 0, Shoulders: 0, Cardio: 0, Core: 0
    };
    workouts.forEach((w) => {
      if (counts[w.category] !== undefined) {
        counts[w.category] += w.sets;
      }
    });

    return Object.keys(counts).map((cat) => ({
      name: cat,
      "Sets Logged": counts[cat]
    }));
  };

  // Metrics calculations
  const totalSets = workouts.reduce((sum, w) => sum + w.sets, 0);
  const totalVolume = workouts.reduce((sum, w) => sum + (w.sets * w.reps * w.weight), 0);
  const streak = Math.min(workouts.length, 5); // Simulated workout streak based on logs count

  const filteredWorkouts = selectedCategoryFilter === "All"
    ? workouts
    : workouts.filter((w) => w.category === selectedCategoryFilter);

  return (
    <div id="progress-dashboard" className="w-full bg-brand-obsidian py-16 md:py-24 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <span className="text-xs font-mono text-brand-amber tracking-widest uppercase flex items-center gap-1.5">
              <Flame size={14} className="animate-pulse" />
              MEMBER METRICS ENGINE
            </span>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mt-2 tracking-tight">
              PROGRESS <span className="text-brand-amber text-glow-amber">DASHBOARD</span>
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-xl">
              Track your lifts, compute total weekly physical volume, and audit your muscle distribution. Let statistics fuel your biological evolution.
            </p>
          </div>
          
          {/* Top Quick Metrics */}
          <div className="flex gap-4 self-stretch md:self-auto overflow-x-auto pb-2 md:pb-0">
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl min-w-[110px] text-center">
              <div className="text-[10px] font-mono text-zinc-500">WEEKLY STREAK</div>
              <div className="text-2xl font-display font-extrabold text-brand-amber mt-1 flex items-center justify-center gap-1">
                {streak} <Flame size={16} className="text-brand-amber fill-brand-amber" />
              </div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl min-w-[120px] text-center">
              <div className="text-[10px] font-mono text-zinc-500">TOTAL LIFTS</div>
              <div className="text-2xl font-display font-extrabold text-white mt-1">
                {workouts.length}
              </div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl min-w-[140px] text-center">
              <div className="text-[10px] font-mono text-zinc-500">VOLUME MOVED</div>
              <div className="text-2xl font-display font-extrabold text-white mt-1 font-mono text-xs sm:text-base">
                {totalVolume.toLocaleString()} lbs
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Log New Exercise Form */}
          <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl glow-box-amber">
            <h4 className="text-base font-display font-extrabold text-white mb-6 flex items-center gap-2">
              <Dumbbell size={18} className="text-brand-amber" />
              RECORD LIFT INTENSITY
            </h4>

            <form onSubmit={handleAddWorkout} className="space-y-4 font-sans text-sm text-zinc-300">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">EXERCISE NAME</label>
                <input
                  type="text"
                  required
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="e.g. Incline Bench Press, Deadlift"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-amber transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">MUSCLE GROUP</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WorkoutLog["category"])}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-amber transition-colors text-sm"
                  >
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Legs">Legs</option>
                    <option value="Arms">Arms</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Core">Core</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">LOG DATE</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-amber transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">SETS</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={sets}
                    onChange={(e) => setSets(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-center text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">REPS</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={reps}
                    onChange={(e) => setReps(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-center text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">WT (LBS)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    required
                    value={weight}
                    onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-center text-sm font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian font-display font-extrabold text-sm py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-amber/10 mt-6"
              >
                <Plus size={16} />
                COMMIT LIFT LOG
              </button>
            </form>
          </div>

          {/* Right Panel: Performance Charts & Logs */}
          <div className="lg:col-span-8 space-y-8 w-full">
            
            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart 1: Daily Volume Tracking */}
              <div className="bg-zinc-900/30 border border-zinc-850 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <TrendingUp size={12} className="text-brand-amber" />
                    CHRONOLOGICAL MOVED VOLUME (LBS)
                  </h5>
                  <span className="text-[10px] font-mono text-brand-amber">ACTIVE TRACK</span>
                </div>
                <div className="h-48 md:h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getVolumeChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                      <YAxis stroke="#71717a" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#f59e0b", borderRadius: "8px" }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Volume (lbs)" 
                        stroke="#f59e0b" 
                        strokeWidth={2.5} 
                        dot={{ fill: "#fbbf24", r: 4 }}
                        activeDot={{ r: 6, stroke: "#ffffff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Muscle Group Split */}
              <div className="bg-zinc-900/30 border border-zinc-850 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Award size={12} className="text-brand-amber" />
                    SETS LOGGED BY TARGET GROUP
                  </h5>
                  <span className="text-[10px] font-mono text-brand-amber">SYMMETRY split</span>
                </div>
                <div className="h-48 md:h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCategoryChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={9} />
                      <YAxis stroke="#71717a" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "8px" }}
                      />
                      <Bar dataKey="Sets Logged" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Workout History List */}
            <div className="bg-zinc-900/30 border border-zinc-850 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h5 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-brand-amber" />
                  PHYSICAL LOG TRANSACTION ARCHIVE
                </h5>
                
                {/* Filter Selector */}
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-zinc-500" />
                  <span className="text-xs font-mono text-zinc-500">FILTER:</span>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-amber transition-colors"
                  >
                    <option value="All">All Groups</option>
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Legs">Legs</option>
                    <option value="Arms">Arms</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Core">Core</option>
                  </select>
                </div>
              </div>

              {/* Logs Table Layout */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-wider pb-2">
                      <th className="py-2">DATE</th>
                      <th className="py-2">EXERCISE</th>
                      <th className="py-2">SPLIT CLASS</th>
                      <th className="py-2 text-center">SETS</th>
                      <th className="py-2 text-center">REPS</th>
                      <th className="py-2 text-right">WEIGHT</th>
                      <th className="py-2 text-right">TOTAL VOL</th>
                      <th className="py-2 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850/50 text-xs">
                    <AnimatePresence>
                      {filteredWorkouts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-zinc-500 italic">
                            No active workout records matching filter constraints.
                          </td>
                        </tr>
                      ) : (
                        filteredWorkouts.map((w) => (
                          <motion.tr
                            key={w.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="text-zinc-300 hover:bg-zinc-900/50 transition-colors"
                          >
                            <td className="py-3 font-mono text-zinc-500">{w.date}</td>
                            <td className="py-3 font-semibold text-white">{w.exercise}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-brand-amber border border-zinc-700/50">
                                {w.category}
                              </span>
                            </td>
                            <td className="py-3 text-center font-mono">{w.sets}</td>
                            <td className="py-3 text-center font-mono">{w.reps}</td>
                            <td className="py-3 text-right font-mono font-medium">{w.weight} lbs</td>
                            <td className="py-3 text-right font-mono text-brand-amber font-semibold">
                              {(w.sets * w.reps * w.weight).toLocaleString()} lbs
                            </td>
                            <td className="py-3 text-center">
                              <button
                                onClick={() => handleDeleteWorkout(w.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
                                title="Delete Log Entry"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
