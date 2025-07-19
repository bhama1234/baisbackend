document.getElementById("bais-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = document.getElementById("user-message").value.trim();
  const mode = document.getElementById("mode-selector").value;
  const chatBox = document.getElementById("chat-box");

  if (!userMessage) return;

  chatBox.innerHTML += `<div class="user-message">🧑‍💼 You: ${userMessage}</div>`;
  document.getElementById("user-message").value = "";

  try {
    const response = await fetch("https://baisbackend-production.up.railway.app/bais/backend/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage, mode })
    });

    const data = await response.json();
    const reply = data.reply;

    chatBox.innerHTML += `<div class="bais-reply">🤖 BAIS: ${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error("❌ Error:", error);
    chatBox.innerHTML += `<div class="bais-reply error">⚠️ Error contacting backend.</div>`;
  }
});
