import express from "express";
import fetch from "node-fetch";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY not set.");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.static("public"));

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
          "You are VoxTalk, an AI voice assistant. Always respond in English. Never default to Spanish."
      })
    });

    if (!r.ok) {
      const errorText = await r.text();
      console.error("❌ OpenAI API error:", r.status, r.statusText, errorText);
      return res.status(r.status).json({ error: "OpenAI session failed", details: errorText });
    }

    const data = await r.json();
    res.json({
      client_secret: data.client_secret,
      model: "gpt-4o-realtime-preview",
      voice: "alloy"
    });
  } catch (e) {
    console.error("❌ Session error:", e);
    res.status(500).json({ error: "Session failed (server error)" });
  }
});

// Placeholder email endpoint
app.post("/send-transcript", (req, res) => {
  const { email, transcript } = req.body;
  console.log(`📩 Transcript requested for ${email}:\n${transcript.join("\n")}`);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on " + PORT));
