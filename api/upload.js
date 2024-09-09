const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const crypto = require('crypto');

const app = express();

// Conexión a MongoDB
const mongoURI = "mongodb+srv://sosadarwin2002:1CgwHY0iO1jO9Cil@telegrambot.u8jca.mongodb.net/TelegramBot?retryWrites=true&w=majority&appName=TelegramBot";
const conn = mongoose.createConnection(mongoURI); // Eliminadas las opciones obsoletas

// Inicializar GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Configuración de almacenamiento
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// Ruta para subir imágenes
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
