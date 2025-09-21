import express from "express";
import fetch from "node-fetch";   // remember to install: npm install node-fetch

const app = express();
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
          "You are VoxTalk, always respond in English. Never switch to Spanish."
      })
    });

    const data = await r.json();
    res.json({
      client_secret: data.client_secret,
      model: "gpt-
