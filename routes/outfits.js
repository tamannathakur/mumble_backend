// routes/outfits.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Outfit = require('../models/Outfit');
const router = express.Router();

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

  // Route to get all outfits
router.get('/', async (req, res) => {
  try {
    const outfits = await Outfit.find();
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


  // Create and save the new outfit
  const outfit = new Outfit({
    name,
    photo, // Directly use the URL sent from the frontend
    tags,
    items: itemsWithDetails,
  });

  try {
    const newOutfit = await outfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
