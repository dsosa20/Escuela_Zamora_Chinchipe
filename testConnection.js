const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sosadarwin2002:1CgwHY0iO1jO9Cil@telegrambot.u8jca.mongodb.net/TelegramBot?retryWrites=true&w=majority&appName=TelegramBot";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("TelegramBot").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
