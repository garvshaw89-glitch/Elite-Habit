import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for logs (pre-populated with sample entries if empty)
let logsStore: any[] = [];

// Helper to seed sample historical logs
function getSampleLogs() {
  const now = new Date();
  const daysAgo = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    return date.toISOString().split("T")[0];
  };

  return [
    {
      id: "sample_1",
      date: daysAgo(4),
      raw_text: "Heavy Bench Press (4x8 100kg), Incline Dumbbell Press (3x10), Tricep Dips. Ate 3100 kcal, 185g protein. Coded 4.5 hours on React and Express.",
      workout_done: true,
      workout_focus: "Chest & Triceps Hypertrophy",
      calories_estimated: 3100,
      protein_grams: 185,
      study_or_coding_hours: 4.5,
      habit_score: 9,
      coach_feedback: `### 📊 Log Summary\n- **Workout**: Chest & Triceps (Heavy Push Day)\n- **Nutrition**: 3,100 kcal | 185g Protein\n- **Productivity**: 4.5h Full-Stack Development\n\n### 🔥 Performance Analysis\nOutstanding session. You hit your calorie target with solid protein intake to support muscle recovery. Crushing 4.5 hours of high-focus deep work shows strong discipline.\n\n### 🚀 Next Move\nEnsure 8 hours of sleep tonight to maximize CNS recovery before tomorrow's Pull session. Keep hydration high.`,
      morning_intention: "Push day 100kg bench press goal + 4h React coding",
      timestamp: Date.now() - 4 * 86400000,
    },
    {
      id: "sample_2",
      date: daysAgo(3),
      raw_text: "Deadlifts (5x5 140kg), Lat Pulldowns, Bicep Curls. Ate around 2800 kcal, 165g protein. Studied algorithms and DSA for 3 hours.",
      workout_done: true,
      workout_focus: "Back & Biceps Heavy Pull",
      calories_estimated: 2800,
      protein_grams: 165,
      study_or_coding_hours: 3.0,
      habit_score: 8,
      coach_feedback: `### 📊 Log Summary\n- **Workout**: Heavy Back & Biceps\n- **Nutrition**: 2,800 kcal | 165g Protein\n- **Productivity**: 3.0h Data Structures & Algorithms\n\n### 🔥 Performance Analysis\nSolid execution on heavy posterior chain pull work. Your protein was slightly on the lower side relative to high training intensity—aim for closer to 180g on heavy deadlift days.\n\n### 🚀 Next Move\nPre-plan your protein sources for tomorrow. Great job staying consistent with DSA problem solving.`,
      morning_intention: "Heavy pull deadlifts 140kg & 3h DSA study",
      timestamp: Date.now() - 3 * 86400000,
    },
    {
      id: "sample_3",
      date: daysAgo(2),
      raw_text: "Rest day from gym. Light 20 min walk. Ate 2400 kcal, 140g protein. Worked 6 hours on backend API development.",
      workout_done: false,
      workout_focus: "Active Recovery Walk",
      calories_estimated: 2400,
      protein_grams: 140,
      study_or_coding_hours: 6.0,
      habit_score: 8,
      coach_feedback: `### 📊 Log Summary\n- **Workout**: Rest Day (Light Mobility Walk)\n- **Nutrition**: 2,400 kcal | 140g Protein\n- **Productivity**: 6.0h Deep Work (Backend APIs)\n\n### 🔥 Performance Analysis\nRest days are where growth happens. Lower calories on non-training days match your energy expenditure cleanly. Outstanding productivity output today.\n\n### 🚀 Next Move\nPrepare mentally for tomorrow's Leg Day. Foam roll hamstrings and quads tonight.`,
      morning_intention: "Rest day recovery walk + 6h backend API refactoring",
      timestamp: Date.now() - 2 * 86400000,
    },
    {
      id: "sample_4",
      date: daysAgo(1),
      raw_text: "Squats (4x8 120kg), Romanian Deadlifts, Calves. Ate 3200 kcal, 190g protein. Coded 3.5 hours on Gemini integration.",
      workout_done: true,
      workout_focus: "Legs & Posterior Chain",
      calories_estimated: 3200,
      protein_grams: 190,
      study_or_coding_hours: 3.5,
      habit_score: 10,
      coach_feedback: `### 📊 Log Summary\n- **Workout**: Leg Day Hypertrophy\n- **Nutrition**: 3,200 kcal | 190g Protein\n- **Productivity**: 3.5h Machine Learning & AI API Work\n\n### 🔥 Performance Analysis\nFlawless discipline today. High protein hit the target dead-on, supporting leg recovery, and your deep work hours were locked in.\n\n### 🚀 Next Move\nKeep momentum going. Tomorrow focus on shoulders and core accessories.`,
      morning_intention: "Leg day 120kg squats & 3.5h Gemini integration",
      timestamp: Date.now() - 1 * 86400000,
    },
  ];
}

