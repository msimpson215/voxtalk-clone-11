import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.static("public"));

// Health check (optional)
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.post("/session", async (_req, res) => {
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "alloy",
        instructions:
          "You are VoxTalk, a calm, intelligent, human-sounding voice partner. Speak clearly, always in English, and respond conversationally.",
      }),
    });

    const data = await r.json();

    if (!r.ok || !data?.client_secret) {
      console.error("Realtime session failed:", data);
      return res.status(500).json({ error: "session_failed", data });
    }

    res.json({
      client_secret: data.client_secret,
      model: "gpt-4o-realtime-preview",
      voice: "alloy",
    });
  } catch (e) {
    console.error("Session error:", e);
    res.status(500).json({ error: "session_failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ VoxTalk Voice Classic running on port " + PORT));
