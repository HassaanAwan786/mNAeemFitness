export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  exercise: string;
  category: "Chest" | "Back" | "Legs" | "Arms" | "Shoulders" | "Cardio" | "Core";
  sets: number;
  reps: number;
  weight: number; // in lbs or kg
}

export interface Booking {
  id: string;
  type: "gym" | "trainer";
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: "Confirmed" | "Pending";
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  color: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface MacroGoals {
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  weight: number;
  height: number;
  age: number;
  goal: "cut" | "maintain" | "bulk";
  activity: "sedentary" | "moderate" | "active" | "extreme";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "trainer";
  text: string;
  timestamp: string;
}
