const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: String, required: true },
      image: { type: String, required: true },
      id: { type: String, required: true },
      webUrl: { type: String, required: true },
    },
  ],
});

const Outfit = mongoose.model('Outfit', outfitSchema);

module.exports = Outfit;
