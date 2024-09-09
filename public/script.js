async function loadMessages() {
  const response = await fetch('/api/messages');
  const messages = await response.json();
  const messagesDiv = document.getElementById('messages');

  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<p><strong>ID del chat:</strong> ${message.chatId}</p>
                                <p><strong>Mensaje:</strong> ${message.text}</p>
                                <p><strong>Hora:</strong> ${new Date(message.timestamp).toLocaleString()}</p>`;
    messagesDiv.appendChild(messageElement);
  });
}

// Cargar mensajes al cargar la página
window.onload = loadMessages;
