const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  input.value = "";

  addMessage("bot", "⏳ Thinking...");

  try {
    const response = await fetch("/bais/backend/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botMessage = data.reply || "⚠️ Sorry, something went wrong.";
    replaceLastBotMessage(botMessage);
  } catch (err) {
    replaceLastBotMessage("⚠️ Failed to connect to server.");
  }
});

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function replaceLastBotMessage(text) {
  const messages = chatBox.querySelectorAll(".message.bot");
  const lastMsg = messages[messages.length - 1];
  if (lastMsg) lastMsg.textContent = text;
}
