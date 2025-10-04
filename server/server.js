import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Assuming this is running on a Node version that doesn't have fetch globally

dotenv.config();

const app = express();
// Serve static files (index.html, style.css, etc.) from the 'public' directory
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
                // Instructions are critical for the personality and language
                instructions:
                "You are an AI voice assistant. You are branded as VoxTalk. ALWAYS respond in English. Translate if needed, but reply only in English. Keep responses concise and conversational."
            })
        });

        const data = await r.json();
        
        // Check for API errors before sending to client
        if (data.error) {
            console.error("API Session Error:", data.error);
            return res.status(500).json({ error: "API session failed", details: data.error });
        }

        res.json({
            client_secret: data.client_secret,
            model: "gpt-4o-realtime-preview",
            voice: "alloy"
        });
    } catch (e) {
        console.error("Server Session error:", e);
        res.status(500).json({ error: "session failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
