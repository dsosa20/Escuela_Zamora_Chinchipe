const { MongoClient } = require('mongodb');

// URI de MongoDB (asegúrate de tener las credenciales correctas)
const uri = process.env.MONGODB_URI || "mongodb+srv://sosadarwin2002:1CgwHY0iO1jO9Cil@telegrambot.u8jca.mongodb.net/TelegramBot?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Conectar al cliente de MongoDB
    await client.connect();
    
    // Realizar un ping para confirmar la conexión
    await client.db("TelegramBot").command({ ping: 1 });
    console.log("Conexión exitosa a MongoDB!");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  } finally {
    // Cerrar la conexión después de la prueba
    await client.close();
  }
}

run();
