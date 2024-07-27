const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');
const admin = require('../firebaseAdmin'); // Ensure correct path
const multer = require('multer');
const path = require('path');
const { parseMyntraLink } = require('../utils/myntraParser');

// Initialize Firebase Storage bucket
const bucket = admin.bucket();

// Initialize multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Function to upload image to Firebase Storage
const uploadImageToFirebase = async (buffer, destination) => {
  const blob = bucket.file(destination);
  const blobStream = blob.createWriteStream({
    resumable: false, // Non-resumable for simplicity
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      console.error('Blob stream error:', err);
      reject(err);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
      resolve(publicUrl);
    });

    blobStream.end(buffer);
  });
};

// Route to handle outfit creation
router.post('/addOutfit', upload.single('photo'), async (req, res) => {
  const { name, tags, items } = req.body;
  const photo = req.file;

  try {
    // Handle photo upload
    const photoDestination = `outfits/${Date.now()}.jpg`;
    const photoUrl = await uploadImageToFirebase(photo.buffer, photoDestination);

    // Function to extract details from Myntra link
    const extractMyntraItemDetails = async (itemLink) => {
      try {
        const { data } = await axios.get(itemLink);
        const $ = cheerio.load(data);
        const imageUrl = $('img.product-image').attr('src'); // Adjust selector as needed
        const price = $('.price').text(); // Adjust selector as needed
        return { imageUrl, price };
      } catch (error) {
        console.error('Error extracting Myntra item details:', error);
        return { imageUrl: '', price: '' };
      }
    };

    // Extract item details for each item
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const { imageUrl, price } = await extractMyntraItemDetails(item.itemLink);
        return {
          ...item,
          imageUrl, // Store extracted image URL
          price,    // Store extracted price
        };
      })
    );

    // Create and save the new outfit
    const outfit = new Outfit({
      name,
      photo: photoUrl,
      tags: tags.split(','),
      items: itemsWithDetails,
    });

    const newOutfit = await outfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    console.error('Error creating outfit:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
