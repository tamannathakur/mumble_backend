// models/Outfit.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  id: String,
  webUrl: String,
});

const outfitSchema = new mongoose.Schema({
  name: String,
  image: String,
  items: [itemSchema],
});

const Outfit = mongoose.model('Outfit', outfitSchema);

module.exports = Outfit;
