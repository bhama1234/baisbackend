const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/bais", async (req, res) => {
  const { query, mode } = req.body;

  if (!query || !mode) {
    return res.status(400).json({ response: "Missing query or mode" });
  }

  // You can connect this to OpenRouter later
  return res.json({ response: [`You said: "${query}" in ${mode} mode.`] });
});

app.get("/", (req, res) => {
  res.send("✅ BAIS Backend is Running");
});

app.listen(PORT, () => {
  console.log(`✅ BAIS server is running on port ${PORT}`);
});
