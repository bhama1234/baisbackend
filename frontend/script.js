document.addEventListener("DOMContentLoaded", function () {
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatContainer = document.getElementById("chatContainer");
  const modeSelector = document.getElementById("mode");
  const toggleBtn = document.getElementById("darkModeToggle");
  const typingIndicator = document.getElementById("typingIndicator");

  toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const input = userInput.value.trim();
    const mode = modeSelector.value;

    if (!input) return;

    appendMessage("user", input);
    userInput.value = "";
    showTypingIndicator();

    try {
      const res = await fetch("rare-tenderness-production.up.railway.app/bais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, mode })
      });

      hideTypingIndicator();
      const data = await res.json();
      const responses = Array.isArray(data.response) ? data.response : [data.response];

      let botMessageElem = appendMessage("bais", "");
      let currentResponse = "";

      for (const msg of responses) {
        for (const char of msg) {
          currentResponse += char;
          botMessageElem.querySelector(".message-content").textContent = currentResponse;
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      }
    } catch (err) {
      hideTypingIndicator();
      appendMessage("bais", "⚠️ Error connecting to backend.");
      console.error(err);
    }
  }

  function appendMessage(sender, message) {
    const messageElem = document.createElement("div");
    messageElem.className = `animate-fade ${
      sender === "user" ? "text-right" : "text-left"
    }`;
    messageElem.innerHTML = `
      <span class="block text-sm ${
        sender === "user" ? "text-blue-300" : "text-green-400"
      } font-semibold">${sender === "user" ? "🧑‍💼 You" : "🤖 BAIS"}</span>
      <div class="message-content bg-gray-700 rounded-lg px-4 py-2 mt-1 inline-block max-w-[80%] ${
        sender === "user" ? "ml-auto bg-blue-600" : "mr-auto"
      }">${message}</div>
    `;
    chatContainer.appendChild(messageElem);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageElem;
  }

  function showTypingIndicator() {
    typingIndicator.classList.remove("hidden");
  }

  function hideTypingIndicator() {
    typingIndicator.classList.add("hidden");
  }
});
