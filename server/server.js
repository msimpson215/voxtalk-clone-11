import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "2mb" }));

// 🟢 Health check
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// 🟢 Text chat endpoint (original, with ONLY parser fallback added)
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: "You are VoxTalk. Be short, kind, clear, and conversational." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await r.json();

    // ------- SURGICAL CHANGE: robust fallback parsing only ----------
    // Try existing keys in order, preserve original behavior if present
    const text =
      data.output_text || // old field
      data.output?.[0]?.content?.[0]?.text || // new-ish nested shape
      data.output?.[0]?.content || // some responses put plain text here
      data.choices?.[0]?.message?.content || // chat-completion style fallback
      "(no response)";
    // ----------------------------------------------------------------

    res.json({ reply: text });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// 🟣 Voice session endpoint
app.post("/session", async (_req, res) => {
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
          "You are VoxTalk, a calm, friendly assistant. Always reply in clear English."
      })
    });

    const data = await r.json();
    res.json({ client_secret: data.client_secret });
  } catch (e) {
    console.error("Session error:", e);
    res.status(500).json({ error: "session_failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ VoxTalk Clone-11 running on port " + PORT));
