import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Use free Groq API (no credit card needed, generous free tier)
// Get your free API key at: https://console.groq.com/keys
const GROQ_API_KEY = process.env.GROQ_API_KEY || "gsk_demo_key_placeholder";
const GROQ_MODEL = "openai/gpt-oss-20b";

const COACH_SYSTEM_INSTRUCTION =
  "You are mNaeem, an elite professional bodybuilder, IFBB Pro, and the legendary head coach at 'mNaeem fitness'. You are highly energetic, intensely motivating, speak with fitness authority, and love using bodybuilding lingo like 'gains', 'beast mode', 'shredded', 'iron paradise', and 'wheels'. Keep responses punchy, helpful, extremely encouraging, and professional. Answer the user's specific question directly. Guide the client on workouts, nutrition macros, exercise form, and subscription benefits. Remind them they can book a slot with you or view their workout calendar directly. Never prefix your replies with labels like [Coach mNaeem] or [Local Coach mNaeem]. Keep response under 200 words.";

app.use(express.json());

function sanitizeCoachResponse(text: string): string {
  return text
    .replace(/^\[(Local )?Coach mNaeem\]\s*/i, "")
    .replace(/\n\n\(Note: Configure GEMINI_API_KEY.*\)$/s, "")
    .replace(/\n\n\(Network glitch occurred.*\)$/s, "")
    .trim();
}

function mapChatHistory(history: unknown) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item: any) => typeof item?.text === "string" && item.text.trim())
    .map((item: any) => ({
      role:
        item.sender === "trainer" ||
        item.role === "assistant" ||
        item.role === "model"
          ? "model"
          : "user",
      parts: [{ text: item.text.trim() }],
    }));
}

// Initialize Groq API (Free tier, no credit card needed)
let aiConfigured = false;
const groqApiKey = process.env.GROQ_API_KEY?.trim();

if (groqApiKey && groqApiKey !== "gsk_demo_key_placeholder") {
  aiConfigured = true;
  console.log(
    `✅ Groq API configured successfully (model: ${GROQ_MODEL}). Free tier with generous limits!`,
  );
} else {
  console.warn(
    `⚠️  GROQ_API_KEY not set. Using fallback mode.\n📝 To enable AI responses:\n   1. Visit: https://console.groq.com/keys\n   2. Create a free account (no credit card needed)\n   3. Copy your API key\n   4. Add GROQ_API_KEY=your_key to your .env file\n   5. Restart the server`,
  );
}

// Global state in-memory (mock DB)
const notifications: any[] = [
  {
    id: 1,
    title: "Welcome to mNaeem fitness!",
    body: "Book your personal slot with mNaeem today and start your transformation journey.",
    timestamp: new Date().toISOString(),
    read: false,
  },
];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/gemini/status", (req, res) => {
  res.json({
    configured: aiConfigured,
    model: GROQ_MODEL,
    provider: "Groq (Free)",
  });
});

app.get("/api/free-chat/status", (req, res) => {
  res.json({
    configured: true,
    provider: aiConfigured ? "Groq" : "Fallback",
  });
});

