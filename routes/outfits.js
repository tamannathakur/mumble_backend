// routes/outfits.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('../firebaseAdmin'); // Ensure correct path
const Outfit = require('../models/Outfit');
const router = express.Router();
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

  // Extract item details from Myntra links
  const updatedItems = await Promise.all(items.map(async (item) => {
    if (item.itemLink) {
      try {
        const response = await axios.get(item.itemLink);
        const $ = cheerio.load(response.data);
        const imageUrl = $('img.product-image').attr('src'); // Adjust selector based on Myntra's structure
        const price = $('span.product-price').text(); // Adjust selector based on Myntra's structure

        return { ...item, itemImage: imageUrl, itemPrice: price };
      } catch (error) {
        console.error('Error fetching item details:', error);
        return { ...item, itemImage: '', itemPrice: '' };
      }
    }
    return item;
  }));

  // Save outfit to database
  try {
    const newOutfit = new Outfit({
      photo,
      name,
      tags,
      items: updatedItems,
    });
    await newOutfit.save();
    res.status(201).json(newOutfit);
  } catch (error) {
    console.error('Error saving outfit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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



module.exports = router;
