// routes/outfits.js
const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');

// Get all outfits
router.get('/', async (req, res) => { // Change from '/api/outfits' to '/'
  try {
    const outfits = await Outfit.find();
    res.json(outfits);
  } catch (err) {
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


module.exports = router;
