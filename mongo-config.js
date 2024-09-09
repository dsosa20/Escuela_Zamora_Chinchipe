const { MongoClient } = require('mongodb');

// Reemplaza '<db_password>' con la contraseña real
const uri = "mongodb+srv://sosadarwin2002:1CgwHY0iO1jO9Cil@telegrambot.u8jca.mongodb.net/TelegramBot?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await client.db("TelegramBot").command({ ping: 1 });
    console.log("Conexión exitosa a MongoDB!");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  } finally {
    await client.close();
  }
}

run();
