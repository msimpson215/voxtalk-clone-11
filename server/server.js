import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.static("public"));

// Hands out a short-lived client secret for WebRTC session with OpenAI Realtime
app.post("/session", async (req, res) => {
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "alloy",
        instructions:
          "You are VoxTalk, a focused AI voice assistant. Always speak clear English. Keep responses concise."
      })
    });

    const data = await r.json();
    // Minimal sanity check
    if (!data?.client_secret?.value) {
      console.error("[server] No client_secret in response:", data);
      return res.status(502).json({ error: "No client_secret from OpenAI", details: data });
    }

    res.json({
      client_secret: data.client_secret,
      model: "gpt-4o-realtime-preview",
      voice: "alloy"
    });
  } catch (e) {
    console.error("[server] /session error:", e);
    res.status(500).json({ error: "session failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port " + PORT));
