document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.querySelector("button[type='submit']");
  const userInput = document.getElementById("user-message");
  const chatContainer = document.getElementById("chat-box");
  const modeSelector = document.getElementById("mode-selector");

  const appendMessage = (sender, message) => {
    const messageElem = document.createElement("div");
    messageElem.className = sender;
    messageElem.innerText = `${sender === "user" ? "🧑‍💼 You" : "🤖 BAIS"}: ${message}`;
    chatContainer.appendChild(messageElem);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const sendMessage = async () => {
    const message = userInput.value.trim();
    if (!message) return;

    const mode = modeSelector?.value || "chat";

    appendMessage("user", message);
    userInput.value = "";

    appendMessage("bot", "⌛ Thinking...");

    try {
      const response = await fetch("https://baisbackend-production.up.railway.app/bais/backend/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, mode })
      });

      const data = await response.json();

      const replyElements = chatContainer.querySelectorAll(".bot");
      replyElements[replyElements.length - 1].innerText = `🤖 BAIS: ${data.reply}`;
    } catch (err) {
      const replyElements = chatContainer.querySelectorAll(".bot");
      replyElements[replyElements.length - 1].innerText = "🤖 BAIS: ⚠️ No response from server.";
    }
  };

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent form submission refresh
    sendMessage();
  });

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});
