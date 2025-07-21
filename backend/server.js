const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ BAIS Backend is Running");
});

app.post("/bais", async (req, res) => {
  const { query, mode } = req.body;

  if (!query || !mode) {
    return res.status(400).json({ response: "Missing query or mode" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: query }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    return res.json({ response: [reply] });
  } catch (error) {
    console.error("❌ Error from OpenRouter:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ BAIS server is running on port ${PORT}`);
});
