const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadImageToFirebase = require('../imageUpload'); // Ensure this path is correct

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 50MB limit
});

router.post('/upload', upload.single('file'), async (req, res) => {
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
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
