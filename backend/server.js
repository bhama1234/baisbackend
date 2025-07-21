// Import necessary modules
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main endpoint for BAIS
app.post("/bais", async (req, res) => {
  const { query, mode } = req.body;

  // Validate request
  if (!query || !mode) {
    return res.status(400).json({ response: "Missing query or mode" });
  }

  try {
    let response;
    // Handle different modes
    switch (mode) {
      case "chat":
        response = await getChatCompletion(query);
        break;
      case "auto":
        response = "Auto mode is not implemented yet.";
        break;
      case "docs":
        response = "Docs mode is not implemented yet.";
        break;
      case "image":
        response = "Image mode is not implemented yet.";
        break;
      case "voice":
        response = "Voice mode is not implemented yet.";
        break;
      default:
        response = "Invalid mode selected.";
    }
    res.json({ response });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ response: "Error processing your request." });
  }
});

// Function to get chat completion from OpenRouter
async function getChatCompletion(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gryphe/mythomax-l2-13b", // Or any other model
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chat completion:", error);
    return "Error connecting to the AI model.";
  }
}

// Health check endpoint
app.get("/", (req, res) => {
  res.send("✅ BAIS Backend is Running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ BAIS server is running on port ${PORT}`);
});
