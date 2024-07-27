const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadImage = require('../imageUpload'); // Adjust the path as necessary
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const filePath = req.file.path;
    const destination = `images/${req.file.filename}${path.extname(req.file.originalname)}`;
    const publicUrl = await uploadImage(filePath, destination);

    res.status(200).json({ url: publicUrl });
  } catch (error) {
    res.status(500).send('Error uploading image');
  }
});

module.exports = router;
