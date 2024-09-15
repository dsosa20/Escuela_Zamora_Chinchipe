const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const stream = require('stream');

const mongoURI = process.env.MONGODB_URI;

let gfs;
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

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

const upload = multer({ storage }).single('file');

exports.handler = async (event) => {
  return new Promise((resolve, reject) => {
    if (event.httpMethod !== 'POST') {
      return resolve({ statusCode: 405, body: 'Method Not Allowed' });
    }

    // Create a stream to handle the file upload
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(event.body, 'base64'));

    // Multer upload middleware
    upload({ file: bufferStream }, null, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return resolve({ statusCode: 500, body: 'Error uploading file' });
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: 'File uploaded successfully' }),
      });
    });
  });
};
