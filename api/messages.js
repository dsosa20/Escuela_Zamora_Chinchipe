const { MongoClient } = require('mongodb');
const axios = require('axios');

const mongoUri = process.env.MONGODB_URI;
const botToken = process.env.TELEGRAM_BOT_TOKEN;

let db;
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event) => {
  if (!db) {
    try {
      await client.connect();
      db = client.db('TelegramBot');
    } catch (err) {
      console.error('Error al conectar a MongoDB:', err);
      return { statusCode: 500, body: 'Error al conectar a MongoDB' };
    }
  }

  const message = JSON.parse(event.body).message;

  if (message && message.photo) {
    try {
      const file_id = message.photo[message.photo.length - 1].file_id;
      const fileUrl = await getTelegramFileUrl(file_id);
      await axios.get(fileUrl, { responseType: 'arraybuffer' });

      const collection = db.collection('messages');
      await collection.insertOne({ ...message, fileUrl });

      return { statusCode: 200, body: 'Foto recibida' };
    } catch (error) {
      console.error('Error al recibir la foto:', error);
      return { statusCode: 500, body: 'Error al recibir la foto' };
    }
  } else if (message && message.text) {
    try {
      const collection = db.collection('messages');
      await collection.insertOne(message);

      return { statusCode: 200, body: 'Mensaje de texto guardado' };
    } catch (error) {
      console.error('Error al guardar el mensaje de texto:', error);
      return { statusCode: 500, body: 'Error al guardar el mensaje de texto' };
    }
  } else {
    return { statusCode: 400, body: 'Mensaje inválido' };
  }
};

async function getTelegramFileUrl(file_id) {
  const fileResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${file_id}`);
  const filePath = fileResponse.data.result.file_path;
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}
