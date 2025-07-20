const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const allowedModels = {
  chat: "mistralai/mistral-7b-instruct:free",
  research: "google/gemma-3n-e2b-it:free",
  draft: "tencent/hunyuan-a13b-instruct:free",
  analyse: "tngtech/deepseek-r1t2-chimera:free"
};

app.post("/bais", async (req, res) => {
  const { query, mode } = req.body;

  if (!query || !mode || !allowedModels[mode]) {
    return res.status(400).json({ response: "Missing or invalid query/mode." });
  }

  const model = allowedModels[mode];

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: `You are BAIS, a legal AI assistant working in '${mode}' mode.` },
          { role: "user", content: query }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "⚠️ No response.";
    return res.json({ response: [reply] });

  } catch (err) {
    console.error("🧠 OpenRouter Error:", err.response?.data || err.message);
    return res.status(500).json({ response: "⚠️ Error connecting to OpenRouter." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ BAIS Backend is Running");
});

app.listen(PORT, () => {
  console.log(`✅ BAIS server is running on port ${PORT}`);
});
