// routes/outfits.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('../firebaseAdmin'); // Ensure correct path
const Outfit = require('../models/Outfit');
const router = express.Router();
const path = require('path');
const { parseMyntraLink } = require('../utils/myntraParser');

// Get all outfits
router.get('/', async (req, res) => { // Change from '/api/outfits' to '/'
  try {
    const outfits = await Outfit.find();
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to handle outfit creation with Myntra item extraction
router.post('/addOutfit', async (req, res) => {
  const { photo, name, tags, items } = req.body;

  try {
    // Handle photo upload
    const photoPath = path.join(__dirname, 'uploads', 'outfit.jpg');
    const photoDestination = `outfits/${Date.now()}.jpg`;
    await uploadImageToFirebase(photoPath, photoDestination);

    // Extract item details from Myntra links
    const updatedItems = await Promise.all(items.map(async (item) => {
      if (item.itemLink) {
        const { imageUrl, price } = await parseMyntraLink(item.itemLink);
        return { ...item, imageUrl, price };
      }
      return item;
    }));

    // Create new outfit
    const outfit = new Outfit({
      photo: `https://storage.googleapis.com/${bucket.name}/${photoDestination}`,
      name,
      tags,
      items: updatedItems,
    });

    const newOutfit = await outfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    console.error('Error creating outfit:', err);
    res.status(500).json({ message: err.message });
  }
});


// Add a new outfit (for seeding purposes)
router.post('/', async (req, res) => {
  const outfit = new Outfit({
    name: req.body.name,
    image: req.body.image,
    items: req.body.items,
    tags: req.body.tags, // Include tags from the request body
  });

  try {
    const newOutfit = await outfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


const uploadImageToFirebase = async (filePath, destination) => {
  await bucket.upload(filePath, {
    destination: destination,
    resumable: true, // Allow resumable uploads
    metadata: {
      contentType: 'image/jpeg',
    },
  });
  console.log(`${filePath} uploaded to ${destination}`);
};


module.exports = router;
