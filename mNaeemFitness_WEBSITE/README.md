<div align="center">


<img width="1569" height="984" alt="image" src="https://github.com/user-attachments/assets/a737f630-6185-4657-bed8-a2304f5ed653" />
</div>

# mNaeem Fitness - AI-Powered Gym Companion

Personal AI coach for workouts, nutrition, and fitness transformation.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- A free Groq API key (takes 2 minutes to set up!)

### Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Get your FREE Groq API key** (no credit card needed!):
   - Visit: https://console.groq.com/keys
   - Sign up for FREE
   - Copy your API key
   - Create a `.env` file in the project root:
     ```bash
     GROQ_API_KEY=gsk_your_free_api_key_here
     NODE_ENV=development
     ```

3. **Run the app:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### ✨ Features

- AI Coach Chat (English responses only!)
-  Workout Dashboard
-  Nutrition Calculator
-  Training Plans
-  Gym Calendar
-  Push Notifications

### 📝 Using the Chat

The AI Coach responds to questions about:

- Workout splits and exercises
- Macro calculations and nutrition
- Training progress and plateaus
- Motivation and mindset
- Membership plans

### 🔧 Troubleshooting

**Chat not responding?**

- Check your `.env` file has `GROQ_API_KEY` set
- Restart the server: `npm run dev`
- If no API key, the system falls back to keyword-based responses

**Port already in use?**

- The app automatically tries the next available port
- Check terminal output for the actual URL
