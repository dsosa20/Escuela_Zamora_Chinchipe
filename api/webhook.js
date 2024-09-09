require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri); 
const dbName = 'TelegramBot';
const db = client.db(dbName);

app.use(bodyParser.json());

// Conectar a MongoDB
client.connect().then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
  process.exit(1);
});

// Ruta para manejar los webhooks de Telegram
app.post('/webhook', async (req, res) => {
  const message = req.body.message;

  if (message && message.photo) {
    try {
      const file_id = message.photo[message.photo.length - 1].file_id;
      const fileUrl = await getTelegramFileUrl(file_id);
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

      // Guardar la URL de la imagen en MongoDB
      const collection = db.collection('messages');
      await collection.insertOne({ ...message, fileUrl });

      res.sendStatus(200);
    } catch (error) {
      console.error('Error al recibir la foto:', error);
      res.status(500).send('Error al recibir la foto');
    }
  } else if (message && message.text) {
    try {
      const collection = db.collection('messages');
      await collection.insertOne(message);

      res.sendStatus(200);
    } catch (error) {
      console.error('Error al guardar el mensaje de texto:', error);
      res.status(500).send('Error al guardar el mensaje de texto');
    }
  } else {
    res.sendStatus(400); // Mensaje inválido
  }
});

// Función para obtener la URL del archivo de Telegram
async function getTelegramFileUrl(file_id) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const fileResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${file_id}`);
  const filePath = fileResponse.data.result.file_path;
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

// Servidor escuchando
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

process.on('SIGINT', async () => {
  console.log('Cerrando conexión con MongoDB...');
  await client.close();
  process.exit();
});

process.on('SIGTERM', async () => {
  console.log('Cerrando conexión con MongoDB...');
  await client.close();
  process.exit();
});