// Free Chatbot Endpoint - Using Groq API (Free tier, no credit card needed)
app.post("/api/free-chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // If Groq API key is configured, use it
    if (
      aiConfigured &&
      groqApiKey &&
      groqApiKey !== "gsk_demo_key_placeholder"
    ) {
      try {
        const groqResponse = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: GROQ_MODEL,
              messages: [
                {
                  role: "system",
                  content: COACH_SYSTEM_INSTRUCTION,
                },
                {
                  role: "user",
                  content: message,
                },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          },
        );

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          const responseText = groqData.choices?.[0]?.message?.content || "";

          if (responseText.trim()) {
            return res.json({
              configured: true,
              text: responseText.trim(),
              provider: "Groq",
            });
          }
        }
      } catch (groqError) {
        console.warn(
          "Groq API error, falling back to keyword matching:",
          groqError,
        );
      }
    }

    // Fallback: Keyword-based responses (always works, no API key needed)
    const fallbackResponses: { [key: string]: string } = {
      plateau:
        "Push harder! Try progressive overload—add 5 lbs each week to keep growing, beast! Mix up your rep ranges and hit those muscles from different angles!",
      macro:
        "Classic ratio for building: 40% protein, 35% carbs, 25% fats. But listen, adjust based on YOUR goals and metabolic type, champion! Track everything!",
      motivation:
        "You got this, Legend! Every rep brings you closer to your destiny. No pain, no GAIN! The iron doesn't lie—show up and put in the WORK! 💪",
      membership:
        "Our Elite Trainer Plan gives you personalized coaching, custom meal plans, weekly check-ins, and DIRECT access to me! Book your transformation today!",
      diet: "Focus on whole foods, bro: chicken, rice, broccoli, eggs, sweet potatoes. Keep it SIMPLE and track your macros! Consistency beats perfection every time!",
      workout:
        "Hit compound movements FIRST: squats, deadlifts, bench press, rows. Build the foundation, then isolate! Progressive overload is KEY to growth!",
      cardio:
        "Cardio kills gains is a myth! 20-30 mins of LISS after workouts keeps you lean without sacrificing muscle. HIIT twice a week is gold!",
      sleep:
        "Sleep is when the MAGIC happens, champion! 7-9 hours every night is non-negotiable. No gains without recovery—hit the pillow hard!",
      supplement:
        "Creatine, whey protein, and multivitamin are the only non-negotiables. Everything else is a nice-to-have. Master the BASICS first!",
    };

    // Simple keyword matching for fallback
    const lowerMessage = message.toLowerCase();
    let fallbackResponse =
      "Let's smash this session! Push past your boundaries and leave it all in the iron paradise, champion! What specific area can I help you dominate today?";

    for (const [keyword, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(keyword)) {
        fallbackResponse = response;
        break;
      }
    }

    res.json({
      configured: !aiConfigured,
      text: fallbackResponse,
      provider: "Fallback (no API key)",
      hint: "Add GROQ_API_KEY to .env for AI responses",
    });
  } catch (err: any) {
    console.error("Chat Error:", err);
    res.status(502).json({
      configured: false,
      text: "Connection issue on my end. Check your network and try again in a moment, beast!",
    });
  }
});

// Push Notifications Mock Endpoint
app.get("/api/notifications", (req, res) => {
  res.json({ notifications });
});

app.post("/api/notifications", (req, res) => {
  const { title, body } = req.body;
  const newNotification = {
    id: notifications.length + 1,
    title: title || "Alert",
    body: body || "Action completed!",
    timestamp: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(newNotification);
  res.status(201).json(newNotification);
});

// Vite middleware configuration for full-stack compatibility
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    // Disable HMR websocket server to avoid fixed-port conflicts (24678)
    // The app will still use Vite's middleware for dev asset serving.
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Attempt to bind to PORT; on EADDRINUSE try incrementing the port a few times.
  async function tryListen(initialPort: number) {
    let port = initialPort;
    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await new Promise<void>((resolve, reject) => {
          const server = app.listen(port, "0.0.0.0", () => {
            console.log(
              `Server running at http://0.0.0.0:${port} in ${process.env.NODE_ENV || "development"} mode`,
            );
            resolve();
          });
          server.on("error", (err: any) => reject(err));
        });
        return;
      } catch (err: any) {
        if (err && err.code === "EADDRINUSE") {
          console.warn(`Port ${port} is in use, trying ${port + 1}...`);
          port += 1;
          continue;
        }
        console.error("Failed to start server:", err);
        process.exit(1);
      }
    }
    console.error(`Could not bind to a port after ${maxAttempts} attempts.`);
    process.exit(1);
  }

  tryListen(PORT);
}

startServer();
