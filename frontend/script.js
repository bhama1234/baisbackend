document.addEventListener("DOMContentLoaded", function () {
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatContainer = document.getElementById("chatContainer");
  const modeSelector = document.getElementById("mode");
  const toggleBtn = document.getElementById("darkModeToggle");

  toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  sendBtn.addEventListener("click", async () => {
    const input = userInput.value.trim();
    const mode = modeSelector.value;

    if (!input) return;

    appendMessage("user", input);
    userInput.value = "";

    appendMessage("bais", "⏳ Thinking...");

    try {
      const res = await fetch("https://baisbackend-production.up.railway.app/bais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, mode })
      });

      const data = await res.json();
      const responses = Array.isArray(data.response) ? data.response : [data.response];

      chatContainer.lastChild.remove();

      for (const msg of responses) {
        appendMessage("bais", msg);
      }
    } catch (err) {
      chatContainer.lastChild.remove();
      appendMessage("bais", "⚠️ Error connecting to backend.");
      console.error(err);
    }
  });

  function appendMessage(sender, message) {
    const messageElem = document.createElement("div");
    messageElem.className = `animate-fade ${
      sender === "user" ? "text-right" : "text-left"
    }`;
    messageElem.innerHTML = `
      <span class="block text-sm ${
        sender === "user" ? "text-blue-300" : "text-green-400"
      } font-semibold">${sender === "user" ? "🧑‍💼 You" : "🤖 BAIS"}</span>
      <div class="bg-gray-800 rounded-lg px-4 py-2 mt-1 inline-block max-w-[80%] ${
        sender === "user" ? "ml-auto" : "mr-auto"
      }">${message}</div>
    `;
    chatContainer.appendChild(messageElem);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});
