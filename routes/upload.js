const express = require('express');
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const bucket = require('../firebaseAdmin'); // Ensure this path is correct

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

router.post('/', upload.single('file'), async (req, res) => { // Note the path is '/'
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const file = req.file;
    const fileName = Date.now() + path.extname(file.originalname);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: true, // Allow resumable uploads
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('Blob stream error:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
