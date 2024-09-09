require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri); 
const dbName = 'TelegramBot';
const db = client.db(dbName);

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const message = req.body;
    console.log('Mensaje recibido:', message);

    const collection = db.collection('messages');
    await collection.insertOne(message);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error en el webhook:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

process.on('SIGINT', async () => {
  console.log('Cerrando conexión con MongoDB...');
  await client.close();
  process.exit();
});
