const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

const OPENROUTER_API_KEY = "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"; // 🔐 Replace with your real OpenRouter API key

app.post("/bais/backend/server", async (req, res) => {
  const userMessage = req.body.message;
  const mode = req.body.mode || "chat";

  let model = "mistralai/mistral-7b-instruct:free";
  let systemPrompt = "You are BAIS, a legal assistant for Indian law.";

  switch (mode) {
    case "auto":
      model = "tngtech/deepseek-r1t2-chimera:free";
      systemPrompt = "You are BAIS Auto, a general legal and AI assistant.";
      break;
    case "docs":
      model = "google/gemma-3n-e2b-it:free";
      systemPrompt = "You are BAIS Docs, an expert in legal document analysis.";
      break;
    case "image":
      model = "google/gemma-3n-e2b-it:free";
      systemPrompt = "You are BAIS Vision, helping users interpret image-based legal documents.";
      break;
    case "voice":
      model = "tencent/hunyuan-a13b-instruct:free";
      systemPrompt = "You are BAIS Voice, responding to queries transcribed from voice input.";
      break;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bhamaassociatesai.netlify.app", // ✅ Match Netlify domain
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
    console.error("❌ Error:", error);
    res.status(500).json({ reply: "⚠️ Error contacting OpenRouter." });
  }
});

app.listen(port, () => {
  console.log(`✅ BAIS backend running on http://localhost:${port}`);
});
