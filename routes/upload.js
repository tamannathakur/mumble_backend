// routes/upload.js
const express = require('express');
const multer = require('multer');
const uploadImage = require('../imageUpload'); // Adjust the path as necessary
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const destination = `images/${req.file.filename}`;
    await uploadImage(filePath, destination);
    res.status(200).send('Image uploaded successfully');
  } catch (error) {
    res.status(500).send('Error uploading image');
  }
});

module.exports = router;
