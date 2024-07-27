// routes/outfits.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bucket = require('../firebaseAdmin'); // Ensure correct path
const Outfit = require('../models/Outfit');
const router = express.Router();
const path = require('path');

// Function to extract details from Myntra link
const extractMyntraItemDetails = async (itemLink) => {
  try {
    const { data } = await axios.get(itemLink);
    const $ = cheerio.load(data);

    // Extracting image URL
    const imageUrl = $('.image-grid-image').css('background-image')
      .replace(/^url\(['"]/, '')
      .replace(/['"]\)$/, '');

    // Extracting price
    const price = $('strong[fs_event_type="click"]').text().trim();

    return { imageUrl, price };
  } catch (error) {
    console.error('Error extracting Myntra item details:', error);
    return { imageUrl: '', price: '' };
  }
};

// Route to handle outfit creation
router.post('/addOutfit', async (req, res) => {
  const { photo, name, tags, items } = req.body;

  // Upload the outfit photo to Firebase Storage
  const photoBuffer = Buffer.from(photo, 'base64');
  const photoName = `outfits/${Date.now()}.jpg`;
  const blob = bucket.file(photoName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  blobStream.on('error', (err) => {
    console.error('Blob stream error:', err);
    return res.status(500).json({ error: 'Error uploading photo' });
  });

  blobStream.on('finish', async () => {
    const photoUrl = `https://storage.googleapis.com/${bucket.name}/${photoName}`;

    // Extract item details for each item
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const { imageUrl, price } = await extractMyntraItemDetails(item.itemLink);
        return {
          ...item,
          imageUrl,
          price,
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

    try {
      const newOutfit = await outfit.save();
      res.status(201).json(newOutfit);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  blobStream.end(photoBuffer);
});

module.exports = router;
