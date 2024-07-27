const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },
  tags: [String],
  items: [
    {
      itemName: String,
      itemLink: String,
      itemId: String,
      imageUrl: String,  // Added field for item image URL
      price: String,     // Added field for item price
    }
  ]
});

module.exports = mongoose.model('Outfit', outfitSchema);
