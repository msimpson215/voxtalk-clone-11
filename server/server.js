import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Stripe from "stripe";
dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "4mb" }));

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-11-15" }) : null;

// -- Health
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// -- Chat endpoint (Responses API)
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
    const text = data.output_text || "(no response)";
    res.json({ reply: text });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// -- Voice session endpoint (Realtime)
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
        instructions: "You are VoxTalk, a calm, friendly assistant. Always reply in clear English."
      })
    });

    const data = await r.json();
    res.json({ client_secret: data.client_secret });
  } catch (e) {
    console.error("Session error:", e);
    res.status(500).json({ error: "session_failed" });
  }
});

// -- Stripe Checkout creation
// This creates a Checkout Session and returns the session id to the client for redirect
app.post("/create-checkout-session", async (req, res) => {
  if (!stripe) return res.status(500).json({ error: "Stripe not configured. Set STRIPE_SECRET_KEY in .env" });

  try {
    // Example: read item info from client (or use server-side data)
    // We'll accept optional {itemName, amount_cents} but default to a $9.99 sample product.
    const { itemName = "Pre-De-Icer Demo Bottle", amount_cents = 999 } = req.body || {};

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: itemName },
            unit_amount: amount_cents
          },
          quantity: 1
        }
      ],
      // Use your domain for success/cancel in production (must be HTTPS). For local test use http://localhost:3000
      success_url: `${req.headers.origin || "http://localhost:3000"}/?checkout=success`,
      cancel_url: `${req.headers.origin || "http://localhost:3000"}/?checkout=cancel`
    });

    res.json({ sessionId: session.id, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "" });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "stripe_session_failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ VoxTalk Clone-11 v2 on port " + PORT));
