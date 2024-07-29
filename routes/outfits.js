const express = require('express');
const puppeteer = require('puppeteer');
const Outfit = require('../models/Outfit');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const outfits = await Outfit.find();
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to handle outfit creation
router.post('/addOutfit', async (req, res) => {
  const { photo, name, tags, items } = req.body;

  // Validate required fields
  if (!photo || !name || !tags || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate each item in the items array
  for (const item of items) {
    if (!item.itemId || !item.itemName || !item.itemLink) {
      return res.status(400).json({ message: 'Each item must have itemId, itemName, and itemLink' });
    }
  }

  // Extract item details for each item
  const itemsWithDetails = await Promise.all(
    items.map(async (item) => {
      const { imageUrl, price } = await extractDetails(item.itemLink);
      return {
        itemId: item.itemId,
        itemName: item.itemName,
        itemLink: item.itemLink,
        imageUrl,
        price,
      };
    })
  );

  // Create and save the new outfit
  const outfit = new Outfit({
    name,
    photo,
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

// Function to extract details from Myntra link using Puppeteer
const extractDetails = async (itemLink) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a common user-agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Increase navigation timeout to 60 seconds
    await page.goto(itemLink, { waitUntil: 'networkidle2', timeout: 60000 });

    // Extract image and price
    const details = await page.evaluate(() => {
      // Extract price
      const priceElement = document.querySelector('span.pdp-price strong');
      const price = priceElement ? priceElement.innerText.trim() : '';

      // Extract image URL
      const imageElement = document.querySelector('div.image-grid-image');
      const imageUrl = imageElement ? imageElement.style.backgroundImage.replace(/^url\(["']/, '').replace(/["']\)$/, '') : '';

      return { price, imageUrl };
    });

    console.log('Extracted Details:', details);
    await browser.close();
    return details;
  } catch (error) {
    console.error('Error extracting details:', error.message);
    return { price: '', imageUrl: '' };
  }
};

module.exports = router;
