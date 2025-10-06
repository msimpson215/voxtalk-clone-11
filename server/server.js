import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.static("public"));

app.get("/health", (req, res) => {
  console.log("[server] GET /health");
  res.json({ ok: true, ts: Date.now() });
});

app.post("/session", async (req, res) => {
  console.log("[server] POST /session");
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
          "You are VoxTalk, a focused AI voice assistant. Always speak clear English."
      })
    });

    const text = await r.text();
    console.log("[server] /realtime/sessions status", r.status);
    // Try to JSON-parse, but return raw if not parseable
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) {
      console.error("[server] OpenAI error payload:", data);
      return res.status(r.status).json({ error: "openai_error", data });
    }

    res.json({
      client_secret: data.client_secret,
      model: "gpt-4o-realtime-preview",
      voice: "alloy"
    });
  } catch (e) {
    console.error("[server] /session exception:", e);
    res.status(500).json({ error: "session_failed", message: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port " + PORT));
