import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.static("public"));

// Provide short-lived OpenAI Realtime session token
app.post("/session", async (req, res) => {
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
          "You are VoxTalk, a friendly AI voice assistant. Always reply in clear English speech.",
      }),
    });

    const data = await r.json();

    res.json({
      client_secret: data.client_secret,
      model: "gpt-4o-realtime-preview",
      voice: "alloy",
    });
  } catch (e) {
    console.error("Session error:", e);
    res.status(500).json({ error: "session failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port " + PORT));
