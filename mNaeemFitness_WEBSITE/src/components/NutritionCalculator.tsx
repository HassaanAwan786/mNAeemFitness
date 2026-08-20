import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calculator, Apple, Flame, ChevronRight, Sparkles, Scale, RefreshCw } from "lucide-react";
import { MacroGoals } from "../types";

export default function NutritionCalculator() {
  const [weight, setWeight] = useState(180); // in lbs
  const [height, setHeight] = useState(70); // in inches
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<MacroGoals["activity"]>("moderate");
  const [goal, setGoal] = useState<MacroGoals["goal"]>("bulk");

  const [results, setResults] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    bmr: number;
  } | null>(null);

  const calculateMacros = () => {
    // Standard Mifflin-St Jeor BMR Formula
    // Convert weight to kg, height to cm
    const weightKg = weight * 0.45359237;
    const heightCm = height * 2.54;

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Activity multipliers
    const multipliers = {
      sedentary: 1.2,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9
    };

    const tdee = Math.round(bmr * multipliers[activity]);

    // Adjust target calories based on goal
    let targetCalories = tdee;
    if (goal === "cut") {
      targetCalories = tdee - 500;
    } else if (goal === "bulk") {
      targetCalories = tdee + 500;
    }

    // High performance bodybuilding macros partition:
    // Protein: 1.1 grams per lb of body weight (or 2.4g/kg)
    const targetProtein = Math.round(weight * 1.1);
    const proteinKcal = targetProtein * 4;

    // Fat: 25% of total calorie intake
    const fatKcal = Math.round(targetCalories * 0.25);
    const targetFat = Math.round(fatKcal / 9);

    // Carbs: Remainder of calorie allowance
    const carbKcal = targetCalories - (proteinKcal + fatKcal);
    const targetCarbs = Math.max(0, Math.round(carbKcal / 4));

    setResults({
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat,
      bmr: Math.round(bmr)
    });
  };

  // Run calculation initially and whenever state changes
  useEffect(() => {
    calculateMacros();
  }, [weight, height, age, gender, activity, goal]);

  // Suggested high-protein muscle builder meal structure
  const getMealStructure = (totalCals: number, p: number, c: number, f: number) => {
    return [
      {
        name: "Meal 1: Breakfast of Champions",
        time: "8:00 AM",
        desc: "Oatmeal with whey protein, mixed berries, and whole eggs.",
        split: `Approx. ${Math.round(totalCals * 0.25)} kcal • ${Math.round(p * 0.25)}g Protein • ${Math.round(c * 0.3)}g Carbs`
      },
      {
        name: "Meal 2: Power Lunch",
        time: "1:00 PM",
        desc: "Grilled chicken breast, jasmine rice, and steamed broccoli.",
        split: `Approx. ${Math.round(totalCals * 0.3)} kcal • ${Math.round(p * 0.3)}g Protein • ${Math.round(c * 0.35)}g Carbs`
      },
      {
        name: "Meal 3: Pre-Workout Fuel",
        time: "4:30 PM",
        desc: "Cream of rice with protein isolate, or canned tuna on whole wheat.",
        split: `Approx. ${Math.round(totalCals * 0.15)} kcal • ${Math.round(p * 0.15)}g Protein • ${Math.round(c * 0.15)}g Carbs`
      },
      {
        name: "Meal 4: Post-Workout Dinner",
        time: "8:00 PM",
        desc: "Lean sirloin steak or salmon, sweet potato, and asparagus salad.",
        split: `Approx. ${Math.round(totalCals * 0.3)} kcal • ${Math.round(p * 0.3)}g Protein • ${Math.round(c * 0.2)}g Carbs`
      }
    ];
  };

  return (
    <div id="nutrition-section" className="w-full bg-zinc-950 py-16 md:py-24 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Heading */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-brand-amber tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Apple size={14} />
            BIOMETRIC FUEL CALCULATOR
          </span>
          <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mt-3 tracking-tight">
            NUTRITION & <span className="text-brand-amber text-glow-amber">CALCULATOR</span>
          </h3>
          <p className="mt-4 text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
            Input your bodily dimensions below to compute your exact biological metabolic targets. Align your caloric ceiling with your aesthetic vision.
          </p>
        </div>

        {/* Core Multi-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Biometric Inputs */}
          <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-850 p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-base font-display font-extrabold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
                <Calculator size={18} className="text-brand-amber" />
                BIOMETRIC PROPERTIES
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">GENDER</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`py-2 text-xs rounded font-mono font-bold border transition-all duration-200 cursor-pointer ${
                        gender === "male"
                          ? "bg-brand-amber/10 border-brand-amber text-brand-amber"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      MALE
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`py-2 text-xs rounded font-mono font-bold border transition-all duration-200 cursor-pointer ${
                        gender === "female"
                          ? "bg-brand-amber/10 border-brand-amber text-brand-amber"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      FEMALE
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">AGE (YEARS)</label>
                  <input
                    type="number"
                    min="15"
                    max="90"
                    value={age}
                    onChange={(e) => setAge(Math.max(15, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-amber"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">WEIGHT (LBS)</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="80"
                      max="450"
                      value={weight}
                      onChange={(e) => setWeight(Math.max(80, Number(e.target.value)))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-amber"
                    />
                    <Scale size={14} className="absolute right-3 text-zinc-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">HEIGHT (INCHES)</label>
                  <input
                    type="number"
                    min="48"
                    max="96"
                    value={height}
                    onChange={(e) => setHeight(Math.max(48, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-amber"
                  />
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5 block">
                    e.g. 5'10\" is 70 inches
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">PHYSICAL EXERTION MULTIPLIER</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as MacroGoals["activity"])}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-amber font-sans"
                  >
                    <option value="sedentary">Sedentary (No Exercise, Desk Job)</option>
                    <option value="moderate">Moderate (3-4 Weight sessions/week)</option>
                    <option value="active">Very Active (5-6 Heavy sessions/week)</option>
                    <option value="extreme">Extreme Athlete (Double splits, Manual labor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">PRIMARY BIOLOGICAL GOAL</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["cut", "maintain", "bulk"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g as MacroGoals["goal"])}
                        className={`py-2 px-1 text-[10px] font-mono font-extrabold rounded border transition-all duration-200 uppercase cursor-pointer ${
                          goal === g
                            ? "bg-brand-amber/10 border-brand-amber text-brand-amber"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        {g === "cut" ? "SHRED (CUT)" : g === "maintain" ? "RECOMP" : "GAIN (BULK)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 text-zinc-500 text-[10px] leading-relaxed font-sans">
              ⚠️ Mifflin-St Jeor is a highly regarded metabolic model. Ensure your protein targets match your muscular volume limits.
            </div>
          </div>

          {/* Right Block: Computed Macro Results */}
          {results && (
            <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-850 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-8">
              
              {/* Core Calorie Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-zinc-800 pb-6">
                
                {/* Calories Display */}
                <div className="md:col-span-5 bg-zinc-950 border border-zinc-850 p-5 rounded-2xl flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-brand-amber/10 text-brand-amber text-[9px] font-mono px-2.5 py-0.5 rounded-bl uppercase">
                    CALORIC CEILING
                  </div>
                  <Flame size={28} className="text-brand-amber animate-pulse mb-1" />
                  <span className="text-3xl md:text-4xl font-display font-black text-white leading-none">
                    {results.calories}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono mt-1">KCAL / DAY TARGET</span>
                </div>

                {/* Macro percentages details */}
                <div className="md:col-span-7 space-y-4">
                  <h5 className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Sparkles size={12} className="text-brand-amber" />
                    DAILY MACRONUTRIENT ALLOCATION
                  </h5>

                  {/* Progressive Bar Indicators */}
                  <div className="space-y-3 font-sans">
                    {/* Protein bar */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-zinc-300 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          PROTEIN
                        </span>
                        <span className="text-white font-bold">{results.protein}g <span className="text-zinc-500 text-[10px]">({results.protein * 4} Kcal)</span></span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "35%" }} // Visual weight mockup
                          transition={{ duration: 0.8 }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Carbs bar */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-zinc-300 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                          CARBS
                        </span>
                        <span className="text-white font-bold">{results.carbs}g <span className="text-zinc-500 text-[10px]">({results.carbs * 4} Kcal)</span></span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "45%" }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full bg-yellow-400 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Fat bar */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-zinc-300 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                          DIETARY FATS
                        </span>
                        <span className="text-white font-bold">{results.fat}g <span className="text-zinc-500 text-[10px]">({results.fat * 9} Kcal)</span></span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "20%" }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-zinc-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Muscle Builder Meal Split */}
              <div className="space-y-4">
                <h5 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  🎯 RECOMMENDED BODYBUILDING MEAL OUTLINE
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getMealStructure(results.calories, results.protein, results.carbs, results.fat).map((meal, idx) => (
                    <div 
                      key={idx} 
                      className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors"
                    >
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-brand-amber mb-1">
                          <span className="font-extrabold uppercase">{meal.name}</span>
                          <span>{meal.time}</span>
                        </div>
                        <p className="text-zinc-300 text-xs leading-snug">{meal.desc}</p>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-2.5 pt-2 border-t border-zinc-900">
                        {meal.split}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
