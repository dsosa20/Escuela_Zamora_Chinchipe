async function loadMessages() {
  try {
    const response = await fetch('/api/messages');
    if (!response.ok) {
      throw new Error('Error al cargar los mensajes');
    }
    const messages = await response.json();
    const messagesDiv = document.getElementById('messages');

    messages.forEach((message) => {
      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      
      // Construir el contenido del mensaje
      let messageContent = `<p><strong>ID del chat:</strong> ${message.chatId}</p>
                            <p><strong>Mensaje:</strong> ${message.text || 'Sin texto'}</p>
                            <p><strong>Hora:</strong> ${new Date(message.timestamp).toLocaleString()}</p>`;

      // Añadir la imagen si está disponible
      if (message.fileUrl) {
        messageContent += `<img src="${message.fileUrl}" alt="Foto desde Telegram" style="max-width: 100%; height: auto;"/>`;
      }

      messageElement.innerHTML = messageContent;
      messagesDiv.appendChild(messageElement);
    });
  } catch (error) {
    console.error('Error al cargar los mensajes:', error);
  }
}

// Cargar mensajes al cargar la página
window.onload = loadMessages;
