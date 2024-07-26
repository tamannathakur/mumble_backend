// routes/outfits.js
const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');

// Get all outfits
router.get('/api/outfits', async (req, res) => {
  try {
    const outfits = await Outfit.find();
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new outfit (for seeding purposes)
router.post('/api/outfits', async (req, res) => {
  const outfit = new Outfit({
    name: req.body.name,
    image: req.body.image,
    items: req.body.items,
  });

  try {
    const newOutfit = await outfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
