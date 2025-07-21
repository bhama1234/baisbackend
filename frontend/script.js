document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const themeToggle = document.getElementById('theme-toggle');

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage('user', messageText);
        userInput.value = '';
        userInput.style.height = 'auto'; // Reset height

        // Simulate bot response
        setTimeout(() => {
            appendMessage('bot', 'This is a simulated response.');
        }, 1000);
    }

    function appendMessage(sender, text) {
        const messageElem = document.createElement('div');
        messageElem.classList.add('message', sender);

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let content = `
            <div class="info">${sender === 'user' ? 'You' : 'Bot'} • ${timestamp}</div>
            <div class="bubble">
                ${text}
                ${sender === 'bot' ? '<button class="copy-btn">📋</button>' : ''}
            </div>
        `;
        messageElem.innerHTML = content;
        chatBox.appendChild(messageElem);
        chatBox.scrollTop = chatBox.scrollHeight;

        if (sender === 'bot') {
            const copyBtn = messageElem.querySelector('.copy-btn');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = '✅';
                    setTimeout(() => {
                        copyBtn.textContent = '📋';
                    }, 2000);
                });
            });
        }
    }

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
});
