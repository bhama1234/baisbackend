const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Dynamic import

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const OPENROUTER_API_KEY = "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"; // Replace with your real key

app.post("/bais/backend/server", async (req, res) => {
  const userMessage = req.body.message;
  const mode = req.body.mode || "chat";

  let model = "mistralai/mistral-7b-instruct:free";
  let systemPrompt = "You are BAIS, a legal assistant for Indian law.";

  if (mode === "auto") {
    model = "openrouter/auto";
    systemPrompt = "You are BAIS Auto, intelligent legal and general assistant.";
  } else if (mode === "docs") {
    model = "google/gemma-3n-e2b-it:free";
    systemPrompt = "You are BAIS Docs, an expert in legal document analysis and OCR tasks.";
  } else if (mode === "image") {
    model = "google/gemma-3n-e2b-it:free";
    systemPrompt = "You are BAIS Vision, an expert in interpreting image-based legal documents.";
  } else if (mode === "voice") {
    model = "openrouter/auto";
    systemPrompt = "You are BAIS Voice, responding to queries transcribed from voice input.";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bhamaassociatesai.netlify.app", // ✅ Required by OpenRouter
        "X-Title": "BAIS"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "⚠️ No response from model.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error from OpenRouter:", error);
    res.status(500).json({ reply: "⚠️ Error contacting model API." });
  }
});

app.listen(port, () => {
  console.log(`✅ BAIS backend running at http://localhost:${port}`);
});
