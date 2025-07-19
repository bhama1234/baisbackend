document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const output = document.getElementById("chat-output");
  const modeSelect = document.getElementById("mode-select");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    const mode = modeSelect.value || "chat";

    // Display user message
    const userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.textContent = "🧑‍💼: " + message;
    output.appendChild(userMsg);

    // Clear input field
    input.value = "";

    try {
      const response = await fetch("https://baisbackend-production.up.railway.app/bais/backend/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, mode })
      });

      const data = await response.json();

      const botMsg = document.createElement("div");
      botMsg.className = "bot-message";
      botMsg.textContent = "🤖: " + data.reply;
      output.appendChild(botMsg);
    } catch (error) {
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = "⚠️ Error connecting to backend.";
      output.appendChild(errorMsg);
      console.error(error);
    }

    // Auto scroll to bottom
    output.scrollTop = output.scrollHeight;
  });
});