logsStore = getSampleLogs();

// Initialize Gemini Client safely
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Coach Elite System Instruction
const AEGIS_SYSTEM_INSTRUCTION = `You are "Coach Elite", an elite, data-driven Personal Routine & Habit Coach specializing in strength training, muscle hypertrophy, nutrition, and computer science/academic productivity.

Core Directives:
1. Parse unstructured daily text logs from the user regarding their workouts, nutrition (calories/protein), and deep work / study blocks.
2. Provide direct, disciplined, and structured feedback (balancing encouragement with tough love).
3. Extract specific metric data points from the user's message and return them in a strict JSON block alongside your human-readable coaching response.

Response Output Format:
You MUST structure your response into two distinct parts:
PART 1: The Coach's Feedback (Formatted using Markdown with the sections: 📊 Log Summary, 🔥 Performance Analysis, 🚀 Next Move).
PART 2: A JSON block enclosed in \`\`\`json tags containing the extracted data for database logging.

JSON Schema Required in Part 2:
{
  "date": "YYYY-MM-DD",
  "workout_done": boolean,
  "workout_focus": "string or null",
  "calories_estimated": integer or null,
  "protein_grams": integer or null,
  "study_or_coding_hours": float,
  "habit_score": integer (1-10)
}

Important Rules:
- If the user doesn't state a date, assume today's date in YYYY-MM-DD format.
- Calculate habit_score (1 to 10) fairly based on effort, consistency, nutrition quality, and study/coding productivity.
- Keep PART 1 engaging, sharp, professional, and actionable.`;

// API Endpoints

// 1. Get all logs
app.get("/api/logs", (req, res) => {
  res.json({ success: true, logs: logsStore });
});

// Helper function for Log parsing with graceful model fallback
async function generateLogAnalysis(
  ai: GoogleGenAI,
  promptWithDate: string
) {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-3.6-flash",
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: promptWithDate,
        config: {
          systemInstruction: AEGIS_SYSTEM_INSTRUCTION,
          temperature: 0.4,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini Log] Model ${model} failed, attempting next model. Error:`, err?.message || err);
      lastError = err;
      // Brief pause to allow transient rate limits to clear
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  throw lastError || new Error("All Gemini models failed to process routine log.");
}

// 2. Set Morning Intention endpoint
app.post("/api/intention", (req, res) => {
  try {
    const { morningIntention, customDate } = req.body;
    if (!morningIntention || typeof morningIntention !== "string" || !morningIntention.trim()) {
      return res.status(400).json({ success: false, error: "Morning intention text is required." });
    }

    const targetDate = customDate || new Date().toISOString().split("T")[0];
    const cleanedIntention = morningIntention.trim();

    // Check if a log entry already exists for targetDate
    const existingIndex = logsStore.findIndex((l) => l.date === targetDate);

    if (existingIndex !== -1) {
      logsStore[existingIndex].morning_intention = cleanedIntention;
      return res.json({
        success: true,
        intention: cleanedIntention,
        date: targetDate,
        metrics: logsStore[existingIndex],
        logs: logsStore,
      });
    } else {
      // Create a initial entry with morning intention
      const initialEntry = {
        id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        date: targetDate,
        raw_text: `[Morning Focus Intention Set]: ${cleanedIntention}`,
        workout_done: false,
        workout_focus: null,
        calories_estimated: null,
        protein_grams: null,
        study_or_coding_hours: 0,
        habit_score: 7,
        coach_feedback: `### 🌅 Morning Intention Saved\n- **Target Focus**: "${cleanedIntention}"\n\nExecute on your goals today. Submit your end-of-day routine log tonight to evaluate performance against this intention!`,
        morning_intention: cleanedIntention,
        timestamp: Date.now(),
      };
      logsStore.unshift(initialEntry);
      return res.json({
        success: true,
        intention: cleanedIntention,
        date: targetDate,
        metrics: initialEntry,
        logs: logsStore,
      });
    }
  } catch (error: any) {
    console.error("Error setting morning intention:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to save morning intention." });
  }
});

