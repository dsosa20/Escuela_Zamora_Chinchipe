const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'TelegramBot';
const collectionName = 'messages';

async function connectToMongo() {
  if (!client.isConnected()) {
    await client.connect();
    console.log('Conectado a MongoDB');
  }
}

async function getMessages() {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return await collection.find().toArray();
}

exports.handler = async function(event, context) {
  await connectToMongo();

  try {
    const messages = await getMessages();
    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al obtener los mensajes" }),
    };
  } finally {
    await client.close();
  }
};