// 3. Submit daily text log
app.post("/api/log", async (req, res) => {
  try {
    const { logText, customDate, morningIntention } = req.body;
    if (!logText || typeof logText !== "string" || !logText.trim()) {
      return res.status(400).json({ success: false, error: "Log text is required." });
    }

    const ai = getGenAIClient();
    const todayDate = customDate || new Date().toISOString().split("T")[0];

    // Find if there's an existing morning intention for today in logsStore
    const existingLog = logsStore.find((l) => l.date === todayDate);
    const activeIntention = morningIntention?.trim() || existingLog?.morning_intention || null;

    let promptWithDate = `Today's Date: ${todayDate}\n`;
    if (activeIntention) {
      promptWithDate += `Morning Intention Target: "${activeIntention}"\n`;
    }
    promptWithDate += `User Daily Log Output:\n"${logText.trim()}"`;

    const rawText = await generateLogAnalysis(ai, promptWithDate);

    // Extract Part 1 (Feedback) and Part 2 (JSON)
    let coachFeedback = rawText;
    let extractedJson: any = {};

    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      try {
        extractedJson = JSON.parse(jsonMatch[1].trim());
        coachFeedback = rawText.replace(jsonMatch[0], "").trim();
      } catch (e) {
        console.warn("Failed to parse AI JSON block:", e);
      }
    }

    const metricEntry = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      date: extractedJson.date || todayDate,
      raw_text: logText.trim(),
      workout_done: typeof extractedJson.workout_done === "boolean" ? extractedJson.workout_done : false,
      workout_focus: extractedJson.workout_focus || null,
      calories_estimated: typeof extractedJson.calories_estimated === "number" ? extractedJson.calories_estimated : null,
      protein_grams: typeof extractedJson.protein_grams === "number" ? extractedJson.protein_grams : null,
      study_or_coding_hours: typeof extractedJson.study_or_coding_hours === "number" ? extractedJson.study_or_coding_hours : 0,
      habit_score: typeof extractedJson.habit_score === "number" ? Math.min(10, Math.max(1, extractedJson.habit_score)) : 7,
      coach_feedback: coachFeedback,
      morning_intention: activeIntention,
      timestamp: Date.now(),
    };

    // If an existing placeholder log existed for today date, replace it or unshift
    const existingIndex = logsStore.findIndex((l) => l.date === todayDate);
    if (existingIndex !== -1) {
      logsStore[existingIndex] = metricEntry;
    } else {
      logsStore.unshift(metricEntry);
    }

    return res.json({
      success: true,
      coachFeedback,
      metrics: metricEntry,
      rawAiText: rawText,
      logs: logsStore,
    });
  } catch (error: any) {
    console.error("Error logging routine:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process log with Gemini API.",
    });
  }
});

// Helper function for Chat with thinking mode and graceful fallback
async function generateChatResponse(
  ai: GoogleGenAI,
  message: string,
  systemPrompt: string
) {
  const modelsToTry = [
    { model: "gemini-2.5-flash", thinking: false },
    { model: "gemini-2.5-pro", thinking: true },
    { model: "gemini-3.6-flash", thinking: false },
    { model: "gemini-2.5-pro", thinking: false },
  ];

  let lastError: any = null;

  for (const item of modelsToTry) {
    try {
      const config: any = {
        systemInstruction: systemPrompt,
        temperature: 0.6,
      };

      if (item.thinking) {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.HIGH,
        };
      }

      const response = await ai.models.generateContent({
        model: item.model,
        contents: message,
        config,
      });

      if (response && response.text) {
        return { reply: response.text, modelUsed: item.model };
      }
    } catch (err: any) {
      console.warn(`[Gemini Chat] Model ${item.model} failed, attempting next model. Error:`, err?.message || err);
      lastError = err;
      // Brief pause to clear quota windows or demand spikes
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  throw lastError || new Error("All Gemini models failed to produce a response.");
}

// 3. General Chat Endpoint with Coach Elite
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Message is required." });
    }

    const ai = getGenAIClient();

    // System context with latest logs summary
    const recentLogsSummary = logsStore
      .slice(0, 3)
      .map((l) => `- ${l.date}: ${l.workout_focus || "No workout"}, ${l.calories_estimated || "?"} kcal, ${l.protein_grams || "?"}g protein, ${l.study_or_coding_hours}h study/coding. Score: ${l.habit_score}/10`)
      .join("\n");

    const systemPrompt = `You are Coach Elite, an elite Personal Routine & Habit Coach specializing in fitness (hypertrophy/strength), nutrition, and computer science/academic productivity.

User's Recent Activity Context:
${recentLogsSummary || "No recent logs recorded."}

Provide direct, actionable, disciplined, and encouraging advice as Coach Elite. Be concise and structured.`;

    const { reply, modelUsed } = await generateChatResponse(ai, message, systemPrompt);

    return res.json({
      success: true,
      reply,
      modelUsed,
    });
  } catch (error: any) {
    console.error("Error in Aegis chat:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to communicate with Coach Aegis.",
    });
  }
});

// 4. Delete a log
app.delete("/api/logs/:id", (req, res) => {
  const { id } = req.params;
  logsStore = logsStore.filter((l) => l.id !== id);
  res.json({ success: true, logs: logsStore });
});

// 5. Reset / Seed logs
app.post("/api/logs/seed", (req, res) => {
  logsStore = getSampleLogs();
  res.json({ success: true, logs: logsStore });
});

app.post("/api/logs/clear", (req, res) => {
  logsStore = [];
  res.json({ success: true, logs: [] });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aegis Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
